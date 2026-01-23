import "./globals.css";

export const metadata = {
  title: "Exclusive Digital Edition",
  description: "Implemented by Manu",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}