---
title: peng
description: Analysiert und optimiert den Prompt automatisch. Erkennt Sprache, Task-Typ, Komplexität. Bei Bedarf startet interaktiver Modus mit Rückfragen.
arguments: "<prompt>"
categories: ["prompt-engineering", "optimization"]
---

# /peng - Automatische Prompt-Optimierung

Analysiere und optimiere den folgenden Prompt automatisch für Claude Code.

## Anweisungen

Wenn der Benutzer `/peng <prompt>` verwendet:

1. **Analysiere den Prompt:**
   - Erkenne die Programmiersprache (JavaScript, TypeScript, Python, Java, C++, Rust, Go, PHP, Ruby, C#)
   - Erkenne den Task-Typ (debug, test, refactor, explain, architecture, code)
   - Bewerte die Komplexität (simple, moderate, complex)
   - Prüfe ob Rückfragen nötig sind

2. **Entscheide ob Optimierung nötig ist:**
   - Zu kurzer Text (< 10 Zeichen): Keine Optimierung
   - Bereits strukturierter Text (mit **, 1., - ): Keine Optimierung
   - Einfache Konversation (thanks, ok, sure): Keine Optimierung
   - Natural Language Prompt erkannt: Optimierung durchführen

3. **Bei vagen/unklaren Prompts:**
   - Wenn der Prompt zu kurz ist (< 30 Zeichen) oder Unsicherheit ausdrückt
   - Generiere 2-3 klärende Fragen
   - Gib eine Session-ID zurück
   - Der User kann mit `/peng-answer <sessionId> <antworten>` antworten

4. **Generiere optimierten Prompt:**
   - Füge Kontext hinzu falls vorhanden
   - Strukturiere nach Task-Typ:
     - **debug**: Fehlersuche und -behebung mit File Search Tools
     - **refactor**: Code-Verbesserung mit Best Practices
     - **test**: Test-Erstellung mit Framework-spezifischen Anforderungen
     - **explain**: Strukturierte Erklärung mit Beispielen
     - **architecture**: Design und Planung mit Skalierbarkeit
     - **code**: Generische Implementierung mit Best Practices

5. **Zeige den optimierten Prompt an (NICHT automatisch ausführen)**

## Beispiele

### Einfacher Debug-Prompt
```
/peng fix my React app performance issues
```

**Ausgabe:**
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

### Vager Prompt (startet interaktiven Modus)
```
/peng help me fix something
```

**Ausgabe:**
```
🤔 I need more information to optimize this effectively!

**Analysis:** Request is too brief - needs more details

**Questions to help me create the best prompt:**
1. What specific error or problem are you encountering?
2. What should the expected behavior be?
3. What technology stack or programming language are you using?

**Next Step:** Use /peng-answer <sessionId> to provide your answers.
```

### Refactor-Prompt
```
/peng refactor the database module to use async/await
```

**Ausgabe:**
```
**Task:** Refactor and improve the following code:

refactor the database module to use async/await

**Requirements:**
- Maintain existing functionality
- Follow javascript best practices
- Improve code readability and maintainability
- Use existing project patterns and conventions

**Ready to proceed with this task?**
```

## Natural Language Detection Patterns

Der Prompt wird als "natürliche Sprache" erkannt, wenn er folgende Muster enthält:

- **Direkte Anfragen:** "help me", "can you", "please", "i need", "i want"
- **Problem-Beschreibungen:** "issue", "problem", "bug", "error", "not working"
- **Task-Anfragen:** "create", "build", "make", "add", "implement", "write", "fix"
- **Verbesserungs-Anfragen:** "improve", "optimize", "refactor", "clean up", "better"
- **Fragen:** "how do", "how can", "what is", "why is", "where is"
- **Unsicherheit:** "not sure", "unsure", "confused", "don't understand"
- **Konversations-Muster:** "i'm", "i've been", "i have", "i think"

## Hinweis

Der optimierte Prompt wird **nur angezeigt** und nicht automatisch ausgeführt. 
Der Benutzer kann den Output dann manuell kopieren und verwenden.
