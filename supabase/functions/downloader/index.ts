import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const DIRECT_EXTENSIONS = [".mp4", ".mp3", ".webm", ".jpg", ".jpeg", ".png", ".gif", ".wav", ".ogg", ".pdf", ".m4a"];

const BLOCKED_DOMAINS = [
  "youtube.com", "youtu.be", "tiktok.com", "instagram.com",
  "twitter.com", "x.com", "facebook.com", "fb.watch",
  "netflix.com", "spotify.com",
];

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname;

    // /resolve endpoint
    if (path.endsWith("/resolve") && req.method === "POST") {
      const body = await req.json();
      const targetUrl = body.url as string;
      const platform = body.platform as string;

      if (!targetUrl) {
        return new Response(
          JSON.stringify({ status: "error", reason: "No URL provided" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }

      let parsedUrl: URL;
      try {
        parsedUrl = new URL(targetUrl);
      } catch {
        return new Response(
          JSON.stringify({ status: "error", reason: "Invalid URL" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }

      const host = parsedUrl.hostname.replace("www.", "");
      const urlPath = parsedUrl.pathname.toLowerCase();

      // Check if blocked platform
      if (BLOCKED_DOMAINS.some((d) => host.includes(d))) {
        return new Response(
          JSON.stringify({
            status: "unavailable",
            reason: `This platform (${platform}) requires external extraction tools. Direct media extraction is not supported.`,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check if direct media
      const isDirectMedia = DIRECT_EXTENSIONS.some((ext) => urlPath.endsWith(ext));
      if (isDirectMedia) {
        const fileName = urlPath.split("/").pop() || "download";
        return new Response(
          JSON.stringify({
            status: "ready",
            download_url: targetUrl,
            file_name: fileName,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Tier 2: Try to fetch the page and look for og:video or media sources
      try {
        const response = await fetch(targetUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; OnlineFileTool/1.0)",
          },
          redirect: "follow",
          signal: AbortSignal.timeout(10000),
        });

        const contentType = response.headers.get("content-type") || "";
        if (contentType.startsWith("video/") || contentType.startsWith("audio/")) {
          const contentDisp = response.headers.get("content-disposition");
          let fileName = "media";
          if (contentDisp) {
            const match = contentDisp.match(/filename="?([^";\n]+)"?/);
            if (match) fileName = match[1];
          }
          return new Response(
            JSON.stringify({
              status: "ready",
              download_url: targetUrl,
              file_name: fileName,
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        if (contentType.includes("text/html")) {
          const html = await response.text();

          // Check for og:video
          const ogVideoMatch = html.match(/<meta\s+property="og:video(?::url)?"\s+content="([^"]+)"/i);
          if (ogVideoMatch && ogVideoMatch[1]) {
            return new Response(
              JSON.stringify({
                status: "ready",
                download_url: ogVideoMatch[1],
                file_name: ogVideoMatch[1].split("/").pop() || "video",
              }),
              { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          // Check for og:audio
          const ogAudioMatch = html.match(/<meta\s+property="og:audio(?::url)?"\s+content="([^"]+)"/i);
          if (ogAudioMatch && ogAudioMatch[1]) {
            return new Response(
              JSON.stringify({
                status: "ready",
                download_url: ogAudioMatch[1],
                file_name: ogAudioMatch[1].split("/").pop() || "audio",
              }),
              { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          // Check for video source tags
          const sourceMatch = html.match(/<source\s+src="([^"]+)"[^>]*type="video\/[^"]+"/i);
          if (sourceMatch && sourceMatch[1]) {
            const srcUrl = sourceMatch[1].startsWith("http") ? sourceMatch[1] : new URL(sourceMatch[1], targetUrl).href;
            return new Response(
              JSON.stringify({
                status: "ready",
                download_url: srcUrl,
                file_name: srcUrl.split("/").pop() || "video",
              }),
              { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
        }
      } catch {
        // Fetch failed, fall through to unavailable
      }

      // Tier 3: No media found
      return new Response(
        JSON.stringify({
          status: "unavailable",
          reason: "No accessible media stream found for this URL.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Default: health check
    return new Response(
      JSON.stringify({ status: "ok", service: "downloader" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ status: "error", reason: "Internal server error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
