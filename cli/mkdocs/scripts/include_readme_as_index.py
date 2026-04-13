# scripts/copy_reports.py
from pathlib import Path
import mkdocs_gen_files

source = Path("./README.md")

with mkdocs_gen_files.open("index.md", "wb") as f:
    f.write(source.read_bytes())
