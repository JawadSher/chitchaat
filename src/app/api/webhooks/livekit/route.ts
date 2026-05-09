import { WebhookReceiver } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";

const reciever = new WebhookReceiver(
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!,
);
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authorization = body.get("Authorization");
    const event = reciever.receive(body, authorization);

    console.log(event);

    return NextResponse.json({ status: 200, success: true });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      status: 500,
      success: false,
    });
  }
}
