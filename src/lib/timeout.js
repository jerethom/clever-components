export function setAbortableTimeout (fn, delay, signal) {
  const timeoutId = setTimeout(fn, delay);
  signal.addEventListener('abort', () => clearTimeout(timeoutId), { once: true });
}

export function setAbortableInterval (fn, delay, signal) {
  const intervalId = setInterval(fn, delay);
  signal.addEventListener('abort', () => clearInterval(intervalId), { once: true });
}
