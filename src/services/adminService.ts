import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

// Admin service uses SERVICE ROLE KEY to bypass RLS
// This should ONLY be used in API routes, never in client-side code
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log("Checking Supabase credentials...");
  console.log("Supabase URL:", supabaseUrl ? "✓ Present" : "✗ Missing");
  console.log("Service Role Key:", serviceRoleKey ? "✓ Present" : "✗ Missing");

  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing from environment variables");
  }

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is missing from environment variables. " +
      "Please add it in Softgen Settings → Environment → SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  console.log("Creating Supabase admin client...");
  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Type definitions
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: "Admin" | "Techniker";
  created_at: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  full_name: string;
  role: "Admin" | "Techniker";
}