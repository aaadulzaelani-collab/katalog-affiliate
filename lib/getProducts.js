export async function getProducts() {
  // Ganti ID_SHEET_KAMU dengan ID yang kamu salin di Langkah 1
  const SHEET_ID = "1kgl-NSd-mIJug1Q-KUpJoVtyS_6pN27oc8GbN7GYc3k";
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;

  const response = await fetch(url, { next: { revalidate: 3600 } }); // Cache 1 jam
  const data = await response.text();

  // Parsing CSV sederhana ke Array of Objects
  const rows = data.split('\n').slice(1);
  return rows.map(row => {
    const columns = row.split('","').map(col => col.replace(/"/g, ''));
    return {
      id: columns[0],
      nama: columns[1],
      kategori: columns[2],
      harga: columns[3],
      link: columns[4],
      gambar: columns[5],
      rating: columns[6]
    };
  });
}