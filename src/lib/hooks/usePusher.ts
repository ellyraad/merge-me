import Pusher from "pusher-js";
import { useEffect, useRef } from "react";

let pusherInstance: Pusher | null = null;

function getPusherClient() {
	if (!pusherInstance && typeof window !== "undefined") {
		pusherInstance = new Pusher(
			process.env.NEXT_PUBLIC_PUSHER_APP_KEY as string,
			{
				cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap1",
			},
		);
	}
	return pusherInstance;
}

interface UsePusherOptions<T> {
	channelName: string;
	eventName: string;
	onEvent: (data: T) => void;
	enabled?: boolean;
}

export function usePusher<T>({
	channelName,
	eventName,
	onEvent,
	enabled = true,
}: UsePusherOptions<T>) {
	const channelRef = useRef<ReturnType<Pusher["subscribe"]> | null>(null);

	useEffect(() => {
		if (!(enabled && channelName)) {
			return;
		}

		const pusher = getPusherClient();
		if (!pusher) {
			return;
		}

		const channel = pusher.subscribe(channelName);
		channelRef.current = channel;

		channel.bind(eventName, onEvent);

		return () => {
			channel.unbind(eventName, onEvent);
			channel.unsubscribe();
			channelRef.current = null;
		};
	}, [channelName, eventName, onEvent, enabled]);

	return channelRef;
}
