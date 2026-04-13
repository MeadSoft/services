#!/usr/bin/env python3
"""Auto-fix common OpenFastTrace-style requirement markdown issues.

Safe-by-default behavior:
- Preview mode unless --write is provided.
- No ID normalization unless --fix-id-format is provided.
"""

from __future__ import annotations

import argparse
import re
import sys
from collections import Counter
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, List, Tuple

ID_LINE_RE = re.compile(r"^(\s*(?:>\s*)?`)([^`]+)(`\s*)$")
STATUS_RE = re.compile(r"^\s*Status:\s*(\S+)\s*$", re.IGNORECASE)
AC_HEADER_RE = re.compile(r"^\s*#{2,6}\s+Acceptance\s+Criteria\b", re.IGNORECASE)
BULLET_RE = re.compile(r"^\s*[-*+]\s+\S+")
ID_VALUE_RE = re.compile(r"^([A-Za-z]+)~([A-Za-z][A-Za-z0-9_.-]*)~(\d+)$")


@dataclass
class FixResult:
    changed: bool
    lines: List[str]
    counts: Counter[str]


def iter_markdown_files(path: Path, recursive: bool) -> Iterable[Path]:
    if path.is_file():
        if path.suffix.lower() == ".md":
            yield path
        return

    pattern = "**/*.md" if recursive else "*.md"
    for p in sorted(path.glob(pattern)):
        if p.is_file():
            yield p


def find_item_starts(lines: List[str]) -> List[int]:
    starts: List[int] = []
    for i, line in enumerate(lines):
        if ID_LINE_RE.match(line):
            starts.append(i)
    return starts


def normalize_status(value: str) -> str:
    value = value.strip().lower()
    if value in {"draft", "proposed", "approved"}:
        return value
    return "draft"


def normalize_id(raw_id: str) -> str:
    if ID_VALUE_RE.match(raw_id):
        artifact, name, revision = raw_id.split("~")
        return f"{artifact.lower()}~{name}~{revision}"

    parts = [p.strip() for p in raw_id.split("~")]
    artifact = parts[0] if len(parts) > 0 else "req"
    name = parts[1] if len(parts) > 1 else "auto.generated"
    revision = parts[2] if len(parts) > 2 else "1"

    artifact = re.sub(r"[^A-Za-z]", "", artifact).lower() or "req"

    name = name.replace(" ", "-")
    name = re.sub(r"[^A-Za-z0-9_.-]", "-", name)
    name = re.sub(r"-+", "-", name)
    name = re.sub(r"\.{2,}", ".", name)
    if not name or not name[0].isalpha():
        name = f"id-{name or 'auto-generated'}"

    revision_digits = re.sub(r"[^0-9]", "", revision)
    revision = revision_digits if revision_digits else "1"

    return f"{artifact}~{name}~{revision}"


def fix_item_block(block: List[str], fix_id_format: bool) -> FixResult:
    lines = list(block)
    counts: Counter[str] = Counter()

    # Optional ID normalization.
    id_match = ID_LINE_RE.match(lines[0])
    if id_match and fix_id_format:
        prefix, raw_id, suffix = id_match.groups()
        normalized = normalize_id(raw_id.strip())
        if normalized != raw_id.strip():
            lines[0] = f"{prefix}{normalized}{suffix}"
            counts["id_normalized"] += 1

    # Status normalization/addition.
    status_indexes: List[int] = [i for i, ln in enumerate(lines) if STATUS_RE.match(ln)]
    if not status_indexes:
        insert_at = 1
        lines.insert(insert_at, "Status: draft")
        counts["status_added"] += 1
        if len(lines) <= insert_at + 1 or lines[insert_at + 1].strip() != "":
            lines.insert(insert_at + 1, "")
    else:
        primary = status_indexes[0]
        sm = STATUS_RE.match(lines[primary])
        assert sm is not None
        normalized_status = normalize_status(sm.group(1))
        rewritten = f"Status: {normalized_status}"
        if lines[primary] != rewritten:
            lines[primary] = rewritten
            counts["status_normalized"] += 1

        # Remove duplicate status lines after the first one.
        for idx in reversed(status_indexes[1:]):
            del lines[idx]
            counts["status_duplicate_removed"] += 1

    # Acceptance Criteria section/add bullets.
    ac_idx = next((i for i, ln in enumerate(lines) if AC_HEADER_RE.match(ln)), -1)
    if ac_idx == -1:
        if lines and lines[-1].strip() != "":
            lines.append("")
        lines.append("## Acceptance Criteria")
        lines.append("- TODO: define measurable and testable acceptance criteria")
        counts["acceptance_section_added"] += 1
    else:
        tail = lines[ac_idx + 1 :]
        has_bullet = any(BULLET_RE.match(ln) for ln in tail)
        if not has_bullet:
            lines.insert(
                ac_idx + 1, "- TODO: define measurable and testable acceptance criteria"
            )
            counts["acceptance_bullet_added"] += 1

    return FixResult(changed=(counts.total() > 0), lines=lines, counts=counts)


def fix_file(path: Path, fix_id_format: bool) -> Tuple[bool, List[str], Counter[str]]:
    original = path.read_text(encoding="utf-8").splitlines()
    starts = find_item_starts(original)
    if not starts:
        return False, original, Counter()

    output: List[str] = []
    file_counts: Counter[str] = Counter()
    output.extend(original[: starts[0]])

    for idx, start in enumerate(starts):
        end = starts[idx + 1] if idx + 1 < len(starts) else len(original)
        block = original[start:end]
        result = fix_item_block(block, fix_id_format=fix_id_format)
        output.extend(result.lines)
        file_counts.update(result.counts)

    changed = output != original
    return changed, output, file_counts


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Auto-fix common OpenFastTrace requirement markdown issues"
    )
    parser.add_argument("target", help="Path to markdown file or directory")
    parser.add_argument(
        "--no-recursive",
        action="store_true",
        help="Do not recurse into nested directories when target is a folder",
    )
    parser.add_argument(
        "--write",
        action="store_true",
        help="Write fixes in place (default is preview mode)",
    )
    parser.add_argument(
        "--fix-id-format",
        action="store_true",
        help="Normalize malformed IDs to artifact~name~revision",
    )
    args = parser.parse_args()

    target = Path(args.target).expanduser().resolve()
    if not target.exists():
        print(f"ERROR: Path does not exist: {target}")
        return 2

    files = list(iter_markdown_files(target, recursive=not args.no_recursive))
    if not files:
        print("ERROR: No markdown files found")
        return 2

    totals: Counter[str] = Counter()
    changed_files: List[Path] = []

    for path in files:
        changed, updated_lines, counts = fix_file(
            path, fix_id_format=args.fix_id_format
        )
        if changed:
            changed_files.append(path)
            totals.update(counts)
            if args.write:
                path.write_text("\n".join(updated_lines) + "\n", encoding="utf-8")

    mode = "APPLIED" if args.write else "PREVIEW"
    print(f"{mode} RESULTS")
    if not changed_files:
        print("- No changes needed")
    else:
        for p in changed_files:
            print(f"- {p}")

    print("\nFIX COUNTS")
    if totals:
        for key, value in sorted(totals.items()):
            print(f"- {key}: {value}")
    else:
        print("- none")

    print("\nNEXT")
    print(
        "- Run validator: ./.github/skills/validate-openfasttrace-requirements/scripts/validate_requirements.py <path>"
    )

    return 0


if __name__ == "__main__":
    sys.exit(main())
