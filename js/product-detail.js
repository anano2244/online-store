document.addEventListener('DOMContentLoaded', async () => {
  
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        console.error('product ID is not in URL!');
        return;
    }

    try {
        
        const res = await fetch(`https://dummyjson.com/products/${productId}`);
        const product = await res.json();


        const titleEl = document.getElementById('product-title');
        const descEl = document.getElementById('product-description');
        const priceEl = document.getElementById('product-price');
        const imgEl = document.getElementById('product-image');

        if (titleEl) titleEl.textContent = product.title;
        if (descEl) descEl.textContent = product.description;
        if (priceEl) priceEl.textContent = product.price;
        if (imgEl) imgEl.src = product.thumbnail;

        const addToCartBtn = document.getElementById('add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                addToCart(product);
            });
        }

    } catch (error) {
        console.error("couldn't load", error);
    }
});
