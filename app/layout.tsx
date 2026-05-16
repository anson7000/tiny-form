import "@/app/ui/styles/globals.css";
import { Header } from "@/app/ui/header";
import { getPayloadFromToken } from "./lib/auth";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const payload = await getPayloadFromToken();
  const isAuthenticated = !!payload;

  return (
    <html lang="en">
      <body className="flex flex-col h-screen">
        <Header isAuthenticated={isAuthenticated} />
        <main className="flex-1 overflow-hidden">{children}</main>
      </body>
    </html>
  );
}
