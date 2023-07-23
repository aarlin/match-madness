export class Queue<T> {
  private queue: T[];

  constructor() {
    this.queue = [];
  }

  enqueue(item: T) {
    this.queue.push(item);
  }

  dequeue(): T | undefined {
    if (this.queue.length === 0) return undefined;
    return this.queue.shift();
  }

  get size(): number {
    return this.queue.length;
  }

  clear() {
    this.queue = [];
  }

  getQueue(): T[] {
    return this.queue;
  }
}
