declare global {
  type IntervalId = ReturnType<typeof setInterval> | number | null;
  type TimeoutId = ReturnType<typeof setTimeout> | number | null;
}
export {};
