# Changelog

## 0.2.0

- **Config system:** new `gestalt-planning-config` CLI for reading/writing `~/.gestalt-planning/config.yaml`
- **Snooze support:** declining an upgrade now snoozes with escalating backoff (24h → 48h → 7 days); new versions reset the snooze
- **Auto-upgrade:** set `auto_upgrade: true` in config to skip the prompt and upgrade automatically
- **Disable update checks:** set `update_check: false` to silence all reminders
- **Upgrade UX:** 4 options instead of 2 (upgrade, auto-upgrade, snooze, disable); vendored project copies are synced automatically
- **Faster checks:** update check interval reduced from 24h to 12h
- **README improvements:** added Troubleshooting, Upgrading, and improved Uninstalling sections
- Regenerated SKILL.md files with updated preamble instructions

## 0.1.0

- Initial release with five planning skills: system-shape, frames, invariants, vertical-slice, widen
- Setup script to register skills with Claude Code
- Auto-update checking across all skills
- Upgrade skill (gestalt-planning-upgrade) for inline updates
- SKILL.md template workflow with `bun run gen:skill-docs`
- Dev tooling: `dev:skill` watch mode, `skill:check` health dashboard, dev-setup/teardown scripts
- CI workflow for skill doc generation
