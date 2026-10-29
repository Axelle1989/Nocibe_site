#!/usr/bin/env python3
import subprocess
import sys
import os

def run(cmd, check=True):
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if check and res.returncode != 0:
        print(f"Error running: {' '.join(cmd)}\nStdout: {res.stdout}\nStderr: {res.stderr}", file=sys.stderr)
        sys.exit(res.returncode)
    return res

def get_message(file_path, status):
    base = os.path.basename(file_path)
    action = "remove" if "D" in status else ("update" if "M" in status else "add")
    
    if file_path.startswith("docs/"):
        return f"docs: {action} {base}"
    elif file_path.startswith("public/images/") or file_path.startswith("public/videos/"):
        return f"assets: {action} {base}"
    elif file_path.startswith("server/prisma/"):
        return f"db: {action} {base}"
    elif file_path.startswith("server/src/routes/"):
        return f"feat(api): {action} route {base}"
    elif file_path.startswith("server/src/"):
        return f"feat(server): {action} {base}"
    elif file_path.startswith("server/"):
        return f"chore(server): {action} {base}"
    elif file_path.startswith("src/components/"):
        return f"feat(ui): {action} component {base}"
    elif file_path.startswith("src/pages/"):
        return f"feat(pages): {action} page {base}"
    elif file_path.startswith("src/context/"):
        return f"feat(context): {action} {base}"
    elif file_path.startswith("src/hooks/"):
        return f"feat(hooks): {action} {base}"
    elif file_path.startswith("src/data/"):
        return f"data: {action} {base}"
    elif file_path.startswith("src/lib/") or file_path.startswith("src/types/"):
        return f"feat(lib): {action} {base}"
    elif file_path.startswith("scripts/"):
        return f"chore(scripts): {action} {base}"
    elif file_path in ["package.json", "package-lock.json", "tsconfig.json", "vite.config.ts", "netlify.toml", "vercel.json"]:
        return f"chore(config): {action} {base}"
    else:
        return f"chore: {action} {base}"

def main():
    status_res = run(["git", "status", "--porcelain", "-uall"])
    lines = [l for l in status_res.stdout.splitlines() if l.strip()]
    
    files_to_commit = []
    for line in lines:
        status = line[:2]
        file_path = line[3:].strip()
        if file_path.startswith('"') and file_path.endswith('"'):
            file_path = file_path[1:-1]
        # Security sanity check
        if file_path.endswith(".env") or file_path == ".env" or file_path.endswith("/.env"):
            print(f"Skipping secret file: {file_path}")
            continue
        files_to_commit.append((file_path, status))
        
    total = len(files_to_commit)
    print(f"Total files to commit individually: {total}")
    
    for idx, (file_path, status) in enumerate(files_to_commit, 1):
        msg = get_message(file_path, status)
        if "D" in status and not os.path.exists(file_path):
            run(["git", "rm", "-f", file_path])
        else:
            run(["git", "add", file_path])
        run(["git", "commit", "-m", msg])
        if idx % 10 == 0 or idx == total:
            print(f"[{idx}/{total}] Committed {file_path}: {msg}")
            
    print(f"\nAll {total} files committed successfully.")
    print("Pushing to origin main...")
    push_res = run(["git", "push", "origin", "main"])
    print(push_res.stdout)
    if push_res.stderr:
        print(push_res.stderr)
    print("Push completed successfully!")

if __name__ == "__main__":
    main()
