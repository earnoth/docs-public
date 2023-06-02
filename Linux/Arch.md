# Arch Linux stuff

## Links

[Kernel parameters at boot](https://wiki.archlinux.org/title/Kernel_parameters#GRUB)

 * [Kernel bug in v5.18](https://www.reddit.com/r/archlinux/comments/v0x3c4/psa_if_you_run_kernel_518_with_nvidia_pass_ibtoff/)
 * [Kernel bug report](https://bugs.archlinux.org/task/74891)



## Installing on a Dell laptop 
This was tested on XPS15 and G15.

### Packages to install

```
pacman -S iw i3-wm i3status lightdm nvidia nvidia-utils screen openssh lightdm-gtk-greeter xf86-video-intel nfs-utils nfsidmap rsync which git firefox chromium base-devel xterm xrdb xorg-xrdb xorg-xmodmap xorg-xbacklight redshift xscreensaver slack flatpak flameshot xsettingsd autocutsel openvpn arandr gimp pavucontrol pulseaudio evince virtualbox virtualbox-host-modules-arch xclip feh dhcpcd xorg-server acpi xorg-mkfontscale
```

### Manually launching wpa_supplicant

```
wpa_supplicant -B -i interface -c /etc/wpa_supplicant/interface-name.conf
```

### Fixing ugly fonts

This works well in my situation.
[Arch Wiki:Font Configuration:GTK applications](https://wiki.archlinux.org/title/Font_configuration#Incorrect_hinting_in_GTK_applications)

### Improving fonts
[From here](https://gist.github.com/YoEight/d19112db56cd8f93835bf2d009d617f7)
Make your Arch fonts beautiful easily!
This is what I do when I install Arch Linux to improve the fonts.

You may consider the following settings to improve your fonts for system-wide usage without installing a patched font library packages (eg. Infinality):

Install some fonts, for example:  
```sudo pacman -S ttf-dejavu ttf-liberation noto-fonts```  

Enable font presets by creating symbolic links:  
```sudo ln -s /etc/fonts/conf.avail/70-no-bitmaps.conf /etc/fonts/conf.d```  
```sudo ln -s /etc/fonts/conf.avail/10-sub-pixel-rgb.conf /etc/fonts/conf.d```  
```sudo ln -s /etc/fonts/conf.avail/11-lcdfilter-default.conf /etc/fonts/conf.d```

The above will disable embedded bitmap for all fonts, enable sub-pixel RGB rendering, and enable the LCD filter which is designed to reduce colour fringing when subpixel rendering is used.

Enable FreeType subpixel hinting mode by editing:

```/etc/profile.d/freetype2.sh```

Uncomment the desired mode at the end:

```  export FREETYPE_PROPERTIES="truetype:interpreter-version=40"```

For font consistency, all applications should be set to use the serif, sans-serif, and monospace aliases, which are mapped to particular fonts by fontconfig.

Create /etc/fonts/local.conf with following:
```
```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
   <match>
      <edit mode="prepend" name="family">
         <string>Noto Sans</string>
      </edit>
   </match>
   <match target="pattern">
      <test qual="any" name="family">
         <string>serif</string>
      </test>
      <edit name="family" mode="assign" binding="same">
         <string>Noto Serif</string>
      </edit>
   </match>
   <match target="pattern">
      <test qual="any" name="family">
         <string>sans-serif</string>
      </test>
      <edit name="family" mode="assign" binding="same">
         <string>Noto Sans</string>
      </edit>
   </match>
   <match target="pattern">
      <test qual="any" name="family">
         <string>monospace</string>
      </test>
      <edit name="family" mode="assign" binding="same">
         <string>Noto Mono</string>
      </edit>
   </match>
</fontconfig>
```
```  
Set your font settings to match above in your DE system settings.

## Laggy Chrome UI

## Java Environments

[Arch Wiki Java Entry](https://wiki.archlinux.org/title/java)

## Optimus Manager 

Handling the dual graphics cards (NVidia and Intel onboard) can be handled via the [Optimus Manager](https://wiki.archlinux.org/title/NVIDIA_Optimus#Use_integrated_graphics_only) package, which must be installed via AUR.

### Breakage

Optimus will sometimes break with the following error following a system update with `pacman`, which will break Xwindows and put the console in a permanent loop.  

```
Traceback (most recent call last):
  File "/usr/lib/python3.11/importlib/metadata/__init__.py", line 563, in from_name
    return next(cls.discover(name=name))
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
StopIteration

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "/usr/bin/optimus-manager", line 33, in <module>
    sys.exit(load_entry_point('optimus-manager==1.4', 'console_scripts', 'optimus-manager')())
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/usr/bin/optimus-manager", line 22, in importlib_load_entry_point
    for entry_point in distribution(dist_name).entry_points
                       ^^^^^^^^^^^^^^^^^^^^^^^
  File "/usr/lib/python3.11/importlib/metadata/__init__.py", line 981, in distribution
    return Distribution.from_name(distribution_name)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/usr/lib/python3.11/importlib/metadata/__init__.py", line 565, in from_name
    raise PackageNotFoundError(name)
importlib.metadata.PackageNotFoundError: No package metadata was found for
optimus-manager

```

To gain access to the system, it is necessary to boot from an Arch install image, mount the filesystems (`/mnt`, `/mnt/boot`, and so forth, then disable the `optimus-manager` in `systemd`:  `systemctl optimus-manager disable`.

The [issue is documented here]() on the Github repository for the project.  [This comment](https://github.com/Askannz/optimus-manager/issues/272#issuecomment-1010192798) on another Issue on the same repository documents how to fix it.  

An alternative procedure is

1. Uninstall optimus-manager
2. Clone a fresh copy of the repository locally.
3. Run `makepkg -si` in the fresh cloned copy.
