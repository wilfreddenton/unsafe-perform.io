<!--metadata
date = 2023-04-02
-->

# Bing Helped Me Write a Lua Plugin for Neovim

**Prompt**:
> Write me a neovim lua script that keeps a history of buffers for each window
> and has a command for going backwards and forwards in history.

**Answer**:
```lua
local history = {}
local current = 0

function AddToHistory()
  local bufnr = vim.fn.bufnr()
  local winid = vim.fn.win_getid()
  local entry = {bufnr, winid}
  table.insert(history, entry)
  current = #history
end

function GoBack()
  if current > 1 then
    current = current - 1
    local entry = history[current]
    vim.fn.bufload(entry[1])
    vim.fn.win_gotoid(entry[2])
  end
end

function GoForward()
  if current < #history then
    current = current + 1
    local entry = history[current]
    vim.fn.bufload(entry[1])
    vim.fn.win_gotoid(entry[2])
  end
end

vim.cmd([[autocmd BufEnter * lua AddToHistory()]])
vim.cmd([[command! -nargs=0 Back lua GoBack()]])
vim.cmd([[command! -nargs=0 Forward lua GoForward()]])
```

In less than 5 seconds Bing spits out the above. A quick read of it puts me in
a state of mild shock. For someone who has never written Lua and is totally
unfamiliar with the Neovim related APIs, this output is incredibly useful.

## The Good

**The generated code contains examples of basic Lua syntax**:

```lua
function Name() -- function definitions
end

if P then -- if statements
end

local name = {} -- variable definitions

#history -- length of table

table.insert(index, value) -- append to table
```

I'm not sure what `[[]]` in the `vim.cmd()` means so I ask Bing:

**Prompt**:
> what is double bracket syntax in lua

**Answer**:
> In Lua, double square brackets are used to enclose literal strings which
> traverse several lines.

There's further info and links to Lua docs and stack overflow as well.

**It familiarizes me with some of the Neovim specific APIs that are necessary
for the plugin**:
```lua
vim.fn.bufnr() -- get the number (ID) of the current buffer

vim.fn.win_getid() -- get the ID of the current window

vim.fn.bufload(bufnr) -- load a buffer by its number into the current window

vim.fn.win_gotoid(winid) -- move to window by its ID

vim.cmd() -- run vim script
```

**Note**: I later changed these to the `vim.api.nvim_*` equivalents. When asked, Bing served them up without a hitch.

**It provides me with a basic structure for the plugin**:

```text
- track the history in a table

- track the current place in history

- function for adding new buffers into history

- function for going backwards in history

- function for going forwards in history

- use autocommand to track `BufEnter` events and handle them with the add function
```

So does it work? **No**, and I'm thankful for that. I will remain employed for
the foreseeable future 😅.

## The Bad

**The `vim.cmd` block at the bottom of the script is essentially vim script and
not Lua**.

I asked Bing if it was possible to do this in pure Lua:

**Prompt**:
> how to create an autocommand for neovim in lua

**Answer**:
> ... You can also use `vim.api.nvim_create_autocmd()` to create autocommands

The answer includes a link to the Neovim Lua docs where I can learn more about
this function.

**The script maintains a global history across all windows instead of a
separate history for each window**.

I prompt Bing a couple times to try and fix this issue but never get any output
better than the original. I think this "nesting" is a bit beyond the AI's
current capabilities.

**The script does not delete entries past the current index when opening a new
file**:

```text
history:
  1. file_b
  2. file_a <- current
  3. file_d

action:
  open file_r

expected:
  1. file_b
  2. file_a
  3. file_r <- current

actual:
  1. file_b
  2. file_a
  3. file_d
  4. fild_r <- current
```

To be fair, I didn't tell Bing that I wanted this behavior and honestly, I'm
not really sure how to put it into simple enough terms for a prompt anyways.
I'll just implement it manually.

**Even if the buffer being added is the same as the current buffer, the script
adds a new entry in history**.

```text
history:
  1. file_b
  2. file_a <- current
  3. file_d

action:
  open file_a

expected:
  1. file_b
  2. file_a <- current
  3. file_d

actual:
  1. file_b
  2. file_a
  3. file_d
  4. file_a <- current
```

While there's plenty of work to be done, I'm significantly more confident in my
ability to complete the plugin because I have a great assistant--Bing.

## My First Neovim Plugin!

A few more hours of coding across a couple days and about 30 Bing prompts
later, I have the plugin in a satisfactory state.

[history.nvim](https://github.com/wilfreddenton/history.nvim/)

Take a look at the code. You'll see that a lot of the generated script's DNA
remains. The largest addition is another command to display the history in a
popup.

Manually scanning through the Neovim Lua docs is slow. It's better to first ask
Bing questions like "Using lua how can I set the position of the cursor in
neovim?" and "Using lua how can I close a window in neovim?" At worst the
chatbot provides something to search for in the docs and at best gives a
complete answer with an explanation and sources.

While there are, of course, many issues with the way large language models have
been unleashed onto the world, so far, I am grateful for them. Bing chat is an
excellent tool for exploring domains outside my immediate area of expertise. It
does not invalidate my years of experience; it enhances it. Without that
experience, I would never have been able to take what Bing generated and turn
it into what I envisioned. I wouldn't know what was good or bad about it. It
does however, greatly increase the velocity at which I am able to develop.

Thanks Bing 💙.
