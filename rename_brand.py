from pathlib import Path

files = []

extensions = {".jsx", ".js", ".css", ".html", ".py"}

search_roots = [
    Path("frontend/src"),
    Path("frontend/index.html"),
    Path("backend"),
]

for root in search_roots:
    if root.is_file():
        files.append(root)
    else:
        for path in root.rglob("*"):
            if path.suffix in extensions and "venv" not in str(path):
                files.append(path)

replacements = {
    "ShanamNest": "ANAM FOUNDATION",
    "SHANAMNEST": "ANAM FOUNDATION",
    "Shanam Nest": "ANAM FOUNDATION",

    # Split logo text cases
    "Shanam<span>Nest</span>": "ANAM <span>FOUNDATION</span>",
    'Shanam<span style={{ color: "#d4537e" }}>Nest</span>':
        'ANAM <span style={{ color: "#d4537e" }}>FOUNDATION</span>',
    'Shanam<span style={{ color: "#f7a6c1" }}>Nest</span>':
        'ANAM <span style={{ color: "#f7a6c1" }}>FOUNDATION</span>',
}

changed_files = []

for file_path in files:
    text = file_path.read_text(encoding="utf-8")
    new_text = text

    for old, new in replacements.items():
        new_text = new_text.replace(old, new)

    if new_text != text:
        file_path.write_text(new_text, encoding="utf-8")
        changed_files.append(str(file_path))

if changed_files:
    print("Changed files:")
    for file_name in changed_files:
        print(file_name)
else:
    print("No brand text found.")