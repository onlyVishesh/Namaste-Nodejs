<h1 style="text-align: center;">🚀 Namaste Node.js - 09 | libuv & Event Loop 🚀</h1>

## Understanding libuv and event loop

## The event loop in LIBUV operates in four major phases:

![Event loop phases]()

1 **Timers Phase:** In this phase, all callbacks that were set using `setTimeout` or `setInterval` are executed. These timers are checked, and if their time has expired, their corresponding callbacks are added to the callback queue for execution.

2 **Poll Phase:** After timers, the event loop enters the Poll phase, which is crucial because it handles I/O callbacks. For instance, when you perform a file read operation using `fs.readFile` , the callback associated with this I/O operation will be executed in this phase. The Poll phase is responsible for handling all I/Orelated tasks, making it one of the most important phases in the event loop.

3 **Check Phase:** Next is the Check phase, where callbacks scheduled by the `setImmediate` function are executed. This utility API allows you to execute callbacks immediately after the Poll phase, giving you more control over the order of operations.

4 **Close Callbacks Phase:** Finally, in the Close Callbacks phase, any callbacks associated with closing operations, such as socket closures, are handled. This phase is typically used for cleanup tasks, ensuring that resources are properly released.

- _Event Loop Cycle with `process.nextTick()` and `Promises`_

### One More Important Note

_When the event loop is empty and there are no more tasks to execute, it enters the `poll phase` and essentially waits for incoming events_

If you found this summary helpful, **please ⭐ star the repository** to show your support! 😊
