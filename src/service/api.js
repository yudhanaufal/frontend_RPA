export const API_BASE_URL = 'https://rpafrost.net/api'
export const SERVER_URL = 'https://rpafrost.net'

export async function apiGet(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`)

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
    }

    return await response.json()
}

export async function apiPost(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
    }

    return await response.json()
}

export async function apiPut(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
    }

    return await response.json()
}

export async function apiDelete(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE'
    })

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
    }

    return await response.json()
}