<!--metadata
date = 2020-01-19
-->

# Working With Multiple Git Identities

Not everyone has the luxury of using their personal Github account for all their projects. It's quite common to have a company provided account as well as a few personal accounts. Without the proper local setup this can cause all kinds of issues: having to login every push, authentication errors, commits associated with the "wrong" account, etc. For those of us unfamiliar with `git` and/or `ssh`, wrangling multiple identities can be a daunting task but it's actually quite simple.

If you don't already use `ssh` for cloning and authentication then you will need to switch to that. While it requires some setup, no longer having to login to perform git actions is quite convenient.

Let's assume you have a `work` account and a `personal` account. If you don't already have `ssh` keys for these accounts follow this handy [guide](https://help.github.com/en/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) provided by Github. Once you've created both keys, [add them to your respective Github accounts](https://help.github.com/en/github/authenticating-to-github/adding-a-new-ssh-key-to-your-github-account).

Your `~/.ssh` directory should now look something like this:

```plaintext
.ssh/
|-- id_rsa_work
|-- id_rsa_work.pub
|-- id_rsa_personal
|-- id_rsa_personal.pub
```

There should be a public and private key for both of your accounts. If not, you may have overwritten the first set with the second.

If your `~/.ssh` directory doesn't already contain a `config` file you'll need to create one (`~/.ssh/config`). It should look something like this:

```plaintext
Host github.com-work
  HostName github.com
  User git
  AddKeysToAgent yes
  IdentityFile ~/.ssh/id_rsa_work

Host github.com-personal
  HostName github.com
  User git
  AddKeysToAgent yes
  IdentityFile ~/.ssh/id_rsa_personal
```

At first glance, this configuration may seem confusing but cloning a couple repos should clear things up.

Suppose you have a clone URL for a work repo like this:

`git@github.com:my-company/work-repo.git`

You'd need to change it to this:

`git@github.com-work:my-company/work-repo.git`

Notice how the `host` has changed from `github.com` to `github.com-work`. It's the same `host` that was specified in the `config` file. This tells `ssh` that the `id_rsa_work` key should be used for this repo and to map the custom `github.com-work` host to the actual host `github.com`. Now, to ensure that you're committing and pushing with the right identity, `cd` into the `work-repo` directory and setup a local `git` config.

```plaintext
git config user.name "my-work-username"
git config user.email "my-work-email"
```

As we are not using the `--global` flag, these commands only set the identity for the `work-repo` repo. You will *not* have to set this configuration again unless you delete the directory and reclone.

You can perform the process again for your personal repo swapping out the `github.com-work` custom host with `github.com-personal`, your work username for your personal username, and your work email for your personal email.

This process can be repeated for any number of identities, adding a "block" in the `ssh` config file for each.
