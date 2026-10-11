const shopContainer = document.querySelector('#shop-container');
async function renderProducts() {
    const data = await fetchProducts(12, 0);
    const products = data.products;
     if (!products || products.length === 0) {
        shopContainer.innerHTML = '<p>პროდუქტები ვერ მოიძებნა.</p>';
        return;
     }

    shopContainer.innerHTML = '';
    products.forEach(product => {
    const formattedPrice = product.price.toFixed(2);
    const brandName = product.brand ? product.brand : 'ბრენდი არ არის';
    const productCard = document.createElement('div');
    productCard.classList.add('product-card'); 
     productCard.innerHTML = `
        <img src="${product.thumbnail}" alt="${product.title}">
        <h3>${product.title}</h3>
        <p class="brand">ბრენდი: ${brandName}</p>
        <p class="price">$${formattedPrice}</p>
        <p class="stock">მარაგი: ${product.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>
        <button onclick="addToCart(${product.id})"></button>
        `;
    shopContainer.appendChild(productCard);
    });
}

document.addEventListener('DOMContentLoaded', renderProducts);