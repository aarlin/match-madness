export async function delayedFunctionExecution(func: Function, delayInMilliseconds: number) {
  // Wrap the setTimeout in a Promise to make it awaitable
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      func(); // Execute the provided function after the specified delay
      resolve(); // Resolve the Promise after the function execution is complete
    }, delayInMilliseconds);
  });
}
