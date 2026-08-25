import { apiGet, API_BASE_URL } from './api.js'

export async function getProdukByToko(tokoId) {
    const response = await apiGet(`/produk/toko/${tokoId}`)
    return response.data
}

export async function getProdukById(id) {
    const response = await apiGet(`/produk/${id}`)
    return response.data
}

export async function updateProduk(id, formDataOrObject) {
    let response
    if (formDataOrObject instanceof FormData) {
        response = await fetch(`${API_BASE_URL}/produk/${id}`, {
            method: 'PUT',
            body: formDataOrObject
        })
    } else {
        response = await fetch(`${API_BASE_URL}/produk/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataOrObject)
        })
    }

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.message || `HTTP error: ${response.status}`)
    }

    return await response.json()
}