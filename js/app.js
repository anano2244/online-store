const shopContainer = document.querySelector('#shop-container');
async function renderProducts(productsToRender = null) {
    let products = productsToRender;
    
    if (!products) {
        const data = await fetchProducts(12, 0);
        products = data.products;
    }

    if (!products || products.length === 0) {
        shopContainer.innerHTML = '<p class="error-message">products couldn\'t found.</p>';
        return;
    }
    
    shopContainer.innerHTML = '';
    products.forEach(product => {
    const formattedPrice = product.price.toFixed(2);
    const brandName = product.brand ? product.brand : 'there is no brand';
    const isOutOfStock = product.stock === 0 || product.availabilityStatus === ' Out of stock';
    const productCard = document.createElement('div');
    productCard.classList.add('product-card'); 
    productCard.addEventListener('click', () => {
        window.location.href=`product.html?id=${product.id}`;
    })
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
const searchInput = document.querySelector('#search-input');

if (searchInput) {
    searchInput.addEventListener('input', async (e) => {
        const query = e.target.value.trim();
        if (query === '') {
            renderProducts();
        } else {
            const data = await searchProducts(query);
            renderProducts(data.products);
        }
    });
}


async function loadCategories() {
    console.log('loadCategories works!'); 
    try {
        const res = await fetch('https://dummyjson.com/products/categories');
        const categories = await res.json();
        const select = document.getElementById('category-select');
        
        if (select) {
            console.log(categories); 
            categories.forEach(category => {
                const option = document.createElement('option');
                const name = typeof category === 'string' ? category : category.name;
                const slug = typeof category === 'string' ? category : category.slug;
                
                option.value = slug;
                option.textContent = name;
                select.appendChild(option);
            });
        } else {
            console.log('cant find category-select !');
        }
    } catch (err) {
        console.error('couldn\'t load categories:', err);
    }
}

const categorySelect = document.getElementById('category-select');

if (categorySelect) {
        categorySelect.addEventListener('change', async (event) => {
            const selectedCategory = event.target.value;

            if (selectedCategory === '') {
                renderProducts();
            } else {
                const data = await fetchProductsByCategory(selectedCategory);
                renderProducts(data.products);
            }
        });
    }
    async function fetchProductsByCategory(slug) {
        try {
            const response = await fetch(`${BASE_URL}/products/category/${slug}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('couldn\'t get category products:', error);
            return { products: [], total: 0 };
        }
    }

const sortSelect = document.getElementById('sort-select');

if (sortSelect) {
    sortSelect.addEventListener('change', async (event) => {
        const sortValue = event.target.value;
        const selectedCategory = categorySelect.value;
        const searchQuery = searchInput ? searchInput.value.trim() : '';
        
        let url = `${BASE_URL}`/products;
        
        if (searchQuery) {
            url = `${BASE_URL}/products/search?q=${searchQuery}`;
        } else if (selectedCategory) {
            url = `${BASE_URL}/products/category/${selectedCategory}`;
        }
        
        if (sortValue === 'price-asc') {
            url += (url.includes('?') ? '&' : '?') + 'sortBy=price&order=asc';
        } else if (sortValue === 'price-desc') {
            url += (url.includes('?') ? '&' : '?') + 'sortBy=price&order=desc';
        } else if (sortValue === 'rating') {
            url += (url.includes('?') ? '&' : '?') + 'sortBy=rating&order=desc';
        }
        
        try {
            const res = await fetch(url);
            const data = await res.json();
            renderProducts(data.products);
        } catch (error) {
            console.error('Sorting error:', error);
        }
    });
}
document.addEventListener('DOMContentLoaded',()=> { renderProducts(); loadCategories(); });
