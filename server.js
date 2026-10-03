import "dotenv/config";
import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import { invokeGemini } from "./src/services/ai.service.js";

const PORT = process.env.PORT || 5000;

await connectDB();
app.get("/", (req, res) => {
    res.send("Hello World");
});

app.get("/invoke", async (req, res) => {
    try {
        const result = await invokeGemini();
        res.send(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
});
