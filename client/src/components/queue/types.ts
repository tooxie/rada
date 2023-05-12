import type { Queue } from "../../queue/types";

import { Action } from "../../queue/enums";

interface QueueContextState {
  queue: Queue;
  actions: typeof Action;
  dispatch: Function;
}

export { Action, QueueContextState };
