export function produkPage() {
    return {
        produkList: [
            {
                id: 1,
                toko_id: 1,
                nama: 'Nugget Ayam',
                harga: 25000,
                stok: 20
            },
            {
                id: 2,
                toko_id: 1,
                nama: 'Sosis Ayam',
                harga: 18000,
                stok: 15
            },
            {
                id: 3,
                toko_id: 1,
                nama: 'Kentang Frozen',
                harga: 22000,
                stok: 10
            }
        ],

        selectedToko: null,
        selectedProduk: null,

        init() {
            this.selectedToko = JSON.parse(
                localStorage.getItem('selectedToko')
            )
        },

        get produkByToko() {
            if (!this.selectedToko) {
                return []
            }

            return this.produkList.filter(
                produk => produk.toko_id === this.selectedToko.id
            )
        },

        pilihProduk(produk) {
            this.selectedProduk = produk

            localStorage.setItem(
                'selectedProduk',
                JSON.stringify(produk)
            )

            window.location.hash = 'edit-produk'
        },

        kembaliKeToko() {
            window.location.hash = 'toko'
        }
    }
}