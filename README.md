# gestalt-planning

**Top-down planning skills for whole-system thinkers.**

Five Claude Code skills that guide you from "I have an idea" to "I have an implementation-ready plan" — without writing a line of code. Designed for gestalt learners: people who need to see the whole system before the parts make sense.

## Philosophy

All five skills share one thread: **you process top-down, whole before parts.**

- A wrong diagram beats no diagram.
- A concrete candidate beats an open question.
- A complete miniature beats a half-finished backend.

These are all planning skills — none write code. You take their outputs into Plan Mode to build.

## Skills

| Layer | Skill | What it does |
|-------|-------|-------------|
| 1 | `/system-shape` | Map the whole system through back-and-forth conversation. Produces `system-shape.md`. |
| 2 | `/frames` | Decompose the system shape into 4–7 architectural chunks. Updates `system-shape.md`. |
| 3 | `/invariants` | Extract the governing rules the system must always obey. Updates `system-shape.md`. |
| 4 | `/vertical-slice` | Plan the thinnest end-to-end path that proves the architecture. Produces `vertical-slice-plan.md`. |
| 5 | `/widen` | Plan the next expansion — one dimension of complexity at a time. Produces `widen-plan-{dimension}.md`. |

## Workflow example

Imagine you're building an email ingestion pipeline that classifies incoming messages and routes them to the right team.

**Layer 1 — `/system-shape`:** You say "help me think through an email ingestion system." Claude draws a rough boxes-and-arrows diagram immediately — even before you've explained much. You react: "no, the classifier is a separate service, not part of ingestion." The diagram updates. After a few rounds, the map stabilizes and gets poured into a structured `system-shape.md`.

**Layer 2 — `/frames`:** Claude reads the system shape and proposes 5 frames: Ingestion Pipeline, Classification Service, Routing Engine, Persistence Layer, Ops Surface. You notice Classification and Routing are too tangled — Claude merges them into a Decision Layer. The frames table gets added to `system-shape.md`.

**Layer 3 — `/invariants`:** Claude walks through each frame: *"What would be a silent failure in the Ingestion Pipeline?"* You realize: "if an email is partially parsed, it should never be passed to classification — ingestion is all-or-nothing." That becomes invariant #1. After 3 turns, you have 7 testable rules governing the system.

**Layer 4 — `/vertical-slice`:** Claude proposes the thinnest path: one email in, parsed, classified as "general", stored, visible on the ops surface. The plan checks every invariant (✅ or ⬜), specs the exact files, and lists what NOT to build. You take `vertical-slice-plan.md` into Plan Mode and implement.

**Layer 5 — `/widen`:** The slice works. You say "add error handling." Claude plans what happens when parsing fails, when classification times out, when storage is down — one dimension, one plan document. Then you widen again: "add the second entity type." Each step produces a focused `widen-plan-{dimension}.md`.

## Install

Open Claude Code and paste this:

> Install gestalt-planning: run `git clone https://github.com/joshuaohanlon/gestalt-planning.git ~/.claude/skills/gestalt-planning` then create symlinks for each skill directory: `ln -s ~/.claude/skills/gestalt-planning/system-shape ~/.claude/skills/gestalt-system-shape && ln -s ~/.claude/skills/gestalt-planning/frames ~/.claude/skills/gestalt-frames && ln -s ~/.claude/skills/gestalt-planning/invariants ~/.claude/skills/gestalt-invariants && ln -s ~/.claude/skills/gestalt-planning/vertical-slice ~/.claude/skills/gestalt-vertical-slice && ln -s ~/.claude/skills/gestalt-planning/widen ~/.claude/skills/gestalt-widen` then add a "gestalt-planning" section to CLAUDE.md that lists the available skills: /system-shape (Layer 1 — map the whole system), /frames (Layer 2 — decompose into architectural chunks), /invariants (Layer 3 — define governing rules), /vertical-slice (Layer 4 — plan the thinnest end-to-end path), /widen (Layer 5 — plan the next expansion). Note that these are planning skills — none write code. The user takes their outputs into Plan Mode to implement.

## Uninstall

Open Claude Code and paste this:

> Uninstall gestalt-planning: remove the 5 skill symlinks `rm ~/.claude/skills/gestalt-system-shape ~/.claude/skills/gestalt-frames ~/.claude/skills/gestalt-invariants ~/.claude/skills/gestalt-vertical-slice ~/.claude/skills/gestalt-widen` then remove the repo `rm -rf ~/.claude/skills/gestalt-planning` then remove the "gestalt-planning" section from CLAUDE.md.

---

## `/system-shape` — Layer 1

**Build the whole picture before writing any code.**

You describe what you're building. Claude draws a diagram immediately — even from a single sentence. A wrong map you can correct is better than a blank canvas you have to describe from scratch.

- **Always draws first** — your first response always includes a boxes-and-arrows diagram
- **3 questions per turn max** — you process by reacting to a whole, not answering a questionnaire
- **Boxes are nouns, arrows are flows** — stays at the level of "what exists and what moves between things"
- **Template comes last** — freeform diagrams during iteration, structured template only after the map stabilizes
- **Output:** `system-shape.md`

## `/frames` — Layer 2

**Decompose the whole into stable architectural chunks.**

Claude reads your system shape and acts as an architectural mirror — reflecting the system's natural joints back to you.

- **Health check first** — flags fuzzy boundaries or ambiguous regions before proposing frames
- **4–7 frames, no more, no fewer** — enough to be useful, few enough to hold in your head
- **Respects your language** — if you proposed frames, Claude evaluates them rather than starting over
- **Entity overloading detection** — flags frames that carry too many entities
- **Never silently renames** — if a rename would help, Claude explains why and asks
- **Output:** updates the Frames section of `system-shape.md`

## `/invariants` — Layer 3

**Extract the governing rules before writing any code.**

Invariants are YOUR highest-value contribution. Claude can write code. Only you can define what must always be true. This skill uses Socratic questioning to surface rules you know but haven't written down.

- **Probe → propose → confirm** — for each frame, Claude asks a targeted question, then proposes a testable invariant for you to accept, modify, or reject
- **2–3 frames per turn** — paced extraction, not a firehose
- **Distinguishes sources** — marks each invariant as "from the system shape," "from our conversation," or "my engineering judgment" (flagged explicitly)
- **Sharpens existing rules** — if you already have rules, Claude rewrites them as testable statements
- **Output:** updates the Invariants section of `system-shape.md`

## `/vertical-slice` — Layer 4

**Plan the thinnest end-to-end path that proves the architecture.**

You understand systems by seeing a complete, working miniature — not by building the backend first and hoping it all connects later. This skill plans that miniature.

- **Thinnest possible path** — one entity, one request flow, one happy path, one test
- **Rigorous invariant check** — every invariant gets ✅ (exercised) or ⬜ (not applicable). Violations block the plan.
- **Data flow as a concrete story** — actual entity names, actual field names, actual input/output shapes
- **File-level spec** — precise enough for a coding agent to implement without clarifying questions
- **"What NOT to build" section** — prevents scope creep by explicitly listing exclusions
- **Widening preview** — shows the first 2–3 dimensions to add after the slice works
- **Output:** `vertical-slice-plan.md`

## `/widen` — Layer 5

**Expand the system one dimension of complexity at a time.**

The vertical slice works. Now add error handling. Then the second entity. Then auth. Each widening step gets its own plan document — focused, reviewable, implementable independently.

- **One dimension per plan** — pushes back if you try to bundle multiple concerns
- **Stubs for dependencies** — if error handling needs an ops surface, the plan includes a minimal stub and notes the full version is planned separately
- **Cumulative invariant coverage tracking** — tracks which invariants are now exercised across all implemented steps. Flags invariants that remain ⬜ after several steps.
- **Concrete visible outcomes** — not "errors will be handled" but "a malformed email produces a visible 'failed ingestion' entry on the ops surface"
- **Output:** `widen-plan-{dimension}.md`

## License

MIT
