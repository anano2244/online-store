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
    const productCard = document.createElement('div');
    productCard.classList.add('product-card'); 
     productCard.innerHTML = `
        <img src="${product.thumbnail}" alt="${product.title}">
        <h3>${product.title}</h3>
        <p class="brand">brand: ${brandName}</p>
        <p class="price">$${formattedPrice}</p>
        <p class="stock">stock status: ${product.availabilityStatus}</p>
        <button class="add-to-cart-btn">Add to cart</button> `;
        const addToCartBtn = productCard.querySelector(' .add-to-cart-btn');
        addToCartBtn.addEventListener('click', () => addToCart(product));
        
    shopContainer.appendChild(productCard);
    });
}


document.addEventListener('DOMContentLoaded', renderProducts);