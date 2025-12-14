
const { Router } = require("express");
const { uploadImages, upload, uploadImage, getImagesByPropertyId } = require("../controllers/images");


const router = Router();

// router.post('/images/single', uploadImage);

router.post('/images/multiple', upload.array('img_url'), (req, res) => {
  uploadImages(req, res);
});

router.post('/images/single', upload.single('image'), uploadImage);

  module.exports = router;
  