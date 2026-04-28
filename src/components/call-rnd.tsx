/* eslint-disable no-var */
import { Rnd } from "react-rnd";
import { Button } from "./ui/button";
import {
  Mic,
  Minus,
  Phone,
  PhoneCall,
  ScreenShare,
  Square,
  Video,
  X,
} from "lucide-react";
import { RefObject, useEffect, useRef, useState } from "react";
import { useCallRNDState } from "@/store/use-call-rnd";
import { useSendCallSignal } from "@/hooks/react-query/mutation-calls";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import UserAvatar from "./avatar";
import ShimmerText from "./kokonutui/shimmer-text";
import Logo from "./logo";
import { SOUNDS } from "@/constants/sounds";

function RNDHeader({
  rndRef,
  setMinimized,
}: {
  rndRef: RefObject<any>;
  setMinimized: (e: boolean) => void;
}) {
  const [isMaximized, setIsMaximized] = useState(false);
  const setDisableCallRND = useCallRNDState().setDisableCallRND;

  const handleMaximize = () => {
    if (!rndRef.current) return;

    if (!isMaximized) {
      rndRef.current.updateSize({
        width: "100vw",
        height: "100vh",
      });
      rndRef.current.updatePosition({ x: 0, y: 0 });
    } else {
      rndRef.current.updateSize({
        width: 360,
        height: 520,
      });
      rndRef.current.updatePosition({ x: 100, y: 100 });
    }

    setIsMaximized(!isMaximized);
    setMinimized(false);
  };

  const handleMinimize = () => {
    if (!rndRef.current) return;

    setMinimized(true);

    const width = 200;
    const height = 90;

    const x = window.innerWidth - width - 160;
    const y = window.innerHeight - height;

    rndRef.current.updateSize({
      width,
      height,
    });

    rndRef.current.updatePosition({ x, y });
  };

  return (
    <div className="flex items-center justify-between px-4 py-1">
      <Logo className="w-18" />
      <div className="flex items-center justify-center gap-3">
        <Button
          onClick={handleMinimize}
          variant={"ghost"}
          className="text-muted-foreground hover:text-foreground cursor-pointer w-fit h-fit"
          type="button"
        >
          <Minus className="size-4" strokeWidth={1.89} />
        </Button>
        <Button
          onClick={handleMaximize}
          variant={"ghost"}
          className="text-muted-foreground hover:text-foreground cursor-pointer w-fit h-fit"
          type="button"
        >
          <Square className="size-4" strokeWidth={1.89} />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant={"ghost"}
              className="text-muted-foreground hover:text-foreground cursor-pointer w-fit h-fit"
              type="button"
            >
              <X className="size-4" strokeWidth={1.89} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="z-100">
            <AlertDialogHeader>
              <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                <PhoneCall strokeWidth={1.89} size={4} />
              </AlertDialogMedia>
              <AlertDialogTitle>End call?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to end the call? This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer" variant="outline">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="cursor-pointer"
                variant="destructive"
                onClick={setDisableCallRND}
              >
                Close
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
function RNDFooter() {
  const setDisableCallRND = useCallRNDState().setDisableCallRND;
  return (
    <div className="flex items-center justify-center gap-2 p-1">
      <Button
        className="cursor-pointer rounded-full w-15"
        type="button"
        variant={"secondary"}
      >
        <Video className="size-5" strokeWidth={1.89} />
      </Button>
      <Button
        className="cursor-pointer rounded-full w-15"
        type="button"
        variant={"secondary"}
      >
        <Mic className="size-5" strokeWidth={1.89} />
      </Button>
      <Button
        className="cursor-pointer rounded-full w-15"
        type="button"
        variant={"secondary"}
      >
        <ScreenShare className="size-5" strokeWidth={1.89} />
      </Button>
      <Button
        className="cursor-pointer bg-red-500  text-white hover:bg-destructive rounded-full w-25"
        type="button"
        variant={"default"}
        onClick={setDisableCallRND}
      >
        <Phone className="size-5 rotate-135" strokeWidth={1.89} />
      </Button>
    </div>
  );
}

function CallRND() {
  const callBeepAudio = useRef(new Audio(SOUNDS.BEEP));

  const [counter, setCounter] = useState<number>(0);
  const [isRinging, setIsRinging] = useState<boolean>(false);
  const client = useQueryClient();
  const callee_id = useCallRNDState((state) => state.callee_id) as string;
  const caller_id = useCallRNDState((state) => state.caller_id) as
    | string
    | null;
  const callType = useCallRNDState((state) => state.callType);
  const callDirection = useCallRNDState((state) => state.callDirection);
  const { mutate: sendCallSignal } = useSendCallSignal({
    callee_id,
    setIsRinging,
  });
  const { user } = useUser();
  const rndRef = useRef(null);
  const [minimized, setMinimized] = useState<boolean>(false);
  const setDisableCallRND = useCallRNDState((state) => state.setDisableCallRND);

  const width = window.innerWidth - 500;
  const height = window.innerHeight - 150;

  const user_info = (() => {
    if (
      (callDirection === "incoming" && caller_id) ||
      (callDirection === "outgoing" && callee_id)
    ) {
      const contacts: any = client.getQueryData(["get-contacts", user?.id]);
      const res = contacts?.find(
        (c: any) =>
          c.contact_user_id ===
            (callDirection === "incoming" ? caller_id : callee_id) &&
          c.status === "accepted" &&
          !c.is_deleted,
      );
      return {
        name: res?.info.full_name ?? null,
        avatar: res?.info.avatar_url ?? null,
      };
    }
    return { name: null, avatar: null };
  })();

  useEffect(() => {
    if (!isRinging) return;

    if (counter >= 20) {
      setDisableCallRND();
      return;
    }

    const timer = setTimeout(() => {
      setCounter((prev) => prev + 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [counter, isRinging, setDisableCallRND]);

  useEffect(() => {
    if (!isRinging || callDirection !== "outgoing") return;

    const interval = setInterval(() => {
      callBeepAudio.current.pause();
      callBeepAudio.current.currentTime = 0;
      callBeepAudio.current.volume = 1;
      callBeepAudio.current.play();
    }, 2000);

    return () => clearInterval(interval);
  }, [isRinging, callDirection]);

  useEffect(() => {
    if (!callType || !callee_id) return;
    if (callDirection === "incoming") return;

    sendCallSignal({ calleeId: callee_id, callType });
  }, [callType, callee_id, callDirection, sendCallSignal]);

  return (
    <Rnd
      default={{ x: 300, y: 100, width, height }}
      minWidth={360}
      minHeight={minimized ? 70 : 400}
      ref={rndRef}
      onDrag={() => setMinimized(false)}
      onResize={() => setMinimized(false)}
      bounds="window"
      className="bg-card text-card-foreground border border-border rounded-lg shadow-xl overflow-hidden z-60"
    >
      <div className="flex flex-col h-full w-full">
        <RNDHeader rndRef={rndRef} setMinimized={setMinimized} />

        {!minimized && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-muted m-1 rounded-lg border">
            <UserAvatar
              className="min-w-30 min-h-30"
              src={user_info.avatar}
              alt="avatar"
            />
            <p className="text-xl dark:text-white/90 font-semibold">
              {user_info.name}
            </p>
            {callDirection === "outgoing" ? (
              <ShimmerText
                className="text-sm font-medium"
                text={isRinging ? "Ringing..." : "Calling..."}
              />
            ) : (
              <ShimmerText
                className="text-sm"
                text={callType === "audio" ? "Voice call" : "Video call"}
              />
            )}
          </div>
        )}

        <RNDFooter />
      </div>
    </Rnd>
  );
}

export default CallRND;
