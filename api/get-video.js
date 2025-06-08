// api/get-video.js

// IDEALNYA: Daftar ini harus diambil dari database atau Environment Variable yang lebih terstruktur.
// Untuk contoh ini, kita simpan dalam objek di sini (jika tidak pakai DB/Env Vars).
// Jika Anda pakai Environment Variable, formatnya perlu disesuaikan.
// Misal: VIDEO_MAP="mpDeq1:https://cdn.videy.co/mpDeq1.mp4,AbX19RQp1:https://cdn.videy.co/AbX19RQp1.mp4"
// Lalu di kode ini Anda parsing string tersebut.

// Jika Anda menggunakan Environment Variable 'VIDEO_URL_MAP' di Vercel:
const rawVideoUrlMap = process.env.VIDEO_URL_MAP;
// Contoh parsing string "id1:url1,id2:url2" menjadi Map
const videoMap = new Map();
if (rawVideoUrlMap) {
    rawVideoUrlMap.split(',').forEach(pair => {
        const [id, url] = pair.split(':');
        if (id && url) {
            videoMap.set(id.trim(), url.trim());
        }
    });
} else {
    // FALLBACK: Jika tidak ada Environment Variable, gunakan hardcode ini (HANYA UNTUK DEBUG/TEST)
    // Dalam produksi, HARUS dari Environment Variable atau database
    videoMap.set('mpDeq1', 'https://cdn.videy.co/mpDeq1.mp4');
    videoMap.set('AbX19RQp1', 'https://cdn.videy.co/AbX19RQp1.mp4');
    videoMap.set('4dxBUUww1', 'https://cdn.videy.co/4dxBUUww1.mp4');
    videoMap.set('video4', 'https://cdn.videy.co/video4.mp4');
    // ... tambahkan semua ID unik dan URL lengkap Anda di sini
}


module.exports = (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'https://viocc.pages.dev'); // Ganti dengan domain frontend Anda
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const videoId = req.query.id; // Mengambil ID unik dari query parameter

    // --- Logika Autentikasi/Otorisasi ---
    // (Opsional, tapi sangat direkomendasikan untuk video pribadi)
    // Misalnya, periksa token JWT dari header Authorization:
    // const authHeader = req.headers.authorization;
    // if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //     return res.status(401).json({ message: 'Authorization token required.' });
    // }
    // const token = authHeader.split(' ')[1];
    // if (!isValidToken(token)) { // Implementasikan fungsi isValidToken Anda
    //     return res.status(401).json({ message: 'Invalid or expired token.' });
    // }
    // -------------------------------------

    if (!videoId) {
        return res.status(400).json({ message: 'Video ID is required.' });
    }

    // Cari URL video berdasarkan ID unik
    const videoUrl = videoMap.get(videoId);

    if (!videoUrl) {
        return res.status(404).json({ message: 'Video not found.' });
    }

    // Mengembalikan URL video sebagai JSON
    res.status(200).json({ url: videoUrl });
};
