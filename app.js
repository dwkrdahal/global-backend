import express from "express";
import multer from "multer";
import routes from "./routes/index.routes.js";
import connectdb from "./utils/db.init.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();

// CORS
app.use(cors());

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the 'uploads' directory (if needed)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configure Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Cloudinary Upload Endpoint
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({ error: "File upload failed." });
        }
        res.json({ imageUrl: result.secure_url });
      }
    );

    // Pass the file buffer to Cloudinary
    const stream = require("stream");
    const streamObj = new stream.PassThrough();
    streamObj.end(req.file.buffer);
    streamObj.pipe(result);
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).json({ error: "File upload failed." });
  }
});

// Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routing
app.use("/", routes);

// 404 Error
app.use((req, res, next) => {
  next({
    result: null,
    status: 404,
    msg: "Resource not found",
  });
});

// Error Handling Middleware
app.use(errorMiddleware);

// Getting Port Number from .env
const port = process.env.PORT || 3000; // Fallback to port 3000 if not in .env

// Connect to Database and Start Server
connectdb().then(() => {
  app.listen(port, (err) => {
    if (err) {
      console.log("Error listening to server:", err);
    } else {
      console.log(`Listening on port ${port}`);
    }
  });
});
