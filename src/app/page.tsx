"use client";

import { useRouter } from "next/navigation";
import { ArrowRightIcon, LoaderCircle } from "lucide-react";
import { Input } from "./input";
import { useRef, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <main className="w-container mx-auto h-full grid place-items-center">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          router.push(`/${id}`);
          setIsSubmitting(true);
        }}
        className="flex gap-2"
      >
        <label className="flex flex-col gap-2 grow w-72">
          <div className="flex flex-col">
            <span className="text-xl text-gray-700">
              At Identifier(handle, did)
            </span>
            <span className="text-base text-gray-500">
              E.g. @snubi.bsky.social
            </span>
          </div>
          <Input
            name="id"
            value={id}
            onChange={(event) => setId(event.currentTarget.value)}
          />
        </label>
        <button
          type="submit"
          disabled={id.trim() === ""}
          className="transition-colors duration-200 grid disabled:bg-gray-100 disabled:text-gray-300 place-items-center border border-gray-200 w-10 h-10 shrink-0 rounded self-end"
        >
          {isSubmitting ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <ArrowRightIcon />
          )}
        </button>
      </form>
    </main>
  );
}
