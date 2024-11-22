import { AtpAgent } from "@atproto/api";
import { Card } from "./card";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

const agent = new AtpAgent({
  service: "https://public.api.bsky.app/",
});

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id.replace("%40", "");

  const response = await agent.app.bsky.actor.getProfile({
    actor: id,
  });

  const profile = response.data;

  return (
    <div className="flex flex-col h-full">
      <Link
        href="/"
        className="text-xl top-8 flex flex-row gap-2 items-center bg-gray-100 hover:bg-gray-200 w-fit p-2"
      >
        <ArrowLeftIcon />
        <span>Find My Card</span>
      </Link>
      <div className="grid place-items-center grow">
        <Card profile={profile} />
      </div>
    </div>
  );
}