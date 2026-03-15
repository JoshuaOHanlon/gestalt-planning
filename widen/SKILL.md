---
name: widen
version: 1.0.0
description: |
   Plan the next widening step for an existing vertical slice — adding one dimension of complexity at a time. Use this skill after a vertical slice is implemented and the user wants to expand the system. This skill does NOT write code — it produces a widening plan document that the user takes into Plan Mode (Claude Code, Codex, etc.) to implement. Trigger on phrases like "widen the slice", "Layer 5", "add error handling", "add the next thing", "expand this", "what should we add next", "iterate on this", "add unhappy paths", "harden this", "plan the next step", or "what's missing." The user is a gestalt learner — they need to see one new layer of complexity at a time, not a batch of changes that fragment their understanding of the whole.
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

# Widen — Plan the Next Expansion

The vertical slice is implemented and working. Now the user wants to expand the system — but one dimension at a time, and planned before built. Each widening step gets its own plan document that the user takes into Plan Mode.

**This skill does NOT write code.** It produces a plan document (`widen-plan-{dimension}.md`) specific enough for a coding agent to implement without ambiguity.

## Widening dimensions

These are the typical dimensions to add, roughly in order of priority (but the user decides the sequence):

1. **Unhappy paths / error handling** — What happens when things fail? Validation errors, not-found, upstream timeouts, malformed input.
2. **Additional entities** — Add the second core entity and its relationships to the first.
3. **Authentication / authorization** — Who can do what? Where is it enforced?
4. **Retries, timeouts, circuit breakers** — Resilience for external dependencies.
5. **Telemetry and observability** — Logging, metrics, tracing. Can you tell if the system is healthy?
6. **Additional UI states** — Loading, error, empty, partial, optimistic updates.
7. **Migrations and data evolution** — Schema changes, backfills, backwards compatibility.
8. **Edge cases and concurrency** — Race conditions, duplicate handling, ordering guarantees.
9. **Performance** — Caching, pagination, query optimization, lazy loading.
10. **Operational tooling** — Admin views, manual overrides, debugging endpoints.

## How to collaborate

1. **Read the current state.** Check `system-shape.md` for the system shape, frames, invariants, and vertical slice plan. If previous widening plans exist, read those too to understand what's already been expanded.

2. **Propose or evaluate the next dimension.** Two paths:

   **If the user asks what to add next:** Suggest the highest-priority dimension that hasn't been addressed yet. Explain:
   - What this dimension adds to the system
   - Which frames it touches
   - Which invariants it exercises (especially any marked ⬜ in the vertical slice plan that this dimension would activate)
   - Whether this dimension requires a **new invariant** — if so, propose it as a candidate for the user to confirm or reject before including it in the plan
   - **What the user will see after this dimension is implemented** — a concrete, visible outcome. The gestalt learner needs to visualize the end state before confirming. Not "errors will be handled" but "sending a malformed email produces a visible 'failed ingestion' entry on the ops surface."

   Ask: *"Does this feel like the right next layer? Or is there something more pressing?"*

   **If the user asks for a specific dimension** (e.g., "add error handling"): Evaluate whether it's the right next step. If a dependency is missing (e.g., they want auth but error handling isn't in place yet), flag it — but don't block. The user decides the order.

   **If the user asks for multiple dimensions at once** (e.g., "add error handling and auth and retries"): Push back. One dimension per plan. Explain why: each widening step should be a coherent unit the user can review as a whole. Bundling fragments the gestalt. Ask which one to plan first.

3. **Confirm the dimension and scope.** Before writing the plan, confirm:
   - Which dimension, specifically
   - Which frames are affected
   - Whether any new invariants are needed
   - What's explicitly OUT of scope for this step

4. **Write the plan document.** Once confirmed, produce `widen-plan-{dimension}.md` (e.g., `widen-plan-error-handling.md`). See plan document structure below.

## Scoping a dimension

A single dimension can touch multiple frames — that's fine. But watch for scope creep:

**If a dimension feels too large** (e.g., "error handling" spans 4 frames and introduces a new one), consider breaking it into sub-dimensions. "Error handling" might become "extraction error handling" (one plan) and "persistence error handling" (another plan). Each sub-dimension should be a coherent unit the user can review and implement independently.

**If dimension A depends on dimension B being minimally present** (e.g., error handling needs somewhere to surface failures, which means the ops surface must exist), it's OK to include a **stub** of dimension B in dimension A's plan. A stub is the minimum viable implementation of a frame — just enough for the current dimension to work. The plan should explicitly note: *"This introduces a stub of [frame]. The full [frame] dimension will be planned separately."* This prevents the plan from bloating while acknowledging real dependencies.

## Plan document structure

### Summary
One sentence: what this widening step adds and why it matters.

### Current state
Brief description of what's already implemented — the vertical slice plus any previous widening steps. This gives the coding agent context for what exists.

### What this dimension adds
Concrete description of the new behavior. Walk through specific scenarios:
- What triggers the new behavior (e.g., "extraction returns confidence below 0.7")
- What happens differently from the current happy path
- What the user/operator sees that they couldn't before

### Frames affected
List each frame that needs changes. For each:
- **What exists now** — one sentence on current implementation
- **What changes** — specific additions or modifications for this dimension
- **What stays the same** — explicitly note what should NOT be touched

### Invariant checklist
Full invariant list from system-shape.md. For each:
- ✅ **Already satisfied** — confirm the existing implementation still respects it after this change
- ✅ **Newly exercised** — this dimension activates an invariant that was ⬜ before; describe HOW
- 🆕 **New invariant** — proposed and confirmed by the user during this planning step
- ⬜ **Not applicable** — still doesn't apply

**Critical:** If this widening step would BREAK an existing invariant, stop. Either revise the plan or propose amending the invariant (with user confirmation).

### File-level spec
For each file that needs to be created or modified:
- **File path**
- **Change type** — new file, or modification to existing
- **What changes** — specific additions, not "update error handling." Be precise: what functions, what conditions, what data shapes.

### Test specification
Describe new tests for this dimension:
- What scenarios they cover (especially the new unhappy/edge cases)
- What they assert
- How they relate to existing tests (the vertical slice test must still pass)

### What NOT to change
Explicitly list what the coding agent should leave alone:
- The happy path from the vertical slice must keep working
- Other dimensions not yet addressed
- Any frames not listed in "Frames affected"

### Widening preview
After this step, what are the next 1–2 dimensions to consider?

## What to avoid

- **Do not write code.** Produce a plan document. The user takes it into Plan Mode.
- **Do not bundle multiple dimensions.** One dimension per plan document. If the user asks for three things, plan them as three separate documents.
- **Do not break the vertical slice.** The plan must preserve the existing happy path. Every plan document explicitly notes: "the vertical slice test must still pass."
- **Do not add infrastructure "for later."** Only spec what this dimension needs. If planning error handling, don't also spec a retry framework "while we're at it."
- **Do not silently add or change invariants.** If a widening step needs a new rule, propose it to the user during the planning conversation. Only include confirmed invariants in the plan document.

## When to stop widening

The system is "done" when:
- All invariants are exercised by at least one code path
- All frames have at least a basic implementation
- The user feels the system handles the important cases
- What remains is polish, not architecture

The user decides when to stop. Your job is to make each widening plan clean enough that they can stop at any point and have a coherent, working system.

## Updating the system shape

After each widening plan is written, update `system-shape.md`:
- New invariants confirmed during planning → add to the invariants list
- New entities discovered → add to core entities
- Boundary changes → update boundaries section
- Frame responsibilities shifted → update frames table
- **Invariant coverage** → update the vertical slice plan's ✅/⬜ list to reflect cumulative coverage across all widening steps. After enough widening, all invariants should be ✅. If any remain ⬜ after several steps, flag it: *"Invariant #N is still not exercised by any implemented code. Should we plan a widening step that activates it?"*

Note these updates in the plan document so the coding agent (or the user) can apply them.

## Output

A `widen-plan-{dimension}.md` file saved to the project. Also note in `system-shape.md` which widening steps have been planned and implemented.

When done, let the user know: *"The widening plan for [dimension] is ready. Take `widen-plan-{dimension}.md` into Plan Mode to implement. After that, we can plan the next dimension."*
