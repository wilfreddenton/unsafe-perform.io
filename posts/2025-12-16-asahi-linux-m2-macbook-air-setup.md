<!--metadata
date = 2025-12-16
-->

# Asahi Linux (Fedora + Gnome) M2 MacBook Air Setup

Unlike the bloat of Windows and the form-over-function of MacOS, Asahi Linux offers a refreshingly stable, fast, and productivity-focused experience. What follows is a collection of tips and tricks to get the most out of your Asahi Linux installation.

Why Gnome and not KDE? I just need my system to work and am not that interested in customization. I find Gnome to be more stable and it provides a familiar experience coming from MacOS.

## Swap

The M2 MacBook Air's highest memory configuration is only 16GB which is shared cross the GPU and CPU cores. By default, the swap file is only 8GB. I increase its size to 24GB. This allows me to compile my rust project's integration test suite with more than a single `CARGO_BUILD_JOB`, which would previously OOM.

```bash
sudo /usr/libexec/fedora-asahi-remix-scripts/setup-swap.sh --recreate 24G
```

More info from the previous maintainer [here](https://discussion.fedoraproject.org/t/psa-transitioning-from-zram-swap-to-zswap/138256)

## Install `dnf` Development Groups

For my work, various C compilers and build tools are necessary so this is an easy way to get most commonly used build dependencies:

```bash
sudo dnf install @development-tools @c-development
```

`cmake` is not included in this so you can install with:

```bash
sudo dnf install cmake
```

## Tweaks and Extensions

To further customize gnome, which I do in the following sections, install the "Tweaks" and "Extension Manager" apps from the "Software" store.

## Modifier Keys

Using the "Tweaks" app. Under "Keyboard" -> "Additional Layout Options". I toggle on:

- "Alt and Win Behavior" -> "Alt is swapped with Win"
- "Ctrl position" -> "Caps Lock as Ctrl".

## Windows Style Alt-Tab

I prefer alt-tab to cycle through open windows instead of apps. This can be done by assigning:

"Settings" -> "Keyboard" -> "View and Customize Shortcuts" -> "Navigation" -> "Switch windows"

to "Alt+Tab".

## Enable Notch Screen Area

By default, Fedora Asahi Linux disables the screen area around the notch. This creates a "bezel" effect where the top of the screen is a black bar.

To use the screen space around the notch, you need to add a kernel argument.

```bash
sudo grubby --update-kernel=ALL --args="apple_dcp.show_notch=1"
```

This requires a restart to take effect.

To move the clock in the top bar to the right (so it's not covered by the notch). Install the "Just Perfection" extension. In the extension settings set "Customize" -> "Clock Menu Position" to "Right".

To adjust the top bar height to match the notch height install the "User style sheet" Gnome extension using the "Extension Manager" from the "Software" store.

Create a css file at `~/.config/gnome-shell/gnome-shell.css`.

I use `150%` scale in my display settings and so setting the top bar (panel) height to `35px` does the trick.

```css
#panel {height: 35px !important}
```

The first time you create this file you will need to log out and log back in for the change to take effect. However, for all subsequent changes you can do `Alt + F2` to open the command runner and then enter `rt` to reload. This is useful for testing out different pixel values.

To disable it:

```bash
sudo grubby --update-kernel=ALL --remove-args="apple_dcp.show_notch"
```

## Fonts

To install fonts, simply copy the `*.ttc` or whatever files into `~/.local/share/fonts`. I use [Iosevka](https://typeof.net/Iosevka/).

## Video Playback

By default non-free codecs are not supported but we can enable them by following the steps at the [RPM Fusion Multimedia Guide](https://rpmfusion.org/Howto/Multimedia) which are:

```bash
sudo dnf swap ffmpeg-free ffmpeg --allowerasing
```

```bash
sudo dnf update @multimedia --setopt="install_weak_deps=False" --exclude=PackageKit-gstreamer-plugin
```

I use `mpv` player which can be installed in the "Software" store.

`~/.config/mpv/mpv.conf`:

```
vo=gpu-next
hwdec=auto
```

`/.config/mpv/input.conf`:

```
ctrl+r cycle-values video-rotate 0 90 180 270
ctrl+R cycle-values video-rotate 270 180 90 0
= cycle-values panscan 0 1
```

## Browser

For work I have to use a Chromium based browser. I've found Vivaldi to be the best option that has support for `aarch64`. It can be installed from the "Software" store.

To get two-finger swipe navigation to work install the "Swipe Navigation Gesture" extension from the chrome webstore. I find upping sensitivity to 100% in the extension's settings to provide the best experience.

## Syncthing

The simplest way to setup Syncthing is to download the `syncthing-linux-arm64` tar from the [latest release on github](https://github.com/syncthing/syncthing/releases/latest). There's a `syncthing` binary in the unpacked dir. Add this binary to your path in `.bashrc`. Then follow the [autostart guide for linux](https://docs.syncthing.net/users/autostart.html#linux) to get it to launch. Syncthing can be installed with `dnf` but it is an old version.
