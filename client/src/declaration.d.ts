declare module "*.gif";
declare module "*.svg";
declare module "*.css" {
  const mapping: Record<string, string>;
  export default mapping;
}

interface BaseWebLockSentinelEventMap {
  onrelease: Event;
}

type WakeLockSentinel = {
  readonly released: Boolean;
  readonly type: string;
  release(): Promise;
  addEventListener(
    type: K,
    listener: (this: Event, ev: BaseWebLockSentinelEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener(
    type: K,
    listener: (this: Event, ev: BaseWebLockSentinelEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void;
};

type WakeLockRequestType = "screen";

interface Navigator {
  wakeLock: {
    request: (type: WakeLockRequestType) => Promise;
  };
}
