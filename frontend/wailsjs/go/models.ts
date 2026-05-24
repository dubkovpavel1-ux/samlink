export namespace main {
	
	export class SystemInfo {
	    CPUName: string;
	    Cores: number;
	    LogicalCores: number;
	    CPUUsage: number;
	    CPUFreq: number;
	    GPUName: string;
	    GPUMemoryTotal: number;
	    RAMUsed: number;
	    RAMTotal: number;
	    DiskFreeGB: number;
	    DiskTotalGB: number;
	    WinVersion: string;
	    Hostname: string;
	    Uptime: string;
	
	    static createFrom(source: any = {}) {
	        return new SystemInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.CPUName = source["CPUName"];
	        this.Cores = source["Cores"];
	        this.LogicalCores = source["LogicalCores"];
	        this.CPUUsage = source["CPUUsage"];
	        this.CPUFreq = source["CPUFreq"];
	        this.GPUName = source["GPUName"];
	        this.GPUMemoryTotal = source["GPUMemoryTotal"];
	        this.RAMUsed = source["RAMUsed"];
	        this.RAMTotal = source["RAMTotal"];
	        this.DiskFreeGB = source["DiskFreeGB"];
	        this.DiskTotalGB = source["DiskTotalGB"];
	        this.WinVersion = source["WinVersion"];
	        this.Hostname = source["Hostname"];
	        this.Uptime = source["Uptime"];
	    }
	}
	export class UpdateInfo {
	    Available: boolean;
	    LatestVersion: string;
	    CurrentVersion: string;
	    DownloadURL: string;
	    ReleaseNotes: string;
	
	    static createFrom(source: any = {}) {
	        return new UpdateInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Available = source["Available"];
	        this.LatestVersion = source["LatestVersion"];
	        this.CurrentVersion = source["CurrentVersion"];
	        this.DownloadURL = source["DownloadURL"];
	        this.ReleaseNotes = source["ReleaseNotes"];
	    }
	}

}

