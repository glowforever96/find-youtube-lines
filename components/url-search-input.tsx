"use client";
import { extractVideoId } from "@/lib/extractVideoId";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Input from "./ui/input";
import Button from "./ui/button";

export default function UrlSearchInput() {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError("");
    setInputValue(e.target.value);
  };

  const handleClickButton = () => {
    if (!inputValue || inputValue.trim() === "") {
      setError("값이 입력되지 않았습니다!");
      return;
    }
    const videoId = extractVideoId(inputValue);

    if (!videoId) {
      setError("유효하지 않은 비디오 URL 입니다.");
      return;
    }

    router.push(`?v=${videoId}`);
  };

  return (
    <>
      <div className="flex w-full h-[54px] gap-2 justify-center">
        <Input
          value={inputValue}
          onChange={handleChange}
          placeholder="찾고 싶은 유튜브 영상의 URL을 복붙해주세요!"
        />
        <Button onClick={handleClickButton} text="영상 찾기" />
      </div>
      {error && (
        <p className="mt-2 text-xl text-red-500 font-semibold">⚠️ {error}</p>
      )}
    </>
  );
}
