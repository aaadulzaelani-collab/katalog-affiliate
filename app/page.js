import { getProducts } from '@/lib/getProducts';

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">Katalog Barang Unik ✨</h1>
          <p className="text-gray-600 mt-2">Rekomendasi setup dan gadget terbaik untukmu.</p>
        </header>

        {/* Grid Produk */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100">
              <img src={item.gambar} alt={item.nama} className="w-full h-48 object-cover" />
              <div className="p-4">
                <span className="text-xs font-semibold bg-orange-100 text-orange-600 px-2 py-1 rounded-full">{item.kategori}</span>
                <h3 className="font-bold text-lg mt-2 line-clamp-1">{item.nama}</h3>
                <p className="text-orange-500 font-bold mt-1">Rp {item.harga}</p>
                
                <a href={item.link} target="_blank" className="block w-full text-center bg-gray-900 text-white mt-4 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors">
                  Beli Sekarang
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}