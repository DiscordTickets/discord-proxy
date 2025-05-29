export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) {
    res.status(400).send("Missing 'url' parameter.");
    return;
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch (e) {
    res.status(400).send("Invalid URL provided.");
    return;
  }
  if (!parsedUrl.pathname.endsWith(".txt")) {
    res.status(400).send("Only .txt files are allowed.");
    return;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      res.status(response.status).send("Error fetching remote URL.");
      return;
    }
    const text = await response.text();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(text);
  } catch (error) {
    res.status(500).send("Server error: " + error.message);
  }
}
