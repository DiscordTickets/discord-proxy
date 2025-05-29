export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.status(200).send("OK");
    return;
  }

  const { url } = req.query;
  if (!url) {
    res.status(400).send("Missing 'url' parameter.");
    return;
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch (e) {
    console.error("Invalid URL provided:", url, e);
    res.status(400).send("Invalid URL provided.");
    return;
  }

  if (!parsedUrl.pathname.endsWith(".txt")) {
    res.status(400).send("Only .txt files are allowed.");
    return;
  }

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; VercelProxy/1.0)" }
    });
    if (!response.ok) {
      console.error("Error fetching remote URL. Status:", response.status);
      res.status(response.status).send("Error fetching remote URL.");
      return;
    }
    const text = await response.text();

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(text);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send("Server error: " + error.message);
  }
}
