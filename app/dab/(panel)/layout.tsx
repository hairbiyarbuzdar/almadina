import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken, SESSION_COOKIE } from "../../lib/auth";
import { Sidebar } from "./sidebar";

export const dynamic = "force-dynamic";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Defense in depth: middleware also guards this, but re-check on the server.
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);
  if (!session) redirect("/dab/login");

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white text-ink">
      <Sidebar />
      <div className="flex-1 min-w-0 bg-[#fafafa]">{children}</div>
    </div>
  );
}
