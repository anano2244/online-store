function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(product) {
    const cart = getCart();
    const existingIndex = cart.findIndex(item => item.id === product.id);
    const maxStock = product.stock ?? 999;
    if (existingIndex > -1) {
        if (cart[existingIndex].quantity < maxStock) {
            cart[existingIndex].quantity += 1;
        }
    } else if (maxStock > 0) {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart(cart);
}
