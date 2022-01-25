# Downloading YouTube Videos With yt-dlp

[`yt-dlp`](https://github.com/yt-dlp/yt-dlp) is an actively maintained fork of [`youtube-dl`](https://ytdl-org.github.io/youtube-dl/index.html) and is the best way to download high quality videos from YouTube. Instructions for how to install it are located [here](https://github.com/yt-dlp/yt-dlp#installation). The tool has a large API surface area and dense documentation which can result in a frustrating experience when you *just* want to download a video. If you see it, like it, want it, this guide will help you get it.

## List Available Formats

```plaintext
yt-dlp -F https://www.youtube.com/watch?v=v7bnOxV4jAc
```

```plaintext
[youtube] v7bnOxV4jAc: Downloading webpage
[youtube] v7bnOxV4jAc: Downloading android player API JSON
[info] Available formats for v7bnOxV4jAc:
ID  EXT   RESOLUTION FPS │   FILESIZE    TBR PROTO │ VCODEC           VBR ACODEC      ABR     ASR MORE INFO
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
sb2 mhtml 48x27          │                   mhtml │ images                                       storyboard
sb1 mhtml 80x45          │                   mhtml │ images                                       storyboard
sb0 mhtml 160x90         │                   mhtml │ images                                       storyboard
139 m4a                  │    1.63MiB    48k https │ audio only           mp4a.40.5   48k 22050Hz low, m4a_dash
249 webm                 │    1.70MiB    51k https │ audio only           opus        51k 48000Hz low, webm_dash
250 webm                 │    2.23MiB    66k https │ audio only           opus        66k 48000Hz low, webm_dash
140 m4a                  │    4.31MiB   129k https │ audio only           mp4a.40.2  129k 44100Hz medium, m4a_dash
251 webm                 │    4.35MiB   130k https │ audio only           opus       130k 48000Hz medium, webm_dash
17  3gp   176x144     12 │    2.48MiB    74k https │ mp4v.20.3        74k mp4a.40.2    0k 22050Hz 144p
394 mp4   256x144     24 │    2.24MiB    67k https │ av01.0.00M.08    67k video only              144p, mp4_dash
160 mp4   256x144     24 │    2.58MiB    77k https │ avc1.4d400c      77k video only              144p, mp4_dash
278 webm  256x144     24 │    2.65MiB    79k https │ vp9              79k video only              144p, webm_dash
395 mp4   426x240     24 │    4.21MiB   126k https │ av01.0.00M.08   126k video only              240p, mp4_dash
133 mp4   426x240     24 │    5.55MiB   166k https │ avc1.4d4015     166k video only              240p, mp4_dash
242 webm  426x240     24 │    5.02MiB   150k https │ vp9             150k video only              240p, webm_dash
396 mp4   640x360     24 │    8.54MiB   256k https │ av01.0.01M.08   256k video only              360p, mp4_dash
134 mp4   640x360     24 │   11.60MiB   348k https │ avc1.4d401e     348k video only              360p, mp4_dash
18  mp4   640x360     24 │   20.13MiB   604k https │ avc1.42001E     604k mp4a.40.2    0k 44100Hz 360p
243 webm  640x360     24 │   10.59MiB   317k https │ vp9             317k video only              360p, webm_dash
397 mp4   854x480     24 │   15.09MiB   453k https │ av01.0.04M.08   453k video only              480p, mp4_dash
135 mp4   854x480     24 │   19.31MiB   579k https │ avc1.4d401e     579k video only              480p, mp4_dash
244 webm  854x480     24 │   18.65MiB   560k https │ vp9             560k video only              480p, webm_dash
398 mp4   1280x720    24 │   29.73MiB   892k https │ av01.0.05M.08   892k video only              720p, mp4_dash
136 mp4   1280x720    24 │   32.38MiB   972k https │ avc1.4d401f     972k video only              720p, mp4_dash
22  mp4   1280x720    24 │ ~ 37.52MiB  1101k https │ avc1.64001F    1101k mp4a.40.2    0k 44100Hz 720p
247 webm  1280x720    24 │   36.24MiB  1088k https │ vp9            1088k video only              720p, webm_dash
399 mp4   1920x1080   24 │   51.84MiB  1557k https │ av01.0.08M.08  1557k video only              1080p, mp4_dash
137 mp4   1920x1080   24 │   85.67MiB  2573k https │ avc1.640028    2573k video only              1080p, mp4_dash
248 webm  1920x1080   24 │   62.54MiB  1878k https │ vp9            1878k video only              1080p, webm_dash
400 mp4   2560x1440   24 │  147.01MiB  4415k https │ av01.0.12M.08  4415k video only              1440p, mp4_dash
271 webm  2560x1440   24 │  165.17MiB  4961k https │ vp9            4961k video only              1440p, webm_dash
401 mp4   3840x2160   24 │  284.63MiB  8549k https │ av01.0.12M.08  8549k video only              2160p, mp4_dash
313 webm  3840x2160   24 │  405.50MiB 12180k https │ vp9           12180k video only              2160p, webm_dash
```

## Determine The Highest Quality Video+Audio Formats

Do *not* rely on the `(best)` note. Follow this simple algorithm instead.

1. Find the largest video with the highest resolution in the desired format.
2. Find the largest compatible audio.

Applying the algorithm to the example results in `313` and `251`. I chose `webm` because I find it looks and plays better than `mp4`.

## Download

```plaintext
yt-dlp -f 313+251 https://www.youtube.com/watch?v=v7bnOxV4jAc
```

```plaintext
[youtube] v7bnOxV4jAc: Downloading webpage
[youtube] v7bnOxV4jAc: Downloading android player API JSON
[info] v7bnOxV4jAc: Downloading 1 format(s): 313+251
[download] Destination: [MV] IU(아이유)_LILAC(라일락) [v7bnOxV4jAc].f313.webm
[download] 100% of 405.50MiB in 00:09
[download] Destination: [MV] IU(아이유)_LILAC(라일락) [v7bnOxV4jAc].f251.webm
[download] 100% of 4.35MiB in 00:00
[Merger] Merging formats into "[MV] IU(아이유)_LILAC(라일락) [v7bnOxV4jAc].webm"
Deleting original file [MV] IU(아이유)_LILAC(라일락) [v7bnOxV4jAc].f251.webm (pass -k to keep)
Deleting original file [MV] IU(아이유)_LILAC(라일락) [v7bnOxV4jAc].f313.webm (pass -k to keep)
```

## Celebrate!

<video src="assets/lilac_loop.mp4" autoplay loop muted playsinline></video>

I used `ffmpeg`, a dependency of `yt-dlp`, to make the loop above.

```plaintext
ffmpeg -i input.mp4 -filter_complex "[0:v]reverse,fifo[r];[0:v][r] concat=n=2:v=1 [v]" -map "[v]" output.mp4
```

The command [concatenates a reversed version of the clip to itself](https://stackoverflow.com/questions/42257354/concat-a-video-with-itself-but-in-reverse-using-ffmpeg).
