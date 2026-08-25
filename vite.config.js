import { defineConfig } from 'vite'

// ★ Cek dulu framework kamu di package.json ★
// Jika pakai React, tambahkan baris ini di bawah import (hilangkan tanda //):
// import react from '@vitejs/plugin-react'
//
// Jika pakai Vue, tambahkan baris ini:
// import vue from '@vitejs/plugin-vue'

export default defineConfig({
    server: {
        // Biarkan akses dari IP manapun (supaya bisa diakses via domain)
        host: '0.0.0.0',

        // Daftar putihkan domain khusus kamu
        allowedHosts: [
            'yudhanr.my.id',
            // tambahkan subdomain lain jika perlu, misal 'www.yudhanr.my.id'
        ],

        // (Opsional) Tentukan port tetap, misal 5173:
        // port: 5173,
    },

    // ★ Jika kamu pakai React/Vue, AKTIFKAN plugin di bawah ini ★
    // plugins: [react()], // <-- Hapus tanda // di depan jika pakai React
    // plugins: [vue()],  // <-- Hapus tanda // di depan jika pakai Vue
})  