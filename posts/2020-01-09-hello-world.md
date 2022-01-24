# Hello, World!

```haskell
-- Unsafe.hs

import Data.IORef (IORef, newIORef, readIORef, writeIORef)
import System.IO.Unsafe (unsafePerformIO)

var :: a -> IORef a
var = unsafePerformIO . newIORef

(<==) :: IORef a -> a -> ()
r <== a = unsafePerformIO $ writeIORef r a

star :: IORef a -> a
star = unsafePerformIO . readIORef
```

Haskell, a *purely* functional programming language, supports global mutable variables. Load the above script with `ghci` to see how it works.

```plaintext
*Main> let helloWorld = var "Hello, World!"
*Main> star helloWorld
"Hello, World!"
*Main> helloWorld <== "Surprise!"
()
*Main> star helloWorld
"Surprise!"
```

Notice, in line `1`, `let` is used instead of `<-`. That's because `var` is not a monadic action. `unsafePerformIO` has removed the `IO` context and made it a "pure" function. `unsafePerformIO` is also used to achieve false purity in the definitions of the assignment operator `<==` and the dereference function `star`. These impurely pure functions can be buried anywhere in a codebase, turning the application into a game of minesweeper.

The `unsafePerformIO` [documentation](https://hackage.haskell.org/package/base-4.12.0.0/docs/System-IO-Unsafe.html#v:unsafePerformIO) provides one of the more humorous lines technical writing has to offer:

> This is the "back door" into the IO monad
