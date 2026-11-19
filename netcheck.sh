#!/usr/bin/env bash
# netcheck.sh - collect Wi-Fi / network diagnostics for analysis.
# Usage: bash netcheck.sh > netcheck.txt   (Linux or macOS, run while on Wi-Fi)
# Read-only: it changes no settings. nmap scan runs only if nmap is installed.

section() { printf '\n===== %s =====\n' "$1"; }
OS=$(uname -s)

section "System"
uname -a; date

section "Default gateway (router)"
if [ "$OS" = "Darwin" ]; then
  GW=$(route -n get default 2>/dev/null | awk '/gateway/{print $2}')
else
  GW=$(ip route 2>/dev/null | awk '/^default/{print $3; exit}')
fi
echo "Gateway: ${GW:-not found}"

section "Interfaces and IP addresses"
if [ "$OS" = "Darwin" ]; then ifconfig | grep -E '^[a-z]|inet '; else ip -br addr; fi

section "Wi-Fi link (signal, channel, rate)"
if [ "$OS" = "Darwin" ]; then
  system_profiler SPAirPortDataType 2>/dev/null | sed -n '1,80p'
else
  command -v iw >/dev/null && for i in $(iw dev | awk '/Interface/{print $2}'); do iw dev "$i" link; done
  command -v nmcli >/dev/null && nmcli -f IN-USE,SSID,CHAN,FREQ,SIGNAL,RATE,SECURITY dev wifi list
fi

section "Latency to router (Wi-Fi quality)"
[ -n "$GW" ] && ping -c 20 "$GW" | tail -3

section "Latency to internet (1.1.1.1)"
ping -c 20 1.1.1.1 | tail -3

section "DNS resolution time"
for h in google.com microsoft.com github.com; do
  /usr/bin/time -p nslookup "$h" >/dev/null 2>/tmp/dns_$$; echo "$h: $(awk '/real/{print $2}' /tmp/dns_$$)s"
done; rm -f /tmp/dns_$$
grep nameserver /etc/resolv.conf 2>/dev/null

section "Route to internet"
if command -v traceroute >/dev/null; then traceroute -n -m 12 -w 2 1.1.1.1; else echo "traceroute not installed"; fi

section "Download speed (100 MB test file, Cloudflare)"
curl -s -o /dev/null -w 'speed: %{speed_download} bytes/s, time: %{time_total}s\n' \
  --max-time 30 'https://speed.cloudflare.com/__down?bytes=100000000'

section "Devices on the local network"
if command -v nmap >/dev/null && [ -n "$GW" ]; then
  nmap -sn "${GW%.*}.0/24" | grep -E 'report|MAC'
else
  arp -a
fi
