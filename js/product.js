const queryString = window.location.search;
const productId = queryString.replace("?id=", "");
console.log(productId);
if (productId) {
    fetchProductDetails(productId);
}