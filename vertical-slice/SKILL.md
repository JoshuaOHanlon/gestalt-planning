---
name: vertical-slice
version: 1.0.0
description: |
   Plan the thinnest possible end-to-end slice that proves the architecture. Use this skill when the user has finished planning (system shape, frames, invariants) and wants to prepare for implementation. This skill does NOT write code — it produces a vertical slice plan document that the user takes into Plan Mode (Claude Code, Codex, etc.) to implement. Trigger on phrases like "vertical slice", "thinnest slice", "Layer 4", "plan the first path", "prove the architecture", "end-to-end slice", "prepare for coding", "plan the smallest working version", or "what should we build first." The user is a gestalt learner — they understand architecture by seeing a complete miniature, not by reading about all the parts. This skill reads system-shape.md (with frames and invariants) and produces an implementation-ready plan.
allowed-tools:
  - Read
  - Write
  - Grep
  - Glob
  - Bash
  - AskUserQuestion
---

# Vertical Slice — Plan the First Path

The user has a system shape, frames, and invariants. Now they need a plan for the thinnest end-to-end slice that proves the architecture — a plan they'll hand to a coding agent in Plan Mode to implement.

**This skill does NOT write code.** It produces a plan document (`vertical-slice-plan.md`) that is specific enough for a coding agent to implement without ambiguity.

## Why a vertical slice

The user is a gestalt learner. They understand systems by seeing a **complete, working miniature** — not by building the backend first and the frontend later. A vertical slice cuts through every frame, giving them a concrete whole to react to. But the planning and the building are separate steps — this skill handles the planning.

## What a good vertical slice includes

- **One request path** (or one event flow) — a single entry point to a single outcome
- **One entity** — the simplest core object in the domain
- **One happy path** — no error handling, no edge cases yet
- **One UI surface** (if applicable) — the minimum screen that shows the result
- **One persisted record** — proof that data flows through and is stored
- **One test** — demonstrating the contract works end-to-end

## How to collaborate

1. **Read `system-shape.md`.** Find the system shape, frames, and invariants. If any of these are missing, tell the user which layers are incomplete and suggest they fill them in first. You can proceed without frames if the user wants, but invariants are required — the coding agent needs rules to code against.

2. **Propose or evaluate the slice.** Two paths:

   **If the user asks you to propose a slice:** Choose the simplest entity and the most straightforward path through the system. Explain:
   - Which entity you're using and why it's the simplest
   - Which frames this slice will touch (and which it won't)
   - Which invariants this slice will exercise — **list every invariant and explicitly mark each as exercised ✅ or not applicable ⬜.** If the slice VIOLATES an invariant, stop and fix the slice definition before proceeding.
   - What the test will verify (one integration test that proves the contract end-to-end)
   - What the user will see when it works (the concrete, visible outcome)
   - A brief **widening preview** — the first 2–3 dimensions to add after the slice (e.g., "after this: real classification, then error handling, then the ops surface"). This helps the gestalt learner see the trajectory.

   **If the user already proposed a slice:** Do NOT discard it and propose your own. Evaluate their slice against the invariants. Check each invariant explicitly. If there's a conflict (e.g., the slice omits an entity required by an invariant), flag it and offer options — don't unilaterally override.

   **If the user asks to "build everything" or "build it end to end":** Redirect to a vertical slice. Explain why: a full build has too many moving parts to debug, and it's hard to verify the architecture until you see data flowing through one complete path. Propose a slice, and note that the full system will come through iterative widening.

3. **Confirm the slice with the user.** Since you're producing a plan (not implementing), always confirm the slice definition before writing the plan document. Ask: *"Does this feel like the right first path? Is there a simpler one I'm missing?"*

4. **Write the plan document.** Once the user confirms, produce `vertical-slice-plan.md`. This document must be specific enough that a coding agent in Plan Mode can implement it without asking clarifying questions. See the plan document structure below.

## Plan document structure

The plan document (`vertical-slice-plan.md`) has these sections:

### Summary
One sentence: what this slice does, end to end.

### Data flow narrative
Walk through the slice as a concrete story — actual entity names, actual field names, actual input/output shapes. Not "a request enters the system" but "a POST to `/api/ingest` with `{ emailId, rawBody, sender }` hits a webhook handler."

The narrative should read as a complete story with beginning, middle, and end:
- Where data enters and in what shape
- What happens at each frame
- What gets created/persisted and where
- What the user can query/see to confirm it worked

### Frames touched
List each frame the slice passes through. For each frame, describe in one sentence what the slice needs from that frame — not the full frame implementation, just what this one path requires.

### Invariant checklist
List every invariant from system-shape.md. For each:
- ✅ **Exercised** — describe HOW the implementation must satisfy it
- ⬜ **Not applicable** — explain why this slice doesn't touch it

If any invariant would be VIOLATED by this slice, the plan is wrong — go back and fix the slice definition.

### File-level spec
For each file the coding agent needs to create or modify, specify:
- **File path** — where it goes in the project
- **Purpose** — what this file does in one sentence
- **Key details** — inputs, outputs, data shapes, important logic. Be specific enough that the coding agent doesn't have to guess.

Keep this minimal — only the files this slice needs. Don't spec files for future widening steps.

### Test specification
Describe the integration test:
- What it sets up (test data, fixtures)
- What action it performs (the request/event that triggers the slice)
- What it asserts (specific checks on persisted state, response shape, invariant compliance)

### What NOT to build
Explicitly list things the coding agent should NOT implement in this slice. This prevents scope creep:
- No error handling (widening step)
- No auth (widening step)
- No UI (unless the slice requires it)
- No abstractions or generic frameworks
- List any specific frames/features that are explicitly out of scope

### Widening preview
The first 2–3 dimensions to add after this slice works. One sentence each.

## What to avoid

- **Do not write code.** Produce a plan document, not an implementation. The user takes this into Plan Mode.
- **Do not spec the whole system.** Only spec what this one path needs.
- **Do not add error handling, auth, retries, or observability to the spec.** Those are widening steps (Layer 5). The slice is the happy path only.
- **Do not over-spec.** No generic base classes, no plugin systems, no configuration frameworks. Spec the simplest implementation that serves this one path.
- **Do not violate invariants.** Even in a minimal slice plan. If an invariant says "all writes are traceable," the spec must include traceability. Invariants apply from the first line of the plan.

## Output

A `vertical-slice-plan.md` file saved to the project. Also update the **Vertical Slice Plan** section of `system-shape.md` with a summary:

- **The slice:** [one-sentence description of the path]
- **Frames touched:** [list]
- **Invariants exercised:** [list with ✅/⬜]
- **What the user sees:** [concrete outcome]
- **Plan document:** `vertical-slice-plan.md`

When done, let the user know: *"The vertical slice plan is ready. Take `vertical-slice-plan.md` into Plan Mode to implement. When you're ready to add complexity after that, use the widen skill (Layer 5) to plan the next dimension."*
