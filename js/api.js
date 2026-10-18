const BASE_URL ='https://dummyjson.com';
async function fetchProducts(limit = 12, skip = 0) {
    try {
        const response = await fetch(`${BASE_URL}/products?limit=${limit}&skip=${skip}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('error! could not get files: ', error);
        throw error; 
    }
}
async function fetchCategories(){
    try {
        const response = await fetch(`${BASE_URL}/products/categories`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('error! couldn\'t get categories:', error);
        throw error;
    }
}

async function searchProducts(query) {
    try {
        const response = await fetch(`${BASE_URL}/products/search?q=${query}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('error! can not find:', error);
        throw error;
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
