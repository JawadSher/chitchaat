import { create } from "zustand";

type CallRNDType = {
  isShowCallRND: boolean;
  callType: "video" | "audio" | null;
  callMode: "direct" | "group" | null;
  setEnableCallRND: ({type, callee_id, callMode, callDirection, caller_id, call_status}:{type: "video" | "audio", callee_id: string, callMode: "direct" | "group" | null, callDirection: "incoming" | "outgoing" | null, caller_id?: string | null, call_status?: "ringing" | "closed" | null}) => void;
  setDisableCallRND: () => void;
  callee_id: string | null;
  callDirection: "incoming" | "outgoing" | null;
  caller_id?: string | null;
  call_status: "ringing" | "closed" | null;
};

export const useCallRNDState = create<CallRNDType>((set) => ({
  isShowCallRND: false,
  callType: null,
  callee_id: null,
  callMode: null,
  callDirection: null,
  caller_id: null,
  call_status: null,
  setEnableCallRND: ({type, callee_id, callMode, callDirection, caller_id, call_status}) => {
    set(() => ({
      isShowCallRND: true,
      callType: type,
      callee_id,
      callMode,
      callDirection,
      caller_id,
      call_status
    }));
  },
  setDisableCallRND: () => {
    set(() => ({
      isShowCallRND: false,
      callType: null,
      callee_id: null,
      callMode: null,
      callDirection: null,
      caller_id: null,
      call_status: null
    }));
  },
}));
