import { WebhookReceiver } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";

const receiver = new WebhookReceiver(
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!,
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    const authorization = request.headers.get("Authorization");

    if (!authorization) {
      return NextResponse.json({
        success: false,
        error: "Missing Authorization header",
      });
    }

    const event = await receiver.receive(body, authorization);

    console.log(event);

    return NextResponse.json({
      success: true,
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
