# Capturing Packets

Start the capture (must be in exec mode)
`capture capin interface inside match ip 192.168.10.10 255.255.255.255 203.0.113.3 255.255.255.255`

Look at the captured packets
`show cap capin`

Stop the capture
`no capture capin`

Flush the capture
`clear capture capin`

Capture dropped packets
`capture asp-drop type asp-drop acl-drop`
`show cap`
`show capture asp-drop`

# Troubleshooting

Tracing ICMP
`debug icmp trace`
`no debug icmp trace`

`show logging`


# Packet tracing
Edit the config:
`packet-tracer input Outside icmp 8.8.8.8 0 0 10.0.1.75 detail`

# NAT
* https://www.cisco.com/c/en/us/support/docs/security/asa-5500-x-series-next-generation-firewalls/111842-asa-dynamic-pat-00.html

* https://detailed.wordpress.com/2016/09/26/asa-8-2-nat/

* https://www.adldata.org/wp-content/uploads/2015/06/Cisco_NAT_Cheat_Sheet.pdf

* https://community.cisco.com/t5/security-documents/asa-pre-8-3-to-8-3-nat-configuration-examples/ta-p/3116375

* https://www.geeksforgeeks.org/dynamic-nat-on-asa/

# Access Lists
* https://www.networkstraining.com/how-to-configure-access-control-lists-on-a-cisco-asa-5500-firewall/

# Allowing ICMP to the Internet through a Dynamic NAT configured firewall
* https://community.cisco.com/t5/network-security/unable-to-ping-internet-site-with-inside-interface/m-p/2046410

# v 8.4 docs
https://www.cisco.com/c/en/us/td/docs/security/asa/asa84/configuration/guide/asa_84_cli_config/conns_connlimits.html#32741

# connection flags
https://kb.itzecurity.com/2013/08/asa-tcp-connection-flags.html
