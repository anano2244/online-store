const shopContainer = document.querySelector('#shop-container');
let currentPage = 1;
const limit = 12;
let currentSortQuery = '';
async function renderProducts(productsToRender = null) {
    let products = productsToRender;
    if (!products) {
        const skip = (currentPage -1) * limit;
        shopContainer.innerHTML = '<p>Loading…</p>';
        try {
            const data = await fetchProducts(limit, skip);
            products = data.products;
            renderPagination (data.total);
        } catch (error) {
            showLoadError();
            return;
        }
    }
    if (!products || products.length === 0) {
        shopContainer.innerHTML = '<p class="error-message">products couldn\'t found.</p>';
        return;
    }
    shopContainer.innerHTML = '';
    const cart = getCart();
    products.forEach(product => {
    const formattedPrice = product.price.toFixed(2);
    const brandName = product.brand ? product.brand : 'there is no brand';
    const isOutOfStock = product.stock === 0 || product.availabilityStatus === ' Out of stock';
    const cartItem = cart.find(item => item.id === product.id);
    const cartLabel = cartItem ? `In cart (${cartItem.quantity})` : 'Add to cart';
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
        <button class="add-to-cart-btn" ${isOutOfStock ? 'disabled' : ''}>${isOutOfStock ? 'out of stock' : cartLabel}</button> `;
        const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
        addToCartBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            addToCart(product);
            renderCart();
            const added = getCart().find(item => item.id === product.id);
            addToCartBtn.textContent = `In cart (${added.quantity})`;
        });
        
    shopContainer.appendChild(productCard);
    });
}
function showLoadError() {
    shopContainer.innerHTML = `
        <p class="error-message">Could not load products. Please try again.</p>
        <button id="retry-btn">Try again</button>
    `;
    document.querySelector('#retry-btn').addEventListener('click', () => renderProducts());
}

const searchInput = document.querySelector('#search-input');
if (searchInput) {
    searchInput.addEventListener('input', async (e) => {
        currentPage = 1;
        const query = e.target.value.trim();
        if (query === '') {
            renderProducts();
        } else {
            try {
                const data = await searchProducts(query);
                renderProducts(data.products);
            } catch (error) {
                showLoadError();
            }
        }
    });
}
async function loadCategories() {
    try {
        const categories = await fetchCategories();
        renderCategoryOptions(categories);
    } catch (err) {
        console.error(err);
    }
}

function renderCategoryOptions(categories) {
    const select = document.getElementById('category-select');
    if (!select) return;
    categories.forEach(category => {
        const name = typeof category === 'string' ? category : category.name;
        const slug = typeof category === 'string' ? category : category.slug;
        const option = document.createElement('option');
        option.value = slug;
        option.textContent = name;
        select.appendChild(option);
    });
}

const categorySelect = document.getElementById('category-select');

if (categorySelect) {
        categorySelect.addEventListener('change', async (event) => {
            currentPage = 1;
            const selectedCategory = event.target.value;
            event.target.classList.toggle('active', selectedCategory !== '');

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
             if (!response.ok) throw new Error('HTTP ' + response.status);
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
        
        let url = `${BASE_URL}/products`;
        
        if (searchQuery) {
            url = `${BASE_URL}/products/search?q=${searchQuery}`;
        } else if (selectedCategory) {
            url = `${BASE_URL}/products/category/${selectedCategory}`;
        }
        
        if (sortValue === 'price-asc') {
            currentSortQuery = 'sortBy=price&order=asc';
        } else if (sortValue === 'price-desc') {
            currentSortQuery = 'sortBy=price&order=desc';
        } else if (sortValue === 'rating') {
            currentSortQuery = 'sortBy=rating&order=desc';
        } else {
            currentSortQuery = '';
        }
        event.target.classList.toggle('active', sortValue !== '');

        currentPage = 1;
        url += (url.includes('?') ? '&' : '?') + (currentSortQuery ? currentSortQuery + '&' : '') +
            `limit=${limit}&skip=${(currentPage - 1) * limit}`;

        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const data = await res.json();
            renderProducts(data.products);
            renderPagination(data.total);
        } catch (error) {
            showLoadError();
        }
    });
}

const paginationContainer = document.querySelector('#pagination-container');

async function goToPage() {
    const data = await fetchProducts(limit, (currentPage - 1) * limit, currentSortQuery);
    await renderProducts(data.products);
    renderPagination(data.total);
}

function renderPagination(totalProducts) {
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(totalProducts / limit);

        const pageInfo = document.createElement('span');
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        paginationContainer.appendChild(pageInfo);

        const prevButton = document.createElement('button');
        prevButton.textContent = '◀';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => { currentPage--; goToPage(); });
        paginationContainer.appendChild(prevButton);

        for (let page = 1; page <= totalPages; page++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = page;
            if (page === currentPage) pageButton.classList.add('active');
            pageButton.addEventListener('click', () => { currentPage = page; goToPage(); });
            paginationContainer.appendChild(pageButton);
        }

        const nextButton = document.createElement('button');
        nextButton.textContent = '▶';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => { currentPage++; goToPage(); });
        paginationContainer.appendChild(nextButton);
    }
const phoneInput = document.querySelector('#phone');

function showFieldError(input, ok, message) {
    let msg = input.nextElementSibling;
    if (!msg || !msg.classList.contains('field-error')) {
        msg = document.createElement('div');
        msg.className = 'field-error';
        input.after(msg);
    }
    msg.textContent = ok ? '' : message;
    return ok;
}

// ფორმა
const checkoutForm = document.querySelector('#checkout-form');

if (checkoutForm) {
    checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const fullnameInput = document.querySelector('#fullname');
        const emailInput = document.querySelector('#email');
        const addressInput = document.querySelector('#address');
        const phone = phoneInput ? phoneInput.value.trim() : '';

        const okFullname = showFieldError(fullnameInput, fullnameInput.value.trim().length >= 3, 'Please enter your full name (at least 3 characters).');
        const okEmail = showFieldError(emailInput, /^\S+@\S+\.\S+$/.test(emailInput.value.trim()), 'Please enter a valid email address.');
        const okAddress = showFieldError(addressInput, addressInput.value.trim() !== '', 'Address is required.');
        const okPhone = showFieldError(phoneInput, /^\d+$/.test(phone), 'Please enter only digits for the phone number.');

        if (!okFullname || !okEmail || !okAddress || !okPhone) return;

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
                renderCart();
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
                successMsg.textContent = `Order placed! ID: ${result.id} — total: $${result.total}, discounted total: $${result.discountedTotal}, products: ${result.totalProducts}, quantity: ${result.totalQuantity}`;
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
    const cartContainer = document.querySelector('#cart-container'); 
    const cartTotalElem = document.querySelector('#cart-total'); 
    const cartCountBadge = document.querySelector('.cart-count-badge'); 
    
    const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (!cartContainer) return;

  
    if (currentCart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty</p>';
        if (cartTotalElem) cartTotalElem.textContent = '$0.00';
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
                <p>Price: $${item.price} × ${item.quantity} = $${itemTotal.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button class="decrease-btn" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-btn" data-id="${item.id}">+</button>
                </div>
                <button class="remove-btn" data-id="${item.id}">Remove</button>
            </div>
        `;
    }).join('');


    if (cartTotalElem) cartTotalElem.textContent = `$${totalSum.toFixed(2)}`;
    if (cartCountBadge) cartCountBadge.textContent = totalQuantity;

    attachCartEventListeners();
}

function attachCartEventListeners() {
    const cartContainer = document.querySelector('#cart-container');
    if (!cartContainer) return;

    let currentCart = JSON.parse(localStorage.getItem('cart')) || [];

  
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

  
    cartContainer.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = Number(e.target.dataset.id);
            currentCart = currentCart.filter(item => item.id !== id);
            localStorage.setItem('cart', JSON.stringify(currentCart));
            renderCart();
        });
    });
}




document.addEventListener('DOMContentLoaded',()=> { renderProducts(); loadCategories(); renderCart(); });
window.addEventListener('pageshow', () => { renderCart(); });
