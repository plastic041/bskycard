import { ImageResponse } from "next/og";
import { AtpAgent } from "@atproto/api";
import { getRarity, RARITY_STYLES_OPENGRAPH } from "./hash";

export const alt = "Your bluesky card";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const agent = new AtpAgent({
  service: "https://public.api.bsky.app/",
});

export default async function Image({ params }: { params: { id: string } }) {
  const id = params.id.replace("%40", "");

  const response = await agent.app.bsky.actor.getProfile({
    actor: id,
  });

  const profile = response.data;

  const rarity = getRarity(profile.did);
  const style = RARITY_STYLES_OPENGRAPH[rarity];

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: "white",
          display: "flex",
          width: size.width,
          height: size.height,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <img
            style={{
              width: "27rem",
              height: "27rem",
              borderRadius: "0.5rem",
            }}
            src={profile.avatar}
          />
          <div
            style={{
              display: "flex",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "27rem",
                borderRadius: "0.5rem",
                backgroundColor: style.bg,
                paddingTop: "0.5rem",
                paddingBottom: "0.5rem",
                paddingLeft: "1rem",
                color: style.text,
                gap: "-.25rem",
              }}
            >
              <span style={{ fontSize: "2.5rem" }}>
                {profile.displayName ?? profile.handle}
              </span>
              <span style={{ fontSize: "1.25rem", opacity: 0.7 }}>
                @{profile.handle}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                marginLeft: "auto",
                right: "1rem",
                marginTop: "1.125rem",
                height: "4rem",
                paddingLeft: "2rem",
                paddingRight: "2rem",
                placeItems: "center",
                borderRadius: "50rem",
                backgroundColor: "rgb(255 255 255 / 0.6)",
                fontSize: "2rem",
                color: style.text,
              }}
            >
              {getRarity(profile.did)}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
