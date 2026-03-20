import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password, full_name, role } = req.body;

    if (!email || !password || !full_name || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name,
      },
    });

    if (authError) {
      console.error("Auth error:", authError);
      return res.status(400).json({ error: authError.message });
    }

    if (authData.user) {
      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .update({
          full_name,
          role,
        })
        .eq("id", authData.user.id);

      if (profileError) {
        console.error("Profile error:", profileError);
        return res.status(400).json({ error: profileError.message });
      }

      return res.status(200).json({ 
        success: true, 
        user: authData.user 
      });
    }

    return res.status(500).json({ error: "Failed to create user" });
  } catch (error: any) {
    console.error("Server error:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}