import { ImageResponse } from "next/og";
import { AtpAgent } from "@atproto/api";
import { getRarity } from "./hash";

export const alt = "Your bluesky card";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// const agent = new AtpAgent({
//   service: "https://public.api.bsky.app/",
// });

export default async function Image({ params }: { params: { id: string } }) {
  // const id = params.id.replace("%40", "");

  // const response = await agent.app.bsky.actor.getProfile({
  //   actor: id,
  // });

  // const profile = response.data;

  return new ImageResponse(
    (
      <div
      // style={{
      // position: "relative",
      // width: "20rem",
      // height: "26.6rem",
      // borderRadius: "0.5rem",
      // backgroundColor: "#eef0e7",
      // }}
      >
        {/* <div
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
              width: "18rem",
              height: "18rem",
              borderRadius: "50%",
              border: "8px solid #29685f",
              backgroundColor: "#19443c",
            }}
            src={profile.avatar}
          /> 
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              margin: "0.5rem",
              borderRadius: "0.25rem",
              backgroundColor: "#19443c",
              padding: "0.5rem",
              textAlign: "center",
              color: "#eef0e7",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "1.5rem" }}>
              {profile.displayName ?? profile.handle}
            </span>
            <span style={{ fontSize: "0.875rem", opacity: 0.75 }}>
              @{profile.handle}
            </span>
          </div>
          <div
            style={{
              position: "absolute",
              marginLeft: "14rem",
              marginTop: "15rem",
              display: "grid",
              width: "4rem",
              height: "4rem",
              placeItems: "center",
              borderRadius: "50%",
              backgroundColor: "#aa5939",
              fontSize: "1.875rem",
              color: "#eef0e7",
            }}
          >
            {getRarity(profile.did)}
          </div>
        </div> */}

        {/* <div
          style={{
            marginTop: "0.5rem",
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gridTemplateRows: "repeat(2, 1fr)",
            gap: "2rem",
            padding: "0 2rem",
            fontSize: "1.25rem",
          }}
        >
          <div style={{ color: "#29685f" }}>Followers</div>
          <div style={{ color: "#19443c" }}>
            {profile.followersCount}
          </div>
          <div style={{ color: "#29685f" }}>Posts</div>
          <div style={{ color: "#19443c" }}>
            {profile.postsCount}
            postsCount
          </div>
        </div> */}
        {/* 
        <div
          style={{
            margin: "1.5rem 0.5rem",
            borderBottom: "1px solid #29685f",
            opacity: 0.5,
          }}
        /> */}

        <div
          style={{
            paddingRight: "0.5rem",
            textAlign: "right",
            fontSize: "0.5rem",
            color: "#29685f",
            opacity: 0.5,
          }}
        >
          {/* {profile.did} */}
          did
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
