const { data, error } = await supabaseAdmin
  .from("system_heartbeat")
  .select("*");

return NextResponse.json({
  data,
  error,
});