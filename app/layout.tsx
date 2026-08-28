import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GDNT Medicare Pvt. Ltd. | Trusted Pharmaceutical Supplier",
  description:
    "GDNT Medicare Pvt. Ltd. supplies genuine, quality-assured medicines to doctors and medical stores. Browse our catalog and enquire for trade pricing.",
  metadataBase: new URL("https://gdntmedicare.com"),
  openGraph: {
    title: "GDNT Medicare Pvt. Ltd.",
    description: "Quality medicines, genuine products — trusted by doctors and medical stores.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
