"use client";

import {
  easeOut,
  motion,
  useAnimationFrame,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef } from "react";
import { AppBskyActorDefs } from "@atproto/api";
import { getRarity } from "./hash";

const WIDTH = 320;
const HEIGHT = (WIDTH / 3) * 4;
const MAX_FOLLOW_DISTANCE = 30;

const spring = {
  type: "spring",
  stiffness: 1000,
  damping: 30,
} as const;

function isTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

export function Card({
  profile,
}: {
  profile: AppBskyActorDefs.ProfileViewDetailed;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  const mousePercentX = useMotionValue(0);
  const mousePercentY = useMotionValue(0);
  const translateX = useSpring(0, spring);
  const translateY = useSpring(0, spring);

  const translateZ = useSpring(0, spring);
  const translateZText = useTransform(translateZ, [0, 1], [0, 48]);
  const translateZImg = useTransform(translateZ, [0, 1], [0, 24]);

  const rotateXSpring = useSpring(0, spring);
  const rotateYSpring = useSpring(0, spring);
  const rotateZ = useMotionValue(0);

  useAnimationFrame((time) => {
    if (ref.current === null) {
      return;
    }

    const _rotateZ = Math.sin(time * 0.0012);

    rotateZ.set(_rotateZ);
  });

  useEffect(() => {
    if (ref.current === null) {
      return;
    }

    const handleMouseMove = (event: MouseEvent | TouchEvent) => {
      const element = ref.current;
      if (!element) {
        return;
      }

      const { clientX, clientY } = (() => {
        if ("touches" in event) {
          return {
            clientX: event.touches[0].clientX,
            clientY: event.touches[0].clientY,
          };
        }
        return {
          clientX: event.clientX,
          clientY: event.clientY,
        };
      })();
      const { left, top, width, height } = element.getBoundingClientRect();
      const mouseX = clientX - left;
      const mouseY = clientY - top;

      const percentX = mouseX / width;
      const percentY = mouseY / height;

      const _rotateY = (percentX - 0.5) * -30;
      const _rotateX = (percentY - 0.5) * 30;

      const _mousePercentX = percentX * 100;
      const _mousePercentY = percentY * 100;

      rotateXSpring.set(_rotateX);
      rotateYSpring.set(_rotateY);

      mousePercentX.set(_mousePercentX);
      mousePercentY.set(_mousePercentY);

      translateX.set((easeOut(percentX) - 0.5) * MAX_FOLLOW_DISTANCE);
      translateY.set((easeOut(percentY) - 0.5) * MAX_FOLLOW_DISTANCE);

      translateZ.set(1);
    };

    const handleMouseEnd = () => {
      rotateXSpring.set(0);
      rotateYSpring.set(0);
      translateX.set(0);
      translateY.set(0);
      translateZ.set(0);
    };

    if (isTouchDevice()) {
      const element = ref.current;
      element.addEventListener("touchmove", handleMouseMove);
      element.addEventListener("touchend", handleMouseEnd);

      return () => {
        element.removeEventListener("touchmove", handleMouseMove);
        element.removeEventListener("touchend", handleMouseEnd);
      };
    } else {
      const element = ref.current;
      element.addEventListener("mousemove", handleMouseMove);
      element.addEventListener("mouseleave", handleMouseEnd);

      return () => {
        element.removeEventListener("mousemove", handleMouseMove);
        element.removeEventListener("mouseleave", handleMouseEnd);
      };
    }
  });

  return (
    <div
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
        width: WIDTH,
        height: HEIGHT,
      }}
    >
      <motion.div
        className="rounded-md"
        ref={ref}
        whileHover={{
          scale: 1.1,
          boxShadow: `var(--shadow-elevation-high)`,
        }}
        whileTap={{
          scale: 1.1,
          boxShadow: `var(--shadow-elevation-high)`,
        }}
        transition={spring}
        style={{
          touchAction: "none",
          perspective: "1000px",
          transformStyle: "preserve-3d",
          width: "100%",
          height: "100%",
          rotateX: rotateXSpring,
          rotateY: rotateYSpring,
          rotateZ: rotateZ,
          x: translateX,
          y: translateY,
          display: "grid",
        }}
      >
        <div
          className="[grid-area:1/1] relative aspect-[3/4] w-80 rounded-lg bg-[#eef0e7] select-none"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="relative flex aspect-square flex-col"
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            <motion.img
              className="absolute m-4 aspect-square w-72 rounded-full border-8 border-[#29685f] bg-[#19443c]"
              style={{ z: translateZImg }}
              src={profile.avatar}
              draggable="false"
            />
            <motion.div
              className="absolute left-0 right-0 m-2 rounded bg-[#19443c] py-2 text-center text-[#eef0e7] flex flex-col items-center"
              style={{ z: translateZText }}
            >
              <span className="text-2xl">
                {profile.displayName ?? profile.handle}
              </span>
              <span className="text-sm opacity-75">@{profile.handle}</span>
            </motion.div>
            <motion.div
              className="absolute ml-56 mt-60 grid aspect-square w-16 place-items-center rounded-full bg-[#aa5939] text-3xl text-[#eef0e7]"
              style={{ z: translateZText }}
            >
              {getRarity(profile.did)}
            </motion.div>
          </div>

          <div
            className="left-0 right-0 mt-2 grid grid-cols-2 grid-rows-2 gap-x-8 px-8 text-xl"
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            <motion.div
              className="text-[#29685f]"
              style={{ z: translateZText }}
            >
              Followers
            </motion.div>
            <motion.div
              className="text-[#19443c]"
              style={{ z: translateZText }}
            >
              {profile.followersCount}
            </motion.div>
            <motion.div
              className="text-[#29685f]"
              style={{ z: translateZText }}
            >
              Posts
            </motion.div>
            <motion.div
              className="text-[#19443c]"
              style={{ z: translateZText }}
            >
              {profile.postsCount}
            </motion.div>
          </div>

          <div className="mx-2 mt-6 border-b border-[#29685f] opacity-50" />

          <div className="pr-2 text-right text-[0.5rem] text-[#29685f] opacity-50">
            {profile.did}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
