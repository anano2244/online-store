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
        <p class="stock">stock: ${product.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>
        <button onclick="addToCart(${product.id})"></button>
        `;
    shopContainer.appendChild(productCard);
    });
}

document.addEventListener('DOMContentLoaded', renderProducts);