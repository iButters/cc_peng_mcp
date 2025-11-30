# Peng Prompt Engineer - Claude Code Plugin

Ein Claude Code Plugin mit Slash-Commands für intelligente Prompt-Optimierung und interaktive Verfeinerung.

## Features

### 🚀 **Automatische Prompt-Optimierung**
- Erkennt automatisch Programmiersprache und Task-Typ
- Optimiert Prompts speziell für Claude Code's Fähigkeiten
- Pattern-basierte Analyse ohne externe API-Aufrufe

### 🤖 **Interaktive Verfeinerung**
- Q&A-basiertes Prompt-Klärungssystem
- Session-basierter Verfeinerungsprozess
- Kontextbewusste Fragengenerierung

### ⚡ **Schnell und Lokal**
- Keine externen API-Abhängigkeiten
- Funktioniert komplett offline
- Sofortige Ergebnisse

## Installation

### 1. Plugin kopieren

Kopiere den `claude-code-plugin` Ordner in dein Claude Code Plugins-Verzeichnis:

```bash
# Standard Claude Code Plugins-Verzeichnis
cp -r claude-code-plugin ~/.claude/plugins/peng-prompt-engineer

# Oder im Projekt-Verzeichnis für Team-Sharing
cp -r claude-code-plugin .claude/plugins/peng-prompt-engineer
```

### 2. Claude Code neu starten

```bash
# Claude Code beenden und neu starten
exit
claude
```

### 3. Installation überprüfen

Teste die Installation mit einem der Slash-Commands:

```
/peng help me fix my code
```

## Slash-Commands

### `/peng <prompt>`

**Automatische Prompt-Optimierung** - Analysiert und optimiert den Prompt automatisch.

```
/peng fix my React app performance issues
```

**Features:**
- Erkennt Programmiersprache (JavaScript, TypeScript, Python, etc.)
- Erkennt Task-Typ (debug, test, refactor, explain, architecture, code)
- Bewertet Komplexität (simple, moderate, complex)
- Startet bei unklaren Prompts den interaktiven Modus

**Beispiel-Output:**
```
**Task:** Debug and fix the following issue:

fix my React app performance issues

**Requirements:**
- Use file search tools (Grep/Glob) to locate relevant code
- Read and analyze the problematic files
- Identify the root cause and implement a fix
- Test the solution if possible

**Ready to proceed with this task?**
```

---

### `/peng-engineer <prompt>`

**Manuelle Prompt-Optimierung** mit voller Kontrolle über Parameter.

```
/peng-engineer optimize database queries --language=python --context="Django ORM" --interactive
```

**Parameter:**
| Parameter | Beschreibung | Beispiel |
|-----------|--------------|----------|
| `--language=<sprache>` | Programmiersprache explizit setzen | `--language=typescript` |
| `--context=<kontext>` | Zusätzlicher Projekt-Kontext | `--context="React 18 App"` |
| `--interactive` | Interaktiven Q&A-Modus aktivieren | `--interactive` |

**Unterstützte Sprachen:**
- JavaScript / Node.js
- TypeScript
- Python
- Java
- C++
- Rust
- Go
- PHP
- Ruby
- C# / .NET

---

### `/peng-ask <sessionId>`

**Session-Rückfragen anzeigen** - Zeigt die Fragen für eine interaktive Session erneut an.

```
/peng-ask abc123xyz456
```

**Verwendung:**
- Wurde eine Session mit `/peng` oder `/peng-engineer --interactive` gestartet?
- Hast du die Fragen vergessen?
- Mit diesem Command kannst du sie erneut abrufen

---

### `/peng-answer <sessionId> <antworten...>`

**Rückfragen beantworten** - Beantwortet die Fragen und generiert den finalen Prompt.

```
/peng-answer abc123xyz456 Using Node.js; Need JWT auth; Must support OAuth2
```

**Antwort-Formate:**
- Semikolon-getrennt: `Antwort 1; Antwort 2; Antwort 3`
- Als zusammenhängender Text: `Ich möchte X erreichen und dabei Y berücksichtigen`

## Interaktiver Workflow

### 1. Vagen Prompt eingeben

```
/peng help me fix something
```

### 2. Claude stellt Fragen

```
🤔 I need more information to optimize this effectively!

**Questions:**
1. What specific error or problem are you encountering?
2. What should the expected behavior be?
3. What technology stack are you using?

**Session ID:** xyz789abc123
```

### 3. Fragen beantworten

```
/peng-answer xyz789abc123 React component not rendering; Should show user list; React 18 with TypeScript
```

### 4. Finaler optimierter Prompt

```
**Final Optimized Prompt for Claude Code:**

**Task:** Debug and fix the following issue:

help me fix something

**Requirements:**
- Use file search tools (Grep/Glob) to locate relevant code
- Read and analyze the problematic files
- Identify the root cause and implement a fix
- Test the solution if possible

**Additional Requirements:**
- React component not rendering
- Should show user list
- React 18 with TypeScript

**Ready to use this prompt?**
```

## Task-Typ Erkennung

Der Task-Typ wird automatisch anhand von Schlüsselwörtern erkannt:

| Task-Typ | Schlüsselwörter | Beschreibung |
|----------|-----------------|--------------|
| debug | debug, fix, error, bug, issue, problem | Fehlersuche und -behebung |
| test | test, testing, unit test, jest, pytest | Test-Erstellung |
| refactor | refactor, clean, optimize, improve | Code-Verbesserung |
| explain | explain, understand, how does, what is | Erklärungen |
| architecture | architecture, design, pattern, structure | System-Design |
| code | (Standard) | Allgemeine Implementierung |

## Natural Language Detection

Der Prompt wird als optimierungsbedürftig erkannt bei folgenden Mustern:

- **Direkte Anfragen:** "help me", "can you", "please", "i need"
- **Problem-Beschreibungen:** "issue", "problem", "bug", "error"
- **Task-Anfragen:** "create", "build", "make", "add", "implement"
- **Verbesserungs-Anfragen:** "improve", "optimize", "refactor"
- **Fragen:** "how do", "how can", "what is", "why is"
- **Unsicherheit:** "not sure", "unsure", "confused"

## Technische Details

### Plugin-Struktur

```
claude-code-plugin/
├── .claude-plugin/
│   └── plugin.json          # Plugin-Manifest
├── commands/
│   ├── peng.md              # /peng Command
│   ├── peng-engineer.md     # /peng-engineer Command
│   ├── peng-ask.md          # /peng-ask Command
│   └── peng-answer.md       # /peng-answer Command
├── scripts/
│   └── peng-core.ts         # Kern-Logik (TypeScript)
└── README.md                # Diese Dokumentation
```

### Session-Management

Sessions werden im Speicher gehalten und enthalten:

| Feld | Beschreibung |
|------|--------------|
| `originalPrompt` | Der ursprüngliche Prompt |
| `context` | Zusätzlicher Kontext |
| `refinements` | Gegebene Antworten |
| `language` | Erkannte Programmiersprache |
| `taskType` | Erkannter Task-Typ |
| `complexity` | Geschätzte Komplexität |

**Hinweis:** Sessions können verloren gehen wenn Claude Code neu gestartet wird.

## Vergleich mit MCP Server

Dieses Plugin bietet die gleiche Funktionalität wie der MCP Server (`index.ts`):

| Plugin Slash-Command | MCP Tool | Funktion |
|----------------------|----------|----------|
| `/peng` | `auto_optimize` | Automatische Analyse und Optimierung |
| `/peng-engineer` | `engineer_prompt` | Manuelle Optimierung mit Parametern |
| `/peng-ask` | `ask_clarification` | Rückfragen anzeigen |
| `/peng-answer` | `answer_questions` | Antworten und finalisieren |

## Wichtiger Hinweis

Der optimierte Prompt wird **nur angezeigt** und **nicht automatisch ausgeführt**.
Der Benutzer kann den Output dann manuell kopieren und nach Bedarf verwenden oder anpassen.

## Lizenz

MIT License - siehe LICENSE Datei im Hauptverzeichnis.
