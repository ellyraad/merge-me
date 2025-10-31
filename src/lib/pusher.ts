import PusherServer from "pusher";
import PusherClient from "pusher-js";

declare global {
	var pusherServerInstance: PusherServer | undefined;
	var pusherClientInstance: PusherClient | undefined;
}

if (!global.pusherServerInstance) {
	global.pusherServerInstance = new PusherServer({
		appId: process.env.PUSHER_APP_ID as string,
		key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY as string,
		secret: process.env.PUSHER_APP_SECRET as string,
		cluster: process.env.PUSHER_CLUSTER || "ap1",
		useTLS: true,
	});
}

if (!global.pusherClientInstance) {
	global.pusherClientInstance = new PusherClient(
		process.env.NEXT_PUBLIC_PUSHER_APP_KEY as string,
		{
			cluster: "ap1",
		},
	);
}

export const pusherServer = global.pusherServerInstance;
export const pusherClient = global.pusherClientInstance;
