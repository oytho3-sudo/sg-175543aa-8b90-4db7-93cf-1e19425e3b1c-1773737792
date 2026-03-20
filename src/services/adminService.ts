import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

// Admin service uses SERVICE ROLE KEY to bypass RLS
// This should ONLY be used in API routes, never in client-side code
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase Service Role credentials");
  }

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