"use client";

import { AppBskyActorDefs } from "@atproto/api";
import { type RefObject, useState } from "react";
import { ImageDownIcon, LoaderCircleIcon } from "lucide-react";
import { domToPng } from "modern-screenshot";

export function DownloadButton({
  profile,
  cardRef,
  functionRef,
}: {
  profile: AppBskyActorDefs.ProfileViewDetailed;
  cardRef: RefObject<HTMLDivElement>;
  functionRef: RefObject<{ capture: () => void }>;
}) {
  const [isDownloading, setIsDownloading] = useState(false);

  async function downloadImage() {
    if (cardRef.current !== null && functionRef.current !== null) {
      setIsDownloading(true);
      functionRef.current.capture();

      await new Promise((resolve) => setTimeout(resolve, 500));

      const dataUrl = await domToPng(cardRef.current, {
        filter: (node) => {
          if (node.nodeName === "IMG") {
            (node as HTMLImageElement).src = `/api/proxy-image?url=${
              (node as HTMLImageElement).src
            }`;
          }
          return true;
        },
      });
      const link = document.createElement("a");
      link.download = `${profile.handle}.png`;
      link.href = dataUrl;
      link.click();

      setIsDownloading(false);
    }
  }

  return (
    <button
      className="flex flex-row gap-2 items-center rounded-sm p-2 h-9 bg-[#0285FF] hover:brightness-110 text-white"
      onClick={downloadImage}
    >
      {isDownloading ? (
        <>
          Downloading... <LoaderCircleIcon className="animate-spin" />
        </>
      ) : (
        <>
          Download Image <ImageDownIcon />
        </>
      )}
    </button>
  );
}
