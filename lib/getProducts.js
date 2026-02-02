// export async function getProducts() {
//   // Ganti ID_SHEET_KAMU dengan ID yang kamu salin di Langkah 1
//   const SHEET_ID = "1kgl-NSd-mIJug1Q-KUpJoVtyS_6pN27oc8GbN7GYc3k";
//   const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;

//   const response = await fetch(url, { next: { revalidate: 3600 } }); // Cache 1 jam
//   const data = await response.text();

//   // Parsing CSV sederhana ke Array of Objects
//   const rows = data.split('\n').slice(1);
//   return rows.map(row => {
//     const columns = row.split('","').map(col => col.replace(/"/g, ''));
//     return {
//       id: columns[0],
//       nama: columns[1],
//       kategori: columns[2],
//       harga: columns[3],
//       link: columns[4],
//       gambar: columns[5],
//       rating: columns[6]
//     };
//   });
// }


/**
 * Fungsi untuk mengambil data dari Google Sheets secara dinamis
 * @param {string} sheetName - Nama TAB di Google Sheets (contoh: "Sheet1" atau "ManajemenKonten")
 */
export async function getSheetData(sheetName = "Sheet1") {
  // Masukkan ID Spreadsheet kamu di sini
  // ID ada di URL browser: https://docs.google.com/spreadsheets/d/[ID_DI_SINI]/edit
  const SHEET_ID = "1kgl-NSd-mIJug1Q-KUpJoVtyS_6pN27oc8GbN7GYc3k"; 
  
  // URL Google Visualization API untuk output JSON
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

  try {
    // revalidate: 0 memastikan data selalu fresh (tidak tersimpan di cache Vercel)
    const response = await fetch(url, { 
      next: { revalidate: 0 },
      cache: 'no-store' 
    });

    if (!response.ok) {
      throw new Error("Gagal menghubungi Google Sheets");
    }

    const text = await response.text();
    
    // Google mengembalikan data dengan prefix "/* google.visualization.Query.setResponse(...); */"
    // Kita perlu memotong teks tersebut agar menjadi JSON murni
    const jsonString = text.substring(47, text.length - 2);
    const jsonData = JSON.parse(jsonString);

    // Ambil baris data
    const rows = jsonData.table.rows;
    // Ambil nama kolom/header
    const cols = jsonData.table.cols;

    // Map data menjadi array of objects yang rapi
    return rows.map((row) => {
      const obj = {};
      cols.forEach((col, index) => {
        // Normalisasi nama kolom: Huruf kecil dan ganti spasi dengan underscore (_)
        // Contoh: "Nama Produk" -> "nama_produk"
        const key = col.label 
          ? col.label.toLowerCase().replace(/\s+/g, '_') 
          : `column_${index}`;
        
        // Ambil nilai dari sel (v adalah value)
        obj[key] = row.c[index] ? row.c[index].v : "";
      });
      return obj;
    });
  } catch (error) {
    console.error(`Gagal mengambil data dari sheet "${sheetName}":`, error);
    return [];
  }
}

/**
 * Fungsi khusus untuk mengambil data produk (untuk halaman depan)
 * Tetap mempertahankan nama fungsi lama agar tidak error di app/page.tsx
 */
export async function getProducts() {
  return await getSheetData("Sheet1"); // Ganti "Sheet1" jika nama tab produkmu berbeda
}