export interface User {
  id: number;
  name: string;
  email: string;
  phone_number: number;
  role: 'user' | 'admin';
}

export interface History {
  id: number;
  action: string;
  report_id: number;
  approved_by: string;
  timestamp: string;
  admin_comments: string;
}

export interface BillingForm {
  date: string;
  admin_comments: string | null;
  broiler_closing_stock: number;
  broiler_opening_stock: number;
  broiler_dead: number;
  broiler_rate_b2b: number;
  broiler_rate_customer: number;
  broiler_sold_b2b: number;
  broiler_sold_customer: number;
  broiler_total_sales: number;
  broiler_wastage_weight: number;
  country_closing_stock: number;
  country_dead: number;
  country_opening_stock: number;
  country_rate_b2b: number;
  country_rate_customer: number;
  country_sold_b2b: number;
  country_sold_customer: number;
  country_total_sales: number;
  country_wastage_weight: number;
  created_at: string | any;
  egg_closing_stock: number;
  egg_opening_stock: number;
  egg_rate: number;
  egg_sold: number;
  goat_opening_stock: number;
  goat_sold_customer: number;
  id: number;
  user: string;
  mutton_rate_b2b: number;
  mutton_rate_customer: number;
  mutton_total_weight: number;
  mutton_wastage_weight: number;
  mutton_weight_sold_b2b: number;
  mutton_weight_sold_customer: number;
  report_date: string;
  status: 'approved' | 'pending' | 'denied';
  total_offline_amount: number;
  total_online_amount: number;
  total_sales_amount: number;
}

export interface UserResponse {
  user: User;
  history: any | History;
  reports: any | BillingForm;
}