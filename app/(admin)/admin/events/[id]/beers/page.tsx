import { notFound } from "next/navigation";

import { AdminEventBeersClient } from "@/components/admin/admin-event-beers-client";
import { getAdminEventBeersData, getAdminBeers } from "@/lib/data/admin";

type AdminEventBeersPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminEventBeersPage({
  params,
}: AdminEventBeersPageProps) {
  const { id } = await params;
  const [eventData, availableBeers] = await Promise.all([
    getAdminEventBeersData(id),
    getAdminBeers(),
  ]);

  if (!eventData.eventTitle) {
    notFound();
  }

  return (
    <AdminEventBeersClient
      eventId={eventData.eventId}
      eventTitle={eventData.eventTitle}
      beers={eventData.beers}
      availableBeers={availableBeers.map((b) => ({
        id: b.id,
        breweryName: b.breweryName,
        productName: b.productName,
        styleName: b.styleName,
        abv: b.abv,
      }))}
    />
  );
}