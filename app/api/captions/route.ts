/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const videoId = req.nextUrl.searchParams.get("videoId");

  if (!videoId) {
    return NextResponse.json(
      { error: "videoId가 필요합니다." },
      { status: 400 }
    );
  }

  try {
    const videoRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
    const html = await videoRes.text();

    console.log(html);

    const match = html.match(/ytInitialPlayerResponse\s*=\s*(\{.+?\});/s);

    if (!match) {
      return NextResponse.json(
        { error: "ytInitialPlayerResponse 추출 실패" },
        { status: 500 }
      );
    }

    const playerResponse = JSON.parse(match[1]);
    const tracks =
      playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

    console.log(tracks);
    if (!tracks || tracks.length === 0) {
      return NextResponse.json({ error: "자막 트랙 없음" }, { status: 404 });
    }

    const koreanTrack = tracks.find((t: any) => t.languageCode === "ko");
    if (!koreanTrack) {
      return NextResponse.json({ error: "한국어 자막 없음" }, { status: 404 });
    }

    const baseUrl = koreanTrack.baseUrl.includes("&fmt=json3")
      ? koreanTrack.baseUrl
      : `${koreanTrack.baseUrl}&fmt=json3`;

    const captionResponse = await fetch(`${baseUrl}&fmt=json3`);

    const captionJson = await captionResponse.json();

    const captions = captionJson.events
      ?.filter((e: any) => {
        if (!e.segs || e.tStartMs === undefined) return false;

        const text = e.segs
          .map((seg: any) => seg.utf8)
          .join("")
          .replace(/\n/g, "")
          .trim();

        return text !== "";
      })
      .map((e: any) => ({
        start: Number(e.tStartMs),
        text: e.segs
          .map((seg: any) => seg.utf8)
          .join("")
          .replace(/\n/g, "")
          .trim(),
      }));

    return NextResponse.json({
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      captions,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "에러 발생: " + err.message },
      { status: 500 }
    );
  }
}
