import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#0D1420] text-white/65 pt-16 pb-7 mt-10">
      <div className="max-w-[1240px] mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 pb-11 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <Image src="/logo.png" alt="GDNT Medicare" width={34} height={34} className="h-[34px] w-auto brightness-0 invert" />
              <span className="font-extrabold text-white text-[15px]">GDNT Medicare Pvt. Ltd.</span>
            </div>
            <p className="max-w-[280px] text-[13.5px] leading-relaxed">
              Expert care for a healthier tomorrow. Supplying genuine pharmaceutical products to doctors and medical stores.
            </p>
          </div>
          <div>
            <h5 className="text-[11px] tracking-wider uppercase text-gold font-extrabold mb-4.5">Explore</h5>
            <ul className="space-y-2.5 text-[13.5px]">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">Shop</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-[11px] tracking-wider uppercase text-gold font-extrabold mb-4.5">Contact</h5>
            <ul className="space-y-2.5 text-[13.5px]">
              <li><a href="tel:+919876543210" className="hover:text-white transition-colors">+91 98765 43210</a></li>
              <li><a href="mailto:orders@gdntmedicare.com" className="hover:text-white transition-colors">orders@gdntmedicare.com</a></li>
              <li><a href="https://wa.me/919876543210" className="hover:text-white transition-colors">WhatsApp Chat</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-[11px] tracking-wider uppercase text-gold font-extrabold mb-4.5">Legal</h5>
            <ul className="space-y-2.5 text-[13.5px]">
              <li><a href="#" className="hover:text-white transition-colors">Drug License Info</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Trade</a></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-2 pt-6 text-[12.5px]">
          <span>© 2026 GDNT Medicare Pvt. Ltd. All rights reserved.</span>
          <span>Designed for those who deliver care.</span>
        </div>
      </div>
    </footer>
  );
}
