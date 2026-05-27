import {
  fetchPreviewPostById,
  getArticlePreviewPath,
  getPostLang,
  isValidPreviewSecret,
} from "../../../lib/wpPreview";
import { DEFAULT_LANG, resolveLang } from "../../../lib/api";

export default async function handler(req, res) {
  const secret = Array.isArray(req.query.secret)
    ? req.query.secret[0]
    : req.query.secret;
  const postId = Array.isArray(req.query.id)
    ? req.query.id[0]
    : req.query.id || req.query.post_id || req.query.preview_id;
  const requestedLang = resolveLang(
    Array.isArray(req.query.lang) ? req.query.lang[0] : req.query.lang || DEFAULT_LANG
  );

  if (!isValidPreviewSecret(secret)) {
    return res.status(401).json({ message: "Invalid preview secret." });
  }

  if (!postId) {
    return res.status(400).json({ message: "Missing post id." });
  }

  try {
    const post = await fetchPreviewPostById(postId, requestedLang);
    const lang = getPostLang(post, requestedLang);
    const destination = getArticlePreviewPath(post, lang);

    res.setPreviewData(
      {
        postId: post.id,
        lang,
        slug: post.slug,
      },
      { maxAge: 60 * 60 }
    );

    res.writeHead(307, { Location: destination });
    return res.end();
  } catch (error) {
    return res.status(500).json({
      message: "Unable to enable preview.",
      error: error.message,
    });
  }
}
