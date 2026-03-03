const { Router } = require("express");
const { validateJwt } = require("../middlewares/validate-jwt");
const { getOrders, getUserOrders, approveOrder, cancelOrder, sendPaymentProof, authorizeOrderSend } = require("../controllers/orders");


const router = Router();

router.get("/get-orders", getOrders);


router.get("/get-user-orders", getUserOrders);

router.put("/approve-order/:orderId", approveOrder);

router.put("/approve-send-order/:orderId", authorizeOrderSend);

router.put("/cancel-order/:orderId", cancelOrder);

router.post('/send-payment-proof/:orderId', validateJwt, sendPaymentProof);

module.exports = router;