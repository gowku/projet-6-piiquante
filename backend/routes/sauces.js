const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const saucesCtrl = require("../controllers/sauces");
const multer = require(`../middleware/multer-config`);

router.post("/", auth, multer, saucesCtrl.createSauce);
router.put("/:id", auth, multer, saucesCtrl.modifySauce);
router.delete("/:id", auth, saucesCtrl.deleteSauce);
router.get("/", auth, saucesCtrl.getAllSauces);
router.get("/:id", auth, saucesCtrl.getOneSauce);
router.post("/:id/like", auth, saucesCtrl.sauceLiked);

module.exports = router;
