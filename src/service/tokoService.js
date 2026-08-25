import { apiGet } from './api.js'

export async function getToko() {
    const response = await apiGet('/toko')

    return response.data
}