# Leveraging Go's Interfaces to Great Effect

Suppose you're developing a web server. One of the request handlers performs logging, authentication, HTTP requests, and database queries. It's provided these capabilities by four structs passed in as arguments and looks something like this:

```go
func createProductHandler(
	l *logger,
	a *auth,
	c *client,
	d *db
) *response {
	// ...
}
```

As the handler deals specifically with creating products, it only uses a few of the methods provided by this set of structs. As a result, the function signature doesn't tell us about the specific behavior of the handler or the side effects it produces. Worse, its coupled to the implementation of the structs. If we were to change their names, split one into multiple, or move methods from one to another, we'd have to modify the handler as well.

With interfaces, we can solve these problems by grouping actions into "effects".

```go
type loggerEff interface { ... }
type authEff interface { ... }
type baseHandlerEff interface {
	loggerEff,
	authEff,
}
type shopifyEff interface { ... }
type productQueriesEff interface { ... }

type createProductEff interface {
	baseHandlerEff,
	shopifyEff,
	productQueriesEff,
}

func createProductHandler(
	ctx createProductEff
) *Response {
	// ...
}
```

The handler's signature now contains a great deal of **semantic information**. It specifies the side effects the procedure will produce and gives the reader a general understanding of the handler's purpose. The business logic has been **decoupled** from the implementation details. The handler no longer has to change if we modify the structs that implement the interfaces. We created a way to **inject dependencies** into the handler, greatly reducing the burden of argument passing. We can **mock** the interfaces which significantly improves the testability of the handler.

To further understand the pattern, let's explore a runnable example. A web server example would require a number of dependencies that, when wired together, create an opinionated "framework". This would *incorrectly* imply that the pattern is tied to a framework and relegated to web servers. Instead, let's create a fun little guessing game. You can find the full code [here](https://github.com/wilfreddenton/gophects).

The game asks the player to input a number of `turns`, a `low` number, and a `high` number. Once the game has been configured, it will randomly select a hidden number between `low` and `high`. It’s the player's job to guess the number in `turns` attempts.

Consider the effects that could help us here. We need some way to interact with the user. These actions can be grouped in what we'll call the console effect. We also need a way to generate random numbers. Let’s call that the random effect. Notice that we've zeroed in on the parts of the app that perform IO.

Let's specify the console effect.

```go
type consoleEff interface {
	putStr(string)
	putStrLn(string)
	getLine(string) string
}
```

`putStr` and `putStrLn` provide ways to write a string to the console. With `getLine` we can write a prompt `s` to the console and allow the player to input a string which is returned by the function.

How might we mock these actions?

```go
type consoleMock struct {
	in  []string
	out string
}
```

`in` and `out` are representations of `stdin` and `stdout`. `in` is a list of strings which mocks the series of inputs provided by the player. `out` is a string which will contain the output of the program.

```go
func (p *consoleMock) putStr(s string) {
	p.out += s
}
```

`putStr` simply appends the provided string to `out`.

```go
func (p *consoleMock) putStrLn(s string) {
	p.putStr(s + "\n")
}
```

`putStrLn` is the same as `putStr` except it tacks on a newline.

```go
func (p *consoleMock) getLine(s string) string {
	in := p.in[0]
	p.putStrLn(fmt.Sprintf("%s%v", s, in))
	p.in = p.in[1:]
	return in
}
```

`getLine` pops off mocked player input from the head of `in`, writes the input prefixed with the prompt `s` to `out`, and returns the input.

While we're still not certain how the entire program will look, we know we need a way to read in settings from the user.

```go
func getTurns(ctx consoleEff) int {
	for {
		turnsS := ctx.getLine("turns: ")
		turns, err := strconv.Atoi(turnsS)
		if err != nil {
			ctx.putStrLn(turnsS + " is not an int")
		} else if turns < 1 {
			ctx.putStrLn("turns must be > 0")
		} else {
			return turns
		}
	}
}
```

The code itself is pretty straight forward. The thing to notice is that the function takes a context object that implements `consoleEff`. Inside the body we can see the `consoleEff` actions being used.

Since we've already written the mock implementation of `consoleEff` we can now write a test for `getTurns`. If we were adhering to TDD we should have written the test first but its easier to explain after you've seen the implementation.

```go
func assert(t *testing.T, g, e interface{}) {
	if g != e {
		t.Error(g)
	}
}

func TestGetTurns(t *testing.T) {
	ctx := &consoleMock{in: []string{"t", "0", "1"}}
	turns := getTurns(ctx)
	assert(t, turns, 1)
	assert(t, ctx.out, `turns: t
t is not an int
turns: 0
turns must be > 0
turns: 1
`)
}
```

First we define an `assert` function to help us compare expected values and results. In a serious application we'd want something more robust but it will do for this exercise. The test begins by defining the context. As `getTurns` only expects `consoleEff`, we can satisfy the constraint with an instance of `consoleMock`. We provide the constructor with a list of mock player input. One element from this list will be supplied to `getTurns` each time it calls `ctx.getLine`. We can make an assertion about the result but because we mocked the console effect, we can also make an assertion about the side effect.

The implementations of `getLow`, `getHigh`, and their tests is very similar to what was described above so let's continue to the next part.

Now that we have these three functions implemented and tested we can use them to `setup` the game:

```go
type settings struct {
	turns int
	lo    int
	hi    int
}

func setup(ctx consoleEff) *settings {
	ctx.putStrLn("Guessing Game")

	turns := getTurns(ctx)
	lo := getLow(ctx)
	hi := getHigh(ctx, lo)
	return &settings{turns, lo, hi}
}
```

Notice how this function passes the context to `getTurns`,  `getLow`, and `getHigh`. When "contextualizing" child functions, the child's constraints must be a subset of the parent's.

The test for `setup` is similar to the ones we've already written:

```go
func TestSetup(t *testing.T) {
	ctx := &consoleMock{in: []string{"5", "1", "10"}}
	r := setup(ctx)
	assert(t, r.turns, 5)
	assert(t, r.lo, 1)
	assert(t, r.hi, 10)
	assert(t, ctx.out, `Guessing Game
turns: 5
low: 1
high: 10
`)
}
```

Now that we have a way for the player to configure the game we can implement the game itself. We know the game needs to generate a random number so let's start by specifying the random effect.

```go
type randEff interface {
	randomR(int, int) int
}
```

This effect is simpler than `consoleEff`, only specifying a single action which selects a random number from within a range. Here's a mock implementation of it:

```go
type randMock struct {
	n int
}

func (r *randMock) randomR(lo, hi int) int {
	r.n = (lo + hi) / 2
	return r.n
}
```

`randMock` keeps track of the most recently generated "random" number in `n`. This mock implementation just returns the average of `lo` and `hi`. It could have been implemented many different ways; for example, `lo + 1` or `hi - 1`. The important thing is that it *deterministically* produces the value so we can rely on our tests running the same every time.

Now that we have an implementation for `randEff` we can write the `play` portion of our game.

```go
type playEff interface {
	consoleEff
	randEff
}

func play(ctx playEff, s *settings) {
	n := ctx.randomR(s.lo, s.hi)
	i := s.turns

	for i > 0 {
		gS := ctx.getLine("guess: ")
		g, err := strconv.Atoi(gS)
		if err != nil {
			ctx.putStrLn(gS + " is not an int")
			continue
		}

		if g < n {
			ctx.putStrLn("higher")
		} else if g > n {
			ctx.putStrLn("lower")
		} else {
			ctx.putStrLn(gS + " is correct")
			return
		}

		i -= 1
	}

	ctx.putStrLn("game over")
}
```

I'll leave it to you to read and understand the business logic. Notice that `play` takes a context that implements `playEff`. This is different from what we've seen before. Interface inheritance allows us to compose `consoleEff` and `randEff` to create `playEff`. At a glance, we know that `play` will be interacting with the player and generating random numbers.

Now let's write the tests for `play`:

```go
func TestPlayWin(t *testing.T) {
	ctx := struct {
		*consoleMock
		*randMock
	}{&consoleMock{in: []string{"x", "3", "7", "5"}}, &randMock{}}
	r := &settings{3, 1, 10}
	play(ctx, r)
	assert(t, ctx.n, 5)
	assert(t, ctx.out, `guess: x
x is not an int
guess: 3
higher
guess: 7
lower
guess: 5
5 is correct
`)
}

func TestPlayLoss(t *testing.T) {
	ctx := struct {
		*consoleMock
		*randMock
	}{&consoleMock{in: []string{"x", "3", "7"}}, &randMock{}}
	r := &settings{1, 1, 10}
	play(ctx, r)
	assert(t, ctx.out, `guess: x
x is not an int
guess: 3
higher
game over
`)
}
```

We test two sequences of user input, one that results in a win, and one a loss. The structure of these tests is the same as the ones we've seen previously except that an instance of `randMock` must also be provided to the context. Struct inheritance allows us to easily create a context object that exposes all the methods of the composed structs.

The game has now been implemented and tested! By abstracting the IO actions into effects we purified the business logic making it immediately testable. The last thing to do is write the IO implementations of our effects and then compose it all together in a `main` function.

```go
type consoleIO struct{}

func (p *consoleIO) putStr(s string) {
	fmt.Print(s)
}

func (p *consoleIO) putStrLn(s string) {
	fmt.Println(s)
}

func (p *consoleIO) getLine(s string) string {
	fmt.Print(s)
	var in string
	fmt.Scanln(&in)
	return in
}
```

We decided with `consoleMock` how the output should look so we just imitate it in `consoleIO`.

```go
type randIO struct{}

func (r *randIO) randomR(lo, hi int) int {
	rand.Seed(time.Now().UnixNano())
	return rand.Intn(hi-lo) + lo
}
```

In `randomR`, we use the current time to seed the pseudorandom number generator. We could have also sourced cryptographically secure random bytes from `/dev/urandom` using the `crypto/rand` package but that's beyond the scope of this example.

As these are very simple implementations they do not necessitate unit tests; however, it is of course best practice to unit test whenever possible.

Finally we can implement `main`:

```go
func main() {
	ctx := struct {
		*consoleIO
		*randIO
	}{&consoleIO{}, &randIO{}}

	s := setup(ctx)
	play(ctx, s)
}
```

Notice how similar this is to the tests. The critical difference is that we used the IO implementations instead of the mock.

While certainly a contrived example, I hope it was an illustrative one. The primary takeaway should be that *interfaces are powerful*. In this example, they provided us a way to mock, inject dependencies, decouple business logic from implementation details, and make function definitions more semantically meaningful. In real-life applications you will come up with more interesting effects and implementations. Because they are completely decoupled from business logic you can package them up into an effect library for use across all your projects.

There are a few open source packages that can assist with this pattern. You could use something like [gomock](https://github.com/golang/mock) to generate mock implementations of your effects. You may find yourself constructing very large context `structs` and something like [wire](https://github.com/google/wire) could help automate that. As these types of libraries involve the use of reflection and/or code generation I tend to avoid them; however, they may be necessary for larger projects.

If you're a Haskeller you might be thinking that this all feels very familiar. That's because the pattern came out of my experiences working on [`mtl`](https://hackage.haskell.org/package/mtl) style codebases. Go's interfaces pale in comparison to Haskell's typeclasses but they can still be used to great effect.
