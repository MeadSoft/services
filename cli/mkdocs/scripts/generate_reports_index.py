# for mkdocs build. not intended for manual running

from pathlib import Path
import mkdocs_gen_files

REPORTS_DIR = Path("./docs/reports")

if not REPORTS_DIR.exists():
    print("No reports directory found. Skipping report index generation.")
    exit()

reports_count = sum(
    1
    for item in REPORTS_DIR.iterdir()
    if item.is_file() and item.suffix in {".html", ".md"}
)

with mkdocs_gen_files.open("reports/.pages", "w") as f:
    f.write(f"title: Requirement Tracing Reports\n")

    if reports_count == 0:
        print("No reports found. Skipping report index generation.")
        f.write("hide: true\n")
        exit()

print(f"Generating reports index for {reports_count} report(s)")
with mkdocs_gen_files.open("reports/index.md", "w") as f:
    f.write("# Reports\n\n")
    f.write("The following reports are available:\n\n")

    for report in sorted(REPORTS_DIR.iterdir()):
        if report.is_file() and report.suffix in {".html", ".md"}:
            f.write(f"- [{report.name}](./{report.name})\n")
