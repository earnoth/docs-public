# Useful Commands

The following is a list of useful commands that I've learned for Linux, but that I use so rarely, I tend to forget until I need them again. 

## Find command
The find command is far too unappreciated for the power it gives...

### Sort by date desc

`find . -printf "%T@ %Tc %p\n" | sort -n`

## SSH to older servers

`ssh -o KexAlgorithms=diffie-hellman-group14-sha1 -c aes256-cbc -oHostKeyAlgorithms=+ssh-rsa 7 <user@host>`

## CDROM / DVD commands

### Mount an ISO to the filesystem

`mount file.iso /cdrom -t iso9660 -o loop`

### Creating a CD ISO

`dd if=/dev/cdrom of=my_cd_image.iso`

### Making an ISO from a file system

 To create an iso using files in Linux: 
`mkisofs -o image.iso path/`

### Burning a CDROM

`wodim dev=/dev/cdrw -v -data cd_image.iso`

`wodim dev=/dev/cdrw -v -audio [wav files...]`

### Burning a DVD

 To burn a DVD from the filesystem: 

`growisofs -dvd-compat -input-charset=ISO-8859-1 -Z /dev/cdrom -R -J -pad "/path/to/source/dir/structure"`

## Generic Bash

### Redirecting STDERR to a pipe in Bourne/BASH

 Passing *both* stdout and stderr to the pipe. 

`<command> 2>&1 | <command2>`

 Passing only stderr to the pipe: 

```
exec 3>&1 
<command> 2>&1 >&3 3>&- | <command2> 3>&-
exec 3>&-
```

## Backups

### Running remote backups to tape with tar
 Use the following command to dump a directory structure to a remote tape drive: 

`tar cv --rmt-command=/sbin/rmt --rsh-command /usr/bin/ssh -f <remote_host>:/dev/st0 --directory /path/to/source/dir --label "Label for backup" <directory_name>`

 Use the following command to recover a directory structure from a remote tape drive: 

`tar xv --rmt-command=/sbin/rmt --rsh-command /usr/bin/ssh -f <remote_host>:/dev/st0`

 Of course, as always with the tar command, one can specify the files/sub-directories to be recovered if one wishes. 

## rsync usage

 Proper, recursive directory structure copy that preserves permissions, etc. Also can restart partial transfers, just execute the command again after a failure. 

`$ rsync --partial --append --verbose --stats --progress --compress --rsh=/usr/bin/ssh --recursive --times --perms --links <src> <dst>`

 For use with cygwin, set the following variable on the Windows side: 

`set CYGWIN=nontsec`



# CTRL CAPS swap

## Console

Use the following procedure to swich the CTRL with the CAPSLOCK on a standard PC keyboard. 
```
# dumpkeys > /usr/share/keymaps/defkeymap.kmap
# cp /usr/share/keymaps/defkeymap.kmap /usr/share/keymaps/ctrlcaps_switch.kmap
# vi /usr/share/keymaps/ctrlcaps_switch.kmap
# diff /usr/share/keymaps/defkeymap.kmap /usr/share/keymaps/ctrlcaps_switch.kmap
1342c1342
< keycode  29 = Control         
---
> keycode  29 = Caps_Lock        Caps_Lock        Caps_Lock        Caps_Lock      
2575c2575,2576
< keycode  58 = Caps_Lock        Caps_Lock        Caps_Lock        Caps_Lock       
---
> keycode  58 = Control
> 

# loadkeys /usr/share/keymaps/ctrlcaps_switch.kmap 
```

Naturally, the loadkeys command at the end needs to be run each time one logs in. Simply add this to the .bashrc to make the change automatic. (It may be advisable to not add the loadkeys command to root's .bashrc, just in case… 

## Xwindows Keyboard

### Method 1

 Create a text file containing the following text: 

```
!
! Swap Caps_Lock and Control_L
!
remove Lock = Caps_Lock
remove Control = Control_L
keysym Control_L = Caps_Lock
keysym Caps_Lock = Control_L
add Lock = Caps_Lock
add Control = Control_L
```

 If you would like this to take effect immediately, just run 

`$ xmodmap /path/to/file/filename`

### Method 2

`setkxbmap -option "ctrl:swapcaps"`


# Links

https://www.reddit.com/r/archlinux/
https://wiki.archlinux.org/index.php/Dell_XPS_15_9550
https://aur.archlinux.org/packages/bcm20703a1-firmware/

# VirtualBox enable nested hypervisor

https://ostechnix.com/how-to-enable-nested-virtualization-in-virtualbox/

1. Run `vboxmanage list vms`

2. Run `VBoxManage modifyvm <VMname> --nested-hw-virt on`
