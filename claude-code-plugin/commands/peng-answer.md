---
title: peng-answer
description: Beantwortet die Rückfragen einer Session und generiert den finalen optimierten Prompt.
arguments: "<sessionId> <antworten...>"
categories: ["prompt-engineering", "interactive"]
---

# /peng-answer - Rückfragen beantworten

Beantworte die Rückfragen einer interaktiven Session und generiere den finalen optimierten Prompt.

## Anweisungen

Wenn der Benutzer `/peng-answer <sessionId> <antworten>` verwendet:

1. **Suche die Session:**
   - Die Session-ID wurde von `/peng` oder `/peng-engineer --interactive` erstellt
   - Prüfe ob die Session existiert

2. **Parse die Antworten:**
   - Antworten können durch Semikolon (;) getrennt werden
   - Oder als zusammenhängender Text gegeben werden
   - Füge die Antworten als Verfeinerungen zur Session hinzu

3. **Generiere den finalen Prompt:**
   - Verwende den Original-Prompt der Session
   - Berücksichtige Sprache und Kontext der Session
   - Füge alle Verfeinerungen (Antworten) als zusätzliche Anforderungen hinzu
   - Strukturiere nach erkanntem Task-Typ

4. **Beende die Session:**
   - Lösche die Session aus dem Speicher
   - Zeige den finalen optimierten Prompt an

5. **Zeige den optimierten Prompt an (NICHT automatisch ausführen)**

## Beispiele

### Antworten mit Semikolon getrennt
```
/peng-answer abc123xyz456 Using Node.js with Express; Need JWT authentication; Must support OAuth2
```

**Ausgabe:**
```
**Final Optimized Prompt for Claude Code:**

**Task:** create a new authentication system

**Implementation Requirements:**
- Follow javascript best practices and conventions
- Use existing project patterns where applicable
- Ensure code quality and maintainability

**Additional Requirements:**
- Using Node.js with Express
- Need JWT authentication
- Must support OAuth2

**Ready to use this prompt?**
```

### Antworten als zusammenhängender Text
```
/peng-answer def789ghi012 I want to optimize database queries for better performance, specifically the user search functionality which is currently slow
```

**Ausgabe:**
```
**Final Optimized Prompt for Claude Code:**

**Context:** Django ORM with PostgreSQL

**Task:** Refactor and improve the following code:

optimize database queries

**Requirements:**
- Maintain existing functionality
- Follow python best practices
- Improve code readability and maintainability
- Use existing project patterns and conventions

**Additional Requirements:**
- I want to optimize database queries for better performance, specifically the user search functionality which is currently slow

**Ready to use this prompt?**
```

### Session nicht gefunden
```
/peng-answer invalid_id some answers
```

**Ausgabe:**
```
**Error:** Session 'invalid_id' not found.

The session may have expired or been completed.

**To start a new session:**
- Use `/peng <prompt>` for automatic optimization
- Use `/peng-engineer <prompt> --interactive` for interactive mode
```

## Antwort-Formate

Die Antworten können in verschiedenen Formaten gegeben werden:

### Format 1: Semikolon-getrennt
```
/peng-answer sessionId Antwort 1; Antwort 2; Antwort 3
```

### Format 2: Zusammenhängender Text
```
/peng-answer sessionId Ich möchte X erreichen und dabei Y berücksichtigen
```

### Format 3: Nummeriert (wird als Text behandelt)
```
/peng-answer sessionId 1. TypeScript 2. Performance-Optimierung 3. Must be backwards compatible
```

## Workflow-Beispiel

Vollständiger interaktiver Workflow:

```
User: /peng help me with my code

Claude: 🤔 I need more information to optimize this effectively!

**Analysis:** Request is too brief - needs more details

**Questions:**
1. What specific error or problem are you encountering?
2. What should the expected behavior be?
3. What technology stack are you using?

**Session ID:** xyz789abc123

---

User: /peng-answer xyz789abc123 React component not rendering; Should show a list of users; React 18 with TypeScript

Claude: **Final Optimized Prompt for Claude Code:**

**Task:** Debug and fix the following issue:

help me with my code

**Requirements:**
- Use file search tools (Grep/Glob) to locate relevant code
- Read and analyze the problematic files
- Identify the root cause and implement a fix
- Test the solution if possible

**Additional Requirements:**
- React component not rendering
- Should show a list of users
- React 18 with TypeScript

**Ready to use this prompt?**
```

## Session-Lebenszyklus

```
1. Session erstellt via /peng oder /peng-engineer --interactive
   └── Status: ACTIVE
   
2. Optional: /peng-ask <sessionId>
   └── Status: ACTIVE (unverändert)
   
3. /peng-answer <sessionId> <antworten>
   └── Antworten werden verarbeitet
   └── Finaler Prompt wird generiert
   └── Status: DELETED (Session beendet)
```

## Hinweis

Der optimierte Prompt wird **nur angezeigt** und nicht automatisch ausgeführt.
Der Benutzer kann den Output dann manuell kopieren und verwenden.

Nach erfolgreicher Beantwortung wird die Session gelöscht. Falls weitere Optimierungen nötig sind,
muss eine neue Session mit `/peng` oder `/peng-engineer --interactive` erstellt werden.
