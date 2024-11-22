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
import { RARITY_STYLES, getRarity } from "./hash";
import {
  FlameIcon,
  ShieldIcon,
  SparklesIcon,
  SwordIcon,
  UsersIcon,
} from "lucide-react";

const WIDTH = 320;
const HEIGHT = (WIDTH / 3) * 4;
const MAX_FOLLOW_DISTANCE = 30;

const spring = {
  type: "spring",
  stiffness: 1000,
  damping: 30,
} as const;

function formatNumber(num: number) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

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
  const translateZRarity = useTransform(translateZ, [0, 1], [0, 24]);

  const rotateXSpring = useSpring(0, spring);
  const rotateYSpring = useSpring(0, spring);
  const rotateZ = useMotionValue(0);

  const rarity = getRarity(profile.did);
  const style = RARITY_STYLES[rarity];

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
  }, []);

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
        className="rounded-md grid w-full h-full"
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
          transformStyle: "preserve-3d",
          rotateX: rotateXSpring,
          rotateY: rotateYSpring,
          rotateZ: rotateZ,
          x: translateX,
          y: translateY,
        }}
      >
        <div
          className={`relative aspect-[3/4] w-80 rounded select-none flex flex-col bg-white border-2 ${style.border}`}
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
            <img
              className="absolute aspect-square w-full rounded-t-sm"
              src={profile.avatar}
              draggable="false"
            />
            <motion.div
              className={`absolute left-0 right-0 m-2 rounded bg-[#19443c] py-2 text-[#eef0e7] flex flex-row justify-between items-center px-2 ${style.gradient} ${style.text}`}
              style={{
                transformStyle: "preserve-3d",
                z: translateZText,
              }}
            >
              <div className="flex flex-col">
                <div className="text-xl flex flex-row items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-white" />

                  {profile.displayName ?? profile.handle}
                </div>
                <span className="text-sm opacity-75">@{profile.handle}</span>
              </div>
              <motion.div
                className={`mr-2 px-3 py-1 rounded-full text font-bold bg-white/20 backdrop-blur-sm text-white shadow-md ${style.glow}`}
                style={{ z: translateZRarity }}
              >
                {rarity}
              </motion.div>
            </motion.div>
            <motion.div
              className="absolute right-2 top-auto bottom-2 flex gap-2 items-center pl-3 pr-4 backdrop-blur rounded-full bg-gray-700/50 text-xl text-white"
              style={{ z: translateZText }}
            >
              <FlameIcon size={16} />
              <span>{formatNumber(profile.postsCount ?? 0)}</span>
            </motion.div>
          </div>

          <div className="px-4 py-2 text-2xl flex flex-col gap-1 tabular-nums grow justify-center">
            <div
              className="flex items-center flex-row gap-4"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              <SwordIcon className="text-[#29685f]" size={24} />
              <div className="text-[#19443c]">{profile.followersCount}</div>
            </div>
            <div
              className="flex items-center flex-row gap-4"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              <ShieldIcon className="text-[#29685f]" size={24} />
              <div className="text-[#19443c]">{profile.followsCount}</div>
            </div>
          </div>

          <div className="mx-2 border-b border-[#29685f] opacity-50" />

          <div className="pr-2 mb-0.5 text-right text-[0.5rem] text-[#29685f] opacity-50">
            {profile.did}
          </div>
        </div>
        {/* <div className="absolute inset-0 opacity-50 mix-blend-overlay bg-gradient-to-br from-transparent via-white to-transparent" /> */}
      </motion.div>
    </div>
  );
}
