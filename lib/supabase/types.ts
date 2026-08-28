export interface DbProduct {
  id: string;
  name: string;
  category: string;
  type: string;
  pack_size: string;
  composition: string;
  description: string | null;
  price: number;
  mrp: number;
  stock_quantity: number;
  reorder_level: number;
  rating: number;
  reviews_count: number;
  image_url: string | null;
  images: string[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbEnquiry {
  id: string;
  name: string;
  store_name: string | null;
  phone: string;
  email: string | null;
  product_name: string | null;
  product_id: string | null;
  message: string | null;
  status: "New" | "Responded";
  created_at: string;
}

export type NewProduct = Omit<DbProduct, "id" | "created_at" | "updated_at">;
export type NewEnquiry = Omit<DbEnquiry, "id" | "created_at" | "status">;
