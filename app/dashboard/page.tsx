import { getPayloadFromToken } from "@/app/lib/auth";
import { EntryPage } from "@/app/ui/dashboard/entry-page";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const payload = await getPayloadFromToken();

  if (payload) {
    const redirectSlug = payload.slug as string;
    if (!redirectSlug) {
      console.log("No slug in token payload");
      return <EntryPage />;
    }

    redirect(`/dashboard/${redirectSlug}`);
  }

  return <EntryPage />;
}
