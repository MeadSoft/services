---
name: autofix-requirements
description: 'Auto-fix common requirement-format violations in a user-provided file or folder path so requirements align with this repository specification and OpenFastTrace-compatible structure. Use when fixing malformed Status fields, missing Acceptance Criteria headers, or weak boilerplate structure before validation.'
argument-hint: 'Path to a markdown file/folder to auto-fix, and whether to write changes'
user-invocable: true
---

# Auto-Fix OpenFastTrace Requirements

## Outcome
Apply safe, repeatable fixes to requirement markdown files, then produce a summary of what changed.

## References
- Repository rules: `requirements.md`
- OFT guidance: `openfasttrace.user-guide.md`
- Fixer script: `./scripts/autofix_requirements.py`
- Validator skill: `.github/skills/validate-requirements/SKILL.md`

## Full Interview Workflow
Always ask all questions before running fixes:
1. What target path should be fixed (file or folder)?
2. Recurse nested directories (default `yes`)?
3. Preview only or write changes in place (default `preview`)?
4. Also normalize malformed requirement IDs (default `no`, because this can be disruptive)?

## Procedure
1. Confirm path exists and contains markdown files.
2. Run fixer in preview mode first.
3. Show intended changes summary.
4. If user approves, rerun with write mode enabled.
5. Run validator to verify residual failures and warnings.
6. Report final status and remaining manual fixes, if any.

## Auto-Fixes Applied
- Insert `Status: draft` after requirement ID if missing.
- Normalize `Status:` values to `draft`, `proposed`, or `approved` (invalid values become `draft`).
- Add `## Acceptance Criteria` when missing.
- Add a placeholder acceptance bullet if the section has no bullets.
- Optional (`--fix-id-format`): normalize malformed requirement IDs to `artifact~name~revision`.

## Safety Rules
- Default mode is preview (`--write` not set).
- ID normalization is opt-in only.
- Do not invent business intent; use TODO placeholders where human input is required.

## Output Contract
Return:
1. Files changed (or would change)
2. Count of fixes by type
3. Next validation command to run
