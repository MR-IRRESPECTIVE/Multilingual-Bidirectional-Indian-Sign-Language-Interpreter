# Development Rules

## Rule A
Never implement a feature without first checking the relevant specification (MVP Specification, Architecture).

## Rule B
Never invent APIs. Any new endpoint must be documented in a shared schema (e.g., OpenAPI/Swagger via FastAPI) before frontend consumption.

## Rule C
Never invent dataset properties. Dataset sizes, classes, and limits must be verified against actual files.

## Rule D
Never claim model accuracy without testing on a held-out validation set.

## Rule E
Never claim a repository supports a feature without inspecting the actual source code implementation (e.g., Repo 3 claimed Web-UI but folder was empty).

## Rule F
Never replace an existing working implementation without documenting why in the Decision Log.

## Rule G
Never add an external dependency (`pip install` or `npm install`) without recording why it is needed in `TECH_STACK.md`.

## Rule H
Never hardcode secrets, API keys, or database credentials. Use `.env` files.

## Rule I
Never silently change architecture. All changes must be discussed with the Lead Architect.

## Rule J
Every major architectural change must update the Decision Log.

## Rule K
If blocked, stop and document the blocker rather than inventing a messy workaround.

## Rule L
If uncertain about scope or design, ask the project owner instead of guessing.
