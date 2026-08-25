export function tokoPage() {
    return {
        tokoList: [
            {
                id: 1,
                nama: 'Toko Bekasi',
                alamat: 'Bekasi'
            },
            {
                id: 2,
                nama: 'Toko Jakarta',
                alamat: 'Jakarta'
            },
            {
                id: 3,
                nama: 'Toko Semarang',
                alamat: 'Semarang'
            }
        ],

        pilihToko(toko) {
            localStorage.setItem(
                'selectedToko',
                JSON.stringify(toko)
            )

            window.location.hash = 'produk'
        }
    }
}