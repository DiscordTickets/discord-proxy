export default async function handler(req, res) {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: "Missing URL parameter" });
  }

  try {
    const allowedDomain = "cdn.discordapp.com";
    const parsedUrl = new URL(url);
    if (!parsedUrl.hostname.endsWith(allowedDomain)) {
      return res.status(400).json({ error: "Invalid URL provided" });
    }

    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch content" });
    }
  
    const text = await response.text();
  
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).send(text);
  } catch (error) {
    console.error("Error fetching file:", error);
    return res.status(500).json({ error: "Server error" });
  }
}