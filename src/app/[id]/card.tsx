"use client";

/* eslint-disable @next/next/no-img-element */

import {
  easeOut,
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { type RefObject, useEffect, useRef, useImperativeHandle } from "react";
import { AppBskyActorDefs } from "@atproto/api";
import { RARITY_STYLES, getRarity, TYPE_STYLES, getType } from "./hash";
import { HeartIcon, ShieldIcon, SparklesIcon, SwordIcon } from "lucide-react";

const WIDTH = 320;
const HEIGHT = (WIDTH / 3) * 4;
const MAX_FOLLOW_DISTANCE = 30;

const spring = {
  type: "spring",
  stiffness: 1000,
  damping: 30,
} as const;

function formatNumber(num: number) {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + "M";
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + "K";
  }
  return num.toString();
}

function isTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

export function Card({
  profile,
  cardRef,
  functionRef,
}: {
  profile: AppBskyActorDefs.ProfileViewDetailed;
  cardRef: RefObject<HTMLDivElement>;
  functionRef: RefObject<{ capture: () => void }>;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  const hovering = useSpring(0, spring);
  const transformStyle = useTransform(() =>
    hovering.get() > 0.2 ? "preserve-3d" : "flat"
  );

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
  const rarityStyle = RARITY_STYLES[rarity];
  const type = getType(profile.did);
  const typeStyle = TYPE_STYLES[type];

  const overlayTemplate = useMotionTemplate`
  radial-gradient(
    circle 300px at ${mousePercentX}% ${mousePercentY}%,
    #d8d8d8, #9d9d9d, #666666, #343434, #000000
  ),
  url("/gradient.jpg")
  `;
  const overlayPositionTemplate = useMotionTemplate`center, ${mousePercentX}% -${mousePercentY}%`;
  const overlayOpacity = useTransform(hovering, [0, 1], [0, 0.8]);

  const nameScale = useTransform(hovering, [0, 1], [1, 1.2]);

  const shineLeft = useTransform(() => mousePercentX.get() - 20);
  const shineRight = useTransform(() => mousePercentX.get() + 20);
  const nameShineTemplate = useMotionTemplate`linear-gradient(
    120deg in oklch,
    rgba(0, 0, 0, 0) ${shineLeft}%,
    oklch(0.999994 0.0000497986 23.7884 / 0.5) ${mousePercentX}%,
    rgba(0, 0, 0, 0) ${shineRight}%
  )`;

  useImperativeHandle(functionRef, () => {
    return {
      capture() {
        if (ref.current) {
          const { width, height } = ref.current.getBoundingClientRect();
          const mouseX = Math.random() * width;
          const mouseY = Math.random() * height;

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

          hovering.set(0.8);
        }
      },
    };
  });

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

      hovering.set(0.8);
    };

    const handleMouseEnd = () => {
      rotateXSpring.set(0);
      rotateYSpring.set(0);
      translateX.set(0);
      translateY.set(0);
      translateZ.set(0);
      hovering.set(0);
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
  }, [
    hovering,
    mousePercentX,
    mousePercentY,
    overlayOpacity,
    rotateXSpring,
    rotateYSpring,
    translateX,
    translateY,
    translateZ,
  ]);

  return (
    <div className="bg-white p-8" ref={cardRef}>
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
            className={`relative aspect-3/4 w-80 rounded-md select-none flex flex-col bg-white border-2 ${rarityStyle.border}`}
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
              <div
                className="absolute inset-0"
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                <img
                  className="absolute aspect-square w-full rounded-t-sm"
                  src={profile.avatar}
                  draggable="false"
                  alt={profile.displayName}
                />
                {(rarity === "SSR" || rarity === "SSSR") && (
                  <motion.div
                    id="foil"
                    className="absolute inset-0 mix-blend-color-dodge"
                    style={{
                      backgroundImage: overlayTemplate,
                      backgroundSize: "100%, 200%",
                      backgroundBlendMode: "multiply, screen",
                      backgroundPosition: overlayPositionTemplate,
                      opacity: overlayOpacity,
                    }}
                  />
                )}
              </div>

              <motion.div
                className={`absolute left-0 right-0 m-2 rounded-sm bg-[#19443c] py-2 text-[#eef0e7] flex flex-row justify-between items-center px-2 ${rarityStyle.gradient} ${rarityStyle.text}`}
                style={{
                  transformStyle: "preserve-3d",
                  z: translateZText,
                  scale: nameScale,
                }}
              >
                <div className="flex flex-col">
                  <div className="text-xl flex flex-row items-center gap-2">
                    <SparklesIcon className="w-5 h-5 text-white" />

                    {profile.displayName ?? profile.handle}
                  </div>
                  <span className="text-sm opacity-75">@{profile.handle}</span>
                </div>

                <div className="absolute inset-0 overflow-hidden">
                  <motion.div
                    className="size-full"
                    style={{
                      opacity: overlayOpacity,
                      backgroundImage: nameShineTemplate,
                    }}
                  />
                </div>
                <motion.div
                  className={`mr-2 px-3 py-1 rounded-full text font-bold bg-white/20 backdrop-blur-sm text-white shadow-md ${rarityStyle.glow}`}
                  style={{ z: translateZRarity }}
                  animate={
                    rarity === "SSR" || rarity === "SSSR"
                      ? {
                          scale: [0.9, 1.2, 0.9],
                          transition: {
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          },
                        }
                      : {}
                  }
                >
                  {rarity}
                </motion.div>
              </motion.div>
              <motion.div
                className="absolute right-2 top-auto bottom-2 flex gap-2 items-center pl-3 pr-4 backdrop-blur rounded-full bg-gray-700/50 text-xl text-white"
                style={{ z: translateZText }}
              >
                <HeartIcon size={20} className="fill-red-500 stroke-red-500" />
                <span>{formatNumber(profile.postsCount ?? 0)}</span>
              </motion.div>
            </div>

            <motion.div
              className="flex flex-row px-4 py-2 grow justify-between"
              style={{
                transformStyle,
              }}
            >
              <div className="text-2xl flex flex-col gap-1 tabular-nums justify-center">
                <div
                  className="flex items-center flex-row gap-4"
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  <SwordIcon className="text-[#29685f]" size={24} />
                  <div className="text-[#19443c]">
                    {formatNumber(profile.followersCount ?? 0)}
                  </div>
                </div>
                <div
                  className="flex items-center flex-row gap-4"
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  <ShieldIcon className="text-[#29685f]" size={24} />
                  <div className="text-[#19443c]">
                    {formatNumber(profile.followsCount ?? 0)}
                  </div>
                </div>
              </div>
              <div className="grid place-content-center rotate-x-20 rotate-y-160 translate-z-10">
                <div
                  className={`grid place-content-center p-2 rounded-full bg-white border-3 ${typeStyle.border}`}
                >
                  <typeStyle.Icon size={48} className={`${typeStyle.stroke}`} />
                </div>
              </div>
            </motion.div>

            <div className="mx-2 border-b border-[#29685f] opacity-50" />

            <div className="pr-2 mb-0.5 text-right text-[0.5rem] text-[#29685f] opacity-50">
              {profile.did}
            </div>
          </div>
          {/* <div className="absolute inset-0 opacity-50 mix-blend-overlay bg-linear-to-br from-transparent via-white to-transparent" /> */}
        </motion.div>
      </div>
    </div>
  );
}
