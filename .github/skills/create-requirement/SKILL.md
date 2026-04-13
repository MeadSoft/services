---
name: create-requirement
description: 'Create OpenFastTrace-compatible requirements in Markdown. Use when writing new feat/req/arch/dsn items, refining vague requirements, or enforcing OFT ID, Needs/Depends/Covers, and acceptance-criteria quality checks.'
argument-hint: 'What artifact are you specifying and what outcome must be validated?'
user-invocable: true
---

# Create OpenFastTrace Requirement

## Outcome
Produce a valid OpenFastTrace (OFT) requirement item that is clear, testable, and traceable.

## When To Use
- You need a new requirement in OFT Markdown format.
- You need to convert a rough statement into a testable requirement.
- You need to ensure traceability fields (`Needs`, `Depends`, `Covers`) are complete.
- You need acceptance criteria that are measurable.

## Inputs To Collect
1. Artifact type (`feat`, `req`, `arch`, `dsn`, `impl`, `utest`, `itest`, or project-specific).
2. Unique ID name segment (for example, `invoice-validation.supported-formats`).
3. Revision number (default `1` for new requirements).
4. Status (default `draft`; allowed values: `draft`, `proposed`, `approved`).
5. Requirement description using RFC 2119 language (`MUST`, `SHOULD`, `MAY`).
6. Optional `Rationale`.
7. Optional `Comment`.
8. Optional traceability fields: `Needs`, `Depends`, `Covers`.
9. Acceptance criteria list (required for quality in this repo).

## Procedure
1. Run a full interview, do not skip questions:
   - Ask for artifact type.
   - Ask for unique ID segment.
   - Ask for revision (default to `1` if omitted).
   - Ask for status (default to `draft` if omitted).
   - Ask for a concise requirement statement.
   - Ask whether `Rationale` should be included.
   - Ask whether `Comment` should be included.
   - Ask for `Needs` artifacts.
   - Ask for `Depends` IDs.
   - Ask for `Covers` IDs.
   - Ask for at least 2 acceptance criteria.
2. Determine artifact type and build the OFT ID in this format:
   - ``artifact-type~unique-id~revision``
3. Check for likely duplicate IDs or near-duplicate requirement intent in existing requirement docs.
4. Draft the requirement body using the [template](./assets/requirement-template.md).
5. Identify the weakest or most ambiguous wording and ask follow-up questions before final output.
6. Validate quality gates:
   - ID is globally unique in the project.
   - Status is set (default `draft` when unspecified).
   - Description is explicit and testable.
   - Acceptance criteria are measurable and observable.
   - Traceability fields are present when needed.
7. Return final Markdown ready to paste into a requirements file.

## Decision Rules
- If requirement wording is vague, ask for `Rationale` before finalizing.
- If status is not provided, set `Status: draft`.
- If downstream implementation or test artifacts are expected, add `Needs`.
- If this item relies on another requirement, add `Depends`.
- If this item refines or implements a higher-level item, add `Covers`.
- If unsure between `feat` and `req`:
  - Use `feat` for user-visible capability goals.
  - Use `req` for implementable and testable requirement statements.

## Output Format
Always output a fenced Markdown block containing exactly one requirement item, followed by an "Acceptance Criteria" section.

## References
- Repo requirement guidance: `requirements.md`
- OFT style guide: `openfasttrace.user-guide.md`
