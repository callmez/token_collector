import {
  addApprove,
  ApproveData,
  ApproveParams,
  getApprovesBySpender,
  GetApprovesBySpenderParams,
} from "@/api/approve";

import { defineStore } from "pinia";

export interface CollectState {
  approves: {
    [key: string]: ApproveData;
  };
}

export const useCollectStore = defineStore({
  id: "collect",
  state: (): CollectState => ({
    approves: {},
  }),
  getters: {},
  actions: {
    async addApprove(params: ApproveParams) {
      const data = await addApprove(params);

      return data;
    },
    async loadApprovesBySpender(params: GetApprovesBySpenderParams) {
      const key = `${params.chain_id}_${params.spender}`;
      const data = await getApprovesBySpender(params);
      this.approves = {
        ...this.approves,
        [key]: data,
      };

      return data;
    },
  },
});
