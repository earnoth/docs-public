# Security

## Reports
[Awesome Annual Security Reports](https://github.com/jacobdjwilson/awesome-annual-security-reports)

## Splunk
Configuring filter extractions for Snort
```
Name	 Type	 Extraction/Transform	 Owner	 App	 Sharing	 Status	Actions
syslog : EXTRACT-dip	 Inline	 \d+\.\d+\.\d+\.\d+(?:\:\d+)* -> (?<dip>\d+\.\d+\.\d+\.\d+)(?:\:\d+)*\s*$	
syslog : EXTRACT-dport	 Inline	 -> \d+\.\d+\.\d+\.\d+\:(?<dport>\d+)\s*$	
syslog : EXTRACT-gid	 Inline	 \[(?<gid>\d+)\:\d+\:\d+\]	
syslog : EXTRACT-sid	 Inline	 \[\d+\:(?<sid>\d+)\:\d+\]	
syslog : EXTRACT-signame	 Inline	 \[\d+\:\d+\:\d+\]\s*(?<signame>.+?)\s*\[Classification	
syslog : EXTRACT-sip	 Inline	 (?<sip>\d+\.\d+\.\d+\.\d+)(?:\:\d+)* -> \d+\.\d+\.\d+\.\d+(?:\:\d+)*\s*$	
syslog : EXTRACT-sport	 Inline	 \d+\.\d+\.\d+\.\d+\:(?<sport>\d+) ->	
```

## Enabling SSL on Apache

### Enabling SSL on Apache

Create a CA certificate for self-signing. 
```
openssl genrsa -des3 -out my-ca.key 2048
openssl req -new -x509 -days 3650 -key my-ca.key -out my-ca.crt
openssl x509 -in my-ca.crt -text -noout
```

Create a private key and CSR, then sign them both with the CA cert just created. 
```
openssl genrsa -des3 -out wilmuctf.key 1024
openssl req -new -key wilmuctf.key -out wilmuctf.csr
openssl x509 -req -in wilmuctf.csr -out wilmuctf.crt -sha1 -CA my-ca.crt -CAkey my-ca.key -CAcreateserial -days 3650
```
 
## Netflow

### Receiving Netflow on Ubuntu

```
apt-get install flow-tools
# grep mnt /etc/flow-tools/flow-capture.conf 
-w /mnt/data/log/flow/<router1_name> -N 3 0/<router1_ip>/<port1>
-w /mnt/data/log/flow/<router2_name> -N 3 0/<router2_ip>/<port2>
```

### Processing pcap with Argus

From http://www.qosient.com/argus/gettingstarted.shtml

#### Analysing Packet Files

Argus processes packet data and generates summary network flow data. If you have packets, and want to know something about whats going on, argus() is a great way of looking at aspects of the data that you can't readily get from packet analyzers. How many hosts are talking, who is talking to whom, how often, is one address sending all the traffic, are they doing the bad thing? Argus is designed to generate network flow status information that can answer these and a lot more questions that you might have.

If your running argus for the first few times, get a packet file from one of the IP packet repositories, such as pcapr and process them with argus(). Once you have both the server and client programs and a packet file, run:

```
argus -r packet.pcap -w packet.argus
ra -r packet.argus
```

