import { NextResponse } from 'next/server';
import { signInAdmin } from '@/app/actions/admin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const formData = new FormData();
    
    formData.append('email', body.email || 'admin@example.com');
    formData.append('password', body.password || 'password');
    
    console.log('🧪 DEBUG TEST: Starting login test with:', {
      email: body.email,
      passwordLength: body.password?.length || 0
    });
    
    const result = await signInAdmin(formData);
    
    return NextResponse.json({
      success: true,
      message: 'Check server console for detailed debug logs',
      result: result || 'Login successful (redirected)'
    });
    
  } catch (error) {
    console.error('🧪 DEBUG TEST: Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
