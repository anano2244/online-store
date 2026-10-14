const queryString = window.location.search;
const productId = queryString.replace("?id=", "");
console.log(productId);

if (productId) {
    fetchProductDetails(productId).then(product => {
        const container = document.querySelector("#product-detail-container");
        
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
                    <p class="brand">Brand: <strong>${product.brand}</strong></p>
                    <p class="price">Price: $${product.price}</p>
                    <p class="stock">Stock: ${product.stock > 0 ? 'In stock (' + product.stock + ')' : 'Out of stock'}</p>
                    <p class="shipping">Shipping Information: ${product.shippingInformation || 'No information available'}</p>
                    <p class="rating-widget">Rating: ${product.rating} / 5</p>
                    <p class="description">${product.description}</p>
                </div>
            </div>

            <div class="product-reviews">
                <h2>Customer Reviews</h2>
                ${product.reviews && product.reviews.length > 0 ? 
                    product.reviews.map(review => 
                        '<div class="review-card">' +
                            '<p class="reviewer"><strong>' + review.reviewerName + '</strong> - Rating: ' + review.rating + ' / 5</p>' +
                            '<p class="review-text">"' + review.comment + '"</p>' +
                            '<p class="review-date">' + new Date(review.date).toLocaleDateString() + '</p>' +
                        '</div>'
                    ).join('') 
                    : '<p>No reviews available yet.</p>'
                }
            </div>
        `;
    });
}