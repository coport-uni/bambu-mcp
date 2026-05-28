# Bambu Printer Connection Reference

This document contains connection details for registering Bambu Lab printers across multiple Claude environments.

---

## Terran Barracks

| 항목 | 값 |
|------|-----|
| ID | `terran-barracks` |
| Name | `Terran Barracks` |
| Model | `P1S` |
| Host (IP) | `192.168.1.235` |
| Serial Number | `01P00C580401626` |
| Access Code | `` |

## Terran Factory

| 항목 | 값 |
|------|-----|
| ID | `terran-factory` |
| Name | `Terran Factory` |
| Model | `X1E` |
| Host (IP) | `192.168.1.131` |
| Serial Number | `03W09C520500510` |
| Access Code | `` |

---

## Registration Prompt

Copy and paste the following message into a new Claude environment to register both printers.

```
Bambu 커넥터에 프린터 2대를 등록해줘.

1번 프린터:
- ID: terran-barracks
- Name: Terran Barracks
- Model: P1S
- IP: 192.168.1.235
- Serial: 01P00C580401626
- Access Code: 

2번 프린터:
- ID: terran-factory
- Name: Terran Factory
- Model: X1E
- IP: 192.168.1.131
- Serial: 03W09C520500510
- Access Code: 
```

---

## Notes

1. **IP address may change** if assigned via DHCP. Consider configuring a static IP or DHCP reservation on the router.
2. **Network requirement**: The client machine must be on the same local network as the printers for MQTT communication. Remote access requires a VPN or port forwarding.
3. **MCP connector required**: The Bambu MCP connector must be installed and active in the target Claude environment for the registration prompt to work.

---

*Last updated: 2026-05-27*
