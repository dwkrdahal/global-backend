import multer from "multer";

// Defining path and filename for image storage
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.cwd()+ "/uploads/images");
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

  const allowed = ["jpg", "png", "jpeg", "svg", "gif", "bmp", "webp"];

  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Defining path and filename for file storage
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.cwd()+ "/uploads/files"  );
  },
  filename: (req, file, cb) => {
    let file_name = Date.now() + "-" + file.originalname;
    cb(null, file_name);
  }
});

// Multer configuration for image upload
const imageUpload = multer({
  storage: imageStorage,
  fileFilter: imageFilter
});

// Reusable uploadImages middleware function
const uploadImages = (fields) => {
  return imageUpload.fields(fields);
};

// other files except image
const fileUpload = multer({
  storage: fileStorage,
});

// Configuration for single and array uploads
 const uploadSingleImage = imageUpload.single('image');
 const uploadArrayImages = imageUpload.array('images', 10);

export default { uploadImages, uploadSingleImage, uploadArrayImages, fileUpload };
