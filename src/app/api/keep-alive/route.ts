import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  // قراءة القيمة الحالية
  const { data } = await supabaseAdmin
    .from("system_heartbeat")
    .select("ping_count")
    .eq("id", 1)
    .single();

  // تحديث البيانات
  const { error } = await supabaseAdmin
    .from("system_heartbeat")
    .update({
      last_ping: new Date().toISOString(),
      ping_count: (data?.ping_count ?? 0) + 1,
    })
    .eq("id", 1);

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    time: new Date().toISOString(),
  });
}