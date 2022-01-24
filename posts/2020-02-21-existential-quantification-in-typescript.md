# Existential Quantification in TypeScript

While working on a TypeScript project, I encountered a scenario that seemed impossible to describe with the language. I needed a function that could take a list of action/handler tuples, `[Promise<A>, (a: A) => void][]`, and apply each handler to the the `await`ed result of the action. Something like this:

```typescript
async function applyMany<A>(ahts: [Promise<A>, (a: A) => void][]): Promise<void>
```

The problem is that `A` constrains every tuple in the list. `applyMany` should *only* care about the compatibility of the action and the handler within each tuple.

The solution is [Existential Quantification](https://wiki.haskell.org/Existential_type). It can be used to "hide" types that are *not* meaningful externally. Unfortunately, TypeScript does not explicitly support existential quantification.[^no-support] It is possible however, to "wrap" over the extra type with clever use of closure and type inference.[^clever] Examples of this cleverness were initially difficult for me to decipher, in part, due to my shaky understanding of existential quantification.

While researching the topic, I came across a [section](https://downloads.haskell.org/ghc/latest/docs/html/users_guide/glasgow_exts.html#existentially-quantified-data-constructors) in the GHC user guide that briefly discusses existential quantification in the context of Haskell. Coincidentally, the example it presents is isomorphic to my problem. I decided to implement the example in TypeScript as an exercise. Before working through this example, let's cover some fundamentals.

## Generic Functions in TypeScript

```typescript
function id<A>(a: A): A {
  return a
}
```

The identity function accepts a value of *any* type `A` and returns it unmodified.

```typescript
id<number>(1) // 1
id<string>('foo') // 'foo'
id<boolean>(true) // true
```

We know intuitively that manually supplying the types is redundant. The compiler is able to infer `A` from the argument `a`:

```typescript
id(1) // 1
id('foo') // 'foo'
id(true) // true
```

`id` can also be implemented as an anonymous function:

```typescript
const id = <A>(a: A): A => a
```

Put another way:

```typescript
const id: <A>(a: A) => A = (a) => a
```

More clearly:

```typescript
type F = <A>(a: A) => A

const id: F = (a) => a
```

Typically when we see a generic type alias, the type variables are on the left side of the `=` like so:

```typescript
type F<A> = (a: A) => A
```

Now, we're in a situation where `A` must always be supplied. It is no longer possible for the compiler to infer the type from the argument. As a result, `id` must be implemented for every type:

```typescript
const idNumber: F<number> = (a) => a
const idString: F<string> = (a) => a
const idBoolean: F<boolean> = (a) => a
// ...
```

This mirrors the original problem:

```typescript
type AHT<A> = [Promise<A>, (a: A) => void]

const ahtNumber: AHT<number> = [Promise.resolve(0), (a) => console.log(a + 1)]
const ahtString: AHT<string> = [Promise.resolve('foo'), (a) => console.log(a.length)]
const ahtBool: AHT<boolean> = [Promise.resolve(true), (a) => console.log(!a)]
// ...
```

`<A>` must move to the right of the `=` so that an `AHT` is constructible *for all* types `A`. From what we've seen, functions provide a way to perform this transformation.

## A Simple Existential Type

Let's come back to the Haskell example.

```haskell
data Foo = forall a. MkFoo a (a -> Bool)
         | Nil
```

`Foo` has two data constructors: `MkFoo`, and `Nil`.

```haskell
MkFoo :: forall a. a -> (a -> Bool) -> Foo
Nil   :: Foo
```

`MkFoo` is clearly the function of interest. `forall a.` "existentializes" the type variable `a` removing it from the left side of the `=`‌. The use of `forall` to **exist**entially quantify a type variable is the source of much confusion. To avoid introducing an additional keyword `exists`, the implementers leveraged a recontextualisation of De Morgan's laws within type theory that describes an isomorphism between `exists` and `forall`.[^forall] Barring all that ivory tower stuff, I just think of it like this:

> `MkFoo` constructs a `Foo` `forall` types `a`.

Notice that this is a restatement of what was said about the `AHT` type in the previous section.

With the `a` extistentialized, a [heterogeneous list](https://wiki.haskell.org/Heterogenous_collections) of `Foo`s can be created.

```haskell
[MkFoo 3 even, MkFoo 'c' isUpper, Nil] :: [Foo]
```

In the first `Foo`, `A` is `Int`. In the second, `A` is `Char`. How can this be achieved in TypeScript? Let's start by defining `Foo`.

```typescript
type Foo = MkFoo | null
```

We don't need to define `Nil` because TypeScript (unfortunately) already has a `null` type. Next we need to define `MkFoo`. Starting from the bottom...

```typescript
type MkFoo_<A> = [A, (a: A) => boolean]
```

`MkFoo_` establishes the relationship between the value and the handler. Next, we need to move the `<A>` to the other side of the `=` by wrapping `MkFoo` in a function.

```typescript
type MkFoo = <R>(run: <A>(_: MkFoo_<A>) => R) => R
```

Well, there's actually two functions. Let's analyze this layer by layer.

```typescript
<A>(_: MkFoo_<A>) => R
```

The inner function infers `A` from the `MkFoo_` argument. As it is a function, it must return something. An additional type variable `R` is used to avoid constraining what can be returned. With only this layer, `R` would appear on the left of the `=` so an additionally layer is necessary.

```typescript
<R>(run: <A>(_: MkFoo_<A>) => R) => R
```

This function is able to infer `R` from the inner layer `run`. You may recognize the "shape" `((_ -> r) -> r)` which is common in [continuation passing style](https://en.wikipedia.org/wiki/Continuation-passing_style) programming. This [blog post](https://rubenpieters.github.io/programming/typescript/2018/07/13/existential-types-typescript.html) explains existential quantification in TypeScript through the lens of CPS.

Now we need a constructor for `MkFoo`:

```typescript
const mkFoo = <A>(mkFoo_: MkFoo_<A>): MkFoo => (run) => run(mkFoo_)
```

This wraps a `MkFoo_` in the layers just described. By accepting a `run` function, a `MkFoo` provides the ability for an external entity to "reach in" and safely interact with the hidden `MkFoo_`. It's a bit like the [*What's in the Box?* challenge](https://youtu.be/Sci99roo2iI).

Finally, we can create the list of `Foo`s:

```typescript
const foos = [
  mkFoo([3, (a) => a % 2 === 0]),
  mkFoo(['c', (a) => a === a.toUpperCase()]),
  null
]
```

Notice that we don't have to explicitly fill in any type variables. In the first `Foo`, `A` is inferred to be `number`. In the second, `A` is inferred to be `string`. `A` is now "closed over" but `R` still needs filling.

```typescript
const f = (foo: Foo): boolean => {
  if (foo === null) return false
  return foo(([v, h]) => h(v))
}

foos.map(f) // [false, false, false]
```

Because the return type of `f` is `boolean`, `R` is filled in with `boolean`. The `run` function `([v, h]) => h(v)`, specified to return `R`, must also return `boolean`. `h(v)` returns `boolean` so the constraint is satisfied. The relationship between `v` and `h` is already encoded within `foo` so they're left unspecified.

We've shown that existential quantification *is* possible in TypeScript. You can play around with this example [here](https://www.typescriptlang.org/play/#code/C4TwDgpgBAsg1gMQPZIPoB4CCA+KBeKAbUwBooAKAQwC4pMBKfXAIxQBsJKA7AXQCg+oSLEQp8UdACVs5AE4BXLrSwzUteMjQrGeXJJ16BAYyRcAzsCgBbUUnEryNzWpHPt620woKuBqD8dbVHoBIWhNcQ0xAB8oLnk2NmNTCygAMxQzcUI+KGtbckIAZjIqP0ooAFIoACZ8PAIABh56Elz8zUKAciMu0spy+oJKADpgJABVMEhZAGFKMwhyeha2vPjEvn4+E3NLNPFyDKRaTXpaViQObi8Ab3aASwOjsQaCDbZGWQhgeVkudKUNiLdrfX7-dIociFABuZAAFi0vPDyDD6CEAL4CY5mEZWShgI70IA).

After implementing `Foo`, I was able to easily transform it into a solution for my initial problem. A new problem arose. I was curious about all the things I could do with existential types. Fortunately, my enthusiasm was curbed after reading this [blog post](https://medium.com/@jonathangfischoff/existential-quantification-patterns-and-antipatterns-3b7b683b7d71) on the dangers of type level magic. The author outlines some good and bad uses of existential quantification. He pointed to the [`foldl`](https://hackage.haskell.org/package/foldl-1.4.6/docs/Control-Foldl.html) package as an example of how to properly employ the technique. It defines the `Fold` data type:

```haskell
data Fold a b = forall x. Fold (x -> a -> x) x (x -> b)
```

If you're unfamiliar with folds, for now just think of them as a more generic form of list reduction.

I decided to implement `Fold` as well as a tiny portion of the library in TypeScript to really solidify all that I'd learned. Let's walk through it together.

## Implementing Fold in TypeScript

`Fold_` is defined just like `MkFoo_`:

```typescript
type Fold_<X, A, B> = { step: (x: X, a: A) => X; initial: X; extract: (x: X) => B }
```

`X` is the type of the accumulator value. `A` is the type of the elements in the structure being folded. `B` is the type of the value resulting from the application of the fold. Many `Fold`s fill in all the variables with the same type. For example, the `sum` fold specifies them all to be `number`. But as we'll see, making these type variables distinct enables the creation of more powerful folds.

Next, we move `<X>` to the right of the `=`:

```typescript
type Fold<A, B> = <R>(run: <X>(_: Fold_<X, A, B>) => R) => R
```

This closely resembles the pattern used when implementing `Foo`. We're already familiar with the `sum` fold, so let's implement that now.

```typescript
const id = <B>(b: B): B => b

const sum: Fold<number, number> = (run) =>
  run({
    step: (x, a) => x + a,
    initial: 0,
    extract: id,
  })
```

This looks familiar. It's almost exactly the same as the `mkFold` constructor defined earlier. This makes sense because it *constructs* a `Fold`. As mentioned previously, all the types involved in this fold are `number`, hence `Fold<number, number>`. By setting `initial` to `0`, the compiler can infer that `X` is also a `number`. `extract` simply returns the accumulator value.

We're still missing one thing: the function that applies a `Fold` to a structure:

```typescript
const fold = <A, B>(f: Fold<A, B>, fa: Foldable<A>): B =>
  f(({ step, initial, extract }) => extract(fa.reduce(step, initial)))
```

Notice how similar this is to the `f` function defined in the `Foo` example. It takes a `Fold` `f` and applies it to a `Foldable` `fa`. Wait, what's a `Foldable`? You may be wondering why I keep using the word "structure" instead of just saying list. Well, what if we want to fold a linked list or a binary tree? Basically any structure that contains elements of a specific type can be folded. The structure just has to have a `reduce` method. Conveniently, the `[]` type already does. Let's define a `Foldable` interface and then create a new `Tree` structure that implements it.

```typescript
type Reduce<A> = <X>(step: (x: X, a: A) => X, init: X) => X

interface Foldable<A> {
  reduce: Reduce<A>
}
```

In the definition of `Reduce`, notice how `A` is on the left of the `=` and `X` is on the right. If `A` and `X` were on the left then we'd be saying that a `Foldable` must specify both `A` and `X`. If they were on the right, we'd be saying that both `A` and `X` can be inferred from `step` and `init`. What we want to say is that the structure implementing `Foldable` should fill in `A` with the type of its elements and that `X` is inferred from the arguments. Thus, `A` on the left, `X` on the right.

Next, let's define a `Tree`. A Haskell implementation might look something like this:[^tree]

```haskell
data Tree a = Empty | Leaf a | Node (Tree a) a (Tree a)
```

This data type is recursive in that a `Node`, one of the `Tree`'s data constructor, takes a left `Tree` and a right `Tree`. TypeScript does not support recursive type aliases but it does have "recursive back references within interface types."[^recursive]

  This example was provided by the creator of TypeScript [himself](https://github.com/ahejlsberg).

Unfortunately we can't quite replicate the elegance of the Haskell definition in TypeScript because we need a `class` on which to define `reduce`.

```typescript
type Root<A> = Empty | Leaf<A> | Node<A>

class Tree<A> implements Foldable<A> {
  root: Root<A>

  constructor(root: Root<A> = { tag: 'EMPTY' }) {
    this.root = root
  }

  // reduce: ...
}

interface Empty {
  tag: 'EMPTY'
}

interface Leaf<A> {
  tag: 'LEAF'
  value: A
}

interface Node<A> {
  tag: 'NODE'
  left: Tree<A>
  value: A
  right: Tree<A>
}
```

A [tagged union type](https://mariusschulz.com/blog/tagged-union-types-in-typescript) is used to describe the `Root` of the `Tree`.

```typescript
  // ...
  reduce: Reduce<A> = (step, init) => {
    const root = this.root
    switch (root.tag) {
      case 'NODE':
        return root.right.reduce(step, step(root.left.reduce(step, init), root.value))
      case 'LEAF':
        return step(init, root.value)
      default:
        // EMPTY
        return init
    }
  }
  // ...
```

`reduce` performs a specific action for each of the different root types. The `NODE` case is clearly the interesting one. It essentially performs an in-order traversal.

Now that we have two different foldable structures, `Tree<A>` and `<A>[]`, let's test out the `sum` fold on them.

```typescript
const testArray = [1, 2, 2, 3]

const testTree = new Tree<number>({
  tag: 'NODE',
  left: new Tree({
    tag: 'NODE',
    left: new Tree({
      tag: 'LEAF',
      value: 1,
    }),
    value: 2,
    right: new Tree(),
  }),
  value: 2,
  right: new Tree({
    tag: 'LEAF',
    value: 3,
  }),
})

fold(sum, testArray) // 8
fold(sum, testTree) // 8
```

So we've proven that the implementation of `Fold` can work on various structures but we haven't tried folds that have different concrete types for `X`, `A`, and `B`.

```typescript
const all = <A>(p: (a: A) => boolean): Fold<A, boolean> => (run) =>
  run({
    step: (x, a) => x && p(a),
    initial: true,
    extract: id,
  })
```

`all` takes a predicate `p` and returns a `Fold<A, boolean>`. If *all* the applications of the predicate to each element in the structure result in `true`, the overall result is `true` otherwise `false`. The compiler can infer `X` from the value of `initial` and `A` from the predicate.

```typescript
const nub = <A>(): Fold<A, A[]> => (run) =>
  run({
    step: (x, a) => x.add(a),
    initial: new Set<A>(),
    extract: (x) => [...x],
  })
```

`nub` folds a structure into a list without duplicate elements.  `X` is inferred to be `Set<A>` from the `initial` value‌. Because sets prevent duplicates from being added and the TypeScript/JavaScript implementation of `Set` maintains insertion order[^order], `extract` can simply convert the accumulator to a list. Note that this fold is a function even though it doesn't take any arguments. This is because it has a type variable and values cannot have type variables.

Let's put these folds to use:

```typescript
fold(all((a) => a > 0), testArray) // true
fold(all((a) => a > 0), testTree) // true
fold(all((a) => a < 0), testArray) // false
fold(all((a) => a < 0), testTree) // false

fold(nub(), testArray) // [1, 2, 3]
fold(nub(), testTree) // [1, 2, 3]
```

All this code can be viewed in the [`fold-ts`](https://github.com/wilfreddenton/fold-ts) repo. Maybe you'll find some use for it. If you'd like to contribute additional folds please submit a PR!

If this type level trickery still confuses you, there are plenty of other examples.[^examples]

## Existential Crisis

It's unfortunate that a seemingly trivial problem leads to such a complex solution. So far, the only two "mainstream" languages that have explicit implementations of existential quantification are Haskell and Scala. It would be greatly beneficial for a language like TypeScript, one that is accessible to many, to introduce the concept to the programming masses. It's a powerful feature and one that should be in every developers playbook or at least on their radar.

[^no-support]: [Existential Type?](https://github.com/Microsoft/TypeScript/issues/14466)

[^clever]: [Closure Workaround](https://github.com/Microsoft/TypeScript/issues/14466#issuecomment-338045331)

[^forall]: [What's the theoretical basis for existential types?](https://stackoverflow.com/questions/10753073/whats-the-theoretical-basis-for-existential-types)

[^tree]: [Foldable](https://hackage.haskell.org/package/foldl-1.4.6/docs/Control-Foldl.html#t:Foldable)

[^recursive]: [Recursive Back References Within Interface Types](https://github.com/microsoft/TypeScript/issues/3496#issuecomment-128553540)

[^order]: [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)

[^examples]: Examples

  - [Encoding Existential Types in TypeScript](https://rubenpieters.github.io/programming/typescript/2018/07/13/existential-types-typescript.html)
  - [Typescript array of different generic types](https://stackoverflow.com/questions/51815782/typescript-array-of-different-generic-types)
  - [How do I type parameterize a tuple?](https://stackoverflow.com/questions/46185023/how-do-i-type-parameterize-a-tuple)

