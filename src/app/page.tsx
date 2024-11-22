"use client";

import { useRouter } from "next/navigation";
import { ArrowRightIcon } from "lucide-react";
import { Input } from "./input";

export default function Home() {
  const router = useRouter();

  return (
    <main className="w-container mx-auto h-full grid place-items-center">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const input = event.currentTarget.elements.namedItem(
            "id"
          ) as HTMLInputElement;
          router.push(`/${input.value}`);
        }}
        className="flex gap-4"
      >
        <label className="flex flex-col gap-2 grow">
          <div className="flex flex-col">
            <span className="text-xl text-gray-700">
              At Identifier(handle, did)
            </span>
            <span className="text-base text-gray-500">
              E.g. @snubi.bsky.social
            </span>
          </div>
          <Input name="id" />
        </label>
        <button
          type="submit"
          className="grid place-items-center border w-10 h-10 shrink-0 rounded self-end"
        >
          <ArrowRightIcon />
        </button>
      </form>
    </main>
  );
}
