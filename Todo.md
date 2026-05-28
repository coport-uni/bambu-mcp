## 2026-05-28 | Fix start_print silent failure & ams_mapping length mismatch

- [x] Default `path` to `"/"` in `start_print` and `start_prints` tool handlers to prevent silent failure when path is omitted
- [x] Add post-print status verification (3s delay + `requestStatus()`) — warn if printer remains IDLE/FAILED after accepted command
- [x] Extract `total_filament_slots` from 3MF `Metadata/slice_info.config` `filament_maps` to determine correct ams_mapping array length
- [x] Update `buildAmsMapping` to pad array to match slicer filament slot count (identity mapping for unused slots)
- [x] Apply same fixes to both `start_print` and `start_prints` handlers
- [x] Verify TypeScript build passes
- [x] Fix arrow function style to match codebase convention: `(r) =>` not `r =>`
- [x] Create GitHub issue (https://github.com/griches/bambu-mcp/issues/2) and open PR (https://github.com/coport-uni/bambu-mcp/pull/1) for review/testing

## 2026-05-28 | Add MCP server icon (SEP-973)

- [x] Upgrade `@modelcontextprotocol/sdk` from `^1.12.0` to `^1.29.0` (icons support requires ≥1.27.0)
- [x] Convert `src/icons/logo.png` to base64 data URI in `src/icon.ts` (3,686 chars)
- [x] Add `icons` field to `McpServer` constructor in `src/index.ts`
- [x] Verify TypeScript build passes and `dist/icon.js` loads correctly