import { ImageResponse } from "next/og";
import { AtpAgent } from "@atproto/api";
import { getRarity } from "./hash";

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

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: "#29685f",
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
            margin: "0 auto",
            width: "27rem",
            height: "36rem",
            borderRadius: "0.5rem",
            backgroundColor: "#eef0e7",
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <img
              style={{
                position: "absolute",
                margin: "1rem",
                width: "25rem",
                height: "25rem",
                borderRadius: "50%",
                border: "8px solid #29685f",
                backgroundColor: "#19443c",
              }}
              src={profile.avatar}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                position: "absolute",
                left: 0,
                right: 0,
                margin: "0.5rem",
                borderRadius: "0.25rem",
                backgroundColor: "#19443c",
                padding: "0.5rem",
                textAlign: "center",
                color: "#eef0e7",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "2.5rem" }}>
                {profile.displayName ?? profile.handle}
              </span>
              <span style={{ fontSize: "1.5rem", opacity: 0.75 }}>
                @{profile.handle}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                marginLeft: "18rem",
                marginTop: "18rem",
                width: "8rem",
                height: "8rem",
                placeItems: "center",
                borderRadius: "50%",
                backgroundColor: "#aa5939",
                fontSize: "3rem",
                color: "#eef0e7",
              }}
            >
              {getRarity(profile.did)}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: "27rem",
              gap: "3rem",
              padding: "0 2rem",
              fontSize: "2.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ color: "#29685f" }}>Followers</div>
              <div style={{ color: "#29685f" }}>Posts</div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  color: "#19443c",
                }}
              >
                {profile.followersCount ?? 0}
              </div>
              <div
                style={{
                  display: "flex",
                  color: "#19443c",
                }}
              >
                {profile.postsCount ?? 0}
              </div>
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
