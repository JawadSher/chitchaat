import { create } from "zustand";

type CallRNDType = {
  isShowCallRND: boolean;
  callType: "video" | "audio" | null;
  setEnableCallRND: (type: "video" | "audio", callee_id: string) => void;
  setDisableCallRND: () => void;
  callee_id: string | null;
};

export const useCallRNDState = create<CallRNDType>((set) => ({
  isShowCallRND: false,
  callType: null,
  callee_id: null,
  setEnableCallRND: (type, callee_id) => {
    set(() => ({
      isShowCallRND: true,
      callType: type,
      callee_id: callee_id
    }));
  },
  setDisableCallRND: () => {
    set(() => ({
      isShowCallRND: false,
      callType: null,
      callee_id: null,
    }));
  },
}));
