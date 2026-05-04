"use client";

import { useCallRNDState } from "@/store/use-call-rnd";
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from "@livekit/components-react";

function LiveKitCallRoom() {
  const token = useCallRNDState((state) => state.token);
  const call_type = useCallRNDState((state) => state.callType)

  if(!token) return;
  return (
    <LiveKitRoom
      token={token || undefined}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      connect={true}
      video={call_type === "video"}
      audio={true}
    >
      <VideoConference />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}

export default LiveKitCallRoom;
