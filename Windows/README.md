# Windows

## Remapping CTRL and CAPS lock

### via aregedit

 Windows Registry Key-remap Changing NT and Win2K Keymaps through the Registry .
 
 1. Run Start→Run…

2. Open: regedt32 to edit the registry.

3. Select the key 

```
HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Keyboard Layout
```

4. From the Edit menu, choose “Add Value” to add a value named “Scancode Map” with type REG_BINARY.

5. Set the value for the layout you want (copy and paste the bold text below, pick one):

* Map CapsLock → Left Ctrl:
```
00 00 00 00 00 00 00 00
02 00 00 00 1d 00 3a 00
00 00 00 00
```

* Swap CapsLock and Left Ctrl:
```
00 00 00 00 00 00 00 00
03 00 00 00 1d 00 3a 00
3a 00 1d 00 00 00 00 00
``` 

* CapsLock→Left Ctrl, Left Ctrl→Left Alt, Left Alt→CapsLock:

```
00 00 00 00 00 00 00 00
04 00 00 00 1d 00 3a 00
38 00 1d 00 3a 00 38 00
00 00 00 00
```

6. Reboot your machine 

### via nircmd
```
nircmd.exe regsetval binary "HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Keyboard Layout\Scancode Map" "00 00 00 00 00 00 00 00 03 00 00 00 1d 00 3a 00 3a 00 1d 00 00 00 00 00"
```

## Windows 11

### Install Windows 11 on VirtualBox

https://www.repairwin.com/how-to-install-windows-11-on-virtualbox-even-without-tpm/

1. At the first install screen, press the SHIFT + F10 keys to launch command prompt.

2. Launch `regedit`

3. In Regedit, navigate to `HKEY_LOCAL_MACHINE\SYSTEM\Setup`

4. Create a new key called `LabConfig`

5. Within the new `LabConfig` key, create 3 `DWORD (32 bit)` Values, with the following names and values

| Value Name | Value |
|------------|-------|
| BypassRAMCheck | 1 |
| BypassSecureBootCheck | 1|
| BypassTPMCheck | 1 |

6. Close Regedit and CMD.EXE

7. Choose Install Now and "I don't have a registry key"

8. Accept the license terms and choose `Custom: Install Windows only (Advanced)` in the following dialogs

9. Complete the install process.

https://blogs.oracle.com/virtualization/post/install-microsoft-windows-11-on-virtualbox


### Restore the classic ribbon in File Explorer
https://www.techrepublic.com/article/how-to-restore-the-classic-file-explorer-in-windows-11/
> To restore the classic ribbon to the File Explorer interface, type `regedit` into the Windows 11 search tool and select Regedit from the search results. In the tree, navigate to this key: 

```
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Shell Extensions6
```

Right-click the Shell Extensions folder and select New | Key and give it the name Blocked

Right-click the Blocked key you just created, and select New | String Value and then enter the following string value as its name: 

```
{e2bf9676-5f8f-435c-97eb-11607a5bedf7}
```
