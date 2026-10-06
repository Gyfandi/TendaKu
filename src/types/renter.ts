export interface Renter {
  id: number;
  name: string;
  phone: string;
  address: string;
  status: "Aktif" | "Nonaktif";
}