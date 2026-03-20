import type { NextApiRequest, NextApiResponse } from "next";
import { createAdminClient } from "@/services/adminService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId, role } = req.body;

    if (!userId || !role) {
      return res.status(400).json({ error: "Missing userId or role" });
    }

    if (role !== "Admin" && role !== "Techniker") {
      return res.status(400).json({ error: "Invalid role. Must be 'Admin' or 'Techniker'" });
    }

    const adminClient = createAdminClient();

    // Update role in profiles table
    const { error: updateError } = await adminClient
      .from("profiles")
      .update({ role })
      .eq("id", userId);

    if (updateError) {
      console.error("Update role error:", updateError);
      return res.status(500).json({ error: "Failed to update role" });
    }

    res.status(200).json({ message: "Role updated successfully" });
  } catch (error) {
    console.error("Update role error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}