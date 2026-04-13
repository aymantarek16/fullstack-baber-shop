import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Royal Barbers — احجز موعدك",
  description: "احجز موعدك أونلاين بسهولة. قص، ذقن، وباكيدج بأفضل الحلاقين.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full`}>
      <body className="relative min-h-full font-sans antialiased">
        <div className="relative z-[1] min-h-full">{children}</div>
      </body>
    </html>
  );
}
