# Damascus UI

> The signature terminal-centric desktop UI for **Damascus OS** — a customizable,
> science-fiction interface for hackers.

Damascus UI is the interim graphical environment for [Damascus OS](https://github.com/Deadmafiya/damascus),
an Arch-based distribution focused on hacking and security work. It pairs a full
terminal with live system telemetry in a sci-fi shell that boots straight into the
action.

![License](https://img.shields.io/github/license/Deadmafiya/damascus-TUI)

## Features

- **Full terminal emulator** — tabs, colors, mouse, and `curses` apps, backed by a real PTY.
- **Short, clean prompt** — the shell shows a short path + `$`; your `user@host` sits
  above the terminal tabs.
- **Live system telemetry** — CPU and GPU usage as crisp text readouts, plus memory,
  process, and network panels.
- **Wide filesystem viewer** — follows the terminal's working directory, stretched
  full-width.
- **Matrix display** — a `cmatrix` panel for the ambience.
- **12-hour clock** and the themed, framed sci-fi panel aesthetic.
- **Sound effects** — keystroke and UI audio for the full hacker-desk feel.

## Status

This is the **v0.9 interim UI** for Damascus OS. It is an Electron application,
bundled into the Damascus live ISO so the system boots directly into it. A lighter,
faster rebuild is planned for the v1.0 line of Damascus OS.

## Building

Damascus UI targets a 2021-era Electron/Node toolchain, so building on a modern
system needs a few specific steps (older Node, a modern `node-gyp`, and an
ABI-correct `node-pty`). The full, reproducible procedure lives in
**[BUILD.md](./BUILD.md)**.

Quick start once built:

```bash
PATH="/path/to/node-v16/bin:$PATH" npm start
```

## Customizations

Damascus UI tailors the base experience for Damascus OS:

| Area | Change |
|------|--------|
| Branding | Renamed to **Damascus UI** (product name, window title) |
| Prompt | Short-path `$` prompt; `user@host` label moved above the tabs |
| Layout | On-screen keyboard removed; filesystem widened to full width |
| Globe | Replaced with a `cmatrix` matrix-rain panel |
| Clock | 12-hour format |
| CPU panel | Live graph replaced with side-by-side **CPU / GPU** text readouts |
| Shell | `damascus.bashrc` restores the system PATH and sets the prompt |

## License

Damascus UI is released under the **GNU General Public License v3.0**. See
[LICENSE](./LICENSE).

## Credits

Damascus UI is **inspired by [eDEX-UI](https://github.com/GitSquared/edex-ui)** by
Gabriel "GitSquared" Saillard and contributors — a science-fiction terminal emulator
that pioneered this look and feel. eDEX-UI was archived in 2021; Damascus UI carries
its spirit forward, customized for Damascus OS. As required by the GPL-3.0, the
upstream copyright and attribution are preserved (see [NOTICE](./NOTICE)).
