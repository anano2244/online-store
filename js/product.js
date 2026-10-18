const queryString = window.location.search;
const productId = queryString.replace("?id=", "");
console.log(productId);

if (productId) {
    const container = document.querySelector("#product-detail-container");
    fetchProductDetails(productId)
     
    .then(product => {
           if (!product) return;

            container.innerHTML = `
                <div class="product-detail-wrapper">
                    <div class="product-gallery">
                        <img src="${product.thumbnail}" alt="${product.title}" id="main-image">
                        <div class="thumbnail-list">
                            ${product.images.map(img => `<img src="${img}" class="thumb" onclick="document.getElementById('main-image').src='${img}'">`).join('')}
                        </div>
                    </div>

                    <div class="product-info">
                        <h1>${product.title}</h1>
                        <p>Brand: <strong>${product.brand || 'Unknown'}</strong></p>
                        <p class="price">Price: $${product.price}</p>
                        <p class="stock">Stock: ${product.stock > 0 ? 'In stock (' + product.stock + ')' : 'Out of stock'}</p>
                        <p class="shipping">Shipping Information: ${product.shippingInformation || 'No information available'}</p>
                        <p class="rating-widget">Rating: ${product.rating} / 5</p>
                        <p class="description">${product.description}</p>
                        <button id="add-to-cart-btn" style="background-color: rgb(170, 221, 221);">Add to Cart</button>
                    </div>
                </div>

                <div class="product-reviews">
                    <h2>Customer Reviews</h2>
                    ${product.reviews && product.reviews.length > 0 ? 
                        product.reviews.map(review => `
                            <div class="review-card">
                                <p class="reviewer"><strong>${review.reviewerName}</strong> - Rating:${review.rating} / 5</p>
                                <p class="review-text">"${review.comment}"</p>
                                <p class="review-date">${new Date(review.date).toLocaleDateString()}</p>
                            </div>
                        `).join('') 
                        : '<p>No reviews available yet.</p>'
                    }
                </div>
            `;

            const addToCartBtn = container.querySelector('#add-to-cart-btn');
            addToCartBtn.addEventListener('click', () => addToCart(product));
        })
        .catch(error => {
            container.innerHTML = `
                <div class="error-container">
                    <p>Failed to load product details.</p>
                    <button id="try-again-btn">Try again</button>
                </div>
            `;
            document.getElementById('try-again-btn').addEventListener('click', () => {
                location.reload();
            });
        });
}