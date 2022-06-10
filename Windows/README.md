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

### Install Windows 11 Pro on VirtualBox

https://blogs.oracle.com/virtualization/post/install-microsoft-windows-11-on-virtualbox


