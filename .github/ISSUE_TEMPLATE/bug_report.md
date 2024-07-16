---
name: Bug report
about: Create a report to help us improve
title: ''
labels: bug
assignees: ''

---

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Platform (please complete the following information):**
 - OS: [e.g. Windows]
 - Docker Environment: [e.g. GitHub Codespaces or Local Docker]

**Additional context**
Add any other context about the problem here.

Pre-bug-report Checklist:
[] Recently ran `git pull`
[] All docker containers are running and healthy, and `db-testing` exited gracefully
[] Docker container `db` is not logging repeated error messages
[] Re-ran `docker compose up -d --build`, if current branch/feature involves a change in dependencies or Docker container update
