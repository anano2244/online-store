const shopContainer = document.querySelector('#shop-container');
async function renderProducts() {
    const data = await fetchProducts(12, 0);
    const products = data.products;
     if (!products || products.length === 0) {
        shopContainer.innerHTML = '<p>products couldn\'t found.</p>';
        return;
     }

    shopContainer.innerHTML = '';
    products.forEach(product => {
    const formattedPrice = product.price.toFixed(2);
    const brandName = product.brand ? product.brand : 'there is no brand';
    const isOutOfStock = product.stock === 0 || product.availabilityStatus === ' Out of stock';
    const productCard = document.createElement('div');
    productCard.classList.add('product-card'); 
     productCard.innerHTML = `
        <img src="${product.thumbnail}" alt="${product.title}">
        <h3>${product.title}</h3>
        <p class="brand">brand: ${brandName}</p>
        <p class="rating">Rating: ${product.rating}</p>
        <p class="rating">
           <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="color: gold; vertical-align: middle; margin-right: 4px;">
           <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
           </svg>
         Rating: ${product.rating}
       </p>
        <p class="price">$${formattedPrice}</p>
        ${product.discountPercentage ? '<p class="discount">Discount: -' + product.discountPercentage + '%</p>' : ''}
        <p class="stock">stock status: ${product.availabilityStatus}</p>
        <button class="add-to-cart-btn" ${isOutOfStock ? 'disabled' : ''}>${isOutOfStock ? 'out of stock' : ' Add to cart'}</button> `;
        const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
        addToCartBtn.addEventListener('click', () => addToCart(product));
        
    shopContainer.appendChild(productCard);
    });
}


document.addEventListener('DOMContentLoaded', renderProducts);