const express = require("express");
const router = express.Router();
const controller = require("../controllers/inventory.controller");

router.get("/", controller.getAllInventories);
router.get("/:id", controller.getInventoryById);
router.get("/product/:productId", controller.getByProduct);

router.post("/add-stock", controller.addStock);
router.post("/remove-stock", controller.removeStock);
router.post("/reservation", controller.reservation);
router.post("/sold", controller.sold);

module.exports = router;