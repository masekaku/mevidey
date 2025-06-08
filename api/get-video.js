// api/get-video.js

// Mengambil string VIDEO_URL_MAP dari environment variable Vercel
const rawVideoUrlMap = process.env.VIDEO_URL_MAP;

// Menginisialisasi Map untuk menyimpan pasangan ID unik dan URL video
const videoMap = new Map();

// Parsing string VIDEO_URL_MAP jika ada
if (rawVideoUrlMap) {
    // Memisahkan string berdasarkan koma untuk mendapatkan setiap pasangan ID:URL
    rawVideoUrlMap.split(',').forEach(pair => {
        // Memisahkan setiap pasangan ID:URL berdasarkan titik dua
        const [id, url] = pair.split(':');
        // Memastikan ID dan URL ada dan kemudian menyimpannya ke dalam Map
        if (id && url) {
            videoMap.set(id.trim(), url.trim()); // trim() untuk menghapus spasi di awal/akhir
        }
    });
} else {
    // Pesan peringatan jika environment variable tidak ditemukan (untuk debugging)
    // Dalam produksi, ini seharusnya tidak terjadi jika sudah diatur dengan benar
    console.warn("WARNING: VIDEO_URL_MAP environment variable not found. Video map will be empty.");
}


// Fungsi utama yang akan dijalankan oleh Vercel sebagai Serverless Function
module.exports = (req, res) => {
    // Mengatur header CORS agar frontend Anda bisa mengakses API
    // Ganti 'https://viocc.pages.dev' dengan domain frontend Anda yang sebenarnya
    res.setHeader('Access-Control-Allow-Origin', 'https://viocc.pages.dev');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS'); // Izinkan metode GET dan OPTIONS
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Menangani permintaan OPTIONS (preflight request untuk CORS)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Mengambil 'id' video dari query parameter URL (misalnya ?id=tSpwxCxv1)
    const videoId = req.query.id;

    // Validasi apakah 'id' video disediakan
    if (!videoId) {
        // Jika ID tidak ada, kembalikan status 400 Bad Request
        return res.status(400).json({ message: 'Video ID is required.' });
    }

    // Mencari URL video berdasarkan ID unik yang diminta
    const videoUrl = videoMap.get(videoId);

    // Jika URL video tidak ditemukan di videoMap
    if (!videoUrl) {
        // Kembalikan status 404 Not Found
        return res.status(404).json({ message: `Video with ID '${videoId}' not found.` });
    }

    // Jika video ditemukan, kembalikan URL sebagai JSON dengan status 200 OK
    res.status(200).json({ url: videoUrl });
};
