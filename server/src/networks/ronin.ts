import { getWeb3 } from "../web3";
import { Queue, Worker, Job as QueueJob } from "bullmq";
import { scheduleJob } from "node-schedule";
import { getQueue } from "../queue";

export const CHAIN_NAME = "ronin";
export const JOB_BLOCK = "block";

interface BlockJobData {
  blockNumber: number;
}

async function scheduleBlock() {
  const web3 = getWeb3(CHAIN_NAME);

  const sync = await web3.eth.isSyncing();
  console.log(sync);

  const queue: Queue<BlockJobData> = getQueue(CHAIN_NAME);

  queue.add(JOB_BLOCK, { blockNumber: 1 });

  console.log("queue");
}

async function processBlock(job?: QueueJob<BlockJobData>) {}

function initQueueWorker() {
  new Worker(CHAIN_NAME, async (job: QueueJob) => {
    if (job.name == JOB_BLOCK) {
      await processBlock(job as QueueJob<BlockJobData>);
    }
  });
}

export default function () {
  initQueueWorker();
  //   scheduleJob("*/3 * * * * *", scheduleBlock);

  scheduleBlock();
}
