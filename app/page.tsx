import MainSection from "@/components/main-section";
import { Suspense } from "react";

export type CaptionInfo = {
  start: number;
  text: string;
};

export default function Home() {
  return (
    <Suspense>
      <MainSection />
    </Suspense>
  );
}
