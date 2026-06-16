class Cpuinfo {
    constructor(parentId) {
        if (!parentId) throw "Missing parameters";

        // Create initial DOM
        this.parent = document.getElementById(parentId);
        this.parent.innerHTML += `<div id="mod_cpuinfo">
        </div>`;
        this.container = document.getElementById("mod_cpuinfo");

        window.si.cpu().then(data => {
            let cpuName = data.manufacturer + data.brand;
            cpuName = cpuName.substr(0, 30);

            // Damascus UI: text-only panel — CPU + GPU usage (no smoothie graph)
            let innercontainer = document.createElement("div");
            innercontainer.setAttribute("id", "mod_cpuinfo_innercontainer");
            innercontainer.innerHTML = `<h1>CPU / GPU<i>${cpuName}</i></h1>
                <div class="mod_cpuinfo_textrows">
                    <div class="mod_cpuinfo_row">
                        <span class="mod_cpuinfo_label">CPU</span>
                        <span class="mod_cpuinfo_value" id="mod_cpuinfo_cpu">--%</span>
                    </div>
                    <div class="mod_cpuinfo_row">
                        <span class="mod_cpuinfo_label">GPU</span>
                        <span class="mod_cpuinfo_value" id="mod_cpuinfo_gpu">--%</span>
                    </div>
                </div>
                <div>
                    <div>
                        <h1>${(process.platform === "win32") ? "CORES" : "TEMP"}<br>
                        <i id="mod_cpuinfo_temp">${(process.platform === "win32") ? data.cores : "--°C"}</i></h1>
                    </div>
                    <div>
                        <h1>SPD<br>
                        <i id="mod_cpuinfo_speed_min">--GHz</i></h1>
                    </div>
                    <div>
                        <h1>MAX<br>
                        <i id="mod_cpuinfo_speed_max">--GHz</i></h1>
                    </div>
                    <div>
                        <h1>TASKS<br>
                        <i id="mod_cpuinfo_tasks">---</i></h1>
                    </div>
                </div>`;
            this.container.append(innercontainer);

            // Init updaters
            this.updatingCPUload = false;
            this.updateCPUload();
            this.updatingGPUload = false;
            this.updateGPUload();
            if (process.platform !== "win32") { this.updateCPUtemp(); }
            this.updatingCPUspeed = false;
            this.updateCPUspeed();
            this.updatingCPUtasks = false;
            this.updateCPUtasks();

            this.loadUpdater = setInterval(() => {
                this.updateCPUload();
                this.updateGPUload();
            }, 1000);
            if (process.platform !== "win32") {
                this.tempUpdater = setInterval(() => {
                    this.updateCPUtemp();
                }, 2000);
            }
            this.speedUpdater = setInterval(() => {
                this.updateCPUspeed();
            }, 1000);
            this.tasksUpdater = setInterval(() => {
                this.updateCPUtasks();
            }, 5000);
        });
    }
    updateCPUload() {
        if (this.updatingCPUload) return;
        this.updatingCPUload = true;
        window.si.currentLoad().then(data => {
            try {
                let load = Math.round(data.currentLoad);
                document.getElementById("mod_cpuinfo_cpu").innerText = `${load}%`;
            } catch(e) {
                // DOM element probably getting refreshed (new theme, etc)
            }
            this.updatingCPUload = false;
        });
    }
    updateGPUload() {
        if (this.updatingGPUload) return;
        this.updatingGPUload = true;
        window.si.graphics().then(data => {
            try {
                let gpu = "n/a";
                if (data && Array.isArray(data.controllers) && data.controllers.length) {
                    // Pick the first controller that reports utilization
                    let ctrl = data.controllers.find(c => typeof c.utilizationGpu === "number");
                    if (ctrl && typeof ctrl.utilizationGpu === "number") {
                        gpu = `${Math.round(ctrl.utilizationGpu)}%`;
                    }
                }
                document.getElementById("mod_cpuinfo_gpu").innerText = gpu;
            } catch(e) {
                // See above notice
            }
            this.updatingGPUload = false;
        }).catch(() => { this.updatingGPUload = false; });
    }
    updateCPUtemp() {
        window.si.cpuTemperature().then(data => {
            try {
                document.getElementById("mod_cpuinfo_temp").innerText = `${data.max}°C`;
            } catch(e) {
                // See above notice
            }
        });
    }
    updateCPUspeed() {
        if (this.updatingCPUspeed) return;
        this.updatingCPUspeed = true
        window.si.cpu().then(data => {
            try {
                document.getElementById("mod_cpuinfo_speed_min").innerText = `${data.speed}GHz`;
                document.getElementById("mod_cpuinfo_speed_max").innerText = `${data.speedMax}GHz`;
            } catch(e) {
                // See above notice
            }
            this.updatingCPUspeed = false;
        });
    }
    updateCPUtasks() {
        if (this.updatingCPUtasks) return;
        this.updatingCPUtasks = true;
        window.si.processes().then(data => {
            try {
                document.getElementById("mod_cpuinfo_tasks").innerText = `${data.all}`;
            } catch(e) {
                // See above notice
            }
            this.updatingCPUtasks = false;
        });
    }
}

module.exports = {
    Cpuinfo
};
