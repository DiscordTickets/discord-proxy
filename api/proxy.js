const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());

app.get("/api/proxy", async (req, res) => {
    const rawUrl = req.query.url;
    if (!rawUrl) return res.status(400).json({ error: "No URL provided" });

    try {
        const response = await fetch(rawUrl);
        if (!response.ok) throw new Error("Failed to fetch content");

        const data = await response.text();
        res.set("Access-Control-Allow-Origin", "*");
        res.send(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log("Proxy running on port 3000"));