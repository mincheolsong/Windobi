import { ElectronHandler } from '../main/preload';

declare global {
  interface Window {
    electron: ElectronHandler;
  }
  type IntervalId = ReturnType<typeof setInterval> | null;
  type TimeoutId = ReturnType<typeof setTimeout> | null;
}

export {};
