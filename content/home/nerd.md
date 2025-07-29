---
id: 3
date: '2025-07-29'
title: "notion who? i built my own job tracker"
pinned: false
---
<div style="display: flex; justify-content: center; margin-top: 1rem;">
  <img
    src="https://pbs.twimg.com/media/F-g2IU8bEAAEXgz.jpg:large"
    alt="nerd"
    style="width: 400px;"
  />
</div>

always wanted to keep track of how many applications i'm sending out. thought about using notion but it's too bloated for me. they have notion ai but it's mid can't even edit databases properly, tried so many times, never worked. could use excel but i still need a mouse for that so yeah, ngmi.


anyways i had this local folder with my latex resume running inside cursor (pretty sure i set it up last week or so). the idea was that i could tweak my projects based on the jd. then i thought, what if i just track all my applications here too?

<div style="display: flex; justify-content: center; margin-top: 1rem;">
  <img
    src="https://i.imgur.com/Cs7mn9E.png"
    alt="nerd"
    style="width: 400px;"
  />
</div>

fast forward and i’ve got 3 shell scripts written (technically 4, but using 3), with a folder structure like:

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

1. `create_application.sh` when i run this, it creates a folder for the application and drops in a copy of my main.tex file. i can make edits to tailor it for the role.

```bash
./create_application.sh "google" "software engineer"
```

2. `list_applications.sh` i use two json files: job_applications.json and application_info.json. the first one tracks everything - id, company, position, date, folder name, status, all that. when i run the script below, it lists out all the applications i’ve made so far.

```bash
./list_applications.sh
```

3. `export_applications.sh` this one’s my favorite. every application folder has its own application_info.json with extras like job url, contact person, notes, etc.

```bash
./export_applications.sh
```

this script dumps everything into a csv with s.no, company, position, date_applied, folder, notes, status, job_posting_url. and since it’s csv, i can even run analysis on it 🤓 (yes i know, i’ve gone full nerd).