---
name: frames
version: 1.0.0
description: |
   Break a system shape into 4–7 meaningful architectural frames (chunks). Use this skill when the user has a system shape document and wants to decompose it into coherent regions for implementation. Trigger on phrases like "break this into frames", "chunk this up", "Layer 2", "architectural frames", "what are the main parts", "how should I structure this", "critique the architecture", or "act as an architectural mirror." The user is a gestalt learner — they need meaningful chunks (architectural regions), not atomized task lists. This skill reads an existing system-shape.md and proposes how to decompose it.
allowed-tools:
  - Read
  - Write
  - Grep
  - Glob
  - Bash
  - AskUserQuestion
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->

## Update Check (run first)

```bash
_UPD=$(~/.claude/skills/gestalt-planning/bin/gestalt-planning-update-check 2>/dev/null || .claude/skills/gestalt-planning/bin/gestalt-planning-update-check 2>/dev/null || true)
[ -n "$_UPD" ] && echo "$_UPD" || true
```

If output shows `UPGRADE_AVAILABLE <old> <new>`: read `~/.claude/skills/gestalt-planning/gestalt-planning-upgrade/SKILL.md` and follow the "Inline upgrade flow" (AskUserQuestion → upgrade if yes, `touch ~/.gestalt-planning/last-update-check` if no). If `JUST_UPGRADED <from> <to>`: tell user "Running gestalt-planning v{to} (just updated!)" and continue.

# Frames — Turn the Whole into Stable Chunks

The user has a system shape document (from the system-shape skill or written by hand). Your job is to decompose it into **4–7 meaningful architectural frames** — coherent regions of the system that the user can hold in their head as units.

## What a frame is

A frame is a **noun that describes a region of the system**. It is not a task or a verb.

Good frames:
- Domain model
- API contract
- Persistence layer
- Async jobs / event processing
- UI flow
- Observability / telemetry
- Rollout / testing strategy
- Auth boundary
- Ingestion pipeline
- Notification system

Bad frames (these are tasks, not regions):
- Write validator
- Add route
- Write tests
- Refactor db
- Update schema
- Fix error handling

The difference matters because the user is a gestalt learner. Tasks fragment the whole. Frames preserve it — each frame is a meaningful piece that still connects to the bigger picture.

## How to collaborate

You are acting as an **architectural mirror**. Your job is to reflect the system's structure back to the user so they can see it, critique it, and refine it.

1. **Read the system shape and do a health check.** Find `system-shape.md` in the project. Before proposing any frames, briefly note what you see:
   - What's clean and well-defined in the map?
   - Are there any fuzzy boundaries, ambiguous regions, or entities that seem to straddle two areas?
   - Does anything in the system shape make framing hard?

   Share this assessment with the user in 2–3 sentences. If there's a real issue (e.g., a boundary that's unclear), flag it before framing — it's easier to fix the map than to force bad frames. If the map is solid, say so and move on.

   If `system-shape.md` doesn't exist, ask the user for context or suggest they use the system-shape skill first.

2. **Propose or evaluate frames.** Two paths depending on what the user gives you:

   **If the user asks you to propose frames:** Propose 4–7 frames. For each frame, provide:
   - A name (2–3 words, a noun phrase)
   - A one-line description of what it covers
   - Which entities from the system shape live here
   - Which other frames it connects to and how

   **If the user already proposed frames:** Do NOT discard them and start over. Evaluate their frames against the system shape. For each frame, check: does it map to a coherent region? Are there entities or flows that don't have a home in any frame? Is anything awkwardly split? Propose adjustments, additions, or merges — but start from the user's language and structure. If you want to rename a frame, say so explicitly and explain why. Do not silently rename.

3. **Show the frame relationships.** Draw a simple diagram or table showing how the frames connect — what flows between them, what depends on what. This helps the user see whether the decomposition preserves the whole.

4. **Ask the user to react.** Pick the 2–3 most useful questions from:
   - *"Do these frames match the natural joints of the system?"*
   - *"Is anything awkwardly split across two frames?"*
   - *"Is anything missing — a region that doesn't belong to any frame?"*
   - *"Are any of these frames too big? Should they split?"*

   Be specific — point at the frame you're least confident about rather than asking generically.

5. **Iterate until the user confirms.** Adjust frames based on feedback. The right decomposition is the one where the user feels each frame is a coherent unit they can think about independently.

## Constraints

- **Exactly 4–7 frames.** Fewer than 4 means the chunks are too big to work with. More than 7 means you've fragmented the whole. If you're stuck at 8+, look for frames that should merge.
- **No implementation details.** Don't propose file structures, module names, or technology choices. Stay at the architectural level.
- **Every entity must belong to exactly one frame.** If an entity spans two frames, that's a signal the frame boundaries need adjustment. Shared/cross-cutting concerns (like auth or logging) can be called out explicitly as cross-cutting rather than forced into a single frame.
- **Watch for entity overloading.** If one frame owns significantly more entities than the others (e.g., 5 entities vs 1 each), that frame is probably doing too much. Consider whether it's actually two frames merged together. Flag this to the user: *"This frame is carrying most of the entities — should we split it?"*

## Output

Update the **Frames** section of `system-shape.md` with the confirmed frames:

| # | Frame | What it covers | Key entities | Connects to |
|---|-------|---------------|--------------|-------------|
| 1 | | | | |

When done, let the user know: *"Frames are set. You can use the invariants skill (Layer 3) to define the rules these frames must obey, or jump to the vertical-slice skill (Layer 4) if you already know your constraints."*
