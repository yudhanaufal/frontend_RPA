export function editProdukPage() {
    return {
        produk: null,

        form: {
            nama: '',
            harga: 0,
            stok: 0
        },

        init() {
            const data = localStorage.getItem('selectedProduk')

            if (!data) {
                return
            }

            this.produk = JSON.parse(data)

            this.form.nama = this.produk.nama
            this.form.harga = this.produk.harga
            this.form.stok = this.produk.stok
        },

        simpan() {
            console.log('Data yang akan disimpan:', this.form)

            alert('Produk berhasil disimpan')
        },

        kembali() {
            window.location.hash = 'produk'
        }
    }
}