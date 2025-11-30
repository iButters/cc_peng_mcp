---
title: peng-ask
description: Zeigt die Rückfragen für eine bestimmte Session an.
arguments: "<sessionId>"
categories: ["prompt-engineering", "interactive"]
---

# /peng-ask - Session-Rückfragen anzeigen

Zeige die Rückfragen für eine bestehende interaktive Session an.

## Anweisungen

Wenn der Benutzer `/peng-ask <sessionId>` verwendet:

1. **Suche die Session:**
   - Die Session-ID wurde von `/peng` oder `/peng-engineer --interactive` erstellt
   - Prüfe ob die Session existiert

2. **Wenn Session gefunden:**
   - Zeige den Original-Prompt
   - Zeige die erkannte Sprache, Task-Typ und Komplexität
   - Generiere und zeige 2-3 klärende Fragen

3. **Wenn Session nicht gefunden:**
   - Zeige eine Fehlermeldung
   - Erkläre wie eine neue Session erstellt wird

## Beispiele

### Existierende Session abfragen
```
/peng-ask abc123xyz456
```

**Ausgabe (wenn Session existiert):**
```
**Session: abc123xyz456**

**Original Prompt:** create a new authentication system

**Detected:**
- Language: typescript
- Task Type: architecture
- Complexity: moderate

**Clarifying Questions:**
1. What specific outcome are you looking for?
2. Are there any constraints or requirements I should know about?
3. What technology stack or programming language are you using?

**Next Step:** Use /peng-answer abc123xyz456 <your answers> to continue.
```

### Nicht existierende Session
```
/peng-ask invalid_session_id
```

**Ausgabe:**
```
**Error:** Session 'invalid_session_id' not found.

This session may have expired or never existed.

**How to create a new session:**
- Use `/peng <prompt>` for automatic optimization (may start interactive mode)
- Use `/peng-engineer <prompt> --interactive` for manual interactive mode

**Active Sessions:**
- No active sessions found.
```

## Session-Informationen

Eine Session enthält folgende Informationen:

| Feld | Beschreibung |
|------|--------------|
| `originalPrompt` | Der ursprüngliche Prompt des Benutzers |
| `context` | Zusätzlicher Kontext (falls angegeben) |
| `refinements` | Bereits gegebene Antworten |
| `language` | Erkannte oder angegebene Programmiersprache |
| `taskType` | Erkannter Task-Typ (debug, test, refactor, etc.) |
| `complexity` | Geschätzte Komplexität (simple, moderate, complex) |

## Workflow

Der interaktive Workflow funktioniert wie folgt:

```
1. /peng "vager prompt"
   └── Session wird erstellt
   └── Session-ID wird zurückgegeben
   └── Fragen werden angezeigt

2. /peng-ask <sessionId>
   └── Zeigt Session-Details und Fragen erneut
   └── Hilfreich wenn man die Fragen nochmal sehen möchte

3. /peng-answer <sessionId> <antworten>
   └── Antworten werden zur Session hinzugefügt
   └── Optimierter Prompt wird generiert
   └── Session wird beendet
```

## Hinweis

Sessions werden im Speicher gehalten und können verloren gehen wenn Claude Code neu gestartet wird.
Bei Bedarf einfach eine neue Session mit `/peng` oder `/peng-engineer --interactive` erstellen.
