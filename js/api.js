const BASE_URL ='https://dummyjson.com';
async function fetchProducts(limit = 12, skip = 0) {
    try {
        const response = await fetch(`${BASE_URL}/products?limit=${limit}&skip=${skip}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('error! could not get files:' , error);
        return {products: [], total: 0};
    }
} 
async function fetchCategories(){
    try{
        const response = await fetch(`${BASE_URL}/products/categories`);
        return await response.json();
    } catch (error) {
        console.error('error!couldn\'t get categories:', error);
        return [];
    }
}
async function searchProducts(query) {
    try {
        const response = await fetch(`${BASE_URL}/products/search?q=${query}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('error! can not find:', error);
        return {products: [], total: 0};
    }
}

async function fetchProductDetails(id) {
    try {
        const response = await fetch(`https://dummyjson.com/products/${id}`);
        const product = await response.json();
        
        console.log(product);
        return product;
    } catch (error) {
        console.error("Error fetching product details:", error);
    }
}
