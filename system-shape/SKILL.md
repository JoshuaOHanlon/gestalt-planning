---
name: system-shape
version: 1.0.0
description: |
   Build a whole-system brief ("system shape") before writing any code. Use this skill when the user starts a new feature, service, module, or app and needs to map out the whole picture first. Trigger on phrases like "system shape", "whole-system brief", "map this out", "let's start a new feature", "help me think through X before we build it", "what does this system look like", or "build the whole picture." Also trigger when the user says "use the gestalt workflow" or "Layer 1." This skill is for the planning and brainstorming phase — the user is a top-down/gestalt learner who needs to see the whole system before the parts make sense. Do NOT write code. Produce a document.
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

# System Shape — Build the Whole Picture

The user is a gestalt learner. They understand systems top-down: whole first, then parts. Your job in this skill is to help them build a **whole-system brief** (called a "system shape") through back-and-forth conversation. No code. Just the map.

## What you're building

A single document (`system-shape.md`) that answers these questions:

1. **What is this?** — One sentence on what this feature/service/app is and why it exists.
2. **Who or what touches it?** — Actors, other services, external APIs, users, cron jobs — anything that interacts with this system.
3. **What are the main entities?** — The core objects/nouns this system cares about and how they relate.
4. **What are the boundaries?** — What is inside this system vs. outside? What does it own vs. delegate?
5. **What comes in?** — Inputs, their sources, formats, and frequency.
6. **What goes out?** — Outputs, their consumers, formats, and triggers.
7. **What must never break?** — Non-negotiable properties (these will become invariants later).
8. **What does success look like?** — How a user or operator knows it's working.

The template at `references/system-shape-template.md` provides the final document structure. Don't introduce it until the diagram has stabilized — see step 4 below.

## How to collaborate

This is a **generative, back-and-forth** process. Do not try to produce the whole document in one shot. Instead:

1. **Always draw first.** Your very first response must include a diagram — even if the user gave you almost nothing. A wrong map that the user can correct is far more useful than a blank canvas they have to describe from scratch. This is non-negotiable. If the user said one sentence, draw a rough 3-box diagram based on that sentence. If they gave you a paragraph, draw a richer one. The user is a gestalt learner — they think by reacting to a whole, not by answering questions in a void.

   If the user's initial prompt gives you enough to draw a map, draw it immediately as an ASCII or Mermaid diagram and ask: *"Does this map match the system in your head? What's missing or wrong?"*

   If the user's initial prompt is very sparse, draw your best guess at a map AND ask up to 3 clarifying questions. Never ask questions without also showing a diagram.

2. **Ask no more than 3 questions per turn.** This is a hard limit. The user processes by reacting to a whole, not by answering a questionnaire. If you have more than 3 things to ask, pick the 3 that most affect the shape of the map. The rest will surface naturally in subsequent turns.

3. **Iterate on the map.** The user will correct you, add things, remove things, re-draw boundaries. Update the diagram each time. Stay at the level of boxes and arrows — resist the pull toward components, functions, or file structures.

4. **Fill in the template sections.** Once the map stabilizes (the user says the diagram is right), switch to the template at `references/system-shape-template.md` and fill in the structured sections one at a time. The template is for the **final document**, not the brainstorming phase — use freeform diagrams during iteration, then pour the confirmed understanding into the template. For each section, propose your best understanding and ask the user to confirm or correct.

5. **Leave Frames, Invariants, and Vertical Slice sections empty.** Those are handled by separate skills. Just produce the top half of the document.

## Diagram vocabulary

Diagrams use boxes and arrows. Follow these rules:

- **Boxes are nouns** — actors, services, data stores, external systems, documents. Label them with what they ARE, not what they DO. Good: "Charter Party", "Voyage Graph", "Ops Team". Bad: "Parse emails", "Compute demurrage".
- **Arrows are flows** — data, events, requests, documents moving between boxes. Label them with what moves. Good: "fixture recap email", "structured voyage data". Bad: "step 1", "then".
- **No verbs inside boxes.** If you catch yourself writing "extract and parse" inside a box, you're describing implementation. Pull back to the noun: "Ingestion Service."

## What to avoid

- Do not write code, propose file structures, or discuss implementation details.
- Do not create a task list or backlog. You're building a map, not a plan.
- Do not fill in more than 7 items in any section. If you're listing more than 7, you're at the wrong altitude — group things up.
- Do not move on from the map until the user explicitly confirms it. Ask directly: *"Is this the whole system? Are we missing anything?"*

## Output

A `system-shape.md` file saved to the project. This document is the input for the next skills in the gestalt workflow (frames, invariants, vertical-slice).

When the user is satisfied with the system shape, let them know: *"The system shape looks solid. When you're ready, you can use the frames skill (Layer 2) to break this into architectural chunks, or the invariants skill (Layer 3) to define the rules."*
