import express from "express";
import multer from "multer";
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/");
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").filter(Boolean).slice(1).join(".");
    cb(null, Date.now() + "." + ext);
  },
});
const upload = multer({ storage: storage });

const base = "http://localhost:3000";
router.post("/", upload.single("file"), (req, res) => {
  res.status(200).send({ url: base + "/" + req.file?.path });
});
export default router;
