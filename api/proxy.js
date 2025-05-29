const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());

app.get("/api/proxy", async (req, res) => {
    const rawUrl = req.query.url;
    
    if (!rawUrl) {
        return res.status(400).json({ error: "No URL provided" });
    }

    try {
        console.log("Fetching:", rawUrl); // Debugging output

        const response = await fetch(decodeURIComponent(rawUrl), {
            headers: {
                "User-Agent": "Mozilla/5.0", // Mimic a browser request
                "Accept": "*/*"
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch content: ${response.status} ${response.statusText}`);
        }

        const data = await response.text();
        res.set("Access-Control-Allow-Origin", "*"); // Allow CORS
        res.send(data);
    } catch (error) {
        console.error("Error:", error); // Log errors for debugging
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log("Proxy running on port 3000"));