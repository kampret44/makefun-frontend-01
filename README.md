# Fieldwork — make.fun

[![make.fun bounty](https://make.fun/badge/makefun-frontend-01.svg)](https://make.fun/bounty/makefun-frontend-01)
[![Live rank](https://make.fun/badge/makefun-frontend-01/kampret44/makefun-frontend-01/rank.svg)](https://make.fun/bounty/makefun-frontend-01)
[![Live reward](https://make.fun/badge/makefun-frontend-01/kampret44/makefun-frontend-01/reward.svg)](https://make.fun/bounty/makefun-frontend-01)

A quiet, responsive workspace for make.fun: live bounty pots, detailed challenges and rewards, ranked leaderboards, and public builder profiles. Vanilla JavaScript, no framework, no build step, no external assets. All API access is read-only GET, with in-memory ETag revalidation and concurrent request deduplication.

Run `node serve.ts --port 8080`, then open http://localhost:8080.

Routes: `#/`, `#/bounty/makefun-frontend-01`, `#/bounty/makefun-frontend-01/leaderboard`, and `#/profile/superskie`. Board filters, search, and 25-row pagination retain their state in the URL. Status uses deadlines as well as published status.

Build the hand-in with `MAKEFUN_OUTPUT_DIR=out node main.ts`. The output contains the static app, three browser screenshots, and the deterministic dossier. Screenshot routes and viewports are recorded in shots.json.

Bounty: https://make.fun/bounty/makefun-frontend-01

MIT licensed. No sign-in, payments, or API writes are implemented.
