import { Product, getDiscountPercent } from "@/lib/products";

export default function CategoriesPanel({ products }: { products: Product[] }) {
  const byCategory = products.reduce<Record<string, Product[]>>((acc, p) => {
    (acc[p.cat] ||= []).push(p);
    return acc;
  }, {});

  const rows = Object.entries(byCategory)
    .map(([cat, items]) => {
      const avgPrice = items.reduce((s, p) => s + p.price, 0) / items.length;
      const lowStock = items.filter((p) => p.stock === "Low Stock").length;
      const onDiscount = items.filter((p) => getDiscountPercent(p.price, p.mrp) > 0).length;
      return { cat, count: items.length, avgPrice, lowStock, onDiscount };
    })
    .sort((a, b) => b.count - a.count);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-navy">Categories</h1>
        <p className="text-[13.5px] text-muted mt-1">Every category currently in your catalog, at a glance.</p>
      </div>

      {rows.length === 0 ? (
        <div className="bg-white border border-line rounded-2xl p-12 text-center text-[13.5px] text-muted">
          No products yet — categories will show up here once you add some.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {rows.map((r) => (
            <div key={r.cat} className="bg-white border border-line rounded-2xl p-5.5">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-extrabold text-navy text-[15px]">{r.cat}</h3>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-forest-pale text-forest">
                  {r.count} {r.count === 1 ? "product" : "products"}
                </span>
              </div>
              <div className="space-y-2 text-[12.5px]">
                <Row label="Avg. Price" value={`₹${r.avgPrice.toFixed(0)}`} />
                <Row label="On Discount" value={`${r.onDiscount} / ${r.count}`} />
                <Row
                  label="Low Stock"
                  value={String(r.lowStock)}
                  valueClass={r.lowStock > 0 ? "text-[#C0392B]" : "text-forest"}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {rows.length > 0 && (
        <div className="bg-white border border-line rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr>
                {["Category", "Products", "Avg. Price", "On Discount", "Low Stock"].map((h) => (
                  <th key={h} className="text-left text-[11px] uppercase tracking-wide text-muted font-semibold px-6 py-3 border-b border-line">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.cat} className="hover:bg-bg-soft transition-colors">
                  <td className="px-6 py-4 text-[13.5px] font-bold text-navy border-b border-line">{r.cat}</td>
                  <td className="px-6 py-4 text-[13.5px] border-b border-line">{r.count}</td>
                  <td className="px-6 py-4 text-[13.5px] border-b border-line">₹{r.avgPrice.toFixed(0)}</td>
                  <td className="px-6 py-4 text-[13.5px] border-b border-line">{r.onDiscount}</td>
                  <td className="px-6 py-4 text-[13.5px] border-b border-line">{r.lowStock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, valueClass = "text-navy" }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted font-semibold">{label}</span>
      <span className={`font-bold ${valueClass}`}>{value}</span>
    </div>
  );
}
