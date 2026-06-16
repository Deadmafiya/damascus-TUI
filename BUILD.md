# Building Damascus-TUI

Damascus-TUI is a rebranded, customized fork of [eDEX-UI](https://github.com/GitSquared/edex-ui)
(GPL-3.0) used as the interim UI for Damascus OS. See `NOTICE` for attribution.

eDEX-UI v2.2.8 targets a ~2021 toolchain (Electron 12 / Node 14). On a modern
system the native build of `node-pty` fails in three ways. This file records the
exact workarounds so the build is reproducible.

## Prerequisites

- A graphical session (it's an Electron desktop app)
- `webkit2gtk` is NOT needed (this is Electron, not Tauri)
- An **older Node** for the build — Node 16 works; Node 26 does not
- `cmatrix` installed (`pacman -S cmatrix`) — used by the matrix panel

## The three build problems (and fixes)

1. **Node 26 ABI mismatch** — `node-pty` won't compile against very new Node.
   Fix: build under **Node 16**.

2. **Python 3.14 breaks bundled node-gyp 7** (`ValueError: invalid mode: 'rU'`).
   Fix: force **node-gyp 10** for the build:
   ```bash
   npm install --no-save node-gyp@10
   export npm_config_node_gyp="$PWD/node_modules/node-gyp/bin/node-gyp.js"
   ```

3. **`openssl_fips` undefined** when compiling node-pty 0.10.1 against Electron 12
   headers with modern node-gyp.
   Fix (pragmatic): the prebuilt `pty.node` from the official eDEX-UI v2.2.8
   AppImage is ABI-correct for Electron 12 — extract and drop it in:
   ```bash
   # from the extracted AppImage's resources/app.asar:
   npx asar extract app.asar /tmp/asar-x
   cp /tmp/asar-x/node_modules/node-pty/build/Release/pty.node \
      src/node_modules/node-pty/build/Release/pty.node
   ```

## Build steps (Linux)

```bash
# 1. Use Node 16 (e.g. a local binary tarball or nvm/fnm)
export PATH="/path/to/node-v16/bin:$PATH"

# 2. Install root + src deps with modern node-gyp forced
npm install --no-save node-gyp@10
export npm_config_node_gyp="$PWD/node_modules/node-gyp/bin/node-gyp.js"
npm install
cd src && npm install && cd ..

# 3. Provide an ABI-correct pty.node (see problem 3 above), then:
npm start
```

## Run

```bash
PATH="/path/to/node-v16/bin:$PATH" npm start
```

Login prompt shows a short-path PS1; `user@host` appears above the terminal tabs.

## Damascus customizations vs upstream eDEX-UI

- Rebranded to "Damascus UI" (productName, window title) — see `NOTICE`
- Terminal prompt: short cwd + `$`; user@host label moved above the tabs
- On-screen keyboard removed; filesystem widened to full width
- Location globe replaced with a `cmatrix` panel (`src/classes/cmatrix.class.js`)
- Clock forced to 12-hour format
- CPU graph replaced with side-by-side CPU/GPU text readouts
- `src/damascus.bashrc`: restores system PATH + sets the prompt for the in-app shell
- `allowRendererProcessReuse = false` in `_boot.js` (lets the renderer load node-pty)
