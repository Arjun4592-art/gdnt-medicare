import Link from "next/link";
import Image from "next/image";
import { Product, getDiscountPercent } from "@/lib/products";
import ProductIcon from "./ProductIcon";
import Stars from "./Stars";
import Reveal from "./Reveal";

export default function ProductCard({ product, delay = 0 }: { product: Product; delay?: number }) {
  const discount = getDiscountPercent(product.price, product.mrp);
  return (
    <Reveal delay={delay}>
      <div className="group bg-white border border-line rounded-2xl overflow-hidden transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_26px_50px_-20px_rgba(20,24,31,0.18)]">
        <div className="h-[170px] bg-bg-soft flex items-center justify-center relative">
          <span
            className="absolute top-3 left-3 bg-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm"
            style={{ color: product.tagColor }}
          >
            {product.cat}
          </span>
          {discount > 0 && (
            <span className="absolute bottom-3 left-3 bg-gold text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm">
              {discount}% OFF
            </span>
          )}
          <button
            aria-label="Save"
            className="absolute top-3 right-3 w-[30px] h-[30px] rounded-full bg-white flex items-center justify-center shadow-sm transition-transform hover:scale-110"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 21s-7.5-4.6-10-9.2C.4 8 2 4 6 4c2.2 0 3.7 1.2 6 3.4C14.3 5.2 15.8 4 18 4c4 0 5.6 4 4 7.8C19.5 16.4 12 21 12 21z" stroke="#5B6470" strokeWidth="1.6" />
            </svg>
          </button>
          {product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.08]"
            />
          ) : (
            <ProductIcon icon={product.icon} className="w-[60px] h-[60px] transition-transform duration-500 group-hover:scale-[1.14] group-hover:rotate-3" />
          )}
        </div>
        <div className="p-[18px]">
          <div className="text-[10px] text-gold font-extrabold uppercase tracking-wide">
            {product.type} · {product.pack}
          </div>
          <h4 className="text-base font-extrabold mt-1.5 text-navy">{product.name}</h4>
          <div className="text-[12.5px] text-muted mt-1">{product.desc}</div>
          <Stars rating={product.rating} reviews={product.reviews} />
        </div>
        <div className="flex items-center justify-between px-[18px] py-3.5 border-t border-line">
          <div className="font-extrabold text-navy text-base">
            ₹{product.price}
            {discount > 0 && (
              <>
                <span className="text-[11px] text-muted font-semibold line-through ml-1.5">₹{product.mrp}</span>
                <span className="text-[11px] text-forest font-bold ml-1.5">{discount}% off</span>
              </>
            )}
          </div>
          <Link
            href={`/product/${product.id}`}
            className="bg-forest-pale text-forest text-xs font-extrabold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors group-hover:bg-forest group-hover:text-white"
          >
            View Details
            <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 transition-transform group-hover:translate-x-1">
              <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </Link>
        </div>
      </div>
    </Reveal>
  );
}
