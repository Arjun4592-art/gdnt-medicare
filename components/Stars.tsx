export default function Stars({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-0.5 mt-2.5">
      {[0, 1, 2, 3].map((i) => (
        <svg key={i} viewBox="0 0 20 20" className="w-3 h-3 fill-gold">
          <path d="M10 1l2.7 5.9 6.3.6-4.8 4.3 1.4 6.2L10 14.9 4.4 18l1.4-6.2L1 7.5l6.3-.6z" />
        </svg>
      ))}
      <span className="text-[11px] text-muted ml-1">
        {rating} ({reviews})
      </span>
    </div>
  );
}
