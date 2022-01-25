# iPad Pro: My Daily Driver

<video src="//i.imgur.com/IWEfb3F.mp4" autoplay loop muted playsinline></video>

The 2018 12.9" iPad Pro has been my daily driver for over a year. While imperfect, the experience far exceeded my expectations and I may never purchase a laptop again.

Awhile back, I realized my MacBook Pro wasn't being used to its full potential. 99% of the time only Firefox and Emacs were running. When it came time for a new machine, I purchased a mid-tier ThinkPad which was significantly cheaper than the available MacBook Pros but comparable in specs. During its period of use, I tried three different operating systems: Ubuntu, Manjaro, and NixOS. While each has its pros and cons, the primary issue I had with all of them was the web browsing experience. Mixing and matching hardware with software can never result in the kind of performance I'd come to expect living in Apple's walled garden.

Eventually I found myself back in the Apple Store to pickup some AirPods. As I was leaving with my bougie new headphones, the iPad Pro caught my eye. I immediately noticed the 120hz display. It gave the apps a feeling of "realness" I'd never experienced before. Tablets had always seemed superfluous, used only by people whose work consists primarily of emailing. Now, based almost entirely on the quality of the display, I wanted to see if the iPad could work for me.

After a year of use, I'm very pleased with the experience provided by the iPad's stellar hardware, quality app ecosystem, and the many useful accessories.

## Hardware

There's really no way to describe the display. If you haven't used it, go to an Apple Store and try it. While the 4:3 aspect ratio may be a turn off to some, I've found that it is better for web browsing and coding than the more common 16:9 aspect ratio. The 12.9" display has plenty of width to make HD and 4K video feel immersive. The colors are full of life and the blacks are the deepest I've seen on an LCD. The 264ppi resolution makes text crisp and easy to read.

Complimenting the display is the Apple A12X Bionic chip which seems to never break a sweat. The animations are fluid, media editing performance is incredible, and you can [play Fortnite at 120fps](https://www.theverge.com/2020/1/19/21073526/fortnite-ipad-pro-frame-rate-120-fps).

The build quality and design is the best I've seen from Apple in years. The return of the boxy design—reminiscent of the iPhone 5—makes it look both classy and tactical.

Perhaps the most impressive aspect of the iPad Pro's hardware is the truly all day battery life. I routinely get 8 hours of screen on time and never worry about running out.

I do find that, with a rather pitiful 6GB of RAM, iPadOS must perform aggressive RAM management, "blanking out" apps when you switch away from them. I hope the situation will improve as iPadOS deviates from iOS and new models ship with more RAM.

## Software

### Safari

Safari evolved from a blown up phone app to an *almost* desktop class browser in iPadOS 13. With fast rendering, slick animations, a FaceID integrated password manager, landscape and portrait view modes, ad blocker extensions, and the always convenient form factor of the iPad, it's the best way to view the web. However, it's not without its faults.

Support for complex web apps is still lacking. For those who view and create spreadsheets or slideshows extensively, the iPad setup just doesn't work. The native apps have only a fraction of the features compared to their desktop counterparts and the web apps are impractical to use on iPadOS Safari. I believe these problems will eventually be solved as the iPad becomes more widely used in the workplace.

Another issue with Safari is the ephemerality of tabs. A result of the more general RAM problem I discussed previously, iPadOS will frequently blackout tabs and reload them next time they're viewed.

### [Blink Shell](https://apps.apple.com/us/app/blink-shell-mosh-ssh-client/id1156707581)

This app is the core of the setup. When opened, it presents you with a unix-like command prompt providing a small palette of commands. As `Blink` is not a full unix environment, for this setup to work, a remote development server is required. The two remote connection utilities provided by Blink are `mosh` and `ssh`. For those unfamiliar with the greatness of [`mosh`](https://mosh.org/), think of it like an enhanced `ssh`. Predictive updating and support for intermittent connectivity provide the feeling of working locally.

In theory, `mosh` should maintain a connection to the remote server even after locking the iPad or changing WiFi connections. In practice, `mosh` will occasionally be unable to automatically reconnect. I believe this happens when using WiFi networks that have multiple and/or poorly setup access points. For the times when `mosh` drops the ball, `tmux` is there. Because my server is running both `mosh` and `tmux` I can connect to it with:

```plaintext
mosh <host> -- tmux a -d
```

This will attach (`a`) my new `mosh` session to the existing `tmux` session and detach (`-d`) the broken `mosh` session. Put simply, it reopens my development environment exactly as I left it. Here's my `~/.tmux.conf`:

```plaintext
new-session
set status-utf8 on
set utf8 on
set -g default-terminal "screen-256color"
set -g status off
```

`set -g status off` will disable the `tmux` status bar which completely hides the fact that `tmux` is in use.

While it may seem like a pain to work in a remote server, one significant benefit is that no matter what computer you're on, you can connect to your development environment.

For those of you who want to use a Graphical IDE, Blink and `mosh` will not help you with that. What I've described is only for terminal based editor users. I have not explored the ecosystem for iPad app IDEs but I imagine the offerings are pretty limited.

### Files

The Files app was a welcome sight when it released with iOS 11. Since then it has been improved significantly. You can now view and manage external hard drives, USB drives, and SD cards. However, for the purposes of my setup, it lacks the crucial ability to (S)FTP into a remote server. For that I use [FileBrowser](https://apps.apple.com/us/app/filebrowser-document-manager/id364738545). Interoperability between the two apps is superb. They can be viewed side by side allowing me to drag multiple files from my remote server into the Files app and vice versa. FileBrowser even provides an extension allowing me to manage my remote files within the Files app.

A tip for using FileBrowser: when you setup an SFTP connection you can authenticate with an `ssh` key by saving the private key in the "My Private Files" folder. The name of the key file must follow this pattern:

```plaintext
<user>.<ip_address>.<port>.sftp
```

If you're looking for a free alternative to FileBrowser, give [FTPManager](https://apps.apple.com/us/app/ftpmanager-ftp-sftp-client/id525959186) a try.

## [iVim](https://apps.apple.com/us/app/ivim/id1266544660)

Unfortunately, support for copying text from the remote shell into a local iPad app is poor. For example, the copying mechanism on the iPad does not understand the separation of "windows" in Emacs. It copies at the "cell" level. I'm forced to copy from the contents of a remote file. I navigate to the remote file in FileBrowser and then share and open the file with iVim. iVim is a port of Vim which seems to be able to open plaintext files of any extension. I copy the necessary lines in iVim and then paste wherever I need to. Fortunately, Copying from an app into the remote shell does work well.

## [Inspect Browser](https://apps.apple.com/us/app/inspect-browser/id1203594958)

For front end web development, you need to be able to view the UI in a browser. At first this seems impossible with just a remote shell but it's entirely possible with just a bit of setup. First, open up a range of TCP ports on your remote server. Then you can run the UI's backend on a port in the range. For example, you might run a web server you're working on at `http://localhost:1337` now you can view it in your iPad's Safari at `http://my.servers.public.ip:1337`. The problem is that Safari doesn't provide any web tools and caches static assets aggressively. This is where Inspect Browser comes in. It gives you many of the tools that the Chrome web inspector provides albeit in a clunkier interface.

## [iA Writer](https://apps.apple.com/us/app/ia-writer/id775737172)

iA Writer is my favorite markdown editor which I use to write blog posts and documentation. There are plenty of others to choose from but I've found this one to be the best.

## [Octal](https://apps.apple.com/us/app/octal/id1308885491)

Octal is a great way to read Hacker News on the iPad.

## Accessories

### [HyperDrive 6-in-1 USB-C Hub](https://www.hypershop.com/products/hyperdrive-6-in-1-hub-for-ipad-pro-2018)

If you only buy one accessory, this is the one to buy. With a complete array of ports, HDMI, SD card, Micro SD, USB-A (outbound charging), USB-C (2-way charging), and the much coveted 3.5mm audio jack, this thing is the real deal. For $70 this dongle provides incomparably more value than anything Apple has to offer.

The main issue has nothing to do with the accessory itself. iPadOS still has embarrassingly poor external display support. By default, apps will mirror themselves in a fixed 4:3 aspect ratio (even if the external display is 16:9). For better support, apps have to implement that themselves. Blink properly utilizes an external display by rendering a resolution adapting terminal.

### [Brydge Pro](https://www.brydge.com/products/brydge-for-ipad-pro-2018)

Do not buy this keyboard. My experience with it was very poor. While it sports an impressive amount of features, the execution is lackluster. The clamps that hold onto the iPad move independently making it difficult to fit the device in place. These clamps are covered in cheap rubber sleeves that slip off constantly and eventually rip due to strain from repeatedly attaching and detaching the iPad. The thin rubber bumpers that are supposed to keep the iPad raised above the keyboard while in the closed position are too far from the edge. As a result, the top of the iPad hits the metal of the keyboard which could scratch the glass or even bend the chassis. The keys themselves, while having decent travel, are made from a terrible cheap plastic. As this is a bluetooth keyboard you will have to worry about charging it; however, the battery does last a very long time.

### [Apple Smart Keyboard](https://www.apple.com/smart-keyboard/)

While a flawed device, I've had a much better time with this keyboard than the Brydge. The texture of the keys feels premium, the closed position keeps the iPad flush against the keyboard, and it doesn't need to be charged. If Apple figures out a way to give it a hinge instead of just the two viewing angles it would be significantly better. The $200 price tag is absurd but what else can you expect from Apple.

### [HHKB Professional Hybrid Type-S](https://fujitsuscannerstore.com/cg01000-297001/)

Fujitsu recently added Bluetooth 4.2 and USB-C to an already incredible keyboard. It works perfectly with my iPad and my Windows Desktop. I can send an iMessage on the iPad, press a key combo, and then immediately be playing [Path of Exile](https://www.pathofexile.com) on the PC.

### [Apple Pencil](https://www.apple.com/apple-pencil/)

The 2nd generation Apple Pencil is an impressive gadget. The magnetic wireless charging mechanism works perfectly. I use it often for "back of the napkin" math, service architecture diagrams, and wireframes. As I don't draw often, I probably could have bought a cheaper stylus, but the sleek design and perfect compatibility with the iPad won me over.

### [Logitech MX Master 2S](https://www.amazon.com/Logitech-Master-Wireless-Mouse-Rechargeable/dp/B071YZJ1G1)

iPadOS 13 brought minimal mouse support to the iPad. It doesn't function like a desktop mouse instead acting more like a "virtual finger". Still, it makes using the iPad with an external display and keyboard much easier. Any bluetooth [BT] mouse with extra buttons should work well. I use an MX Master 2S, mapping the additional buttons to various iPad actions like opening up the App Switcher. The new [Logitech MX Master 3](https://www.amazon.com/Logitech-Master-Advanced-Wireless-Mouse/dp/B07S395RWD) would be great as well.

When traveling, I use the the [Microsoft Arc Mouse](https://www.amazon.com/Microsoft-Arc-Mouse-ELG-00001-Black/dp/B072FG8LBV). The design is sexy and the innovative snap feature proves Microsoft can *think different*. Usability was clearly sacrificed for portability but it gets the job done when you're on the go.

I wish the Magic Trackpad was more compatible with iPadOS. Using gestures instead of buttons to perform actions would provide a more familiar way to interact with an iPad.

To use a BT mouse with your iPad go to the following settings menu:

```plaintext
Settings -> Accessibility -> AssistiveTouch
```

Here there is a toggle to turn on AssistiveTouch as well as a bunch of other settings. I like to turn the "Idle Opacity" to the lowest. In "Pointer Style" I choose the smallest possible size. In "Devices" you can connect the BT mouse. Once connected, you can tap the device to map actions to buttons.

I also like to add the "Accessibility Shortcuts" control to Control Center and enable the AssistiveTouch shortcut so it's easy to toggle on and off.

Unfortunately, mouse support is still buggy. For some reason iPadOS thinks that my mouse is also a keyboard. If I disconnect my USB keyboard (plugged in with the HyperDrive dongle) while the BT mouse is still connected, no on-screen keyboard will appear. If I connect the keyboard while the BT mouse is connected, none of the commands like `Command + Tab` or `Command + Space` will work within apps but *will* work on the home screen. This forces you to consider the order in which you connect your devices. Start with the BT mouse turned off. Connect the keyboard, then turn on the BT mouse which should automatically connect if paired. When disconnecting the keyboard just make sure the mouse gets turned off and the on-screen keyboard should appear.

Additionally, the mouse related animations are ugly. The cursor practically jumps around the screen and scrolling with the mouse wheel is a stutter-fest. It's a pretty poor experience so far but still manages to be better than touch when using the iPad as part of a larger setup.

## Insecure About the Future

I plan on using this setup into the foreseeable future but there are some concerns.

It seems that Blink is [maintained by a single person](https://github.com/blinksh/blink/commits/raw). While I have nothing but respect for yury, I can't help but think that dealing with [hundreds of issues](https://github.com/blinksh/blink/issues) alone will cause burnout eventually. The only other option I see in the app store is [Terminus](https://apps.apple.com/us/app/termius-ssh-client/id549039908) but it doesn't share the minimalist philosophy I love so much about Blink.

`mosh` hasn't seen a release since summer 2017. There's an [issue](https://github.com/mobile-shell/mosh/issues/974) about it on Github but it doesn't seem like much progress is being made. As there really is nothing else like `mosh`, this is potentially a huge problem for the longevity of the setup.

iPadOS needs desktop class RAM management and generally iPads need more RAM. If apps on your laptop had their state cleared every so often you would be upset right? If I have an app open it's because I'm using it and I need its state to be maintained.

The fact that the $200 Apple Smart Keyboard is the best portable keyboard option I've found is sad. Somebody, other than Brydge, please make a keyboard that has a 360 degree hinge and a built-in trackpad.

## I Need an Appliance not a Computer

At the risk of starting a war, to me, an iPhone is just a fancy phone and an Android is a computer in your pocket. While this may seem like a rag on iPhone, this is exactly why I use one. I don't need a phone to do all the things Android is capable of. I just need it do a few important things reliably. The iPhone is an appliance and so is the iPad. That's why it works for me. The vast majority of my work is web browsing and Emacsing, the iPad provides these two capabilities in a way no laptop can.
