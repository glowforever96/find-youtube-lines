# 유튜브 대사 찾기

좋아하는 유튜브 영상에서 찾고 싶은 대사를 찾아보세요!

![](https://velog.velcdn.com/images/boyfromthewell/post/c4b41db0-e01c-477b-88b5-e5ed85235dae/image.png)

원하는 유튜브 영상의 URL을 긁어 검색합니다.</br>
한국어 자동 자막 생성 데이터를 영상 검색시 가져옵니다.

![](https://velog.velcdn.com/images/boyfromthewell/post/9e30930c-14a9-43d8-a0f2-e52cd8059a53/image.png)

자막 데이터를 성공적으로 가져왔다면 원하는 대사를 검색 가능합니다.</br>

![](https://velog.velcdn.com/images/boyfromthewell/post/172bf017-732b-487e-9a9b-6858728f30f4/image.png)

원하는 대사를 찾았다면 플레이어와 함께 대사 시작 시간에 맞춰 플레이어를 재생 가능합니다.

## 기능 구현

CORS 에러를 피하기 위해 Next.js의 API Route 기능을 사용했습니다.

```tsx
// ...
// @/app/routes/api/captions/route.ts
const videoRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
const html = await videoRes.text();
const match = html.match(/ytInitialPlayerResponse\s*=\s*(\{.+?\});/s); // HTML에서 자막 관련 JSON이 포함된 스크립트 추출

//...

const playerResponse = JSON.parse(match[1]); // 추출된 JSON 문자열을 파싱
const tracks =
  playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks; // 자막 트랙 정보 접근

// ...

// 자막 중 언어 코드가 "ko"(한국어)인 트랙 찾기
const koreanTrack = tracks.find((t: any) => t.languageCode === "ko");

const baseUrl = koreanTrack.baseUrl.includes("&fmt=json3")
  ? koreanTrack.baseUrl
  : `${koreanTrack.baseUrl}&fmt=json3`; // 자막 API 요청 URL 구성 (fmt=json3 포맷 사용)

// 자막 JSON 데이터 요청
const captionResponse = await fetch(`${baseUrl}&fmt=json3`);
const captionJson = await captionResponse.json();
```

자막 데이터를 가져오는 코드 일부 입니다. 핵심 로직만 작성했습니다.

## 🚀 실행 방법

```bash
git clone https://github.com/glowforever96/find-youtube-lines.git

npm install

npm run dev
```

## 아쉬운점

실제로 배포 환경에서는 CORS 정책 혹은 YouTube 측 차단으로 인해 데이터를 아예 가져오지 못하는 문제가 발생했습니다.

또한 유튜브 공식 API에서는 영상 자막 데이터를 직접적으로 제공하지 않기 때문에 Youtube HTML을 통쨰로 요청한뒤 내부 스크립트 데이터를 추출하는 로직이기에 많이 불안정합니다. 여러 번 요청을 시도하면 정상적으로 자막을 받아오는 경우도 있습니다.

![](https://velog.velcdn.com/images/boyfromthewell/post/451dd644-6aeb-4e17-b814-88804d206eee/image.png)
![](https://velog.velcdn.com/images/boyfromthewell/post/d956f15b-d4d6-42f8-b550-e8a3db773203/image.png)
유튜브 한국어 자동 생성 자막은 부정확해 정확도가 높지는 않습니다. (빵애 라는 대사가 자주 나오는 영상이지만 검색하지 못함)
