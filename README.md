# Bambu MCP (Fork)

[Bambu Lab](https://bambulab.com/) 3D 프린터를 Claude Desktop에서 AI로 제어하기 위한 [MCP(Model Context Protocol)](https://modelcontextprotocol.io/) 서버입니다.

> 원본 레포: [griches/bambu-mcp](https://github.com/griches/bambu-mcp)

## 이 포크에서 추가/수정된 사항

- **H2D 프린터 지원** — FTP URL, 캘리브레이션 필드, 듀얼 노즐 오프셋 보정
- **3MF 플레이트 자동 감지** — 멀티 플레이트 3MF 파일에서 올바른 플레이트 번호를 자동 선택
- **AMS 필라멘트 자동 매핑** — 3MF 파일의 필라멘트 색상과 프린터 트레이를 자동 매칭
- **연결 안정성 개선** — MCP 서버를 프린터 연결 전에 시작, 연결 타임아웃 추가
- **프린트 시작 최적화** — flow/vibration 캘리브레이션 기본값 비활성화로 빠른 시작

## 지원 프린터

| 프린터 | 테스트 완료 |
|--------|:---------:|
| Bambu Lab P1S | O |
| Bambu Lab X1E | O |
| Bambu Lab H2D | O |
| Bambu Lab A1 Mini | O |

Bambu Lab의 MQTT over LAN을 지원하는 모든 프린터(X1C, X1, P1P, A1 등)에서 동작합니다.

---

## 설치 가이드 (처음부터 따라하기)

### 1단계: Node.js 설치

MCP 서버를 실행하려면 Node.js 18 이상이 필요합니다.

1. [Node.js 공식 사이트](https://nodejs.org/)에서 **LTS 버전**을 다운로드합니다
2. 설치 파일을 실행하고, 기본 옵션 그대로 **Next**를 눌러 설치를 완료합니다
3. 설치가 끝나면 터미널(PowerShell 또는 명령 프롬프트)을 **새로 열고** 아래 명령어로 확인합니다:

```powershell
node --version    # v18.x.x 이상이면 OK
npm --version     # 숫자가 나오면 OK
```

> 이미 Node.js가 설치되어 있다면 이 단계는 건너뛰세요.

### 2단계: 소스 코드 다운로드 및 빌드

```powershell
# 원하는 폴더로 이동
cd C:\Users\사용자이름\Desktop

# 레포 클론
git clone https://github.com/coport-uni/bambu-mcp.git

# 폴더 진입
cd bambu-mcp

# 의존성 설치
npm install

# TypeScript 빌드
npm run build
```

빌드가 성공하면 `dist/index.js` 파일이 생성됩니다. 이 파일의 **절대 경로**를 다음 단계에서 사용합니다.

### 3단계: Claude Desktop에 MCP 서버 등록

1. Claude Desktop을 열고 **설정(Settings)** 으로 이동합니다
2. 왼쪽 메뉴에서 **Developer** 탭을 클릭합니다
3. **Edit Config** 버튼을 눌러 `claude_desktop_config.json` 파일을 엽니다
4. 아래 내용을 붙여넣고, 경로를 자신의 환경에 맞게 수정합니다:

```json
{
  "mcpServers": {
    "bambu": {
      "command": "node",
      "args": [
        "C:\\Users\\사용자이름\\Desktop\\bambu-mcp\\dist\\index.js"
      ]
    }
  }
}
```

> **경로 구분자**: Windows에서는 `\\` (역슬래시 두 개)를 사용합니다.

5. 파일을 저장한 뒤 **Claude Desktop을 완전히 종료하고 다시 실행**합니다

### 4단계: MCP 연결 확인

Claude Desktop을 다시 열면, 채팅 입력창 아래에 **망치 아이콘(MCP Tools)** 이 나타납니다. 아이콘을 클릭하면 `bambu`로 시작하는 도구 목록이 보여야 합니다.

> 아이콘이 안 보이면: 설정 > Developer에서 config 경로가 맞는지, Node.js 경로에 문제가 없는지 확인하세요.

---

## 프린터 설정 (프린터 측)

MCP 서버가 프린터와 통신하려면, 프린터에서 아래 설정을 먼저 해야 합니다:

### LAN Only 모드 활성화

프린터 터치스크린에서 **설정 > 네트워크**로 이동하여 **LAN Only Mode**를 켭니다.

> LAN Only 모드를 켜면 Bambu Handy 앱 등 클라우드 기능을 사용할 수 없습니다. 모든 제어는 로컬 네트워크에서만 가능합니다.

### Developer 모드 활성화

**설정 > 네트워크 > LAN Only Mode** 화면에서 **Developer Mode**를 켭니다.

### 연결 정보 메모

다음 3가지를 메모해 둡니다:

| 정보 | 확인 위치 |
|------|----------|
| **IP 주소** | 설정 > WLAN (또는 Bambu Studio 기기 탭) |
| **Access Code** | 설정 > WLAN (Developer Mode 활성화 후 표시) |
| **Serial Number** | 설정 > Device (또는 프린터 뒷면 라벨) |

---

## 프린터 등록 (Claude Desktop에서)

MCP 서버가 정상 작동하면, Claude에게 자연어로 프린터를 등록할 수 있습니다:

```
프린터를 등록해줘.
- IP: 192.168.1.235
- Access Code: 30430928
- Serial: 01P00A3B0900744
- Model: P1S
- Name: 내 프린터
```

등록된 프린터 정보는 `~/.bambu-mcp/printers.json`에 저장되며, 서버를 재시작해도 자동으로 재연결됩니다.

---

## 사용할 수 있는 도구 목록

### 프린터 관리

| 도구 | 설명 |
|------|------|
| `add_printer` | 프린터 등록 (IP, 액세스 코드, 시리얼) |
| `remove_printer` | 프린터 제거 |
| `reconnect_printer` | 프린터 재연결 (네트워크 변경 후 등) |
| `list_printers` | 등록된 프린터 목록 및 연결 상태 |

### 상태 확인

| 도구 | 설명 |
|------|------|
| `get_status` | 출력 진행률, 온도, 속도, AMS 상태, 조명 |
| `get_version` | 펌웨어 및 모듈 버전 정보 |

### 출력 제어

| 도구 | 설명 |
|------|------|
| `start_print` | SD 카드의 파일로 출력 시작 (3MF 플레이트 자동 감지) |
| `pause_print` | 출력 일시정지 |
| `resume_print` | 일시정지된 출력 재개 |
| `stop_print` | 출력 취소 |
| `skip_objects` | 멀티 오브젝트 출력에서 특정 오브젝트 건너뛰기 |

### 하드웨어 제어

| 도구 | 설명 |
|------|------|
| `set_speed` | 출력 속도 변경 (silent, standard, sport, ludicrous) |
| `set_light` | 챔버/작업 조명 on/off |
| `set_temperature` | 노즐/베드 온도 설정 (안전 제한 포함) |
| `set_nozzle` | 노즐 직경 설정 |

### 파일 관리

| 도구 | 설명 |
|------|------|
| `list_files` | SD 카드 파일 목록 |
| `upload_file` | 3MF/G-code 파일 업로드 |
| `download_file` | 파일 다운로드 |
| `delete_file` | 파일 삭제 |

### 카메라

| 도구 | 설명 |
|------|------|
| `set_recording` | 카메라 녹화 on/off |
| `set_timelapse` | 타임랩스 녹화 on/off |

### AMS / 필라멘트

| 도구 | 설명 |
|------|------|
| `change_filament` | AMS 필라멘트 트레이 변경 |
| `unload_filament` | 필라멘트 언로드 |

### G-code

| 도구 | 설명 |
|------|------|
| `send_gcode` | 커스텀 G-code 명령 전송 (위험 명령 차단) |

---

## 프린터 지정 방법

프린터 관련 도구에는 `printer` 파라미터를 사용할 수 있습니다:

- **특정 프린터** — 프린터 ID 지정 (예: `"terran-barracks"`)
- **전체 프린터** — `"all"` 입력 시 모든 프린터에 동시 실행
- **자동 선택** — 프린터가 1대만 등록되어 있으면 생략 가능

---

## 통신 방식

| 프로토콜 | 포트 | 용도 |
|----------|------|------|
| MQTT (TLS) | 8883 | 명령 전송 및 상태 수신 |
| FTP (implicit FTPS) | 990 | 파일 업로드/다운로드 |

---

## 문제 해결 (FAQ)

### Claude Desktop에서 MCP 도구가 안 보여요
- `claude_desktop_config.json`의 경로가 정확한지 확인하세요 (`\\` 두 개)
- Claude Desktop을 완전히 종료(시스템 트레이에서도)하고 다시 시작하세요
- 터미널에서 `node C:\...\dist\index.js`를 직접 실행해 에러가 없는지 확인하세요

### 프린터에 연결이 안 돼요
- 프린터와 컴퓨터가 **같은 네트워크**에 있는지 확인하세요
- **LAN Only Mode**와 **Developer Mode**가 모두 켜져 있는지 확인하세요
- IP 주소가 변경되었을 수 있습니다. 프린터 터치스크린에서 현재 IP를 확인하세요
- `reconnect_printer` 도구를 사용해 재연결을 시도하세요

### IP 주소가 자꾸 바뀌어요
- 공유기 설정에서 해당 프린터에 **고정 IP(DHCP 예약)** 를 설정하세요

---

## 라이선스

MIT — 원본 프로젝트 [griches/bambu-mcp](https://github.com/griches/bambu-mcp) 라이선스를 따릅니다.
