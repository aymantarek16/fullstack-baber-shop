// Debug script to test admin login
const { createClient } = require('./src/lib/supabase/server.js');

async function testLogin() {
  console.log('Testing admin login flow...');
  
  // Test with sample credentials (you'll need to replace these)
  const testEmail = 'admin@example.com'; // Replace with actual admin email
  const testPassword = 'password'; // Replace with actual admin password
  
  try {
    const supabase = await createClient();
    
    console.log('🔍 DEBUG: Attempting sign in with Supabase...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ 
      email: testEmail, 
      password: testPassword 
    });
    
    console.log("🔍 DEBUG: Sign in result:", {
      signInData: signInData ? {
        user: signInData.user ? {
          id: signInData.user.id,
          email: signInData.user.email,
          email_confirmed_at: signInData.user.email_confirmed_at,
          created_at: signInData.user.created_at
        } : null,
        session: signInData.session ? "exists" : "null"
      } : null,
      signInError: signInError ? {
        message: signInError.message,
        status: signInError.status
      } : null
    });

    if (signInError) {
      console.log("🔍 DEBUG: Sign in failed:", signInError);
      return;
    }

    if (!signInData?.user) {
      console.log("🔍 DEBUG: No user data returned");
      return;
    }

    if (!signInData.user.email_confirmed_at) {
      console.log("🔍 DEBUG: Email not confirmed");
      return;
    }

    console.log("🔍 DEBUG: Checking admin role for user:", signInData.user.id);
    
    // Check admin_users table directly
    const { data: adminUserCheck, error: adminUserError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', signInData.user.id);
    
    console.log("🔍 DEBUG: Direct admin_users check:", {
      userId: signInData.user.id,
      data: adminUserCheck,
      error: adminUserError ? {
        message: adminUserError.message,
        details: adminUserError.details,
        code: adminUserError.code
      } : null
    });
    
    // Check via the RPC function
    const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");
    
    console.log("🔍 DEBUG: Admin check result:", {
      isAdmin,
      adminError: adminError ? {
        message: adminError.message,
        details: adminError.details
      } : null
    });

  } catch (error) {
    console.error('Debug script error:', error);
  }
}

testLogin();
