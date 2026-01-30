import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// PINDAHKAN KE SINI
export const metadata: Metadata = {
  title: 'Katalog Barang Unik ✨',
  description: 'Temukan rekomendasi setup dan gadget terbaik dengan harga promo.',
  openGraph: {
    title: 'Katalog Barang Unik ✨',
    description: 'Cek koleksi barang unik dan gadget impianmu di sini!',
    url: 'https://katalog-kamu.vercel.app', 
    siteName: 'Katalog Cuan',
    images: [
      {
        url: 'https://link-gambar-andalan-kamu.jpg', // Pastikan link gambar ini valid
        width: 1200,
        height: 630,
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>{children}</body>
    </html>
  );
}