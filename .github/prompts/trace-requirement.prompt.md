---
name: "Trace Requirement"
description: "Find code for a requirement and add a label for implementation, unit-test, or integration-test to trace the requirement in the codebase."
argument-hint: "Requirement ID + specification item type (implementation|unit-test|integration-test), for example: requirement~ledes-file.supported-format.1998b~1 implementation"
tools: ["search/codebase", "vscode/askQuestions"]
agent: "agent"
---

Given a requirement ID, locate its implementation in the current workspace and add the OpenFastTrace implementation label as a code comment directly above the implementing class or function.

Inputs:

- Requirement ID from the user (required) in the format `requirement\~<name>\~<revision>`.
- Trace specification item type from the user (required): `implementation`, `unit-test`, or `integration-test`.

Task:

1. Find the requirement text and acceptance criteria for the provided requirement ID.
2. Search the codebase for the code target matching the selected specification item type:
    - `implementation`: production implementation (class or function that enforces behavior)
    - `unit-test`: unit test validating the behavior
    - `integration-test`: integration test validating end-to-end behavior
3. Add a comment immediately above the chosen class or function that includes the label for the selected type. The label MUST follow the label format specified below and include the requirement ID.

Search rules:

- Do not search caches (e.g., .git, .angular)
- Do not search build artifacts (e.g., dist, build, target)
- Do not search dependency directories (e.g., node_modules, vendor)

Label rules:

- Comment style must match the language file style (for example, `//` in Java/TypeScript, `#` in Python).
- If the same label already exists on that class/function, do not duplicate it.

Decision rules:

- Check all source code, tests, and SQL migration scripts.
- Add labels to all plausible code targets if multiple are found.
- If no implementation is found, do not guess; report what was searched and what is missing.

Label format:

- Expected format: `[implementation|unit-test|integration-test->requirement~<name>~<revision>]`
    - name and revision should match the input requirement ID

Quality constraints:

- Preserve existing coding style and formatting.
- Do not modify requirement IDs in requirement documents unless explicitly requested.
