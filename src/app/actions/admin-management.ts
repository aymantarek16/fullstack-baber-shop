"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Add a user as admin by email
 * This function requires an existing admin to call it
 */
export async function addAdminUser(email: string): Promise<{ ok: boolean; error?: string; message?: string }> {
  if (!email || !email.includes("@")) {
    return { ok: false, error: "البريد الإلكتروني غير صالح" };
  }

  const supabase = await createClient();
  
  try {
    // First verify current user is admin
    const { data: isCurrentAdmin, error: adminCheckError } = await supabase.rpc("is_admin");
    
    if (adminCheckError || !isCurrentAdmin) {
      return { ok: false, error: "غير مصرح لك بإضافة مشرفين" };
    }

    // Call the database function to add admin
    const { data, error } = await supabase.rpc("add_admin_user", { user_email: email });
    
    if (error) {
      return { ok: false, error: error.message };
    }
    
    return { ok: true, message: data };
    
  } catch (error) {
    console.error("Error adding admin user:", error);
    return { ok: false, error: "حدث خطأ غير متوقع" };
  }
}

/**
 * List all admin users
 * This function requires an existing admin to call it
 */
export async function listAdminUsers(): Promise<{ ok: boolean; data?: any[]; error?: string }> {
  const supabase = await createClient();
  
  try {
    // Verify current user is admin
    const { data: isCurrentAdmin, error: adminCheckError } = await supabase.rpc("is_admin");
    
    if (adminCheckError || !isCurrentAdmin) {
      return { ok: false, error: "غير مصرح لك بعرض المشرفين" };
    }

    // Get list of admins
    const { data, error } = await supabase.rpc("list_admins");
    
    if (error) {
      return { ok: false, error: error.message };
    }
    
    return { ok: true, data };
    
  } catch (error) {
    console.error("Error listing admin users:", error);
    return { ok: false, error: "حدث خطأ غير متوقع" };
  }
}

/**
 * Check if current user is admin
 * Useful for debugging
 */
export async function checkCurrentUserAdmin(): Promise<{ ok: boolean; isAdmin?: boolean; error?: string }> {
  const supabase = await createClient();
  
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      return { ok: false, error: "لم يتم تسجيل الدخول" };
    }

    const { data: isAdmin, error } = await supabase.rpc("is_admin");
    
    if (error) {
      return { ok: false, error: error.message };
    }
    
    return { ok: true, isAdmin: !!isAdmin };
    
  } catch (error) {
    console.error("Error checking admin status:", error);
    return { ok: false, error: "حدث خطأ غير متوقع" };
  }
}
