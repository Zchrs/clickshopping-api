const { Router } = require("express");

const { 
  addToCart, 
  removeFromCart, 
  updateCartProduct, 
  getCartProducts, 
  moveToWishlist,
  payCart,
} = require("../controllers/cart");
const { validateJwt } = require("../middlewares/validate-jwt");


const router = Router();

router.get('/get-User-cart/:user_id', getCartProducts);

router.post('/add', addToCart);

// mover del carrito a lista de deseos
router.post('/move-to-wishlist/:product_id', moveToWishlist);

// eliminar un producto del carrito
router.delete('/delete-product-cart', validateJwt, removeFromCart);

// actualizar la cantidad de un producto en el carrito
router.put('/update/:productId', updateCartProduct);

router.post("/pay-order", payCart);


module.exports = router;