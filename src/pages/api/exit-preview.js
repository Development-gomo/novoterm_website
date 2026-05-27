export default function handler(req, res) {
  const redirectTo = Array.isArray(req.query.redirect)
    ? req.query.redirect[0]
    : req.query.redirect || "/";

  res.clearPreviewData();
  res.writeHead(307, { Location: redirectTo.startsWith("/") ? redirectTo : "/" });
  res.end();
}
