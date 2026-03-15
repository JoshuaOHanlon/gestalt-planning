---
name: invariants
version: 1.0.0
description: |
   Define the invariants (governing rules) a system must always obey before implementation begins. Use this skill when the user wants to articulate system constraints, rules, or non-negotiable properties. Trigger on phrases like "define invariants", "what are the rules", "Layer 3", "system constraints", "what must never break", "governing principles", "define the contracts", or "what are the hard rules." Also trigger when the user says things like "before we start coding, what are the rules?" This skill uses Socratic questioning to extract constraints the user already knows but hasn't written down. The user is a gestalt learner — invariants are their highest-value contribution to the human-agent collaboration.
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

If output shows `UPGRADE_AVAILABLE <old> <new>`: read `~/.claude/skills/gestalt-planning/gestalt-planning-upgrade/SKILL.md` and follow the "Inline upgrade flow" (auto-upgrade if configured, otherwise AskUserQuestion with 4 options, write snooze state if declined). If `JUST_UPGRADED <from> <to>`: tell user "Running gestalt-planning v{to} (just updated!)" and continue.

# Invariants — Define the Governing Rules

The user knows rules that the system must obey. Many of these rules are in their head but not written down. Your job is to **extract** them through conversation — not to invent them. Invariants are the user's highest-value contribution to this collaboration. You can write lots of code. Only the user can define what must always be true.

## What an invariant is

An invariant is a property of **this specific system** that must hold at all times, across all code paths. Violating an invariant is always a bug, never a tradeoff.

Invariants are different from general engineering best practices. "All external calls have timeouts" is a best practice. "All calls to the AgentMail webhook API have a 30-second timeout because a stalled webhook blocks the entire ingestion pipeline" is an invariant — it's specific to this system, it explains WHY, and you could write a test for it. A best practice might become an invariant if the user confirms it's a hard rule for this system, but don't assume.

Good invariants — specific to this system, testable, governing:
- Every job has an idempotency key
- All writes are traceable to a user or agent action
- API responses use one shared error envelope
- Ingestion is append-only before normalization
- UI never shows partially committed state as final
- All external calls have timeouts and retries with backoff
- No business logic in the transport layer
- Every state transition is logged with before/after

Bad invariants — vague, aspirational, untestable:
- The system should be fast
- Code should be clean
- Errors should be handled properly
- The UX should be good

## How to collaborate

This is an **extraction** process. The user has the answers — many are in their head but not written down. Your job is to surface them, sharpen them, and get confirmation. Do not generate a best-practices checklist. Extract the rules that are specific to THIS system.

### Pacing rule

Cover no more than **2–3 frames per turn**. After each batch, pause and confirm the proposed invariants before moving on. If the user asks to "hit me with everything" or wants the full list in one go, push back gently: *"Invariants need to be confirmed one by one — a list of 10 unconfirmed rules isn't useful yet. Let me work through the frames a few at a time."*

### Two paths: extraction vs. sharpening

**If the user asks you to define invariants from scratch:**

1. **Read the system shape and frames.** Find `system-shape.md` in the project. Understand the entities, boundaries, flows, and frame decomposition. If the document doesn't exist yet, ask the user for context.

2. **Start with "What Must Never Break."** The system shape already has an initial list. Sharpen each one into a testable statement — rewrite it precisely enough that you could write a test or a code review checklist item for it. Read the sharpened versions back and ask: *"Do these match what you meant? Let's confirm these, then find the ones we missed."*

3. **Walk through frames using probe → propose → confirm.** For each frame, pick the ONE question (from the types below) that's most revealing for that frame — don't cycle through all three mechanically:
   - *"What would be a silent, hard-to-debug failure in [frame]?"* (surfaces implicit invariants)
   - *"If someone unfamiliar modified this area, what mistake would they make?"* (surfaces tribal knowledge)
   - *"What does every other frame assume about [frame]?"* (surfaces interface contracts)

   Then, based on the user's answer, **propose a candidate invariant** written as a testable statement. The user confirms, modifies, or rejects it. This is faster than open-ended questions because the user can react to a concrete rule rather than describing one from scratch.

4. **Probe cross-cutting concerns.** After frame-specific invariants are confirmed, check whether any cross-cutting rules are missing. Pick the 2–3 most relevant from:
   - **Consistency:** *"Can the system ever show data that's partially committed?"*
   - **Idempotency:** *"What happens if the same event is processed twice?"*
   - **Failure modes:** *"What happens when an external dependency is down?"*
   - **Security boundaries:** *"Who can see/do what? Where is that enforced?"*
   - **Data lifecycle:** *"Is anything append-only? Soft-deleted? Immutable?"*

   For each, propose a candidate invariant if the user's answer suggests one.

5. **Distinguish your sources.** When proposing invariants, be clear about where each one comes from:
   - **From the system shape** — something the user already stated that you're sharpening.
   - **From the conversation** — something the user just told you in response to a probe.
   - **From your engineering judgment** — something you think should be a rule but the user hasn't stated. Flag these explicitly: *"This one is my suggestion based on engineering experience, not something you've said — is it actually a hard rule for this system?"*

   Never present an invariant you invented as if the user stated it.

6. **Number them and read back the full list.** Ask: *"Is this complete? Is any rule missing? Is any rule wrong — something you'd actually want to violate sometimes?"*

**If the user already has rules they want to codify:**

Do NOT ignore their rules and run the full Socratic process. Instead:

1. **Sharpen each rule into a testable statement.** Rewrite it precisely — specific enough to test, with clear pass/fail criteria. Read the sharpened version back: *"You said [their words]. I'd write that as: [testable statement]. Does that match what you meant?"*

2. **Confirm the sharpened rules**, then probe for gaps using the frame-walking approach above. Focus on frames and cross-cutting concerns that aren't already covered by the user's rules.

## How invariants get used

These invariants govern all subsequent implementation:
- In the **vertical slice** (Layer 4), the agent checks every piece of code against this list.
- In **widening** (Layer 5), the agent checks whether new complexity requires new invariants.
- If a proposed change would violate an invariant, the agent must flag it immediately and get explicit permission before proceeding.

Make this clear to the user: these rules become the acceptance criteria for everything the agent builds.

## Output

Update the **Invariants** section of `system-shape.md` with the confirmed list:

1. [Invariant — specific, testable statement]
2. [Invariant — specific, testable statement]
3. ...

When done, let the user know: *"Invariants are locked in. These govern everything we build from here. When you're ready, use the vertical-slice skill (Layer 4) to build the first end-to-end path."*
