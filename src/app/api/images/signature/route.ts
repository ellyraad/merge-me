import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { cloudinary } from "@/lib/cloudinary";

export async function POST(req: Request) {
	const session = await auth();

	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const body: { paramsToSign: Record<string, string> } = await req.json();
	const { paramsToSign } = body;
	const signature = cloudinary.v2.utils.api_sign_request(
		paramsToSign,
		process.env.CLOUDINARY_API_SECRET as string,
	);

	return Response.json({ signature });
}
