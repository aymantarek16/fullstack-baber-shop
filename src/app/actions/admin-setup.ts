"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Helper function to verify admin setup
 * This can be called to debug admin login issues
 */
export async function verifyAdminSetup(email: string) {
  const supabase = await createClient();
  
  console.log("🔧 Admin Setup Verification");
  console.log("==========================");
  
  try {
    // Step 1: Check if user exists in auth.users
    const { data: { users }, error: listUsersError } = await supabase.auth.admin.listUsers();
    
    if (listUsersError) {
      console.error("❌ Error listing users:", listUsersError);
      return { success: false, error: "Cannot list users - check service role key" };
    }
    
    const targetUser = users?.find(u => u.email === email);
    
    if (!targetUser) {
      console.log("❌ User not found in auth.users");
      return { 
        success: false, 
        error: `User with email ${email} not found in Supabase Auth`,
        suggestion: "Create the user first in Supabase Auth"
      };
    }
    
    console.log("✅ User found in auth.users:", {
      id: targetUser.id,
      email: targetUser.email,
      email_confirmed: !!targetUser.email_confirmed_at,
      created_at: targetUser.created_at
    });
    
    // Step 2: Check if user exists in admin_users table
    const { data: adminUser, error: adminUserError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', targetUser.id)
      .single();
    
    if (adminUserError && adminUserError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error("❌ Error checking admin_users:", adminUserError);
      return { success: false, error: "Error checking admin_users table" };
    }
    
    if (!adminUser) {
      console.log("❌ User not found in admin_users table");
      console.log(`🔧 To fix this, run in Supabase SQL Editor:`);
      console.log(`INSERT INTO public.admin_users (user_id) VALUES ('${targetUser.id}');`);
      
      return { 
        success: false, 
        error: `User ${email} exists in Auth but not in admin_users table`,
        fixSql: `INSERT INTO public.admin_users (user_id) VALUES ('${targetUser.id}');`
      };
    }
    
    console.log("✅ User found in admin_users table:", adminUser);
    
    // Step 3: Test the is_admin() function
    const { data: isAdmin, error: isAdminError } = await supabase.rpc("is_admin");
    
    if (isAdminError) {
      console.error("❌ Error calling is_admin():", isAdminError);
      return { success: false, error: "Error calling is_admin() function" };
    }
    
    console.log("✅ is_admin() function returned:", isAdmin);
    
    if (!isAdmin) {
      console.log("❌ is_admin() returned false but user exists in admin_users");
      return { 
        success: false, 
        error: "is_admin() function returned false despite user being in admin_users",
        suggestion: "Check RLS policies on admin_users table"
      };
    }
    
    console.log("✅ Admin setup is correct!");
    return { success: true, message: "Admin setup is correct" };
    
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    return { success: false, error: "Unexpected error during verification" };
  }
}
