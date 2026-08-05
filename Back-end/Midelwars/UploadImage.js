import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { fileURLToPath } from "url";
import APPError from "../utils/ErrorHandler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_ROOT = path.join(__dirname, "..", "uploads");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new APPError("Seuls les fichiers image sont autorisés", 400), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// req.file must be picked up first via uploadImage(fieldName)
export const uploadImage = (fieldName = "image") => upload.single(fieldName);

// Resizes/converts the buffer from memory storage to an optimized webp file on disk,
// then rewrites req.body[bodyField] to the public path so controllers can save it as-is.
export const optimizeImage = (folder, { width = 1000, quality = 80, bodyField = "image" } = {}) =>
  async (req, res, next) => {
    if (!req.file) return next();
    try {
      const dir = path.join(UPLOADS_ROOT, folder);
      fs.mkdirSync(dir, { recursive: true });
      const filename = `${folder}-${Date.now()}-${crypto.randomUUID()}.webp`;

      await sharp(req.file.buffer)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality })
        .toFile(path.join(dir, filename));

      req.body[bodyField] = `/uploads/${folder}/${filename}`;
      next();
    } catch (err) {
      next(err);
    }
  };
