const shopContainer = document.querySelector('#shop-container');
let currentPage = 1;
const limit = 12;
async function renderProducts(productsToRender = null) {
    let products = productsToRender;
    if (!products) {
        const skip = (--currentPage) * limit;
        const data = await fetchProducts(limit, skip);
        products = data.products;
        renderPagination (data.total);
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
        addToCartBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            addToCart(product);
            renderCart();
        });
        
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
        
        let url = `${BASE_URL}/product`;
        
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

const paginationContainer = document.querySelector('#pagination-container');

function renderPagination(totalProducts) {
    paginationContainer.innerHTML = ''; 
    const totalPages = Math.ceil(totalProducts / limit);

    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = '◀';
        prevButton.addEventListener('click', async () => {
            currentPage--;
            const skip = (currentPage - 1) * limit;
            const data = await fetchProducts(limit, skip);
            await renderProducts(data.products); 
            renderPagination(totalProducts);
        });
        paginationContainer.appendChild(prevButton);
    }

    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.textContent = '▶';
        nextButton.addEventListener('click', async () => {
            currentPage++;
            const skip = (currentPage -1) * limit;
            const data = await fetchProducts(limit, skip);
            await renderProducts(data.products);
            renderPagination(totalProducts);
        });
        paginationContainer.appendChild(nextButton);
    }
}
const phoneInput = document.querySelector('#phone');

if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        const phoneValue = e.target.value.trim();
        const phoneRegex = /^\d+$/;
        
        let errorMsg = document.querySelector('#form-error-msg');
        if (!errorMsg) {
            errorMsg = document.createElement('div');
            errorMsg.id = 'form-error-msg';
            errorMsg.style.color = 'red';
            errorMsg.style.margin = '10px 0';
            phoneInput.parentNode.insertBefore(errorMsg, phoneInput);
        }

        if (phoneValue !== '' && !phoneRegex.test(phoneValue)) {
            errorMsg.textContent = 'Please enter only digits for the phone number!';
        } else {
            errorMsg.textContent = '';
        }
    });
}

// ფორმა
const checkoutForm = document.querySelector('#checkout-form');

if (checkoutForm) {
    checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const phone = phoneInput ? phoneInput.value.trim() : '';
        let errorMsg = document.querySelector('#form-error-msg');
        if (!errorMsg) {
            errorMsg = document.createElement('div');
            errorMsg.id = 'form-error-msg';
            errorMsg.style.color = 'red';
            errorMsg.style.margin = '10px 0';
            phoneInput.parentNode.insertBefore(errorMsg, phoneInput);
        }

        if (phone === '' || !/^\d+$/.test(phone)) {
            errorMsg.textContent = 'Please enter only digits for the phone number!';
            return;
        }
        errorMsg.textContent = '';

        const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
        const submitBtn = checkoutForm.querySelector('button[type="submit"]');

        try {
            if (submitBtn) submitBtn.disabled = true;

            // ზუსტად ითხოვს: მხოლოდ id და quantity
            const orderData = {
                userId: 1,
                products: currentCart.map(item => ({
                    id: item.id,
                    quantity: item.quantity
                }))
            };

            const response = await fetch(`${BASE_URL}/carts/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();

            if (response.ok) {
                localStorage.removeItem('cart');
                checkoutForm.reset();

                // შედეგის გამოჩენა გვერდზე (UI-ში) დივის მეშვეობით
                let successMsg = document.querySelector('#order-success-msg');
                if (!successMsg) {
                    successMsg = document.createElement('div');
                    successMsg.id = 'order-success-msg';
                    successMsg.style.color = 'green';
                    successMsg.style.margin = '10px 0';
                    checkoutForm.parentNode.insertBefore(successMsg, checkoutForm);
                }
                successMsg.textContent = `Order placed successfully! Order ID: ${result.id}`;
            } else {
                console.error('Failed to place order.');
            }

        } catch (error) {
            console.error('Error submitting order:', error);
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    });
}
function renderCart() {
    const cartContainer = document.querySelector('#cart-container'); // კალათის კონტეინერი
    const cartTotalElem = document.querySelector('#cart-total'); // საერთო ჯამის ელემენტი
    const cartCountBadge = document.querySelector('.cart-count-badge'); // ჰედერში რაოდენობის ბეჯი
    
    const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (!cartContainer) return;

    // A5 პუნქტი: თუ კალათა ცარიელია
    if (currentCart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart-msg">თქვენი კალათა ცარიელია</p>';
        if (cartTotalElem) cartTotalElem.textContent = '0 ₾';
        if (cartCountBadge) cartCountBadge.textContent = '0';
        return;
    }

    let totalSum = 0;
    let totalQuantity = 0;

    cartContainer.innerHTML = currentCart.map(item => {
        const itemTotal = item.price * item.quantity;
        totalSum += itemTotal;
        totalQuantity += item.quantity;

        return `
            <div class="cart-item" data-id="${item.id}">
                <h4>${item.title || item.name}</h4>
                <p>ფასი: ${item.price} ₾ × ${item.quantity} = ${itemTotal.toFixed(2)} ₾</p>
                <div class="quantity-controls">
                    <button class="decrease-btn" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-btn" data-id="${item.id}">+</button>
                </div>
                <button class="remove-btn" data-id="${item.id}">წაშლა</button>
            </div>
        `;
    }).join('');

    // ჰედერისა და ჯამის განახლება
    if (cartTotalElem) cartTotalElem.textContent = `${totalSum.toFixed(2)} gel`;
    if (cartCountBadge) cartCountBadge.textContent = totalQuantity;

    attachCartEventListeners();
}

function attachCartEventListeners() {
    const cartContainer = document.querySelector('#cart-container');
    if (!cartContainer) return;

    let currentCart = JSON.parse(localStorage.getItem('cart')) || [];

    // რაოდენობის გაზრდა (+) - stock-ის გათვალისწინებით
    cartContainer.querySelectorAll('.increase-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = Number(e.target.dataset.id);
            const product = currentCart.find(item => item.id === id);
            
            if (product) {
                const maxStock = product.stock || 999; 
                if (product.quantity < maxStock) {
                    product.quantity += 1;
                    localStorage.setItem('cart', JSON.stringify(currentCart));
                    renderCart();
                }
            }
        });
    });

    // რაოდენობის შემცირება (-) - არ ჩამოდის 1-ზე ქვემოთ
    cartContainer.querySelectorAll('.decrease-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = Number(e.target.dataset.id);
            const product = currentCart.find(item => item.id === id);
            
            if (product && product.quantity > 1) {
                product.quantity -= 1;
                localStorage.setItem('cart', JSON.stringify(currentCart));
                renderCart();
            }
        });
    });

    // წაშლა კალათიდან
    cartContainer.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = Number(e.target.dataset.id);
            currentCart = currentCart.filter(item => item.id !== id);
            localStorage.setItem('cart', JSON.stringify(currentCart));
            renderCart();
        });
    });
}

// ==========================================
// ძებნის შედეგის შემოწმება (როცა შედეგი არ არის)
// ==========================================
function renderSearchResults(products) {
    const resultsContainer = document.querySelector('#search-results-container');
    if (!resultsContainer) return;

    // A5 / ძებნის შეტყობინება, თუ პროდუქტი ვერ მოიძებნა
    if (!products || products.length === 0) {
        resultsContainer.innerHTML = '<p class="no-results-msg">product couldn\'t found</p>';
        return;
    }

    resultsContainer.innerHTML = products.map(p => `
        <div class="product-card">
            <h3>${p.title}</h3>
            <p>${p.price} gel</p>
        </div>
    `).join('');
}


document.addEventListener('DOMContentLoaded',()=> { renderProducts(); loadCategories(); renderCart(); });
