export type BookingStatus = "pending" | "confirmed" | "cancelled" | "done";

export type BarberRow = {
  id: string;
  name: string;
  tagline: string | null;
  image_url: string;
  active: boolean;
  created_at: string;
};

export type ServiceRow = {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
  created_at: string;
};

export type BookingRow = {
  id: string;
  customer_name: string;
  phone: string;
  barber_id: string;
  service_id: string;
  booking_date: string;
  booking_time: string;
  notes: string | null;
  status: BookingStatus;
  created_at: string;
};

export type BookingWithRelations = BookingRow & {
  barber: { name: string } | null;
  service: { name: string; price: number; duration_minutes: number } | null;
};
