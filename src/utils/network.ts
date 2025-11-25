import os from "os";

export function getLocalIP(): string | null {
	const nets = os.networkInterfaces();
	let localIp: string | null = null;

	for (const name of Object.keys(nets)) {
		for (const net of nets[name]!) {
			if (net.family === "IPv4" && !net.internal) {
				localIp = net.address;
				break;
			}
		}
		if (localIp) break;
	}

	return localIp;
}
