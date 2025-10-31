export type SwipeDirection = "left" | "right";
export type SwipeType = "LIKE" | "PASS";

export const swipeDirectionToType = (direction: SwipeDirection): SwipeType =>
	direction === "right" ? "LIKE" : "PASS";

export type SwipeResponse = {
	swipe: {
		id: string;
		type: SwipeType;
		createdAt: string;
	};
	match?: {
		id: string;
		createdAt: string;
	};
};
