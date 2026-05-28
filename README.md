# Bambu MCP (Fork)

An [MCP (Model Context Protocol)](https://modelcontextprotocol.io/) server for controlling Bambu Lab 3D printers from Claude Desktop.

> Original repo: [griches/bambu-mcp](https://github.com/griches/bambu-mcp)

## What this fork adds

- **Beginner-friendly setup guide** for first-time MCP and npm users
- **Printer connection reference** (`bambu-printers.md`) for quick registration across environments
- **Claude Desktop config example** (`claude_desktop_config.json`)

All printer features (H2D support, AMS auto-mapping, plate auto-detection, etc.) come from the original repo.

## Supported Printers

| Printer | Tested |
|---------|:------:|
| Bambu Lab P1S | Yes |
| Bambu Lab X1E | Yes |
| Bambu Lab H2D | Yes |
| Bambu Lab A1 Mini | Yes |

Should work with any Bambu Lab printer that supports MQTT over LAN (X1C, X1, P1P, A1, etc.).

---

## Setup Guide (Step by Step)

### Step 1: Install Node.js

The MCP server requires Node.js 18 or later.

1. Download the **LTS version** from [nodejs.org](https://nodejs.org/)
2. Run the installer with default options
3. Open a **new** terminal (PowerShell or Command Prompt) and verify:

```powershell
node --version    # v18.x.x or higher
npm --version     # any number is fine
```

> Skip this step if Node.js is already installed.

### Step 2: Clone and Build

```powershell
# Navigate to your preferred directory
cd C:\Users\YourName\Desktop

# Clone this repo
git clone https://github.com/coport-uni/bambu-mcp.git

# Enter the directory
cd bambu-mcp

# Install dependencies
npm install

# Build
npm run build
```

A successful build creates `dist/index.js`. You'll need the **absolute path** to this file in the next step.

### Step 3: Register the MCP Server in Claude Desktop

1. Open Claude Desktop and go to **Settings**
2. Click the **Developer** tab on the left
3. Click **Edit Config** to open `claude_desktop_config.json`
4. Paste the following, replacing the path with your own:

```json
{
  "mcpServers": {
    "bambu": {
      "command": "node",
      "args": [
        "C:\\Users\\YourName\\Desktop\\bambu-mcp\\dist\\index.js"
      ]
    }
  }
}
```

> **Windows paths** use `\\` (double backslash) in JSON.

5. Save the file, then **fully quit and relaunch** Claude Desktop

### Step 4: Verify the Connection

After relaunching Claude Desktop, look for the **hammer icon (MCP Tools)** below the chat input. Click it — you should see tools starting with `bambu`.

> If the icon doesn't appear: check that the path in your config is correct and that `node dist/index.js` runs without errors in a terminal.

---

## Printer Setup (On the Printer)

Before the MCP server can communicate with your printer:

### Enable LAN Only Mode

On the printer's touchscreen, go to **Settings > Network** and enable **LAN Only Mode**.

> Enabling LAN Only Mode disables cloud features (Bambu Handy app, cloud printing). All control is local only.

### Enable Developer Mode

On the **Settings > Network > LAN Only Mode** screen, enable **Developer Mode**.

### Note Your Connection Details

| Info | Where to Find |
|------|--------------|
| **IP Address** | Settings > WLAN (or Bambu Studio Device tab) |
| **Access Code** | Settings > WLAN (shown after enabling Developer Mode) |
| **Serial Number** | Settings > Device (or label on the printer) |

---

## Register a Printer (In Claude Desktop)

Once the MCP server is running, ask Claude in natural language:

```
Register a printer.
- IP: 192.168.1.235
- Access Code: 30430928
- Serial: 01P00A3B0900744
- Model: P1S
- Name: My Printer
```

Printer configs are saved to `~/.bambu-mcp/printers.json` and automatically reconnect on server restart.

---

## Available Tools

### Printer Management

| Tool | Description |
|------|-------------|
| `add_printer` | Register a printer (IP, access code, serial) |
| `remove_printer` | Remove a printer |
| `reconnect_printer` | Reconnect after network changes |
| `list_printers` | List registered printers and connection status |

### Status

| Tool | Description |
|------|-------------|
| `get_status` | Print progress, temperatures, speed, AMS, lights |
| `get_version` | Firmware and module version info |

### Print Control

| Tool | Description |
|------|-------------|
| `start_print` | Start printing from SD card (auto-detects 3MF plate) |
| `pause_print` | Pause current print |
| `resume_print` | Resume paused print |
| `stop_print` | Cancel current print |
| `skip_objects` | Skip specific objects in a multi-object print |

### Hardware

| Tool | Description |
|------|-------------|
| `set_speed` | Change print speed (silent, standard, sport, ludicrous) |
| `set_light` | Toggle chamber/work lights |
| `set_temperature` | Set nozzle/bed temperature (with safety limits) |
| `set_nozzle` | Set nozzle diameter |

### File Management

| Tool | Description |
|------|-------------|
| `list_files` | List files on SD card |
| `upload_file` | Upload .3mf or .gcode file |
| `download_file` | Download a file |
| `delete_file` | Delete a file |

### Camera

| Tool | Description |
|------|-------------|
| `set_recording` | Toggle camera recording |
| `set_timelapse` | Toggle timelapse recording |

### AMS / Filament

| Tool | Description |
|------|-------------|
| `change_filament` | Switch to a different AMS tray |
| `unload_filament` | Unload filament from extruder |

### G-code

| Tool | Description |
|------|-------------|
| `send_gcode` | Send raw G-code (dangerous commands blocked) |

---

## Printer Targeting

Every printer tool accepts an optional `printer` parameter:

- **Specific printer** — use the printer ID (e.g., `"terran-barracks"`)
- **All printers** — use `"all"` to run on every connected printer
- **Auto-select** — omit the parameter when only one printer is configured

---

## Communication

| Protocol | Port | Purpose |
|----------|------|---------|
| MQTT (TLS) | 8883 | Commands and status updates |
| FTP (implicit FTPS) | 990 | File upload/download |

---

## Troubleshooting

### MCP tools don't appear in Claude Desktop
- Verify the path in `claude_desktop_config.json` uses `\\` (double backslash)
- Fully quit Claude Desktop (including system tray) and relaunch
- Run `node C:\...\dist\index.js` in a terminal to check for errors

### Can't connect to the printer
- Confirm the printer and computer are on the **same network**
- Confirm both **LAN Only Mode** and **Developer Mode** are enabled
- The IP address may have changed — check the printer's touchscreen
- Try the `reconnect_printer` tool

### IP address keeps changing
- Set a **static IP (DHCP reservation)** for the printer in your router settings

---

## License

MIT — see the [original project](https://github.com/griches/bambu-mcp) for details.
