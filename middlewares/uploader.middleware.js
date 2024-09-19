import multer from "multer";

// Defining path and filename for image storage
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.cwd() + "/uploads/images");
  },
  filename: (req, file, cb) => {
    let file_name = Date.now() + "-" + file.originalname;
    cb(null, file_name);
  }
});

// Defining path and filename for video storage
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.cwd() + "/uploads/videos");
  },
  filename: (req, file, cb) => {
    let file_name = Date.now() + "-" + file.originalname;
    cb(null, file_name);
  }
});

// Image validation
const imageFilter = (req, file, cb) => {
  let parts = file.originalname.split(".");
  let ext = parts[parts.length - 1].toLowerCase();

  const allowedImages = ["jpg", "png", "jpeg", "svg", "gif", "bmp", "webp"];

  if (allowedImages.includes(ext)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Video validation
const videoFilter = (req, file, cb) => {
  let parts = file.originalname.split(".");
  let ext = parts[parts.length - 1].toLowerCase();

  const allowedVideos = ["mp4", "mov", "avi", "wmv", "flv", "mkv"];

  if (allowedVideos.includes(ext)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Defining path and filename for other file storage
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.cwd() + "/uploads/files");
  },
  filename: (req, file, cb) => {
    let file_name = Date.now() + "-" + file.originalname;
    cb(null, file_name);
  }
});

// Combined storage for both image and video uploads
const mediaStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let parts = file.originalname.split(".");
    let ext = parts[parts.length - 1].toLowerCase();

    const allowedImages = ["jpg", "png", "jpeg", "svg", "gif", "bmp", "webp"];
    const allowedVideos = ["mp4", "mov", "avi", "wmv", "flv", "mkv"];

    if (allowedImages.includes(ext)) {
      cb(null, process.cwd() + "/uploads/images");
    } else if (allowedVideos.includes(ext)) {
      cb(null, process.cwd() + "/uploads/videos");
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
  filename: (req, file, cb) => {
    let file_name = Date.now() + "-" + file.originalname;
    cb(null, file_name);
  }
});

// Combined filter for both image and video uploads
const mediaFilter = (req, file, cb) => {
  let parts = file.originalname.split(".");
  let ext = parts[parts.length - 1].toLowerCase();

  const allowedImages = ["jpg", "png", "jpeg", "svg", "gif", "bmp", "webp"];
  const allowedVideos = ["mp4", "mov", "avi", "wmv", "flv", "mkv"];

  if (allowedImages.includes(ext) || allowedVideos.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only image and video files are allowed!"), false);
  }
};

// Multer configuration for image upload
const imageUpload = multer({
  storage: imageStorage,
  fileFilter: imageFilter
});

// Multer configuration for video upload
const videoUpload = multer({
  storage: videoStorage,
  fileFilter: videoFilter
});

// Multer configuration for combined image and video upload
const mediaUpload = multer({
  storage: mediaStorage,
  fileFilter: mediaFilter
});

// Reusable uploadImages middleware function
const uploadImages = (fields) => {
  return imageUpload.fields(fields);
};

// Reusable uploadVideos middleware function
const uploadVideos = (fields) => {
  return videoUpload.fields(fields);
};

// Other files except image and video
const fileUpload = multer({
  storage: fileStorage,
});

// Middleware for handling both image and video uploads in a single request
const uploadMedia = mediaUpload.fields([
  { name: "image", maxCount: 1 },
  { name: "video", maxCount: 1 }
]);

// Configuration for single and array uploads
const uploadSingleImage = imageUpload.single("image");
const uploadArrayImages = imageUpload.array("images");
const uploadSingleVideo = videoUpload.single("video");
const uploadArrayVideos = videoUpload.array("videos");

export default {
  uploadImages,
  uploadVideos,
  uploadSingleImage,
  uploadArrayImages,
  uploadSingleVideo,
  uploadArrayVideos,
  uploadMedia,  // New middleware for image and video upload together
  fileUpload
};
