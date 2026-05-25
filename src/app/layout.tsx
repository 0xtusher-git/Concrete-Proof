import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://proof.concrete.xyz"),
  title: "CONCRETE PROOF | Show your work. Earn your place.",
  description: "Explore real contributions from the Concrete community. Submit yours and get discovered.",
  openGraph: {
    title: "CONCRETE PROOF | Show your work. Earn your place.",
    description: "Explore real contributions from the Concrete community. Submit yours and get discovered.",
    url: "https://proof.concrete.xyz", // placeholder URL
    siteName: "CONCRETE PROOF",
    images: [
      {
        url: "/og-image.jpg", // We will need to create or assume this exists
        width: 1200,
        height: 630,
        alt: "CONCRETE PROOF",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CONCRETE PROOF | Show your work. Earn your place.",
    description: "Explore real contributions from the Concrete community. Submit yours and get discovered.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sora.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col relative overflow-x-hidden">
        {/* Subtle radial glow background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
          <div className="absolute top-[-20%] left-[50%] translate-x-[-50%] w-[1000px] h-[600px] bg-concrete-yellow/[0.05] rounded-full blur-[120px]"></div>
        </div>
        
        {children}
      </body>
    </html>
  );
}
