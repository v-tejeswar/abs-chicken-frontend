import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";


export const formSchema = z.object({
    report_date: z.date(),
    broiler_opening_stock: z.number().min(0),
    broiler_closing_stock: z.number().min(0),
    broiler_sold_customer: z.number().min(0),
    broiler_sold_b2b: z.number().min(0),
    broiler_dead: z.number().min(0),
    broiler_wastage_weight: z.number().min(0),
    broiler_rate_customer: z.number().min(0),
    broiler_rate_b2b: z.number().min(0),
    broiler_total_sales: z.number().min(0),
    country_opening_stock: z.number().min(0),
    country_closing_stock: z.number().min(0),
    country_sold_customer: z.number().min(0),
    country_sold_b2b: z.number().min(0),
    country_dead: z.number().min(0),
    country_wastage_weight: z.number().min(0),
    country_rate_customer: z.number().min(0),
    country_rate_b2b: z.number().min(0),
    country_total_sales: z.number().min(0),
    goat_opening_stock: z.number().min(0),
    goat_sold_customer: z.number().min(0),
    mutton_total_weight: z.number().min(0),
    mutton_weight_sold_customer: z.number().min(0),
    mutton_weight_sold_b2b: z.number().min(0),
    mutton_wastage_weight: z.number().min(0),
    mutton_rate_customer: z.number().min(0),
    mutton_rate_b2b: z.number().min(0),
    egg_opening_stock: z.number().min(0),
    egg_sold: z.number().min(0),
    egg_closing_stock: z.number().min(0),
    egg_rate: z.number().min(0),
    total_offline_amount: z.number().min(0),
    total_online_amount: z.number().min(0),
    total_sales_amount: z.number().min(0),
  });

export const FormDefaultValues = {
      report_date: new Date(),
      broiler_opening_stock: 0,
      broiler_closing_stock: 0,
      broiler_sold_customer: 0,
      broiler_sold_b2b: 0,
      broiler_dead: 0,
      broiler_wastage_weight: 0,
      broiler_rate_customer: 0,
      broiler_rate_b2b: 0,
      broiler_total_sales: 0,
      country_opening_stock: 0,
      country_closing_stock: 0,
      country_sold_customer: 0,
      country_sold_b2b: 0,
      country_dead: 0,
      country_wastage_weight: 0,
      country_rate_customer: 0,
      country_rate_b2b: 0,
      country_total_sales: 0,
      goat_opening_stock: 0,
      goat_sold_customer: 0,
      mutton_total_weight: 0,
      mutton_weight_sold_customer: 0,
      mutton_weight_sold_b2b: 0,
      mutton_wastage_weight: 0,
      mutton_rate_customer: 0,
      mutton_rate_b2b: 0,
      egg_opening_stock: 0,
      egg_sold: 0,
      egg_closing_stock: 0,
      egg_rate: 0,
      total_offline_amount: 0,
      total_online_amount: 0,
      total_sales_amount: 0,
    }

export const reportLabels: Record<string, string> = {
    id: "Report ID",
    status: "Status",
    report_date: "Report Date",
    broiler_opening_stock: "Broiler Opening Stock",
    broiler_closing_stock: "Broiler Closing Stock",
    broiler_dead: "Broiler Dead",
    broiler_sold_b2b: "Broiler Sold (B2B)",
    broiler_sold_customer: "Broiler Sold (Customer)",
    broiler_total_sales: "Broiler Total Sales",
    broiler_rate_b2b: "Broiler Rate (B2B)",
    broiler_rate_customer: "Broiler Rate (Customer)",
    country_opening_stock: "Country Opening Stock",
    country_closing_stock: "Country Closing Stock",
    country_dead: "Country Dead",
    country_sold_b2b: "Country Sold (B2B)",
    country_sold_customer: "Country Sold (Customer)",
    country_total_sales: "Country Total Sales",
    country_rate_b2b: "Country Rate (B2B)",
    country_rate_customer: "Country Rate (Customer)",
    egg_opening_stock: "Egg Opening Stock",
    egg_closing_stock: "Egg Closing Stock",
    egg_sold: "Egg Sold",
    egg_rate: "Egg Rate",
    goat_opening_stock: "Goat Opening Stock",
    goat_sold_customer: "Goat Sold (Customer)",
    mutton_total_weight: "Mutton Total Weight",
    mutton_weight_sold_b2b: "Mutton Weight Sold (B2B)",
    mutton_weight_sold_customer: "Mutton Weight Sold (Customer)",
    mutton_rate_b2b: "Mutton Rate (B2B)",
    mutton_rate_customer: "Mutton Rate (Customer)",
    total_offline_amount: "Total Offline Amount",
    total_online_amount: "Total Online Amount",
    total_sales_amount: "Total Sales Amount",
  };


  export const formFieldLabels: { [key: string]: string } = {
    broiler_opening_stock: "Broiler Opening Stock",
    broiler_closing_stock: "Broiler Closing Stock",
    broiler_dead: "Broiler Dead",
    broiler_rate_b2b: "Broiler Rate B2B",
    broiler_rate_customer: "Broiler Rate Customer",
    broiler_sold_b2b: "Broiler Sold B2B",
    broiler_sold_customer: "Broiler Sold Customer",
    broiler_total_sales: "Broiler Total Sales",
    broiler_wastage_weight: "Broiler Wastage Weight",
    country_opening_stock: "Country Opening Stock",
    country_closing_stock: "Country Closing Stock",
    country_dead: "Country Dead",
    country_rate_b2b: "Country Rate B2B",
    country_rate_customer: "Country Rate Customer",
    country_sold_b2b: "Country Sold B2B",
    country_sold_customer: "Country Sold Customer",
    country_total_sales: "Country Total Sales",
    country_wastage_weight: "Country Wastage Weight",
    egg_opening_stock: "Egg Opening Stock",
    egg_closing_stock: "Egg Closing Stock",
    egg_rate: "Egg Rate",
    egg_sold: "Egg Sold",
    goat_opening_stock: "Goat Opening Stock",
    goat_sold_customer: "Goat Sold Customer",
    mutton_rate_b2b: "Mutton Rate B2B",
    mutton_rate_customer: "Mutton Rate Customer",
    mutton_total_weight: "Mutton Total Weight",
    mutton_wastage_weight: "Mutton Wastage Weight",
    mutton_weight_sold_b2b: "Mutton Weight Sold B2B",
    mutton_weight_sold_customer: "Mutton Weight Sold Customer",
    total_offline_amount: "Total Offline Amount",
    total_online_amount: "Total Online Amount",
    total_sales_amount: "Total Sales Amount",
    admin_comments: "Admin Comments",
    status: "Status",
    report_date: "Report Date",
  };