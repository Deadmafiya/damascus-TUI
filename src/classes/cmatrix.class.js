// Cmatrix — Damascus UI placeholder panel (replaces the eDEX location globe).
// Spawns the cmatrix binary in a pty and renders it with xterm.js, reusing the
// globe panel's DOM/CSS so the sci-fi framing is unchanged. Lightweight: one pty,
// one xterm, no websocket.
class Cmatrix {
    constructor(parentId) {
        if (!parentId) throw "Missing parameters";

        const os = require("os");
        const pty = require("node-pty");
        this.xTerm = require("xterm").Terminal;
        const {FitAddon} = require("xterm-addon-fit");

        // Reuse the globe panel's container/styling (#mod_globe) for a seamless look.
        this.parent = document.getElementById(parentId);
        this.parent.innerHTML += `<div id="mod_globe">
            <div id="mod_globe_innercontainer">
                <h1>MATRIX<i>STANDBY DISPLAY</i></h1>
                <div id="mod_cmatrix_term"></div>
            </div>
        </div>`;

        // Theme the xterm to match the active Damascus theme.
        let r = window.theme ? window.theme.r : 170;
        let g = window.theme ? window.theme.g : 207;
        let b = window.theme ? window.theme.b : 209;
        let fg = `rgb(${r},${g},${b})`;

        this.term = new this.xTerm({
            fontFamily: (window.theme && window.theme.terminal && window.theme.terminal.fontFamily) || "Fira Mono",
            fontSize: 12,
            theme: {
                background: "rgba(0,0,0,0)",
                foreground: fg,
                cursor: "rgba(0,0,0,0)"
            },
            disableStdin: true,
            cursorStyle: "bar",
            allowTransparency: true
        });

        this.fitAddon = new FitAddon();
        this.term.loadAddon(this.fitAddon);

        const os2 = os;
        // Defer open/fit/spawn until the panel actually has layout dimensions —
        // opening + fitting immediately gives a 0-size grid and cmatrix renders nothing.
        this._start = () => {
            let el = document.getElementById("mod_cmatrix_term");
            if (!el || el.clientHeight < 10) {
                // panel not laid out yet — retry shortly
                return setTimeout(this._start, 120);
            }
            this.term.open(el);
            try { this.fitAddon.fit(); } catch (e) { /* ignore */ }

            // Spawn cmatrix sized to the now-real xterm grid.
            this.tty = pty.spawn("cmatrix", ["-b", "-u", "4"], {
                name: "xterm-256color",
                cols: this.term.cols || 40,
                rows: this.term.rows || 18,
                cwd: os2.homedir(),
                env: Object.assign({}, process.env, {TERM: "xterm-256color"})
            });
            this.tty.onData(data => {
                try { this.term.write(data); } catch (e) { /* term disposed */ }
            });
        };
        setTimeout(this._start, 200);

        // Keep cmatrix sized to the panel on window resize.
        this._onResize = () => {
            try {
                this.fitAddon.fit();
                if (this.tty) this.tty.resize(this.term.cols, this.term.rows);
            } catch (e) { /* ignore transient resize errors */ }
        };
        window.addEventListener("resize", this._onResize);
    }

    dispose() {
        try { window.removeEventListener("resize", this._onResize); } catch (e) {}
        try { this.tty.kill(); } catch (e) {}
        try { this.term.dispose(); } catch (e) {}
    }
}

module.exports = {
    Cmatrix
};
