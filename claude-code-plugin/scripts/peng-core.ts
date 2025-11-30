/**
 * Peng Prompt Engineer - Core Logic
 * 
 * This module contains all the prompt engineering logic extracted from the MCP server.
 * It provides language detection, task type analysis, complexity evaluation, and
 * optimized prompt generation.
 */

export interface PromptSession {
  originalPrompt: string;
  context: string[];
  refinements: string[];
  language?: string;
  complexity?: 'simple' | 'moderate' | 'complex';
  taskType?: 'code' | 'debug' | 'explain' | 'refactor' | 'test' | 'architecture';
}

export interface AutoOptimizeAnalysis {
  shouldOptimize: boolean;
  confidence: number;
  reason: string;
  needsQuestions: boolean;
  questioningReason?: string;
  detectedLanguage?: string;
  taskType?: string;
  complexity?: string;
  method?: string;
  error?: string;
}

export interface AutoOptimizeResult {
  shouldOptimize: boolean;
  optimizedPrompt?: string;
  analysis: AutoOptimizeAnalysis;
  needsQuestions?: boolean;
  questions?: string[];
  sessionId?: string;
}

// Session storage for interactive prompt engineering
const activeSessions: Map<string, PromptSession> = new Map();

/**
 * Generates a unique session ID
 */
export function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

/**
 * Gets a session by ID
 */
export function getSession(sessionId: string): PromptSession | undefined {
  return activeSessions.get(sessionId);
}

/**
 * Creates a new session
 */
export function createSession(sessionId: string, session: PromptSession): void {
  activeSessions.set(sessionId, session);
}

/**
 * Updates an existing session
 */
export function updateSession(sessionId: string, updates: Partial<PromptSession>): boolean {
  const session = activeSessions.get(sessionId);
  if (!session) return false;
  
  Object.assign(session, updates);
  return true;
}

/**
 * Deletes a session
 */
export function deleteSession(sessionId: string): boolean {
  return activeSessions.delete(sessionId);
}

/**
 * Lists all active sessions
 */
export function listSessions(): string[] {
  return Array.from(activeSessions.keys());
}

/**
 * Detects if text is natural language that should be optimized
 */
export function isNaturalLanguagePrompt(text: string): boolean {
  // Patterns that suggest this is natural language that should be optimized
  const promptIndicators = [
    // Direct requests
    /\b(help me|can you|please|could you|would you|i need|i want)\b/i,
    // Problem descriptions  
    /\b(issue|problem|bug|error|not working|broken|failing)\b/i,
    // Task requests
    /\b(create|build|make|add|implement|write|fix|update|change)\b/i,
    // Improvement requests
    /\b(improve|optimize|refactor|clean up|better|faster|slower)\b/i,
    // Questions
    /\b(how do|how can|what is|why is|where is|when should)\b/i,
    // Uncertainty markers
    /\b(not sure|unsure|confused|don't understand|struggling)\b/i,
    // Conversational patterns
    /\b(i'm|i've been|i have|i was|i think|i believe)\b/i,
  ];

  // Check if text matches prompt patterns
  const hasPromptIndicators = promptIndicators.some(pattern => pattern.test(text));
  
  // Additional heuristics
  const isQuestion = text.includes('?');
  const hasFirstPerson = /\b(i|me|my|mine)\b/i.test(text);
  const isConversational = text.length > 20 && (hasFirstPerson || text.includes(' '));
  const hasCodeTerms = /\b(function|component|api|database|server|frontend|backend|code|file|script)\b/i.test(text);
  
  return hasPromptIndicators || (isConversational && (isQuestion || hasCodeTerms));
}

/**
 * Determines if questions should be asked for clarification
 */
export function shouldAskQuestions(text: string): boolean {
  // Much more conservative approach - only ask when truly necessary
  
  // Critical uncertainty indicators that genuinely need clarification
  const criticalUncertaintyMarkers = /\b(not sure|unsure|don't know|unclear|confused|which one|what should|help me choose)\b/i;
  const hasUncertainty = criticalUncertaintyMarkers.test(text);
  
  // Extremely vague requests with no context
  const extremelyVague = text.length < 20 && /\b(help|fix|do|make)\b/i.test(text) && !/\b(function|component|file|error|bug)\b/i.test(text);
  
  // Only ask questions if:
  // 1. User explicitly expresses uncertainty
  // 2. Request is extremely vague and short
  return hasUncertainty || extremelyVague;
}

/**
 * Gets the reason for asking questions
 */
export function getQuestioningReason(text: string): string {
  if (text.length < 30) {
    return "Request is too brief - needs more details";
  }
  
  if (/\b(not sure|unsure|don't know|unclear|confused)\b/i.test(text)) {
    return "User expressed uncertainty - clarification needed";
  }
  
  if (/\b(fix|optimize|improve|better|faster)\b/i.test(text)) {
    return "Vague improvement request - needs specific details";
  }
  
  if (/\b(issue|problem|not working)\b/i.test(text)) {
    return "Problem reported without details - need specifics";
  }
  
  return "Request needs clarification for best results";
}

/**
 * Analyzes whether auto-optimization should be applied
 */
export function shouldAutoOptimize(text: string): { 
  shouldOptimize: boolean; 
  confidence: number; 
  reason: string; 
  needsQuestions: boolean;
  questioningReason?: string;
} {
  if (text.length < 10) {
    return { shouldOptimize: false, confidence: 0, reason: "Text too short", needsQuestions: false };
  }

  // Don't optimize if it's already a well-structured prompt
  if (text.includes('**') || text.includes('1.') || text.includes('- ')) {
    return { shouldOptimize: false, confidence: 0.1, reason: "Already structured", needsQuestions: false };
  }

  // Don't optimize if it's clearly just conversation
  const conversationPatterns = /\b(thanks|thank you|yes|no|ok|okay|sure|got it|makes sense)\b/i;
  if (conversationPatterns.test(text) && text.length < 50) {
    return { shouldOptimize: false, confidence: 0.2, reason: "Simple conversation", needsQuestions: false };
  }

  if (isNaturalLanguagePrompt(text)) {
    const confidence = Math.min(0.9, text.length / 100 + 0.3);
    
    // Determine if questions are needed
    const needsQuestions = shouldAskQuestions(text);
    const questioningReason = needsQuestions ? getQuestioningReason(text) : undefined;
    
    return { 
      shouldOptimize: true, 
      confidence, 
      reason: "Natural language prompt detected",
      needsQuestions,
      questioningReason
    };
  }

  return { shouldOptimize: false, confidence: 0.1, reason: "Not a prompt", needsQuestions: false };
}

/**
 * Detects programming language from text (sync version)
 */
export function detectLanguageSync(prompt: string): string {
  const languagePatterns: Record<string, RegExp> = {
    javascript: /\b(javascript|js|node|npm|react|vue|angular)\b/i,
    typescript: /\b(typescript|ts|tsx)\b/i,
    python: /\b(python|py|django|flask|pandas|numpy)\b/i,
    java: /\b(java|spring|maven|gradle)\b/i,
    cpp: /\b(c\+\+|cpp|cmake)\b/i,
    rust: /\b(rust|cargo|rustc)\b/i,
    go: /\b(golang|go|gin)\b/i,
    php: /\b(php|laravel|composer)\b/i,
    ruby: /\b(ruby|rails|gem)\b/i,
    csharp: /\b(c#|csharp|dotnet|\.net)\b/i,
  };

  for (const [lang, pattern] of Object.entries(languagePatterns)) {
    if (pattern.test(prompt)) {
      return lang;
    }
  }
  return 'general';
}

/**
 * Detects task type from text (sync version)
 */
export function detectTaskTypeSync(prompt: string): string {
  const taskPatterns: Record<string, RegExp> = {
    debug: /\b(debug|fix|error|bug|issue|problem|not working)\b/i,
    test: /\b(test|testing|unit test|integration test|jest|pytest)\b/i,
    refactor: /\b(refactor|clean|optimize|improve|restructure)\b/i,
    explain: /\b(explain|understand|how does|what is|why)\b/i,
    architecture: /\b(architecture|design|pattern|structure|system)\b/i,
  };

  for (const [task, pattern] of Object.entries(taskPatterns)) {
    if (pattern.test(prompt)) {
      return task;
    }
  }
  return 'code';
}

/**
 * Detects complexity from text (sync version)
 */
export function detectComplexitySync(prompt: string): 'simple' | 'moderate' | 'complex' {
  if (prompt.length > 200 || /\b(complex|advanced|enterprise|scale)\b/i.test(prompt)) {
    return 'complex';
  }
  if (prompt.length > 50) {
    return 'moderate';
  }
  return 'simple';
}

/**
 * Detects language and task type (async version for compatibility)
 */
export async function detectLanguageAndTaskType(prompt: string): Promise<{ 
  language?: string; 
  taskType: string; 
  complexity: string 
}> {
  const languagePatterns: Record<string, RegExp> = {
    javascript: /\b(javascript|js|node|npm|react|vue|angular)\b/i,
    typescript: /\b(typescript|ts|tsx)\b/i,
    python: /\b(python|py|django|flask|pandas|numpy)\b/i,
    java: /\b(java|spring|maven|gradle)\b/i,
    cpp: /\b(c\+\+|cpp|cmake)\b/i,
    rust: /\b(rust|cargo|rustc)\b/i,
    go: /\b(golang|go|gin)\b/i,
    php: /\b(php|laravel|composer)\b/i,
    ruby: /\b(ruby|rails|gem)\b/i,
    csharp: /\b(c#|csharp|dotnet|\.net)\b/i,
  };

  const taskPatterns: Record<string, RegExp> = {
    debug: /\b(debug|fix|error|bug|issue|problem|not working)\b/i,
    test: /\b(test|testing|unit test|integration test|jest|pytest)\b/i,
    refactor: /\b(refactor|clean|optimize|improve|restructure)\b/i,
    explain: /\b(explain|understand|how does|what is|why)\b/i,
    architecture: /\b(architecture|design|pattern|structure|system)\b/i,
  };

  let language: string | undefined;
  for (const [lang, pattern] of Object.entries(languagePatterns)) {
    if (pattern.test(prompt)) {
      language = lang;
      break;
    }
  }

  let taskType = 'code';
  for (const [task, pattern] of Object.entries(taskPatterns)) {
    if (pattern.test(prompt)) {
      taskType = task;
      break;
    }
  }

  const complexity = prompt.length > 200 || /\b(complex|advanced|enterprise|scale)\b/i.test(prompt) ? 'complex' : 
                    prompt.length > 50 ? 'moderate' : 'simple';

  return { language, taskType, complexity };
}

/**
 * Generates clarifying questions based on prompt analysis
 */
export async function generateClarifyingQuestions(
  prompt: string, 
  language?: string, 
  context?: string
): Promise<string[]> {
  const questions: string[] = [];
  
  // Analyze what type of clarification is needed
  if (/\b(fix|error|bug|issue|problem)\b/i.test(prompt) && prompt.length < 50) {
    questions.push("What specific error or problem are you encountering?");
    questions.push("What should the expected behavior be?");
  }
  
  if (/\b(improve|optimize|better)\b/i.test(prompt) && !/\b(performance|speed|memory|size)\b/i.test(prompt)) {
    questions.push("What specific aspect needs improvement (performance, readability, maintainability)?");
  }
  
  if (/\b(app|application|system|project)\b/i.test(prompt) && !language) {
    questions.push("What technology stack or programming language are you using?");
  }
  
  // Default questions if none of the above apply
  if (questions.length === 0) {
    questions.push(
      "What specific outcome are you looking for?",
      "Are there any constraints or requirements I should know about?"
    );
  }
  
  return questions.slice(0, 3); // Limit to 3 questions max
}

/**
 * Generates an optimized prompt based on analysis
 */
export function generateOptimizedPrompt(
  prompt: string,
  language?: string, 
  context?: string,
  refinements: string[] = []
): string {
  const detectedLanguage = language || detectLanguageSync(prompt);
  const taskType = detectTaskTypeSync(prompt);
  const complexity = detectComplexitySync(prompt);

  // Build enhanced prompt directly instead of meta-prompting
  let optimizedPrompt = '';
  
  // Add context if provided
  if (context) {
    optimizedPrompt += `**Context:** ${context}\n\n`;
  }
  
  // Enhance the original prompt based on task type
  if (taskType === 'debug') {
    optimizedPrompt += `**Task:** Debug and fix the following issue:\n\n${prompt}\n\n**Requirements:**\n`;
    optimizedPrompt += `- Use file search tools (Grep/Glob) to locate relevant code\n`;
    optimizedPrompt += `- Read and analyze the problematic files\n`;
    optimizedPrompt += `- Identify the root cause and implement a fix\n`;
    optimizedPrompt += `- Test the solution if possible\n`;
  } else if (taskType === 'refactor') {
    optimizedPrompt += `**Task:** Refactor and improve the following code:\n\n${prompt}\n\n**Requirements:**\n`;
    optimizedPrompt += `- Maintain existing functionality\n`;
    optimizedPrompt += `- Follow ${detectedLanguage} best practices\n`;
    optimizedPrompt += `- Improve code readability and maintainability\n`;
    optimizedPrompt += `- Use existing project patterns and conventions\n`;
  } else if (taskType === 'test') {
    optimizedPrompt += `**Task:** Create comprehensive tests for:\n\n${prompt}\n\n**Requirements:**\n`;
    optimizedPrompt += `- Follow the project's existing test patterns\n`;
    optimizedPrompt += `- Cover edge cases and error scenarios\n`;
    optimizedPrompt += `- Use appropriate testing framework for ${detectedLanguage}\n`;
  } else if (taskType === 'explain') {
    optimizedPrompt += `**Task:** Explain the following:\n\n${prompt}\n\n**Requirements:**\n`;
    optimizedPrompt += `- Provide clear, structured explanation\n`;
    optimizedPrompt += `- Use examples where helpful\n`;
    optimizedPrompt += `- Cover both high-level concepts and implementation details\n`;
  } else if (taskType === 'architecture') {
    optimizedPrompt += `**Task:** Design and plan architecture for:\n\n${prompt}\n\n**Requirements:**\n`;
    optimizedPrompt += `- Consider scalability and maintainability\n`;
    optimizedPrompt += `- Follow established design patterns\n`;
    optimizedPrompt += `- Document key decisions and trade-offs\n`;
  } else {
    // Generic enhancement
    optimizedPrompt += `**Task:** ${prompt}\n\n**Implementation Requirements:**\n`;
    optimizedPrompt += `- Follow ${detectedLanguage} best practices and conventions\n`;
    optimizedPrompt += `- Use existing project patterns where applicable\n`;
    if (complexity === 'complex') {
      optimizedPrompt += `- Break down into manageable steps using TodoWrite tool\n`;
    }
    optimizedPrompt += `- Ensure code quality and maintainability\n`;
  }
  
  // Add refinements if provided
  if (refinements.length > 0) {
    optimizedPrompt += `\n**Additional Requirements:**\n${refinements.map(r => `- ${r}`).join('\n')}\n`;
  }
  
  // Add execution suggestion
  optimizedPrompt += `\n**Ready to proceed with this task?**`;
  
  return optimizedPrompt;
}

/**
 * Main prompt engineering function
 */
export async function engineerPrompt(
  prompt: string, 
  language?: string, 
  context?: string, 
  refinements: string[] = []
): Promise<string> {
  return generateOptimizedPrompt(prompt, language, context, refinements);
}

/**
 * Auto-optimization with analysis
 */
export async function autoOptimizeText(
  text: string, 
  context?: string, 
  forceInteractive?: boolean
): Promise<AutoOptimizeResult> {
  const analysis = shouldAutoOptimize(text);
  
  if (!analysis.shouldOptimize) {
    return { shouldOptimize: false, analysis };
  }

  const detectedInfo = await detectLanguageAndTaskType(text);
  
  // Check if we should ask questions (either forced or auto-detected)
  const needsQuestionsResult = forceInteractive || analysis.needsQuestions;
  
  if (needsQuestionsResult) {
    try {
      const questions = await generateClarifyingQuestions(text, detectedInfo.language, context);
      const sessionId = generateSessionId();
      
      // Store session for later use
      // Validate and map complexity
      const validComplexities = ['simple', 'moderate', 'complex'] as const;
      const complexity = validComplexities.includes(detectedInfo.complexity as typeof validComplexities[number]) 
        ? detectedInfo.complexity as 'simple' | 'moderate' | 'complex'
        : 'moderate';
      
      // Validate and map taskType  
      const validTaskTypes = ['code', 'debug', 'explain', 'refactor', 'test', 'architecture'] as const;
      const taskType = validTaskTypes.includes(detectedInfo.taskType as typeof validTaskTypes[number])
        ? detectedInfo.taskType as 'code' | 'debug' | 'explain' | 'refactor' | 'test' | 'architecture'
        : 'code';

      createSession(sessionId, {
        originalPrompt: text,
        context: context ? [context] : [],
        refinements: [],
        language: detectedInfo.language,
        complexity,
        taskType
      });
      
      return {
        shouldOptimize: true,
        analysis: {
          ...analysis,
          detectedLanguage: detectedInfo.language,
          taskType: detectedInfo.taskType,
          complexity: detectedInfo.complexity
        },
        needsQuestions: true,
        questions,
        sessionId
      };
    } catch (error) {
      // If question generation fails, fall back to direct optimization
      console.error('Question generation failed, falling back to direct optimization:', error);
    }
  }

  // Direct optimization (no questions needed or questions failed)
  try {
    const optimizedPrompt = await engineerPrompt(text, detectedInfo.language, context);
    
    return {
      shouldOptimize: true,
      optimizedPrompt,
      analysis: {
        ...analysis,
        detectedLanguage: detectedInfo.language,
        taskType: detectedInfo.taskType,
        complexity: detectedInfo.complexity,
        method: 'built-in'
      }
    };
  } catch (error) {
    // If optimization fails, still return the analysis
    return { 
      shouldOptimize: true, 
      analysis: { 
        ...analysis, 
        error: error instanceof Error ? error.message : String(error) 
      } 
    };
  }
}

/**
 * Parses arguments from command line style input
 * Supports: --language=value, --context=value, --interactive
 */
export function parseArguments(input: string): {
  prompt: string;
  language?: string;
  context?: string;
  interactive: boolean;
} {
  let prompt = input;
  let language: string | undefined;
  let context: string | undefined;
  let interactive = false;

  // Extract all --language=value occurrences (use first one, remove all)
  const languageMatches = input.matchAll(/--language=(\S+)/gi);
  for (const match of languageMatches) {
    if (!language) {
      language = match[1];
    }
    prompt = prompt.replace(match[0], '').trim();
  }

  // Extract all --context=value occurrences (supports quoted values, use first one, remove all)
  const contextRegex = /--context=["']([^"']+)["']|--context=(\S+)/gi;
  let contextMatch;
  while ((contextMatch = contextRegex.exec(input)) !== null) {
    if (!context) {
      context = contextMatch[1] || contextMatch[2];
    }
    prompt = prompt.replace(contextMatch[0], '').trim();
  }

  // Extract all --interactive flag occurrences
  const interactiveRegex = /--interactive\b/gi;
  let interactiveMatch;
  while ((interactiveMatch = interactiveRegex.exec(input)) !== null) {
    interactive = true;
    prompt = prompt.replace(interactiveMatch[0], '').trim();
  }

  return { prompt, language, context, interactive };
}
