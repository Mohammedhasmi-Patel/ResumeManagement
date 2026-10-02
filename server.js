import "dotenv/config";
import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";

const PORT = process.env.PORT || 5000;

await connectDB();
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
});
