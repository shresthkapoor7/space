---
id: 3
date: '2025-07-29'
title: "Writing my own bash scripts to avoid using notion"
pinned: false
---

Always wanted to track how many job applications I'm sending out. Thought about Notion - too bloated. Excel - still need a mouse for that, ngmi.

<div style="display: flex; justify-content: center; margin-top: 1rem;">
  <img
    src="https://pbs.twimg.com/media/F-g2IU8bEAAEXgz.jpg:large"
    alt="nerd"
    style="width: 400px;"
  />
</div>

## The setup

I already had a local folder with my LaTeX resume running inside Cursor - the idea being I could tweak projects based on the JD. Then it clicked: why not track applications from the same place?

<div style="display: flex; justify-content: center; margin-top: 1rem;">
  <img
    src="https://i.imgur.com/Cs7mn9E.png"
    alt="folder structure"
    style="width: 400px;"
  />
</div>

Ended up with 3 shell scripts and a folder structure like this:

```
resume/
├── main.tex
├── job_applications.json
├── create_application.sh
├── list_applications.sh
├── build_resume.sh
├── applications/
│   ├── README.md
│   └── 2024-07-28_Google_Software_Engineer/
│       ├── main.tex
│       ├── application_info.json
│       └── resume.pdf
└── README.md
```

## The scripts

**`create_application.sh`** - creates a folder for the role and drops in a copy of `main.tex` to tailor.

```bash
./create_application.sh "google" "software engineer"
```

**`list_applications.sh`** - reads from `job_applications.json` and lists everything: id, company, position, date, status.

```bash
./list_applications.sh
```

**`export_applications.sh`** - my favorite. Each application folder has its own `application_info.json` with the job URL, contact, notes, etc. This dumps it all into a CSV.

```bash
./export_applications.sh
```

Output: `s.no, company, position, date_applied, folder, notes, status, job_posting_url`. Since it's CSV, you can run actual analysis on it. Yes I know, full nerd territory. No regrets.
