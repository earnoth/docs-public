# Commands

Checking smartctl on disks
`smartctl -a /dev/da6`

Checking Zpool status
`zpool status`

## Replacing a drive

1. Take the drive offline: `zpool offline data <bad disk ID from zpool status>`
2. Power off the server
3. Replace the failed drive
4. Power on the server
5. Create the geometry: `gpart create -s gtp <new disk OS disk name, eg /dev/da7>`
6. Add a new partition: `gpart add -t freebsd-zfs <new disk OS name, eg /dev/da7>`
7. Replace the failed drive in the zpool: `zpool replace data <bad disk ID from zpool status> <new disk OS name, eg /dev/da7>`
8. This should kick off resilvering which can take days on large filesystems.



# Links

* [TrueNAS core](https://www.truenas.com/truenas-core/)

* [Backing up the OS and config](https://www.truenas.com/docs/core/coretutorials/systemconfiguration/usingconfigurationbackups/)

* [Core Hardware Guide](https://www.truenas.com/docs/core/gettingstarted/corehardwareguide/)

* [System Dataset](https://www.truenas.com/docs/core/uireference/system/systemdataset/)

* [Disk identification](https://www.truenas.com/community/threads/disk-identification.56694/)

* [Zpool disk replacement procedures on CLI](https://docs.oracle.com/cd/E19253-01/819-5461/gbcet/index.html)

* https://www.truenas.com/community/threads/freenas-on-dell-r320-and-dell-r230-sharing-my-impressions.74598/
