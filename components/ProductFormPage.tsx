"use client";

import { useState, FormEvent, useEffect, useRef } from "react";
import Image from "next/image";
import { Product } from "@/lib/products";
import { addProduct, updateProduct } from "@/lib/actions/products";
import { createClient } from "@/lib/supabase/client";

interface Props {
  onCancel: () => void;
  onSaved: () => void;
  editingProduct?: Product | null;
}

const TYPES = ["Tablets", "Capsules", "Syrup", "Ointment"];
const MAX_IMAGES = 4;

export default function ProductFormPage({ onCancel, onSaved, editingProduct }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "", category: "", type: "Tablets", pack_size: "", composition: "",
    description: "", price: "", mrp: "", stock_quantity: "", reorder_level: "15",
  });

  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    if (editingProduct) {
      setForm({
        name: editingProduct.name,
        category: editingProduct.cat,
        type: editingProduct.type,
        pack_size: editingProduct.pack,
        composition: editingProduct.salt,
        description: editingProduct.desc,
        price: String(editingProduct.price),
        mrp: String(editingProduct.mrp),
        stock_quantity: editingProduct.stock === "In Stock" ? "50" : "5",
        reorder_level: "15",
      });
      setImages(editingProduct.images ?? []);
    } else {
      setForm({ name: "", category: "", type: "Tablets", pack_size: "", composition: "", description: "", price: "", mrp: "", stock_quantity: "", reorder_level: "15" });
      setImages([]);
    }
    setError("");
    setImageError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingProduct]);

  async function handleFilesSelected(files: FileList | null) {
    if (!files || files.length === 0) return;
    setImageError("");

    const remainingSlots = MAX_IMAGES - images.length;
    if (remainingSlots <= 0) {
      setImageError(`You can upload up to ${MAX_IMAGES} images per product.`);
      return;
    }

    const picked = Array.from(files).slice(0, remainingSlots);
    const invalid = picked.find((f) => !f.type.startsWith("image/"));
    if (invalid) {
      setImageError("Only image files are allowed.");
      return;
    }
    const tooBig = picked.find((f) => f.size > 5 * 1024 * 1024);
    if (tooBig) {
      setImageError("Each image must be under 5MB.");
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const uploadedUrls: string[] = [];

      for (const file of picked) {
        const ext = file.name.split(".").pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(path, file, { cacheControl: "3600", upsert: false });

        if (uploadError) throw new Error(uploadError.message);

        const { data } = supabase.storage.from("product-images").getPublicUrl(path);
        uploadedUrls.push(data.publicUrl);
      }

      setImages((prev) => [...prev, ...uploadedUrls]);
    } catch (err) {
      setImageError(
        err instanceof Error
          ? err.message
          : "Couldn't upload image. Make sure the 'product-images' storage bucket exists in Supabase."
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((img) => img !== url));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        name: form.name,
        category: form.category,
        type: form.type,
        pack_size: form.pack_size,
        composition: form.composition,
        description: form.description || null,
        price: parseFloat(form.price),
        mrp: parseFloat(form.mrp),
        stock_quantity: parseInt(form.stock_quantity) || 0,
        reorder_level: parseInt(form.reorder_level) || 15,
        rating: editingProduct?.rating ?? 4.5,
        reviews_count: editingProduct?.reviews ?? 0,
        image_url: images[0] ?? null,
        images,
        is_active: true,
      };

      if (editingProduct) {
        await updateProduct(String(editingProduct.id), payload);
      } else {
        await addProduct(payload);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Make sure Supabase is connected and you're logged in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={onCancel}
        className="flex items-center gap-2 text-[13px] font-bold text-muted hover:text-forest transition-colors mb-5"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        Back to Products
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-navy">
          {editingProduct ? "Edit Product" : "Add New Product"}
        </h1>
        <p className="text-[13.5px] text-muted mt-1">
          {editingProduct ? "Update details for this product." : "Fill in the details to add a product to your catalog."}
        </p>
      </div>

      <div className="bg-white border border-line rounded-2xl p-6 md:p-8 max-w-[760px]">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label={`Product Images (up to ${MAX_IMAGES})`}>
            <div className="flex gap-3 flex-wrap">
              {images.map((url) => (
                <div key={url} className="relative w-[92px] h-[92px] rounded-lg overflow-hidden border border-line group">
                  <Image src={url} alt="Product" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove image"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" /></svg>
                  </button>
                </div>
              ))}

              {images.length < MAX_IMAGES && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-[92px] h-[92px] rounded-lg border-2 border-dashed border-line flex flex-col items-center justify-center gap-1 text-muted hover:border-forest hover:text-forest transition-colors disabled:opacity-60"
                >
                  {uploading ? (
                    <span className="text-[10px] font-semibold">Uploading...</span>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                      <span className="text-[10px] font-semibold">Add photo</span>
                    </>
                  )}
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFilesSelected(e.target.files)}
            />
            {imageError && <p className="text-[#C0392B] text-[12px] font-semibold mt-2">{imageError}</p>}
            {images.length === 0 && !imageError && (
              <p className="text-muted text-[11.5px] mt-2">No images yet — the product will show a placeholder icon instead.</p>
            )}
          </Field>

          <Field label="Product Name">
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input" placeholder="e.g. Amlogard 5mg" />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Category">
              <input required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="input" placeholder="e.g. Cardiac Care" />
            </Field>
            <Field label="Form">
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input">
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Pack Size">
              <input required value={form.pack_size} onChange={(e) => setForm({ ...form, pack_size: e.target.value })}
                className="input" placeholder="e.g. 10x10" />
            </Field>
            <Field label="Composition / Salt">
              <input required value={form.composition} onChange={(e) => setForm({ ...form, composition: e.target.value })}
                className="input" placeholder="e.g. Amlodipine 5mg" />
            </Field>
          </div>

          <Field label="Description">
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input" placeholder="Short description" />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Price (₹)">
              <input required type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input" />
            </Field>
            <Field label="MRP (₹)">
              <input required type="number" step="0.01" value={form.mrp} onChange={(e) => setForm({ ...form, mrp: e.target.value })} className="input" />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Stock Quantity">
              <input required type="number" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} className="input" />
            </Field>
            <Field label="Reorder Level">
              <input type="number" value={form.reorder_level} onChange={(e) => setForm({ ...form, reorder_level: e.target.value })} className="input" />
            </Field>
          </div>

          {error && <p className="text-[#C0392B] text-[13px] font-semibold">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onCancel} className="flex-1 sm:flex-none sm:px-8 border border-line py-3 rounded-lg font-bold text-sm text-navy">
              Cancel
            </button>
            <button type="submit" disabled={loading || uploading} className="flex-1 sm:flex-none sm:px-8 bg-forest text-white py-3 rounded-lg font-bold text-sm disabled:opacity-60">
              {loading ? "Saving..." : uploading ? "Uploading images..." : editingProduct ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid var(--line);
          border-radius: 8px;
          padding: 11px 14px;
          font-size: 14px;
          background: white;
        }
        .input:focus {
          outline: none;
          border-color: var(--forest);
          box-shadow: 0 0 0 3px var(--forest-pale);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold text-navy mb-1.5">{label}</label>
      {children}
    </div>
  );
}
