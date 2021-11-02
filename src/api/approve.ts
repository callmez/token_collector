import { useDatabase } from "@/firebase";

import { ref, set, query, onValue } from "@firebase/database";

export interface ApproveParams {
  tx?: any;
  chain_id: number;
  wallet: string;
  spender: string;
  token: string;
  amount: string;
  created_at: number;
}

export async function addApprove(params: ApproveParams) {
  const db = useDatabase();

  await set(
    ref(
      db,
      "chain/" +
        params.chain_id +
        "/approves/" +
        params.spender +
        "/tokens/" +
        params.token +
        "/wallets"
    ),
    {
      [params.wallet]: {
        amount: params.amount,
        created_at: params.created_at,
      },
    }
  );
}

export interface GetApprovesBySpenderParams {
  spender: string;
  chain_id: number;
}

export interface ApproveData {
  chain_id: number;
  spender: string;
  tokens: {
    [token: string]: {
      wallets: {
        [wallet: string]: {
          amount: number;
          created_at: number;
        };
      };
    };
  };
}

export async function getApprovesBySpender(
  params: GetApprovesBySpenderParams
): Promise<ApproveData> {
  return new Promise(async (resolve, reject) => {
    const db = useDatabase();
    const approvesRef = await query(
      ref(
        db,
        "chain/" + params.chain_id + "/approves/" + params.spender + "/tokens/"
      )
    );

    return onValue(approvesRef, (snapshots) => {
      const approves: ApproveData = {
        chain_id: params.chain_id,
        spender: params.spender,
        tokens: {},
      };
      snapshots.forEach((snapshot: any) => {
        approves.tokens[snapshot.key] = snapshot.val();
      });
      resolve(approves);
    });
  });
}
