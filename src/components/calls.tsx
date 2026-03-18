"use client";
import { TabsContent } from "./ui/tabs";
import { useEffect, useState } from "react";
import {
  LiveKitRoom,
  GridLayout,
  ParticipantTile,
  useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { useUser } from "@clerk/nextjs";
import { Track } from "livekit-client";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  Monitor,
  MoreVertical,
  Settings,
} from "lucide-react";
import { useLocalParticipant } from "@livekit/components-react";
import { useRoomContext } from "@livekit/components-react";

type Props = {
  roomName?: string;
};

function Calls({ roomName }: Props) {
  const [token, setToken] = useState<string | null>(null);
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useUser();

  useEffect(() => {
    const getToken = async () => {
      try {
        if (!user?.id) {
          throw new Error("User not authenticated");
        }

        const res = await fetch("/api/token/live-kit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomName: roomName || "Default Room",
            userId: user.id,
            userName: user.username || "Anonymous",
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch token");
        }

        setToken(data.token);
        setServerUrl(data.url);
        setError(null);
      } catch (error) {
        console.error("Token fetch error:", error);
        setError(
          error instanceof Error ? error.message : "Failed to join call"
        );
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      getToken();
    }
  }, [user, roomName]);

  if (loading) {
    return (
      <TabsContent value="call" className="h-full">
        <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-black">
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500"></div>
              <div className="absolute inset-2 rounded-full border-2 border-slate-800 border-r-blue-400 animate-pulse"></div>
            </div>
            <p className="text-sm font-medium text-slate-300">
              Joining call...
            </p>
          </div>
        </div>
      </TabsContent>
    );
  }

  if (error || !token || !serverUrl) {
    return (
      <TabsContent value="call" className="h-full">
        <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
          <div className="flex flex-col items-center gap-4 rounded-lg border border-red-900/50 bg-red-950/30 p-8 backdrop-blur-sm">
            <div className="text-4xl">⚠️</div>
            <p className="text-center text-sm font-medium text-red-200">
              {error || "Unable to join call. Please try again."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 hover:shadow-lg"
            >
              Retry
            </button>
          </div>
        </div>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="call" className="h-full p-0">
      <LiveKitRoom
        token={token}
        serverUrl={serverUrl}
        connect={true}
        audio={true}
        video={true}
        data-lk-theme="dark"
        className="h-full"
        style={{ height: "100vh" }}
      >
        <CallContainer />
      </LiveKitRoom>
    </TabsContent>
  );
}

function CallContainer() {
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
    { source: Track.Source.ScreenShare, withPlaceholder: false },
  ]);

  return (
    <div className="flex h-full flex-col bg-gradient-to-br from-black via-slate-900 to-slate-800">
      {/* Video Grid Area */}
      <div className="flex-1 overflow-hidden bg-gradient-to-b from-slate-900 to-black relative">
        {tracks && tracks.length > 0 ? (
          <GridLayout tracks={tracks} className="w-full h-full">
            <ParticipantTile />
          </GridLayout>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mb-4 text-6xl opacity-20">📹</div>
              <p className="text-slate-400">Waiting for participants...</p>
            </div>
          </div>
        )}

        {/* Call Timer */}
        <div className="absolute top-6 left-6 bg-black/40 backdrop-blur-md rounded-lg px-4 py-2 border border-slate-700/50">
          <p className="text-sm font-medium text-slate-100">00:05:32</p>
        </div>

        {/* Participant Count */}
        <div className="absolute top-6 right-6 bg-black/40 backdrop-blur-md rounded-lg px-4 py-2 border border-slate-700/50">
          <p className="text-sm font-medium text-slate-100">
            {tracks?.length || 1} participant{tracks && tracks.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="border-t border-slate-700/50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center justify-center gap-4">
          <CallControls />
        </div>
      </div>
    </div>
  );
}

function CallControls() {
  const { localParticipant } = useLocalParticipant();
  const roomContext = useRoomContext();
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Handle mic toggle
  const toggleMic = async () => {
    if (localParticipant) {
      await localParticipant.setMicrophoneEnabled(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  // Handle camera toggle
  const toggleCamera = async () => {
    if (localParticipant) {
      await localParticipant.setCameraEnabled(isCameraOff);
      setIsCameraOff(!isCameraOff);
    }
  };

  // Handle screen share toggle
  const toggleScreenShare = async () => {
    if (localParticipant) {
      if (isScreenSharing) {
        await localParticipant.setScreenShareEnabled(false);
      } else {
        await localParticipant.setScreenShareEnabled(true);
      }
      setIsScreenSharing(!isScreenSharing);
    }
  };

  // Handle end call
  const endCall = () => {
    if (roomContext) {
      roomContext.disconnect();
      window.location.reload();
    }
  };

  return (
    <>
      {/* Mute Button */}
      <button
        onClick={toggleMic}
        className={`group relative flex items-center justify-center h-12 w-12 rounded-full transition-all duration-200 ${
          isMuted
            ? "bg-red-600/20 border border-red-500/50 hover:bg-red-600/30"
            : "bg-slate-700/50 border border-slate-600/50 hover:bg-slate-600"
        }`}
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? (
          <MicOff className="h-5 w-5 text-red-400" />
        ) : (
          <Mic className="h-5 w-5 text-slate-200" />
        )}
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-950 text-slate-100 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {isMuted ? "Unmute" : "Mute"}
        </span>
      </button>

      {/* Camera Button */}
      <button
        onClick={toggleCamera}
        className={`group relative flex items-center justify-center h-12 w-12 rounded-full transition-all duration-200 ${
          isCameraOff
            ? "bg-red-600/20 border border-red-500/50 hover:bg-red-600/30"
            : "bg-slate-700/50 border border-slate-600/50 hover:bg-slate-600"
        }`}
        title={isCameraOff ? "Turn on camera" : "Turn off camera"}
      >
        {isCameraOff ? (
          <VideoOff className="h-5 w-5 text-red-400" />
        ) : (
          <Video className="h-5 w-5 text-slate-200" />
        )}
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-950 text-slate-100 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {isCameraOff ? "Camera off" : "Camera on"}
        </span>
      </button>

      {/* Screen Share Button */}
      <button
        onClick={toggleScreenShare}
        className={`group relative flex items-center justify-center h-12 w-12 rounded-full transition-all duration-200 ${
          isScreenSharing
            ? "bg-blue-600/20 border border-blue-500/50 hover:bg-blue-600/30"
            : "bg-slate-700/50 border border-slate-600/50 hover:bg-slate-600"
        }`}
        title={isScreenSharing ? "Stop sharing" : "Share screen"}
      >
        <Monitor className="h-5 w-5 text-slate-200" />
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-950 text-slate-100 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {isScreenSharing ? "Stop sharing" : "Share screen"}
        </span>
      </button>

      {/* Settings Button */}
      <button
        className="group relative flex items-center justify-center h-12 w-12 rounded-full bg-slate-700/50 border border-slate-600/50 hover:bg-slate-600 transition-all duration-200"
        title="Settings"
      >
        <Settings className="h-5 w-5 text-slate-200" />
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-950 text-slate-100 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Settings
        </span>
      </button>

      {/* More Options */}
      <button
        className="group relative flex items-center justify-center h-12 w-12 rounded-full bg-slate-700/50 border border-slate-600/50 hover:bg-slate-600 transition-all duration-200"
        title="More options"
      >
        <MoreVertical className="h-5 w-5 text-slate-200" />
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-950 text-slate-100 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          More
        </span>
      </button>

      {/* End Call Button - Prominent Red */}
      <div className="h-12 w-1 bg-slate-700/30 rounded-full mx-2"></div>
      <button
        onClick={endCall}
        className="group relative flex items-center justify-center h-12 w-12 rounded-full bg-red-600 hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-red-500/50 hover:shadow-2xl"
        title="End call"
      >
        <Phone className="h-5 w-5 text-white rotate-[135deg]" />
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-950 text-slate-100 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          End call
        </span>
      </button>
    </>
  );
}

export default Calls;