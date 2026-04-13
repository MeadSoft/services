---
name: validate-requirements
description: 'Validate requirements in a user-provided file or folder path against this repository requirement specification and OpenFastTrace-compatible structure. Use when auditing requirement quality, gate-checking pull requests, or finding malformed/duplicate requirement IDs and missing acceptance criteria.'
argument-hint: 'Path to a markdown file or folder containing requirements to validate'
user-invocable: true
---

# Validate OpenFastTrace Requirements

## Outcome
Given a user-provided file path or folder path, produce a validation report that identifies requirement-spec violations and OpenFastTrace structure issues.

## References
- Repository rules: `requirements.md`
- OpenFastTrace guidance: `openfasttrace.user-guide.md`
- Validator script: [validate_requirements.py](./scripts/validate_requirements.py)

## Full Interview Workflow
Always run this full interview before validating:
1. Ask for target path (file or folder).
2. Ask whether to include nested directories recursively (default `yes`).
3. Ask if warnings should fail validation (default `no`).
4. Ask whether to enforce strict acceptance-criteria checks (default `yes`).
5. Ask if non-Markdown files should be ignored (default `yes`).

## Procedure
1. Confirm the target path exists.
2. Run the validator script with the provided path.
3. If strict mode is enabled, pass `--strict-acceptance`.
4. If warnings should fail, pass `--warnings-as-errors`.
5. Return findings grouped by severity and include file/line context.
6. If there are failures, propose the smallest concrete edits needed to pass.

## Validation Checks Performed
- Requirement ID line exists and matches OFT-like structure: ``artifact~name~revision``.
- `artifact` uses ASCII letters.
- `name` starts with a letter and contains only letters, digits, `.`, `_`, `-` (no `..`).
- `revision` is an integer >= 0.
- Requirement ID uniqueness across the scanned scope.
- Requirement contains a non-empty description.
- If `Status:` exists, it is one of `draft`, `proposed`, `approved`.
- Requirement includes an `Acceptance Criteria` section.
- Acceptance Criteria contains at least one bullet item.
- `Covers:` and `Depends:` references, if present, use valid requirement IDs.
- Description warns when RFC 2119 keywords are missing.

## Output Contract
Report results in this order:
1. `FAILURES` (must-fix)
2. `WARNINGS` (quality risks)
3. `PASS SUMMARY` (counts)

When no issues are found, explicitly state that validation passed with zero failures.

## Notes
- This validator enforces a practical subset of OpenFastTrace authoring rules that can be checked statically.
- Semantic quality (for example, whether criteria are truly measurable) still requires human review.
