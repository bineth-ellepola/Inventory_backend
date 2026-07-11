import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env");
}

if (!supabaseUrl.startsWith("https://") || !supabaseUrl.includes(".supabase.co")) {
  throw new Error(
    "SUPABASE_URL is invalid. Expected format: https://<project-ref>.supabase.co"
  );
}

if (supabaseServiceRoleKey.startsWith("sb_publishable_")) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY is using a publishable key. Use the service_role key from Supabase project settings."
  );
}

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
  },
});
