export enum States {
  Idle,
  Loading,
  Playing,
  Paused,
}

export enum Action {
  Append,
  Clear,
  Play,
  SkipNext,
  SkipPrevious,
  RemoveAt,
  SetIndex,
  UpdateTime,
}
