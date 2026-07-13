import { createClient } from "@supabase/supabase-js";

// Server-side admin client — uses the SECRET key. Never import this into
// a Client Component or expose the key to the browser.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

export const PRODUCT_BUCKET = "product-images";
