#!/usr/bin/env python3
"""Validate OpenFastTrace-style requirements in markdown files.

This script performs static checks aligned with repository requirement guidance
and a practical subset of OpenFastTrace-compatible structure.
"""

from __future__ import annotations

import argparse
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, List, Optional, Sequence

ID_LINE_RE = re.compile(r"^\s*(?:>\s*)?`([^`]+)`\s*$")
ID_VALUE_RE = re.compile(r"^([A-Za-z]+)~([A-Za-z][A-Za-z0-9_.-]*)~(\d+)$")
REF_ID_RE = re.compile(r"([A-Za-z]+~[A-Za-z][A-Za-z0-9_.-]*~\d+)")
STATUS_RE = re.compile(r"^\s*Status:\s*(\S+)\s*$", re.IGNORECASE)
KEYWORD_RE = re.compile(
    r"^\s*(Rationale|Comment|Needs|Depends|Covers|Status|Tags):\s*(.*)$",
    re.IGNORECASE,
)
AC_HEADER_RE = re.compile(r"^\s*#{2,6}\s+Acceptance\s+Criteria\b", re.IGNORECASE)
BULLET_RE = re.compile(r"^\s*[-*+]\s+\S+")
RFC2119_RE = re.compile(
    r"\b(MUST(?:\s+NOT)?|SHALL(?:\s+NOT)?|SHOULD(?:\s+NOT)?|MAY|REQUIRED|RECOMMENDED|OPTIONAL)\b"
)


@dataclass
class Finding:
    severity: str
    path: Path
    line: int
    message: str


@dataclass
class RequirementItem:
    req_id: str
    path: Path
    line: int
    lines: List[str]


def iter_markdown_files(path: Path, recursive: bool) -> Iterable[Path]:
    if path.is_file():
        if path.suffix.lower() == ".md":
            yield path
        return

    pattern = "**/*.md" if recursive else "*.md"
    for file_path in sorted(path.glob(pattern)):
        if file_path.is_file():
            yield file_path


def split_items(path: Path, content: Sequence[str]) -> List[RequirementItem]:
    items: List[RequirementItem] = []
    starts: List[tuple[int, str]] = []

    for idx, line in enumerate(content, start=1):
        match = ID_LINE_RE.match(line)
        if not match:
            continue
        raw_id = match.group(1).strip()
        if "~" not in raw_id:
            continue
        starts.append((idx, raw_id))

    for i, (start_line, raw_id) in enumerate(starts):
        end_line = starts[i + 1][0] - 1 if i + 1 < len(starts) else len(content)
        block = list(content[start_line:end_line])
        items.append(
            RequirementItem(req_id=raw_id, path=path, line=start_line, lines=block)
        )

    return items


def validate_id(req_id: str) -> Optional[str]:
    match = ID_VALUE_RE.match(req_id)
    if not match:
        return "Requirement ID must match artifact~name~revision"

    _artifact, name, _revision = match.groups()
    if ".." in name:
        return "Requirement name must not contain consecutive dots"

    return None


def parse_references(lines: Sequence[str], keyword: str) -> List[str]:
    refs: List[str] = []
    in_section = False

    for line in lines:
        key_match = KEYWORD_RE.match(line)
        if key_match:
            current_key = key_match.group(1).lower()
            in_section = current_key == keyword.lower()
            text = key_match.group(2)
            refs.extend(REF_ID_RE.findall(text))
            continue

        if in_section and BULLET_RE.match(line):
            refs.extend(REF_ID_RE.findall(line))
            continue

        if (
            in_section
            and line.strip()
            and not line.startswith((" ", "\t"))
            and not BULLET_RE.match(line)
        ):
            in_section = False

    return refs


def validate_item(item: RequirementItem, strict_acceptance: bool) -> List[Finding]:
    findings: List[Finding] = []

    id_error = validate_id(item.req_id)
    if id_error:
        findings.append(Finding("ERROR", item.path, item.line, id_error))

    status_values: List[tuple[int, str]] = []
    for offset, line in enumerate(item.lines, start=item.line + 1):
        sm = STATUS_RE.match(line)
        if sm:
            status_values.append((offset, sm.group(1).strip().lower()))

    for line_no, status in status_values:
        if status not in {"draft", "proposed", "approved"}:
            findings.append(
                Finding(
                    "ERROR",
                    item.path,
                    line_no,
                    "Status must be one of: draft, proposed, approved",
                )
            )

    description_lines: List[str] = []
    for line in item.lines:
        stripped = line.strip()
        if not stripped:
            if description_lines:
                break
            continue
        if stripped.startswith("#"):
            continue
        if KEYWORD_RE.match(line):
            if description_lines:
                break
            continue
        if AC_HEADER_RE.match(line):
            break
        description_lines.append(stripped)

    if not description_lines:
        findings.append(
            Finding("ERROR", item.path, item.line, "Requirement description is missing")
        )
    else:
        merged_description = " ".join(description_lines)
        if RFC2119_RE.search(merged_description) is None:
            findings.append(
                Finding(
                    "WARNING",
                    item.path,
                    item.line,
                    "Description should include RFC 2119 keyword (MUST/SHOULD/MAY/etc.)",
                )
            )

    ac_indices = [
        idx
        for idx, line in enumerate(item.lines, start=item.line + 1)
        if AC_HEADER_RE.match(line)
    ]
    if not ac_indices:
        findings.append(
            Finding(
                "ERROR",
                item.path,
                item.line,
                "Acceptance Criteria section is missing",
            )
        )
    else:
        ac_start = ac_indices[0]
        ac_block = item.lines[ac_start - item.line :]
        has_bullet = any(BULLET_RE.match(line) for line in ac_block)
        if not has_bullet:
            findings.append(
                Finding(
                    "ERROR",
                    item.path,
                    ac_start,
                    "Acceptance Criteria must contain at least one bullet item",
                )
            )
        elif strict_acceptance:
            # Lightweight quality heuristic: each AC bullet should be specific enough.
            weak = [
                line
                for line in ac_block
                if BULLET_RE.match(line) and len(line.strip()) < 20
            ]
            for line in weak:
                findings.append(
                    Finding(
                        "WARNING",
                        item.path,
                        ac_start,
                        f"Acceptance criteria may be too vague: {line.strip()}",
                    )
                )

    for key in ("depends", "covers"):
        refs = parse_references(item.lines, key)
        for ref in refs:
            ref_error = validate_id(ref)
            if ref_error:
                findings.append(
                    Finding(
                        "ERROR",
                        item.path,
                        item.line,
                        f"{key.title()} reference '{ref}' is invalid: {ref_error}",
                    )
                )

    return findings


def main() -> int:
    parser = argparse.ArgumentParser(
        description=(
            "Validate OpenFastTrace-style requirements in a markdown file or folder."
        )
    )
    parser.add_argument("target", help="Path to a markdown file or directory")
    parser.add_argument(
        "--no-recursive",
        action="store_true",
        help="Do not recurse into nested directories when target is a folder",
    )
    parser.add_argument(
        "--strict-acceptance",
        action="store_true",
        help="Enable additional warnings for weak acceptance-criteria bullets",
    )
    parser.add_argument(
        "--warnings-as-errors",
        action="store_true",
        help="Return non-zero exit code when warnings are present",
    )
    args = parser.parse_args()

    target = Path(args.target).expanduser().resolve()
    if not target.exists():
        print(f"ERROR: Path does not exist: {target}")
        return 2

    recursive = not args.no_recursive
    files = list(iter_markdown_files(target, recursive=recursive))
    if not files:
        print("ERROR: No markdown files found to validate")
        return 2

    all_items: List[RequirementItem] = []
    findings: List[Finding] = []

    for file_path in files:
        content = file_path.read_text(encoding="utf-8").splitlines()
        all_items.extend(split_items(file_path, content))

    if not all_items:
        print("ERROR: No requirement IDs found in scanned files")
        return 2

    seen_ids: dict[str, RequirementItem] = {}
    for item in all_items:
        existing = seen_ids.get(item.req_id)
        if existing:
            findings.append(
                Finding(
                    "ERROR",
                    item.path,
                    item.line,
                    f"Duplicate requirement ID '{item.req_id}' first seen at {existing.path}:{existing.line}",
                )
            )
        else:
            seen_ids[item.req_id] = item

        findings.extend(validate_item(item, strict_acceptance=args.strict_acceptance))

    errors = [f for f in findings if f.severity == "ERROR"]
    warnings = [f for f in findings if f.severity == "WARNING"]

    print("FAILURES")
    if errors:
        for f in errors:
            print(f"- {f.path}:{f.line}: {f.message}")
    else:
        print("- None")

    print("\nWARNINGS")
    if warnings:
        for f in warnings:
            print(f"- {f.path}:{f.line}: {f.message}")
    else:
        print("- None")

    print("\nPASS SUMMARY")
    print(f"- Files scanned: {len(files)}")
    print(f"- Requirements found: {len(all_items)}")
    print(f"- Errors: {len(errors)}")
    print(f"- Warnings: {len(warnings)}")

    if errors:
        return 1
    if args.warnings_as_errors and warnings:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
