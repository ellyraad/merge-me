import { cloudinary } from "@/lib/cloudinary";

export async function POST(req: Request) {
	try {
		const body = await req.json().catch(() => ({}));
		const publicId = body?.publicId ?? null;

		const result = await cloudinary.v2.uploader.destroy(publicId, {
			invalidate: true,
			resource_type: "image",
		});

		return new Response(JSON.stringify({ result }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (err) {
		console.error("Cloudinary delete error:", err);
		return new Response(JSON.stringify({ error: String(err) }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
