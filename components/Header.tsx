"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-100 bg-white/92 backdrop-blur-md border-b border-line">
      <div className="max-w-[1240px] mx-auto px-8 flex items-center justify-between h-20">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="GDNT Medicare logo" width={42} height={42} className="h-[42px] w-auto" />
          <div className="leading-tight">
            <span className="block font-extrabold text-[17px] text-navy">GDNT Medicare</span>
            <span className="block text-[9px] tracking-wider uppercase text-forest font-bold">Pvt. Ltd.</span>
          </div>
        </Link>
        <nav className="hidden md:block">
          <ul className="flex gap-9">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`text-sm font-semibold py-1.5 relative transition-colors hover:text-forest ${
                    pathname === item.href ? "text-forest" : "text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href="/shop"
            aria-label="Search"
            className="hidden sm:flex w-10 h-10 rounded-full bg-bg-soft items-center justify-center transition-colors hover:bg-forest-pale"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="#14181F" strokeWidth="1.8" />
              <path d="M21 21l-4.3-4.3" stroke="#14181F" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </Link>
          <Link
            href="/contact"
            className="bg-forest text-white px-6 py-3 rounded-lg text-[13px] font-bold transition-transform hover:-translate-y-0.5 shadow-sm"
          >
            Enquire Now
          </Link>
        </div>
      </div>
    </header>
  );
}
