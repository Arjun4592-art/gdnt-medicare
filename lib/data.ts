import { Product, ProductIcon } from "@/lib/products";
import { DbProduct } from "@/lib/supabase/types";

function mapDbProduct(row: DbProduct): Product {
  const iconMap: Record<string, ProductIcon> = {
    Tablets: "tablet",
    Syrup: "syrup",
    Capsules: "capsule",
    Ointment: "ointment",
  };
  return {
    id: row.id as unknown as number, // UUID string; components use it as a key/URL param
    name: row.name,
    cat: row.category,
    type: row.type,
    pack: row.pack_size,
    salt: row.composition,
    desc: row.description || "",
    price: Number(row.price),
    mrp: Number(row.mrp),
    stock: row.stock_quantity > 0 ? (row.stock_quantity <= row.reorder_level ? "Low Stock" : "In Stock") : "Low Stock",
    rating: Number(row.rating),
    reviews: row.reviews_count,
    tagColor: "#0F6E4E",
    icon: iconMap[row.type] || "tablet",
    images: row.images && row.images.length > 0 ? row.images : row.image_url ? [row.image_url] : [],
  };
}

// Get all active products for public display (Shop, Home featured)
export async function getProducts(): Promise<Product[]> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map(mapDbProduct);
}

// Get a single product by id
export async function getProductByIdAsync(id: string): Promise<Product | undefined> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single();

  if (error || !data) return undefined;
  return mapDbProduct(data);
}

export async function getRelatedProductsAsync(product: Product, count = 4): Promise<Product[]> {
  const all = await getProducts();
  const sameCategory = all.filter((p) => p.cat === product.cat && p.id !== product.id);
  const others = all.filter((p) => p.id !== product.id && p.cat !== product.cat);
  return [...sameCategory, ...others].slice(0, count);
}
