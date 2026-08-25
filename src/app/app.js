import { getToko } from '../service/tokoService.js'
import { getProdukByToko, getProdukById, updateProduk } from '../service/produkService.js'
import { SERVER_URL } from '../service/api.js'

export function app() {
    return {
        currentPage: 'toko',

        // =========================
        // TOKO
        // =========================
        tokoList: [],
        selectedToko: null,

        // =========================
        // PRODUK
        // =========================
        produkList: [],
        selectedProduk: null,
        serverUrl: SERVER_URL,

        // =========================
        // EDIT FORM STATE
        // =========================
        formEdit: {
            id: null,
            nama_produk: '',
            barcode: '',
            harga_beli: 0,
            harga_jual: 0,
            stok: 0,
            toko_id: null,
            gambarFile: null,
            gambarPreview: null,
            existingGambar: null
        },
        loadingEdit: false,
        errorEdit: null,
        successEdit: null,

        // =========================
        // STATE
        // =========================
        loading: false,
        loadingProduk: false,
        error: null,
        errorProduk: null,

        // =========================
        // INIT
        // =========================
        async init() {
            this.handleRoute()

            window.addEventListener('popstate', async () => {
                await this.handleRoute()
            })

            if (this.currentPage === 'toko') {
                await this.loadToko()
            }

            if (this.currentPage === 'produk') {
                await this.loadTokoById()
                await this.loadProduk()
            }
        },

        defaultImage: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150"><rect width="150" height="150" rx="8" fill="%23e2e8f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%2364748b">No Image</text></svg>`,

        // =========================
        // HELPER GET IMAGE URL
        // =========================
        getImageUrl(produk) {
            if (!produk) return this.defaultImage
            const imgPath = produk.gambar_url || produk.gambar
            if (!imgPath) return this.defaultImage

            if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
                return imgPath
            }
            if (imgPath.startsWith('/uploads/')) {
                return `${this.serverUrl}${imgPath}`
            }
            if (imgPath.startsWith('uploads/')) {
                return `${this.serverUrl}/${imgPath}`
            }
            if (imgPath.startsWith('/')) {
                return `${this.serverUrl}${imgPath}`
            }
            return `${this.serverUrl}/uploads/produk/${imgPath}`
        },

        // =========================
        // LOAD TOKO
        // =========================
        async loadToko() {
            this.loading = true
            this.error = null

            try {
                this.tokoList = await getToko()
            } catch (error) {
                console.error('Get toko error:', error)
                this.error = 'Gagal mengambil data toko'
            } finally {
                this.loading = false
            }
        },

        // =========================
        // LOAD TOKO BERDASARKAN ID
        // =========================
        async loadTokoById() {
            const tokoId = this.selectedToko?.id
            if (!tokoId) return

            if (this.tokoList.length === 0) {
                try {
                    this.tokoList = await getToko()
                } catch (e) {
                    console.error('Failed loading toko list', e)
                }
            }

            const toko = this.tokoList.find(t => t.id === tokoId)
            if (toko) {
                this.selectedToko = toko
            }
        },

        // =========================
        // LOAD PRODUK
        // =========================
        async loadProduk() {
            const tokoId = this.selectedToko?.id
            if (!tokoId) return

            this.loadingProduk = true
            this.errorProduk = null

            try {
                this.produkList = await getProdukByToko(tokoId)
            } catch (error) {
                console.error('Get produk error:', error)
                this.errorProduk = 'Gagal mengambil data produk'
                this.produkList = []
            } finally {
                this.loadingProduk = false
            }
        },

        // =========================
        // LOAD EDIT PRODUK
        // =========================
        async loadEditProduk(tokoId, produkId) {
            this.loadingEdit = true
            this.errorEdit = null
            this.successEdit = null

            this.selectedToko = { id: Number(tokoId) }
            await this.loadTokoById()

            let produk = this.produkList.find(p => p.id === Number(produkId))

            if (!produk) {
                try {
                    produk = await getProdukById(produkId)
                } catch (err) {
                    console.error('Fetch product detail error:', err)
                }
            }

            if (produk) {
                this.selectedProduk = produk
                this.formEdit = {
                    id: produk.id,
                    nama_produk: produk.nama_produk || produk.nama || '',
                    barcode: produk.barcode || '',
                    harga_beli: produk.harga_beli || produk.harga || 0,
                    harga_jual: produk.harga_jual || produk.harga || 0,
                    stok: produk.stok || 0,
                    toko_id: produk.toko_id || Number(tokoId),
                    gambarFile: null,
                    gambarPreview: null,
                    existingGambar: this.getImageUrl(produk)
                }
            } else {
                this.errorEdit = 'Produk tidak ditemukan'
            }

            this.loadingEdit = false
        },

        // =========================
        // HANDLE FILE INPUT CHANGE
        // =========================
        onFileChange(event) {
            const file = event.target.files[0]
            if (file) {
                this.formEdit.gambarFile = file
                this.formEdit.gambarPreview = URL.createObjectURL(file)
            } else {
                this.formEdit.gambarFile = null
                this.formEdit.gambarPreview = null
            }
        },

        // =========================
        // SIMPAN EDIT PRODUK
        // =========================
        async simpanEditProduk() {
            if (!this.formEdit.id) return

            this.loadingEdit = true
            this.errorEdit = null
            this.successEdit = null

            try {
                const formData = new FormData()
                formData.append('nama_produk', this.formEdit.nama_produk)
                formData.append('barcode', this.formEdit.barcode)
                formData.append('harga_beli', this.formEdit.harga_beli)
                formData.append('harga_jual', this.formEdit.harga_jual)
                formData.append('stok', this.formEdit.stok)
                if (this.formEdit.toko_id) {
                    formData.append('toko_id', this.formEdit.toko_id)
                }
                if (this.formEdit.gambarFile) {
                    formData.append('gambar', this.formEdit.gambarFile)
                }

                await updateProduk(this.formEdit.id, formData)

                this.successEdit = 'Produk berhasil diperbarui!'
                
                // Refresh produk list and navigate back to produk page after short delay
                setTimeout(async () => {
                    await this.keProduk(this.selectedToko.id)
                }, 1000)
            } catch (error) {
                console.error('Update error:', error)
                this.errorEdit = error.message || 'Gagal memperbarui produk'
            } finally {
                this.loadingEdit = false
            }
        },

        // =========================
        // ROUTER
        // =========================
        async handleRoute() {
            const path = window.location.pathname

            if (path === '/' || path === '/toko') {
                this.currentPage = 'toko'
                if (this.tokoList.length === 0) {
                    await this.loadToko()
                }
                return
            }

            // /toko/:tokoId/produk/:produkId/edit
            const editMatch = path.match(/^\/toko\/(\d+)\/produk\/(\d+)\/edit$/)
            if (editMatch) {
                this.currentPage = 'editProduk'
                await this.loadEditProduk(editMatch[1], editMatch[2])
                return
            }

            // Redirect /toko/:tokoId/produk/:produkId directly to edit view
            const detailMatch = path.match(/^\/toko\/(\d+)\/produk\/(\d+)$/)
            if (detailMatch) {
                await this.keEditProduk(detailMatch[1], detailMatch[2])
                return
            }

            // /toko/:tokoId/produk
            const produkMatch = path.match(/^\/toko\/(\d+)\/produk$/)
            if (produkMatch) {
                this.currentPage = 'produk'
                this.selectedToko = { id: Number(produkMatch[1]) }
                await this.loadTokoById()
                await this.loadProduk()
                return
            }

            this.currentPage = '404'
        },

        // =========================
        // NAVIGATE
        // =========================
        async navigate(path) {
            history.pushState({}, '', path)
            await this.handleRoute()
        },

        // =========================
        // KE TOKO
        // =========================
        async keToko() {
            this.selectedToko = null
            this.selectedProduk = null
            this.produkList = []
            await this.navigate('/toko')
        },

        // =========================
        // KE PRODUK
        // =========================
        async keProduk(tokoId) {
            this.selectedProduk = null
            await this.navigate(`/toko/${tokoId}/produk`)
        },

        // =========================
        // EDIT PRODUK
        // =========================
        async keEditProduk(tokoId, produkId) {
            this.selectedProduk = { id: produkId }
            await this.navigate(`/toko/${tokoId}/produk/${produkId}/edit`)
        }
    }
}