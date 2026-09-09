import multer from 'multer';
import path from 'path';
import { randomUUID } from 'crypto';

// notes : temporart storage // ill chaneg it for deployment 
// change it later into production this version if for development only
// ill use cloudfare r2 later
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename : (req, file, cb) => {
    const uniqueName = `${randomUUID()}${path.extname(file.originalname)}`;
    cb(null, uniqueName)
  }
});

const upload = multer({
  storage,
  // 10 mb
  limits : { fileSize : 10 * 1024 * 1024 },

  fileFilter : (req, file, cb) => {

    const exstention = file.originalname.split('.').pop().toLowerCase();

    const allowedExtensions = ["jpg", "jpeg", "png", "pdf", "doc", "docx"];

    if(allowedExtensions.includes(exstention)) {
      cb(null, true);
    }else {
      cb(new Error("Invalid file type"));
    }
  },
});

export default upload;