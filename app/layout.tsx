import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Happy Birthday Suman Kumar Thakur 🎉',
  description: 'A special birthday surprise for the best brother in the world!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-poppins bg-[#0a0a0f] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
