const { Router } = require("express");
const { validateJwt, validateJwtAdmin } = require("../middlewares/validate-jwt");
const { getOrders, getUserOrders, approveOrder, cancelOrder, sendPaymentProof, authorizeOrderSend, getUserOrdersById } = require("../controllers/orders");


const router = Router();

router.get("/get-orders", validateJwtAdmin, getOrders);

router.get("/get-user-orders", getUserOrders);

router.get("/get-user-orders/:userId", validateJwt, getUserOrdersById);

router.put("/approve-order/:orderId", validateJwtAdmin, approveOrder);

router.put("/approve-send-order/:orderId", validateJwtAdmin, authorizeOrderSend);

router.put("/cancel-order/:orderId", cancelOrder);

router.post('/send-payment-proof/:orderId', validateJwt, sendPaymentProof);

module.exports = router;