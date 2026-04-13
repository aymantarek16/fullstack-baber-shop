import { NextResponse } from 'next/server';
import { verifyAdminSetup } from '@/app/actions/admin-setup';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({
        success: false,
        error: "Email is required"
      });
    }
    
    const result = await verifyAdminSetup(email);
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Debug admin route error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
