import type { NextApiRequest, NextApiResponse } from "next";
import { createAdminClient } from "@/services/adminService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const adminClient = createAdminClient();

    // Get all users from auth.users
    const { data: authUsers, error: authError } = await adminClient.auth.admin.listUsers();

    if (authError) {
      console.error("Auth users fetch error:", authError);
      return res.status(500).json({ error: "Failed to fetch users" });
    }

    // Get all profiles
    const { data: profiles, error: profilesError } = await adminClient
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (profilesError) {
      console.error("Profiles fetch error:", profilesError);
      return res.status(500).json({ error: "Failed to fetch profiles" });
    }

    // Combine auth users with profiles
    const users = authUsers.users.map((authUser) => {
      const profile = profiles.find((p) => p.id === authUser.id);
      return {
        id: authUser.id,
        email: authUser.email || "",
        full_name: profile?.full_name || authUser.user_metadata?.full_name || "",
        role: profile?.role || "Techniker",
        created_at: authUser.created_at,
      };
    });

    res.status(200).json({ users });
  } catch (error) {
    console.error("List users error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}