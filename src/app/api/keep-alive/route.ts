import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("system_heartbeat")
    .select("*");

  return NextResponse.json({
    data,
    error,
  });
}