# Bidirectional ISL Translator (WORKING NAME)

## Official SIH Problem Statement
- **Official PS ID:** SIH1715
- **Title:** AI Tool/Mobile App for Indian Sign Language Generator from Audio-Visual Content in English/Hindi to ISL and Vice-Versa
- **Organization:** Ministry of Social Justice and Empowerment
- **Category/Theme:** Miscellaneous / Software
- **Official Requirement:** To develop a bidirectional communication tool that can convert spoken English/Hindi audio or text input into Indian Sign Language (ISL) gestures, and recognize ISL gestures captured via camera to translate them into English/Hindi text/speech in real-time.

## Problem Understanding
The project aims to build a bidirectional communication system between hearing/speech-impaired individuals who use Indian Sign Language (ISL) and individuals who speak/write in English or Hindi. The barrier lies in the lack of a common medium of communication.

## Target Users
- ISL users (Deaf and Hard of Hearing individuals in India)
- English-speaking users
- Hindi-speaking users

## Core Problem
ISL has its own grammar and vocabulary distinct from spoken English/Hindi. Hearing individuals do not understand ISL gestures, and ISL users may struggle with written/spoken English or Hindi. A bridge is needed to translate spoken/written language to ISL animations/video, and physical ISL gestures to spoken/written language.

## Proposed Solution
A system with two main components:
1. **Text/Speech to ISL (English/Hindi → ISL):** Converts text or speech into an animated 3D avatar or video sequence representing ISL.
2. **ISL to Text/Speech (ISL → English/Hindi):** Uses camera input to track hand and body landmarks (via MediaPipe), classifies the gestures using ML models, and outputs English/Hindi text/speech.

## MVP
The Minimum Viable Product (MVP) will feature:
- A controlled dictionary of 30-50 common conversational signs/words (subject to dataset and model validation).
- English/Hindi Text to ISL Avatar translation.
- ISL Camera Gesture to English/Hindi Text translation.
- Basic conversational UI where both translations can happen sequentially.

## Phase 2
- Expanding the vocabulary.
- Audio input (Speech-to-Text).
- Audio output (Text-to-Speech).
- Better NLP integration for complex sentence restructuring.
- Transitioning to a mobile app if the MVP is web-based.

## Future Scope
- Unrestricted continuous signing recognition.
- Multimodal recognition (facial expressions, body pose).
- Advanced context-aware translation.
- Dialectal variations in ISL.
