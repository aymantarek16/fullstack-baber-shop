export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      dir="ltr"
      className="min-h-screen bg-[#070708] text-zinc-100 antialiased"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(201,162,39,0.08), transparent 55%), radial-gradient(ellipse 60% 40% at 100% 100%, rgba(201,162,39,0.04), transparent 50%)",
      }}
    >
      {children}
    </div>
  );
}
