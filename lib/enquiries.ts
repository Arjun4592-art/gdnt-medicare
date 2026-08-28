export interface Enquiry {
  id: number;
  name: string;
  store: string;
  product: string;
  contact: string;
  date: string;
  status: "New" | "Responded";
}
