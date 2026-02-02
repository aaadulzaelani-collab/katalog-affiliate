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







// "use client";

// import { useState, useEffect } from 'react';
// import { getProducts } from '@/lib/getProducts';

// // Definisi Interface untuk TypeScript
// interface Product {
//   id: string;
//   nama: string;
//   kategori: string;
//   harga: string;
//   link: string;
//   gambar: string;
// }

// export default function Home() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("Semua");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const data = await getProducts();
//         setProducts(data);
//       } catch (error) {
//         console.error("Gagal mengambil data:", error);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchData();
//   }, []);

//   // --- FITUR 1: AI CAPTION GENERATOR ---
//   const generateAICaption = (item: Product) => {
//     const templates = [
//       `🔥 RACUN BARU! 🔥\n\nCuma Rp ${item.harga} udah dapet ${item.nama}. Jujur ini worth it banget buat kalian yang pengen barang berkualitas tapi budget pelajar.\n\nKlik link di bio ya! ✨\n#RacunShopee #Affiliate #MurahBanget`,
      
//       `Spill ${item.nama} check! ✅\n\nBarangnya asli cakep banget, harga cuma Rp ${item.harga}. Cocok banget buat kado atau dipake sendiri.\n\nCek di sini: ${window.location.origin}\n#BarangUnik #RacunTikTok #SpillBarang`,
      
//       `Gak nyangka harganya cuma Rp ${item.harga}! 😱\n\nBuat yang dari kemarin nanyain ${item.nama}, stoknya terbatas ya. Jangan sampe kehabisan lagi!\n\nLink produk ada di bio profil nomor ${item.id} ya! 🚀`
//     ];

//     const randomCaption = templates[Math.floor(Math.random() * templates.length)];
    
//     // Copy ke clipboard
//     navigator.clipboard.writeText(randomCaption);
//     alert("✨ AI Caption Berhasil Disalin!\nSilakan paste di TikTok/IG/WA kamu.");
//   };

//   // --- FITUR 2: SHARE TO MEDSOS ---
//   const handleShare = (item: Product) => {
//     const shareText = `Cek deh! ${item.nama} harganya cuma Rp ${item.harga}. Keren banget:`;
//     const shareUrl = window.location.href;

//     if (navigator.share) {
//       navigator.share({
//         title: item.nama,
//         text: shareText,
//         url: shareUrl,
//       }).catch(() => {});
//     } else {
//       const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`;
//       window.open(waUrl, '_blank');
//     }
//   };

//   // Logika Filter
//   const filteredProducts = products.filter((item) => {
//     const matchesSearch = item.nama?.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = selectedCategory === "Semua" || item.kategori === selectedCategory;
//     return matchesSearch && matchesCategory;
//   });

//   const categories = ["Semua", ...new Set(products.map(p => p.kategori).filter(Boolean))];

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div>
//       </div>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-slate-50 p-4 md:p-10 text-slate-800 font-sans">
//       <div className="max-w-6xl mx-auto">
        
//         {/* Header Section */}
//         <header className="mb-10 text-center">
//           <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
//             KATALOG <span className="text-orange-500 underline decoration-orange-200">AFFILIATE</span> ✨
//           </h1>
//           <p className="text-slate-500 mt-3 text-lg">Cari barang impianmu dan dapatkan harga terbaik!</p>
//         </header>

//         {/* Search & Filter Bar */}
//         <div className="flex flex-col md:flex-row gap-4 mb-12">
//           <div className="relative flex-1">
//             <input 
//               type="text"
//               placeholder="Cari nama produk..."
//               className="w-full p-4 pl-12 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-orange-500 transition-all bg-white"
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <svg className="absolute left-4 top-4 h-6 w-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//             </svg>
//           </div>
          
//           <select 
//             className="p-4 rounded-2xl border-none bg-white font-semibold shadow-sm focus:ring-2 focus:ring-orange-500 cursor-pointer"
//             onChange={(e) => setSelectedCategory(e.target.value)}
//           >
//             {categories.map(cat => (
//               <option key={cat} value={cat}>{cat}</option>
//             ))}
//           </select>
//         </div>

//         {/* Product Grid */}
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
//           {filteredProducts.map((item) => (
//             <div key={item.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-slate-100">
              
//               {/* Image Section */}
//               <div className="relative aspect-square overflow-hidden bg-slate-100">
//                 <img 
//                   src={item.gambar || 'https://via.placeholder.com/300'} 
//                   alt={item.nama} 
//                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
//                 />
//                 <div className="absolute top-3 left-3">
//                   <span className="text-[10px] font-bold bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full text-orange-600 shadow-sm uppercase tracking-wider">
//                     {item.kategori}
//                   </span>
//                 </div>
//               </div>

//               {/* Info Section */}
//               <div className="p-4 flex flex-col flex-1">
//                 <h3 className="font-bold text-slate-800 line-clamp-2 text-sm md:text-base h-10 md:h-12 leading-snug">
//                   {item.nama}
//                 </h3>
                
//                 <div className="mt-auto pt-4">
//                   <div className="flex items-baseline gap-1">
//                     <span className="text-xs font-medium text-slate-400">Rp</span>
//                     <span className="text-lg font-black text-slate-900 tracking-tight">{item.harga}</span>
//                   </div>
                  
//                   {/* Action Buttons */}
//                   <div className="mt-4 flex gap-2">
//                     <a 
//                       href={item.link} 
//                       target="_blank" 
//                       className="flex-1 text-center bg-slate-900 text-white py-2.5 rounded-xl text-xs md:text-sm font-bold hover:bg-orange-500 transition-colors shadow-lg shadow-slate-200"
//                     >
//                       Beli
//                     </a>
                    
//                     {/* Button AI Caption */}
//                     <button 
//                       onClick={() => generateAICaption(item)}
//                       className="p-2.5 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-100 transition-colors"
//                       title="Generate Caption AI"
//                     >
//                       <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
//                       </svg>
//                     </button>

//                     {/* Button Share */}
//                     <button 
//                       onClick={() => handleShare(item)}
//                       className="p-2.5 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-100 transition-colors"
//                     >
//                       <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
//                       </svg>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Empty State */}
//         {filteredProducts.length === 0 && (
//           <div className="text-center py-20 bg-white rounded-3xl mt-10 shadow-sm border border-dashed border-slate-300">
//             <p className="text-xl text-slate-400 font-medium italic">Oops! Produk yang kamu cari belum ada.</p>
//             <button 
//               onClick={() => {setSearchTerm(""); setSelectedCategory("Semua")}}
//               className="mt-4 text-orange-500 font-bold hover:underline"
//             >
//               Tampilkan Semua Produk
//             </button>
//           </div>
//         )}
//       </div>
      
//       {/* Footer */}
//       <footer className="mt-20 py-10 border-t border-slate-200 text-center text-sm text-slate-400">
//         <p>&copy; 2024 Katalog Cuan Affiliate. Dibuat dengan ✨</p>
//       </footer>
//     </main>
//   );
// }