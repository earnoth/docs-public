# Storage

## S.M.A.R.T

Checking disk
`smartctl -a /dev/ada0`

### Smartmontools

* https://sourceforge.net/p/smartmontools/mailman/smartmontools-support/thread/4DAC90F2.4070805%40t-online.de/

## Configuring RAID1
 Before creating the RAID volume, be sure to partition the entirety of all disks to be used with type “Linux raid auto” (code 0xfd). 

```
mdadm --create /dev/md0 --verbose --level=5 --raid-devices=6 /dev/sdg1 /dev/sdh1 /dev/sdi1 /dev/sdj1 /dev/sdk1 /dev/sdl1
mdadm --manage --add /dev/md0 /dev/sdd1
```

## LVM config
```
pvcreate /dev/md0
vgcreate datavg /dev/md0
lvcreate --name datalv --size 179.99G datavg
lvextend -L +1G -t /dev/datavg/datalv
mkfs.ext3 -m 0 -t largefile /dev/datavg/datalv
```

## Restoring an old array on a new server

```
apt-get install mdadm lvm2
```

After installing those tools, you can assemble the existing raid and finally scan for the lvm: 

```
mdadm --assemble /dev/md0 /dev/sda1 /dev/sdb1
mdadm --detail --scan
vgchange -a y
```

fstab entry 
```
/dev/datavg/datalv       /mnt/data               ext4    errors=remount-ro 0       1
```
