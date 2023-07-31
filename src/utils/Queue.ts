import { useState } from 'react';

export class Queue<T> {
  // Use a state variable to store the queue internally
  private queueState: T[];

  constructor() {
    // Initialize the queue with an empty array
    this.queueState = [];
  }

  // Enqueue an item to the queue
  enqueue(item: T) {
    this.queueState.push(item);
  }

  // Dequeue an item from the queue and return it
  dequeue(): T | undefined {
    if (this.queueState.length === 0) return undefined;
    return this.queueState.shift();
  }

  // Get the size of the queue
  get size(): number {
    return this.queueState.length;
  }

  // Clear the queue
  clear() {
    this.queueState = [];
  }

  // Get the queue as an array
  getQueue(): T[] {
    return this.queueState;
  }
}

// Use a custom React hook to create and manage the Queue instance as a state
export function useQueue<T>() {
  const [queueInstance] = useState<Queue<T>>(() => new Queue<T>());

  return queueInstance;
}
