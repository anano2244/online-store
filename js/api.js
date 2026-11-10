const BASE_URL = 'https://dummyjson.com';

async function requestJson(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('error! could not get data: ', error);
        throw error;
    }
}

async function fetchProducts(limit = 12, skip = 0, sort = '') {
    let url = `${BASE_URL}/products?limit=${limit}&skip=${skip}`;
    if (sort) url += `&${sort}`;
    return requestJson(url);
}

async function fetchCategories() {
    return requestJson(`${BASE_URL}/products/categories`);
}

async function searchProducts(query, limit = 12, skip = 0, sort = '') {
    let url = `${BASE_URL}/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`;
    if (sort) url += `&${sort}`;
    return requestJson(url);
}

async function fetchProductsByCategory(slug, limit = 12, skip = 0, sort = '') {
    let url = `${BASE_URL}/products/category/${slug}?limit=${limit}&skip=${skip}`;
    if (sort) url += `&${sort}`;
    return requestJson(url);
}

async function fetchProductDetails(id) {
    return requestJson(`${BASE_URL}/products/${id}`);
}
