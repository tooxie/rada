import { Action, Queue } from "../../queue/types";

interface QueueContextState {
  queue: Queue;
  actions: typeof Action;
  dispatch: Function;
}

export { Action, QueueContextState };
