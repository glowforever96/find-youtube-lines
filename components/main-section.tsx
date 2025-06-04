"use client";
import { CaptionInfo } from "@/app/page";
import { useCallback, useEffect, useState } from "react";
import UrlSearchInput from "./url-search-input";
import Button from "./ui/button";
import Image from "next/image";
import ResultSection from "./result-section";
import { useSearchParams } from "next/navigation";

export default function MainSection() {
  const s = useSearchParams();
  const videoId = s.get("v");

  const [captionInfo, setCaptionInfo] = useState<CaptionInfo[]>();
  const [thumbnail, setThumbnail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCaptions = useCallback(async () => {
    if (!videoId) return;
    setLoading(true);
    setError(null);

    const res = await fetch(`/api/captions?videoId=${videoId}`);

    const { captions, thumbnailUrl } = await res.json();
    setCaptionInfo(captions);
    setThumbnail(thumbnailUrl);

    if (res.status === 500) {
      setError("서버 연결이 좋지 못합니다. 다시 시도 해주세요.");
    }
    if (res.status === 404) {
      setError("한국어 자막을 지원하지 않습니다.");
    }
    setLoading(false);
  }, [videoId]);

  useEffect(() => {
    fetchCaptions();
  }, [fetchCaptions, videoId]);

  return (
    <div className="flex flex-col items-center p-6">
      <UrlSearchInput />
      {videoId && error && (
        <div className="text-red-500 flex gap-2 text-lg items-center mt-4">
          <p>{error}</p>
          <Button onClick={fetchCaptions} text="다시 시도" />
        </div>
      )}
      {loading && <p className="mt-4 text-lg">자막 정보 찾는중...</p>}
      {captionInfo && (
        <Image
          src={thumbnail}
          alt="영상 썸네일"
          width={400}
          height={320}
          className="mt-4"
        />
      )}
      {captionInfo && (
        <ResultSection videoId={videoId} captionInfo={captionInfo} />
      )}
    </div>
  );
}
