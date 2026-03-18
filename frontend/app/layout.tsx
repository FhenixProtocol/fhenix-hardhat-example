import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Fhenix Counter",
  description: "Encrypted counter demo on Ethereum Sepolia using FHE and COFHE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="fhenixlight" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'fhenixlight';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <Providers>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 5000,
              style: {
                background: "#1E293B",
                color: "#fff",
                border: "1px solid #FF6B35",
                borderRadius: "4px",
                fontFamily: "monospace",
              },
              success: {
                style: {
                  border: "1px solid #10B981",
                },
                iconTheme: {
                  primary: "#10B981",
                  secondary: "#1E293B",
                },
              },
              error: {
                style: {
                  border: "1px solid #EF4444",
                },
                iconTheme: {
                  primary: "#EF4444",
                  secondary: "#1E293B",
                },
              },
            }}
          />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
