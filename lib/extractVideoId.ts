export const extractVideoId = (url: string) => {
  const parsedUrl = new URL(url);
  const host = parsedUrl.hostname;
  const path = parsedUrl.pathname;

  console.log(host, path);

  if (parsedUrl.searchParams.has("v")) {
    return parsedUrl.searchParams.get("v");
  }

  if (
    host === "youtu.be" ||
    path.startsWith("/embed") ||
    path.startsWith("/shorts") ||
    path.startsWith("/live")
  ) {
    return path.split("/")[2] || path.split("/")[1];
  }

  return null;
};
