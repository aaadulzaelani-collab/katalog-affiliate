"use client";

import { useState, useEffect } from 'react';
import { getProducts } from '@/lib/getProducts';


//Meta data Share to Medsos


// Definisi struktur data agar tidak error TypeScript
interface Product {
  id: string;
  nama: string;
  kategori: string;
  harga: string;
  link: string;
  gambar: string;
  rating: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Logika Share
  const handleShare = (item: Product) => {
    const shareText = `Cek deh! ${item.nama} harganya cuma Rp ${item.harga}. Keren banget:`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      navigator.share({
        title: item.nama,
        text: shareText,
        url: shareUrl,
      }).catch(() => {});
    } else {
      const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`;
      window.open(waUrl, '_blank');
    }
  };

  // Logika Filter & Search
  const filteredProducts = products.filter((item) => {
    const matchesSearch = item.nama?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || item.kategori === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["Semua", ...new Set(products.map(p => p.kategori).filter(Boolean))];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-10 text-[#495057]">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Katalog <span className="text-orange-500">Affiliate</span> ✨
          </h1>
          <p className="text-gray-500 mt-2">Temukan barang unik dengan harga terbaik.</p>
        </header>

        {/* Bar Pencarian & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <input 
              type="text"
              placeholder="Cari barang impianmu..."
              className="w-full p-4 pl-12 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500 transition-all bg-white text-[#495057] shadow-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="absolute left-4 top-4.5 h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <select 
            className="p-4 rounded-2xl border border-gray-200 bg-white text-[#495057] font-semibold outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer shadow-sm"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Grid Produk */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {filteredProducts.map((item) => (
            <div key={item.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col">
              {/* Image Container */}
              <div className="relative overflow-hidden">
                <img 
                  src={item.gambar || 'https://via.placeholder.com/300'} 
                  alt={item.nama} 
                  className="w-full h-40 md:h-52 object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute top-2 left-2">
                  <span className="text-[10px] font-bold bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-sm text-orange-600">
                    {item.kategori}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-gray-800 line-clamp-2 text-sm md:text-base h-10 md:h-12 leading-tight">
                  {item.nama}
                </h3>
                
                <div className="mt-auto pt-4">
                  <p className="text-xs text-gray-400 mb-1">Harga Terbaik</p>
                  <p className="text-lg font-black text-gray-900">Rp {item.harga}</p>
                  
                  <div className="mt-4 flex gap-2">
                    <a 
                      href={item.link} 
                      target="_blank" 
                      className="flex-1 text-center bg-gray-900 text-white py-2.5 rounded-xl text-xs md:text-sm font-bold hover:bg-orange-500 transition-colors shadow-lg shadow-gray-200"
                    >
                      Beli
                    </a>
                    <button 
                      onClick={() => handleShare(item)}
                      className="p-2.5 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors text-[#495057]"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-400 font-medium">Ups! Barang tidak ditemukan.</p>
            <button 
              onClick={() => {setSearchTerm(""); setSelectedCategory("Semua")}}
              className="mt-4 text-orange-500 font-bold underline"
            >
              Reset Pencarian
            </button>
          </div>
        )}
      </div>
      
      {/* Footer Simple */}
      <footer className="mt-20 py-10 border-t border-gray-200 text-center text-sm text-gray-400">
        &copy; 2026 Katalog Cuan. Semua link mengarah ke toko resmi.
      </footer>
    </main>
  );
}