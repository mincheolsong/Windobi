import { ElectronHandler } from '../main/preload';

declare global {
  interface Window {
    electron: ElectronHandler;
  }
  type IntervalId = ReturnType<typeof setInterval> | number | null;
  type TimeoutId = ReturnType<typeof setTimeout> | number | null;
}

export {};
