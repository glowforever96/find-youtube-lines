import { useEffect, useState } from "react";
import Input from "./ui/input";
import Button from "./ui/button";
import { formatTime } from "@/lib/formatTime";
import { CaptionInfo } from "@/app/page";

interface ResultSectionProps {
  videoId: string | null;
  captionInfo: CaptionInfo[] | undefined;
}

export default function ResultSection({
  videoId,
  captionInfo,
}: ResultSectionProps) {
  const [searchWord, setSearchWord] = useState("");
  const [filteredInfo, setFilteredInfo] = useState<CaptionInfo[]>();
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWord(e.target.value);
  };

  const handleClickBtn = () => {
    setError("");
    if (filteredInfo) setFilteredInfo([]);

    const findKeyword = captionInfo?.filter((item) =>
      item.text.includes(searchWord)
    );

    if (!findKeyword?.length) {
      setError("해당하는 대사를 찾을수 없습니다.");
      return;
    }
    setFilteredInfo(findKeyword);
  };

  const handleToggle = (idx: number) => {
    if (activeIndex === idx) {
      setActiveIndex(null);
    } else {
      setActiveIndex(idx);
    }
  };

  const seekTo = (player: HTMLIFrameElement, startTimeMs: number) => {
    player.contentWindow?.postMessage(
      JSON.stringify({
        event: "command",
        func: "seekTo",
        args: [Math.floor(startTimeMs / 1000), true],
      }),
      "*"
    );
  };

  useEffect(() => {
    setFilteredInfo([]);
    setSearchWord("");
  }, [captionInfo]);

  return (
    <div className="w-full flex flex-col gap-4 mt-4">
      <div className="flex w-full h-[54px] gap-2 justify-center">
        <Input
          value={searchWord}
          onChange={handleChange}
          placeholder="찾고싶은 대사를 입력 해주세요."
        />
        <Button onClick={handleClickBtn} text="대사 찾기" />
      </div>
      {error && (
        <span className="text-red-500 flex gap-2 text-lg justify-center">
          {error}
        </span>
      )}
      {filteredInfo?.map(({ text, start }, idx) => (
        <div key={`${text}${start}`} className="flex flex-col">
          <div
            className="border border-gray-300 p-3 flex gap-2 rounded-md bg-gray-100 cursor-pointer items-center"
            onClick={() => handleToggle(idx)}
          >
            <p className="text-base font-medium">{text}</p>
            <span className="text-sm text-gray-500">({formatTime(start)})</span>

            <span
              className={`text-gray-500 transition-transform duration-200 ml-auto ${
                activeIndex === idx ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </div>

          {activeIndex === idx && (
            <div className="mt-2 flex justify-center">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
                id={`youtube-player-${idx}`}
                width="560"
                height="315"
                onLoad={() => {
                  const player = document.getElementById(
                    `youtube-player-${idx}`
                  ) as HTMLIFrameElement;
                  if (player) {
                    seekTo(player, start);
                  }
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
