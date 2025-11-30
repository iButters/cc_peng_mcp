---
title: peng-engineer
description: Manual prompt optimization with optional parameters for language, context, and interactive mode.
arguments: "<prompt> [--language=<language>] [--context=<context>] [--interactive]"
categories: ["prompt-engineering", "manual", "optimization"]
---

# /peng-engineer - Manuelle Prompt-Optimierung

Führe eine manuelle Prompt-Optimierung durch mit voller Kontrolle über die Parameter.

## Anweisungen

Wenn der Benutzer `/peng-engineer <prompt>` verwendet:

1. **Parse die Argumente:**
   - `<prompt>`: Der zu optimierende Prompt (erforderlich)
   - `--language=<sprache>`: Programmiersprache (optional, wird sonst automatisch erkannt)
   - `--context=<kontext>`: Zusätzlicher Kontext (optional, unterstützt "quoted values")
   - `--interactive`: Aktiviert den interaktiven Q&A-Modus (optional)

2. **Im interaktiven Modus (--interactive):**
   - Generiere 2-3 klärende Fragen basierend auf dem Prompt
   - Erstelle eine Session mit eindeutiger ID
   - Speichere Original-Prompt, Sprache, Kontext für spätere Verfeinerung
   - Zeige Fragen und Session-ID an
   - User antwortet mit `/peng-answer <sessionId> <antworten>`

3. **Im direkten Modus (ohne --interactive):**
   - Erkenne Task-Typ automatisch (debug, test, refactor, explain, architecture, code)
   - Generiere optimierten Prompt basierend auf Task-Typ
   - Füge sprachspezifische Best Practices hinzu
   - Berücksichtige Komplexität für Strukturierung

4. **Zeige den optimierten Prompt an (NICHT automatisch ausführen)**

## Parameter

| Parameter | Beschreibung | Beispiel |
|-----------|--------------|----------|
| `--language=<sprache>` | Programmiersprache explizit angeben | `--language=typescript` |
| `--context=<kontext>` | Zusätzlicher Projekt-Kontext | `--context="React 18 App"` |
| `--interactive` | Interaktiven Q&A-Modus aktivieren | `--interactive` |

## Unterstützte Sprachen

- JavaScript / Node.js
- TypeScript
- Python
- Java
- C++ (cpp)
- Rust
- Go / Golang
- PHP
- Ruby
- C# / .NET

## Beispiele

### Einfache Optimierung
```
/peng-engineer write a function to validate email addresses
```

**Ausgabe:**
```
**Optimized Prompt for Claude Code:**

**Task:** write a function to validate email addresses

**Implementation Requirements:**
- Follow general best practices and conventions
- Use existing project patterns where applicable
- Ensure code quality and maintainability

**Ready to proceed with this task?**
```

### Mit Sprache und Kontext
```
/peng-engineer optimize database queries --language=python --context="Django ORM with PostgreSQL"
```

**Ausgabe:**
```
**Optimized Prompt for Claude Code:**

**Context:** Django ORM with PostgreSQL

**Task:** Refactor and improve the following code:

optimize database queries

**Requirements:**
- Maintain existing functionality
- Follow python best practices
- Improve code readability and maintainability
- Use existing project patterns and conventions

**Ready to proceed with this task?**
```

### Interaktiver Modus
```
/peng-engineer create a new authentication system --interactive
```

**Ausgabe:**
```
Interactive prompt engineering session started (ID: abc123xyz456).

To help create the best prompt for Claude Code, please answer these questions:

1. What technology stack or programming language are you using?
2. What specific outcome are you looking for?
3. Are there any constraints or requirements I should know about?

Use /peng-answer abc123xyz456 <your answers> to provide your answers.
```

### Komplexe Anfrage mit allen Parametern
```
/peng-engineer build a REST API for user management --language=typescript --context="Express.js with MongoDB" --interactive
```

**Ausgabe:**
```
Interactive prompt engineering session started (ID: def789ghi012).

To help create the best prompt for Claude Code, please answer these questions:

1. What specific outcome are you looking for?
2. Are there any constraints or requirements I should know about?

Use /peng-answer def789ghi012 <your answers> to provide your answers.

---
**Detected:** typescript | code | moderate
```

## Task-Typ Erkennung

Der Task-Typ wird automatisch erkannt anhand von Schlüsselwörtern:

| Task-Typ | Schlüsselwörter |
|----------|-----------------|
| debug | debug, fix, error, bug, issue, problem, not working |
| test | test, testing, unit test, integration test, jest, pytest |
| refactor | refactor, clean, optimize, improve, restructure |
| explain | explain, understand, how does, what is, why |
| architecture | architecture, design, pattern, structure, system |
| code | (Standard für alle anderen) |

## Hinweis

Der optimierte Prompt wird **nur angezeigt** und nicht automatisch ausgeführt.
Der Benutzer kann den Output dann manuell kopieren und verwenden.
