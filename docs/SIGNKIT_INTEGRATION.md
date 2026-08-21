# SignKit Text \u2192 ISL Integration

## 1. Why the old Text \u2192 ISL system was replaced
The old system used a static dictionary mapping strings to individual pre-recorded MP4 videos. This approach was inflexible, required massive storage for expanding the vocabulary, had no seamless transitions between signs, and could not be extended dynamically.

## 2. Why SignKit was selected
SignKit provides a lightweight, fully 3D avatar-based ISL generation system using Three.js. It features a programmatic animation pipeline where words are mapped directly to bone rotations, allowing fluid, continuous animation without large video files. It also has a built-in fingerspelling fallback mechanism for unsupported words.

## 3. SignKit Architecture
The original SignKit repository is a React 17 application utilizing pure client-side JavaScript. It handles Text \u2192 Gloss translation using a simple SOV heuristic, maps those glosses to an `animationRegistry`, and plays back arrays of bone transformations inside a `requestAnimationFrame` loop using `three.js`.

## 4. What was migrated
- `xbot.glb` and `ybot.glb` avatar models.
- The entire `Animations` registry, containing hand-crafted bone rotations for ~55 signs, the alphabet, and numbers.
- The `glosser.js` text processing logic.

## 5. What was removed
- The old `SignVideoPlayer` component.
- The MP4 video files inside `frontend/public/signs/`.
- The spaCy-based `isl_nlp_service.py` (which was overly complex given that SignKit's animations expect exact keyword matches based on its own heuristics).

## 6. Text processing
Text processing has been ported to the FastAPI backend (`text_translation_service.py`). It:
1. Strips punctuation.
2. Removes common English stop words.
3. Applies a basic 3-word SOV (Subject-Object-Verb) reordering if a pronoun is present.
4. Deduplicates consecutive words.
5. Keeps compound phrases like "THANK YOU" intact.

## 7. ISL grammar handling
The grammar handling is intentionally kept identical to SignKit's original logic to ensure compatibility with its exact vocabulary expectations. 

## 8. Sign vocabulary
SignKit supports around 55 basic words (including pronouns, family, food, common verbs, feelings), numbers 0-9, and the English alphabet (A-Z) for fingerspelling.

## 9. Animation architecture
The animation system is pure JavaScript. Each word corresponds to a function that pushes an array of bone transforms (`[boneName, action, axis, limit, sign]`) into a `ref.animations` queue.

## 10. Avatar architecture
The avatar is a `SkinnedMesh` loaded via Three.js `GLTFLoader`.

## 11. API contract
`POST /api/translate/text-to-sign`
**Request:**
```json
{
  "text": "I want to go home"
}
```
**Response:**
```json
{
  "success": true,
  "input_text": "I want to go home",
  "normalized_text": "i want to go home",
  "gloss": ["I", "HOME", "GO", "WANT"],
  "signs": [... array of sign objects ...],
  "unsupported_words": []
}
```

## 12. Frontend integration
The frontend component `SignKitPlayer.tsx` is dynamically imported (`ssr: false`) inside `app/translate/page.tsx` to prevent Next.js SSR from attempting to load Three.js browser APIs on the server.

## 13. Controls
The `SignKitPlayer` includes Play/Restart and Stop controls, driving the internal `requestAnimationFrame` loop.

## 14. Unsupported-word handling
Words not found in the SignKit vocabulary are passed to the frontend in the `unsupported_words` array. The `SignKitPlayer` detects this and automatically queues letter-by-letter fingerspelling animations, while the UI displays a notification to the user about which words lacked native signs.

## 15. Dependencies
- `three`
- `@types/three`

## 16. Known limitations
- The NLP heuristic is very basic. It does not handle complex tenses, plurals, or multi-clause sentences correctly.
- Missing lemmatization: "GOING" will be fingerspelled because only "GO" exists in the registry, unless we explicitly add an alias.
- The avatar animations are hand-coded and sometimes blocky.

## 17. How to run locally
No special configuration is needed. `npm run dev` in the frontend and `uvicorn app.main:app` in the backend will run the fully integrated system.
