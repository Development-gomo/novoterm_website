const WP_API = process.env.NEXT_PUBLIC_WP_URL?.replace(/\/$/, "");
const WP_USER = process.env.WP_API_USER;
const WP_PASS = process.env.WP_API_PASS;

export const config = {
  api: {
    bodyParser: false,
  },
};

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function getAuthHeaders() {
  if (!WP_USER || !WP_PASS) return null;

  return {
    Authorization: `Basic ${Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64")}`,
  };
}

function normalizeField(field) {
  return {
    type: field.type,
    basetype: field.basetype,
    name: field.name,
    options: field.options || [],
    labels: field.labels || [],
    values: field.values || [],
    raw_values: field.raw_values || [],
  };
}

function tokenizeShortcode(value = "") {
  const tokens = [];
  const tokenPattern = /"([^"]*)"|'([^']*)'|(\S+)/g;
  let match;

  while ((match = tokenPattern.exec(value))) {
    tokens.push({
      value: decodeEntities(match[1] ?? match[2] ?? match[3] ?? ""),
      quoted: match[1] !== undefined || match[2] !== undefined,
    });
  }

  return tokens;
}

function parseShortcodeFields(content = "") {
  const fields = [];
  const shortcodePattern = /\[([^\]]+)\]/g;
  let match;

  while ((match = shortcodePattern.exec(content))) {
    const tokens = tokenizeShortcode(match[1]);
    if (!tokens.length) continue;

    const type = tokens[0].value;
    const basetype = type.replace("*", "");
    const isSubmit = basetype === "submit";
    const name = isSubmit ? "" : tokens[1]?.value;

    if (!isSubmit && !name) continue;

    const bodyTokens = tokens.slice(isSubmit ? 1 : 2);
    const labels = bodyTokens.filter((token) => token.quoted).map((token) => token.value);
    const options = bodyTokens.filter((token) => !token.quoted).map((token) => token.value);

    fields.push({
      type,
      basetype,
      name,
      options,
      labels,
      values: labels,
      raw_values: labels,
    });
  }

  return fields;
}

function mergeFields(apiFields = [], content = "") {
  const normalizedFields = apiFields.map(normalizeField);
  const fieldMap = new Map(normalizedFields.map((field) => [field.name || `submit-${field.type}`, field]));

  parseShortcodeFields(content).forEach((field) => {
    const key = field.name || `submit-${field.type}`;
    if (!fieldMap.has(key)) {
      fieldMap.set(key, field);
    }
  });

  return Array.from(fieldMap.values());
}

function decodeEntities(value = "") {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}

function stripTags(value = "") {
  return decodeEntities(value.replace(/<[^>]*>/g, "").trim());
}

function extractFormCopy(content = "") {
  const headings = [...content.matchAll(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gis)]
    .map((match) => stripTags(match[1]))
    .filter(Boolean);
  const notes = [...content.matchAll(/<p[^>]*class=["'][^"']*cf7-note[^"']*["'][^>]*>(.*?)<\/p>/gis)]
    .map((match) => stripTags(match[1]))
    .filter(Boolean);

  return { headings, notes };
}

function extractShortcodeFieldNames(value = "") {
  const names = [];
  const shortcodePattern = /\[([a-zA-Z][^\]\s]*)(?:\s+([^\]\s]+))?[^\]]*\]/g;
  let match;

  while ((match = shortcodePattern.exec(value))) {
    const tag = match[1].replace("*", "");
    const name = match[2]?.replace(/^["']|["']$/g, "");

    if (tag !== "submit" && name) names.push(name);
  }

  return names;
}

function extractFormLayout(content = "") {
  const lines = content.split(/\r?\n/);
  const layout = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (!line) continue;

    const headingMatch = line.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/i);
    if (headingMatch) {
      layout.push({ type: "heading", text: stripTags(headingMatch[1]) });
      continue;
    }

    const noteMatch = line.match(/<p[^>]*class=["'][^"']*cf7-note[^"']*["'][^>]*>(.*?)<\/p>/i);
    if (noteMatch) {
      layout.push({ type: "note", text: stripTags(noteMatch[1]) });
      continue;
    }

    if (line.includes("cf7-row")) {
      const rowLines = [line];
      while (i + 1 < lines.length && !/^\s*<\/div>\s*$/.test(lines[i])) {
        i += 1;
        rowLines.push(lines[i]);
      }

      const fields = extractShortcodeFieldNames(rowLines.join("\n"));
      if (fields.length) layout.push({ type: "row", fields });
      continue;
    }

    const fields = extractShortcodeFieldNames(line);
    fields.forEach((name) => layout.push({ type: "field", name }));
  }

  return layout;
}

export default async function handler(req, res) {
  if (!["GET", "POST"].includes(req.method)) {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ message: "Method not allowed." });
  }

  if (!WP_API) {
    return res.status(500).json({ message: "NEXT_PUBLIC_WP_URL is missing." });
  }

  const formId = String(req.query.formId || "");
  if (!/^\d+$/.test(formId)) {
    return res.status(400).json({ message: "A valid CF7 formId is required." });
  }

  if (req.method === "GET") {
    const authHeaders = getAuthHeaders();
    if (!authHeaders) {
      return res.status(500).json({ message: "WordPress API credentials are missing." });
    }

    try {
      const wpRes = await fetch(
        `${WP_API}/wp-json/contact-form-7/v1/contact-forms/${formId}`,
        {
          headers: {
            Accept: "application/json",
            ...authHeaders,
          },
        }
      );
      const data = await wpRes.json();

      if (!wpRes.ok) {
        return res.status(wpRes.status).json({
          message: data?.message || "Could not load the Contact Form 7 form.",
        });
      }

      const content = data.properties?.form?.content || "";

      return res.status(200).json({
        id: data.id,
        title: data.title,
        locale: data.locale,
        content,
        copy: extractFormCopy(content),
        layout: extractFormLayout(content),
        fields: mergeFields(data.properties?.form?.fields || [], content),
      });
    } catch (error) {
      return res.status(502).json({
        message: "Could not load the Contact Form 7 form from WordPress.",
      });
    }
  }

  try {
    const body = await readRawBody(req);
    const wpRes = await fetch(
      `${WP_API}/wp-json/contact-form-7/v1/contact-forms/${formId}/feedback`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": req.headers["content-type"] || "multipart/form-data",
        },
        body,
      }
    );

    const text = await wpRes.text();
    const contentType = wpRes.headers.get("content-type") || "application/json";

    res.status(wpRes.status);
    res.setHeader("Content-Type", contentType);
    return res.send(text);
  } catch (error) {
    return res.status(502).json({
      message: "Could not submit the form to WordPress.",
    });
  }
}
