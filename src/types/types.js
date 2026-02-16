

export const types = {
    login: `[auth], login`,
    logout: `[auth], logout`,
    logged: false,

    // types para el estado de autenticación 
    authCheckingFinish: '[auth] Finish checking login state',
    authLogin: '[auth] Start login',
    authStartRegister: '[auth] Start register',
    authStartTokenRenew: '[auth] Start token renew',
    authLogout: '[auth] Logout',
    
    // types para el estado de autenticación admin
    adminCheckingFinish: '[auth] Finish checking admin login state',
    authAdminLogin: '[auth] admin login active',
    authAdminLogout: '[auth] admin logout',

    // types para el estado de productos
    productView: `[looking], looking start`,
    productViewed: `[viewed], viewed out`,
    STORAGED_PRODUCT: `[storaged], storaged`,
    SELECTED_PRODUCT: `[selected], product selected`,
    REMOVE_PRODUCT: `[remove], deleted`,
    UPDATE_PRODUCT: `[update], Updated`,
    productViewedFinish: `[finish], viewed finish`,
    
    CHANGE_LANG: 'CHANGE_LANG',
    
    // types para el estado del carrito
    ADD_TO_CART: 'Adding to cart',
    REMOVE_FROM_CART: 'Removed to cart success',
    CLEAR_CART: 'Clear cart success',
    ADD_TO_CART_SUCCESS: 'Added to cart success',
    ADD_TO_CART_FAIL: 'ADD_TO_CART_FAIL',
    MOVE_FROM_WISHLIST_TO_CART: 'Move to wishlist success',
    
    // types para el estado de las ótrdenes
    startPayment: `[paying], start paying product`,
    errorPayment: `[error], order pay failed`,
    pendingPayment: `[pending], payout order pending`,
    paymentSuccess: `[finish], order payed`,
    orderView: `[looking], looking order start`,
    setFilteredOrders: `[filtered], filtered orders`,
    SELECTED_ORDER: `[selected], order selected`,
    UPDATE_ORDER: `[update], orpdated`,

    // types para el estado de la lista de deseos
    ADD_TO_WISHLIST: 'ADD_TO_WISHLIST',
    MOVE_FROM_CART_TO_WISHLIST: 'Move to wishlist success',
    REMOVE_FROM_WISHLIST: 'REMOVE_FROM_WISHLIST',
    CLEAR_WISHLIST: 'Clear whislist success',
    ADD_TO_WISHLIST_SUCCESS: 'ADD_TO_WISHLIST_SUCCESS',
    ADD_TO_WISHLIST_FAIL: 'ADD_TO_WISHLIST_FAIL',
    
    // types para el estado de las calificaciones
    SET_RATINGS: 'ratings on'
}

export const SOCKET_UPDATE_PRODUCTS = 'SOCKET_UPDATE_PRODUCTS';