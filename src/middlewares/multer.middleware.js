import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp"); //cb is callback fn
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Math.round(Math.random() * 10);
    cb(null, file.originalname + "_" + uniqueSuffix);
  },
});

const upload = multer({ storage });
export { upload };
