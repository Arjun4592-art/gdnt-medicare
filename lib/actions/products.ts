"use server";

import { createClient } from "@/lib/supabase/server";
import { NewProduct } from "@/lib/supabase/types";
import { revalidatePath } from "next/cache";

// Fetch all active products (for public site)
export async function getActiveProducts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

// Fetch a single product by id (for product detail page)
export async function getProduct(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single();

  if (error) return null;
  return data;
}

// Fetch ALL products regardless of active status (for admin dashboard)
export async function getAllProductsAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

// Add a new product (admin only — requires authenticated session)
export async function addProduct(product: NewProduct) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").insert(product).select().single();

  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/shop");
  return data;
}

// Update an existing product (admin only)
export async function updateProduct(id: string, updates: Partial<NewProduct>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/shop");
  revalidatePath(`/product/${id}`);
  return data;
}

// Delete a product (admin only)
export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/shop");
}

// Adjust stock quantity only (used from Inventory panel)
export async function adjustStock(id: string, newQuantity: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({ stock_quantity: newQuantity })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}
