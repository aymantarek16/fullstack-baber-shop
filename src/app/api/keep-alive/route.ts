import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  // 1. قراءة القيمة الحالية
  const { data, error: fetchError } = await supabaseAdmin
    .from("system_heartbeat")
    .select("ping_count")
    .eq("id", 1)
    .single();

  if (fetchError) {
    return NextResponse.json(
      {
        success: false,
        error: fetchError.message,
      },
      { status: 500 }
    );
  }

  // 2. تحديث القيمة
  const { error: updateError } = await supabaseAdmin
    .from("system_heartbeat")
    .update({
      last_ping: new Date().toISOString(),
      ping_count: (data?.ping_count ?? 0) + 1,
    })
    .eq("id", 1);

  if (updateError) {
    return NextResponse.json(
      {
        success: false,
        error: updateError.message,
      },
      { status: 500 }
    );
  }

  // 3. Response
  return NextResponse.json({
    success: true,
    time: new Date().toISOString(),
  });
}