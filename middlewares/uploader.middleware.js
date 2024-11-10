import multer from "multer";
import cloudinary from "cloudinary";
import streamifier from "streamifier";

// Function to upload files to Cloudinary using buffer and stream
const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// Multer memory storage configuration (to avoid saving files locally)
const storage = multer.memoryStorage();

// Image validation filter
const imageFilter = (req, file, cb) => {
  const allowedImages = ["jpg", "png", "jpeg", "svg", "gif", "bmp", "webp"];
  const ext = file.originalname.split(".").pop().toLowerCase();
  if (allowedImages.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Video validation filter
const videoFilter = (req, file, cb) => {
  const allowedVideos = ["mp4", "mov", "avi", "wmv", "flv", "mkv"];
  const ext = file.originalname.split(".").pop().toLowerCase();
  if (allowedVideos.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only video files are allowed!"), false);
  }
};

// File validation filter (for non-image, non-video files)
const fileFilter = (req, file, cb) => {
  const allowedFiles = ["pdf", "doc", "docx", "xls", "xlsx", "txt", "csv"];
  const ext = file.originalname.split(".").pop().toLowerCase();
  if (allowedFiles.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only valid file types are allowed!"), false);
  }
};

// General multer configuration for image upload
const imageUpload = multer({
  storage: storage,
  fileFilter: imageFilter,
});

// General multer configuration for video upload
const videoUpload = multer({
  storage: storage,
  fileFilter: videoFilter,
});

// General multer configuration for file upload
const fileUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

// Reusable upload middleware for single image
const uploadSingleImage = (req, res, next) => {
  return imageUpload.single("image")(req, res, next);
};

// Reusable upload middleware for single image
const uploadArrayImages = (maxCount = 10) => {
  return imageUpload.array("images", maxCount);
};

// Reusable upload middleware for single video
const uploadSingleVideo = (req, res, next) => {
  return videoUpload.single("video")(req, res, next);
};

// Reusable upload middleware for multiple videos
const uploadArrayVideos = (maxCount = 5) => {
  return videoUpload.array("videos", maxCount);
};

// Reusable uploadImages middleware function
const uploadImages = (fields) => {
  return imageUpload.fields(fields);
};

// Reusable uploadVideos middleware function
const uploadVideos = (fields) => {
  return videoUpload.fields(fields);
};

// Reusable upload middleware for both image and video uploads together
const uploadMedia = (fields) => {
  return multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      const allowedFiles = [
        "jpg", "png", "jpeg", "svg", "gif", "bmp", "webp", 
        "mp4", "mov", "avi", "wmv", "flv", "mkv"
      ];
      const ext = file.originalname.split(".").pop().toLowerCase();
      if (allowedFiles.includes(ext)) {
        cb(null, true);
      } else {
        cb(new Error("Only image and video files are allowed!"), false);
      }
    }
  }).fields(fields);
};

// Controller to handle file uploads to Cloudinary
const handleFileUpload = async (req, res, next) => {
  try {
    const uploadedFiles = {};

    // Check if an image is uploaded
    if (req.files.image) {
      const imageFile = req.files.image[0];
      const imageResult = await uploadToCloudinary(imageFile.buffer, "images");
      uploadedFiles.image = imageResult.secure_url;
      console.log("image",imageResult.secure_url);
      
    }

    // Check if a video is uploaded
    if (req.files.video) {
      const videoFile = req.files.video[0];
      const videoResult = await uploadToCloudinary(videoFile.buffer, "videos");
      uploadedFiles.video = videoResult.secure_url;
    }

    // Check if a file is uploaded (for non-image/video files)
    if (req.files.file) {
      const fileResult = await uploadToCloudinary(req.files.file[0].buffer, "files");
      uploadedFiles.file = fileResult.secure_url;
    }

    // Attach the Cloudinary URLs to the request for further use
    req.uploadedFiles = uploadedFiles;
    next();
  } catch (error) {
    next(error);
  }
};

// Export all upload functions and the file upload handler
export default {
  uploadImages, 
  uploadVideos, 
  uploadSingleImage,
  uploadArrayImages,
  uploadSingleVideo,
  uploadArrayVideos,
  uploadMedia, 
  uploadFiles: fileUpload.fields, 
  uploadSingleFile: fileUpload.single, 
  uploadArrayFiles: fileUpload.array, 
  handleFileUpload, // Updated middleware for handling file uploads to Cloudinary
};
