# ISL Sign Video Assets

This directory stores prerecorded Indian Sign Language (ISL) sign videos
for the Text/Voice → ISL translation feature.

## Expected Files

Teammates should record and place MP4 videos here with these exact filenames:

| Filename | Sign |
|---|---|
| `hello.mp4` | Hello |
| `sorry.mp4` | Sorry |
| `eat_food.mp4` | Eat / Food |
| `indian.mp4` | Indian |
| `namaste.mp4` | Namaste |
| `thank_you.mp4` | Thank You |
| `love.mp4` | Love |
| `good.mp4` | Good |
| `yes.mp4` | Yes |
| `no.mp4` | No |

## Format Requirements

- **Format:** MP4 (H.264 codec)
- **Resolution:** 720p recommended (1280×720)
- **Aspect Ratio:** 4:3 or 16:9
- **Duration:** 1–3 seconds per sign
- **Background:** Plain background preferred for clarity
- **Framing:** Signer visible from waist up, hands clearly visible

## How It Works

Once a video file is placed here, it will automatically be served by
Next.js as a static asset. The application will detect and play it
without any code changes needed.

If a video file is missing, the application shows a "Sign video not
available yet" placeholder instead of crashing.
