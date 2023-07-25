'use client'
import { useLottie } from "lottie-react";
import underConstruction from "@/assets/lottie/under-construction-painter.json"

export const UnderConstruction = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: underConstruction,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
    style: {
      height: 800,
      width: 1000
    }
  };
  const { View } = useLottie(defaultOptions);

  return (
    <>{View}</>
  )
}
