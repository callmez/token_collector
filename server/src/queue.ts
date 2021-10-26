import { Queue } from "bullmq";
import config from "./config";

const queues: {
  [name: string]: Queue;
} = {};

export function getQueue(name: string) {
  if (queues[name] === undefined) {
    const options = config.queues[name];

    queues[name] = new Queue(name, options);
  }

  return queues[name];
}
