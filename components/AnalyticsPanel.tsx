import { Product } from "@/lib/products";
import { Enquiry } from "@/lib/enquiries";
import { getDiscountPercent } from "@/lib/products";
import BarChart from "./charts/BarChart";
import DonutChart from "./charts/DonutChart";

const SLICE_COLORS = ["#0F6E4E", "#C79A48", "#1B2A4A", "#14A876", "#5B6470", "#8B6D3F"];

export default function AnalyticsPanel({ products, enquiries }: { products: Product[]; enquiries: Enquiry[] }) {
  const catalogValue = products.reduce((s, p) => s + p.price, 0);
  const avgDiscount =
    products.length === 0
      ? 0
      : Math.round(products.reduce((s, p) => s + getDiscountPercent(p.price, p.mrp), 0) / products.length);
  const discountedCount = products.filter((p) => getDiscountPercent(p.price, p.mrp) > 0).length;

  const byCategory = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.cat] = (acc[p.cat] || 0) + 1;
    return acc;
  }, {});
  const categoryData = Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({ label, value }));

  const byForm = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.type] = (acc[p.type] || 0) + 1;
    return acc;
  }, {});
  const formData = Object.entries(byForm).map(([label, value], i) => ({
    label,
    value,
    color: SLICE_COLORS[i % SLICE_COLORS.length],
  }));

  const stockData = [
    { label: "In Stock", value: products.filter((p) => p.stock === "In Stock").length, color: "#0F6E4E" },
    { label: "Low Stock", value: products.filter((p) => p.stock === "Low Stock").length, color: "#C0392B" },
  ];

  const topRated = [...products].sort((a, b) => b.rating - a.rating).slice(0, 5).map((p) => ({
    label: p.name,
    value: p.rating,
  }));

  const enquiryStatusData = [
    { label: "New", value: enquiries.filter((e) => e.status === "New").length, color: "#C79A48" },
    { label: "Responded", value: enquiries.filter((e) => e.status === "Responded").length, color: "#0F6E4E" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-navy">Analytics</h1>
        <p className="text-[13.5px] text-muted mt-1">Catalog and enquiry performance at a glance.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Stat label="Products Listed" value={String(products.length)} />
        <Stat label="Catalog Value (₹)" value={catalogValue.toLocaleString("en-IN")} />
        <Stat label="Products on Discount" value={`${discountedCount} / ${products.length || 0}`} />
        <Stat label="Avg. Discount" value={`${avgDiscount}%`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <Card title="Products by Category">
          {categoryData.length === 0 ? (
            <Empty />
          ) : (
            <BarChart data={categoryData} />
          )}
        </Card>
        <Card title="Stock Health">
          {products.length === 0 ? <Empty /> : <DonutChart data={stockData} />}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card title="Products by Form">
          {formData.length === 0 ? <Empty /> : <DonutChart data={formData} />}
        </Card>
        <Card title="Enquiry Status">
          {enquiries.length === 0 ? <Empty /> : <DonutChart data={enquiryStatusData} />}
        </Card>
      </div>

      {topRated.length > 0 && (
        <div className="mt-5">
          <Card title="Top Rated Products">
            <BarChart data={topRated} />
          </Card>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-line rounded-2xl p-5.5">
      <div className="text-xs text-muted font-semibold">{label}</div>
      <div className="text-[26px] font-extrabold text-navy mt-2">{value}</div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-line rounded-2xl p-6">
      <h3 className="text-[15px] font-extrabold text-navy mb-5">{title}</h3>
      {children}
    </div>
  );
}

function Empty() {
  return <p className="text-[13px] text-muted">Not enough data yet.</p>;
}
