"use strict"

const multer = require('multer')
const path = require("node:path");

module.exports = multer({
    storage: multer.diskStorage({
        destination: './upload/',
        filename: function(req, file, returnCallback) {
             returnCallback(null, Date.now() + "_" + file.originalname);
        }
    }),
    fileFilter: function (req, file, returnCallback) {
    const allowedExtensions = [".jpg", ".jpeg", ".png"];
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(fileExtension)) {
      returnCallback(null, true);
    } else {
      returnCallback(
        new Error("Sadece .jpg, .jpeg ve .png dosyaları yüklenebilir!"),
        false
      );
    }
  },
})