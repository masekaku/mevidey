// api/get-video.js
const rawVideoUrls = process.env.VIDEO_URLS;
const VIDEO_URLS = rawVideoUrls ? rawVideoUrls.split(',') : [];

module.exports = (req, res) => {
    // Mengizinkan CORS dari domain frontend Anda (ganti dengan domain pages.dev Anda)
    // Jika frontend Anda di `viocc.pages.dev`, ganti 'http://localhost:8080'
    res.setHeader('Access-Control-Allow-Origin', 'https://viocc.pages.dev'); // Ganti ini!
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle OPTIONS preflight request for CORS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const videoIndex = parseInt(req.query.id); // Mengambil ID dari query parameter

    // --- Logika Otentikasi/Otorisasi Sederhana (Opsional tapi Direkomendasikan) ---
    // Contoh: Memerlukan token sederhana di header Authorization
    // const authToken = req.headers.authorization;
    // if (!authToken || authToken !== 'Bearer my_super_secret_token_from_frontend') {
    //     return res.status(401).json({ message: 'Unauthorized' });
    // }
    // ---------------------------------------------------------------------

    if (isNaN(videoIndex) || videoIndex < 0 || videoIndex >= VIDEO_URLS.length) {
        // Menggunakan res.status(404) untuk Not Found
        return res.status(404).json({ message: 'Video not found or invalid ID.' });
    }

    const videoUrl = VIDEO_URLS[videoIndex];

    // Mengembalikan URL video sebagai JSON
    res.status(200).json({ url: videoUrl });
};
