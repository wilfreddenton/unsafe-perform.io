# Enjoy Writing JavaScript With Async/Await

JavaScript has come a long way since the days of [callback hell](http://callbackhell.com/). Many libraries were introduced to help ease the pain but it wasn't until the introduction of [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) did things really start to improve. While promises solve the nesting issue, chaining them together is still an awkward way to compose a procedure.

Now that `async/await` has full support in LTS versions of `node` as well as recent versions of [all *modern* browsers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function#Browser_compatibility), JavaScript can be enjoyable to write. If you are targeting older platforms, [Babel](https://babeljs.io/) can help by providing polyfills or by compiling your code to specific targets.

## You Can't Erase History

While `async/await` does an excellent job of covering up the old blemishes, history cannot be erased. Callbacks and promises will still be used however sparingly.

```javascript
function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(ms)
    }, ms)
  })
}
```

In the example above, the familiar `setTimeout` function is being "promisified" to create a convenient `sleep` function. At the bottom "layer", there's a call to the `resolve` function provided by the promise. `resolve` is mostly synonymous with `return`. Whatever value we `resolve`, in this case `ms`, can be thought of as the return value of the promise. Because `resolve` is invoked within the callback function of `setTimeout`, the promise will "return" after `ms` milliseconds. Historically, to synchronize this promise, we would use `sleep(ms).then(...)` but with `async/await` we can just `await sleep(ms)`. This layering/wrapping pattern can be used to "modernize" any legacy higher-order function. Suppose you want to use `fs.readFile`, wrap it in a promise, and then call it with `await`.

## Composing Async Functions

```javascript
// sync version
function main() {
  syncSleep(1000)
  syncSleep(2000)
  syncSleep(3000)
}

main()
```

```javascript
// async version
async function main() {
  await sleep(1000)
  await sleep(2000)
  await sleep(3000)
}

main()
```

The first code block shows how normal synchronous code is composed into a procedure. This example is both fake in that  `syncSleep` does not exist and contrived in that you could just `syncSleep(6000)` if it did but go with it. The second block composes asynchronous functions and it's nearly identical to the first except for the addition of `async` and `await`. If you need to synchronize a promise or a function that includes `async` in its definition (also a promise under the hood), call it with the `await` keyword. Any function that contains `await`ed calls must include the `async` keyword in its definition.

To prove that the sleeps in `main` take a total of 6 seconds to run we can write a timing mechanism.

```javascript
async function timed(action) {
  console.log('running timed action...')
  const start = Date.now()
  await action()
  console.log(`${Math.floor((Date.now() - start) / 1000)} seconds elapsed`)
}
```

Because `timed` takes an async action, `await` is used to synchronize it. As `await` is used within the body of `timed`, it must include the `async` keyword in its definition. Now we can modify `main` to use `timed`.

```javascript
async function main() {
  await timed(async () => {
    console.log(await sleep(1000))
    console.log(await sleep(2000))
    console.log(await sleep(3000))
  })
}

main()
```

The example groups the calls to `sleep` within an asynchronous anonymous function which is passed, as the async action, to `timed`. Running this produces the output:

```plaintext
running timed action...
1000
2000
3000
6 seconds elapsed
```

From the output it is clear that the calls to `sleep` are running synchronously and do not "overlap" in any way.

## Running Async Functions Concurrently

Sometimes we don't want to run a set of async actions synchronously. Instead we'd like to compose them into a single async action that runs the sub-actions concurrently.

Pretend that `sleep(1000)`, `sleep(2000)`, and `sleep(3000)` are all requests to some API that fetch data and have `ms` latency. The requests are totally independent so they can be performed concurrently. If we `await` each one sequentially like in the previous example, we are waiting unnecessarily long. As requests are typically IO bound, sending request concurrently provides a significant performance boost.

We can do this easily with the extremely useful and oft forgotten `Promise.all` which takes a list of `await`able actions:

```javascript
async function main() {
  await timed(async() => {
    console.log(await Promise.all([
      sleep(1000),
      sleep(2000),
      sleep(3000),
    ]))
  })
}

main()
```

Running this produces different output:

```plaintext
running timed action...
[ 1000, 2000, 3000 ]
3 seconds elapsed
```

Because the three requests (sleeps) are run concurrently, the total elapsed time is bounded by the request that takes the longest, in this case, 3 seconds. Notice that the result of `Promise.all` is a list of the return values of each sub-action. Destructuring makes this easy to handle:

```javascript
[r1, r2, r3] = Promise.all([a1, a2, a3])
```

## Exception Handling

Now that asynchronous code looks essentially the same as synchronous code we can use the previously irrelevant `try/catch/finally` construct.

Let's make a new promise that again uses `setTimeout` but this time results in an error.

```javascript
function nightmare(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(ms)
    }, ms)
  })
}
```

`nightmare` is the same as `sleep` except that it uses `reject` instead of `resolve`. `reject` is to `throw` as `resolve` is to `return`.

```javascript
async function main() {
  try {
    await timed(async () => await nightmare(1000))
  } catch (error) {
    console.error(`error: ${error}`)
  } finally {
    console.log('always runs')
  }
}

main()
```

Running the above produces:

```plaintext
running timed action...
error: 1000
always runs
```

The exception generated by `nightmare` bubbles up through the timing mechanism, up into `main` where it is caught and logged. The `console.log` in the `finally` block demonstrates that code in a `finally` will run regardless of whether or not the code in the `try` throws an exception.

## JavaScript, Elegant?

JavaScript was one of the first languages I learned. Maturing as a developer while the language matured has been an edifying experience. As the community around the language became more knowledgable and skillful, the more elegant the language became and vice versa. Many times the community has been made fun of for rediscovering solutions to problems already solved by a host of other languages. While there is certainly truth to that, this constantly evolving environment was the perfect place for young developers to learn, experiment, and grow.
