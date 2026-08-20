import { IAIService, AIChatMessage, BEUFullPatternAnalysisReport } from './ai.interface.js';
import { BEUPatternAnalyzerEngine } from './beuAnalyzerEngine.js';
import { BEU_MASTER_SYSTEM_PROMPT } from './beuMasterPrompt.js';
import { BEUKnowledgeEngine } from './beuKnowledgeEngine.js';
import { QueryClassifier } from './queryClassifier.js';
import { env } from '../../config/env.js';
import { Logger } from '../../utils/logger.js';

/**
 * OpenRouter AI Gateway Service
 * Provides modular access to top-tier LLMs (Llama 3.3 70B, Gemini 2.0 Flash, DeepSeek, GPT-4o-mini)
 * with strict BEU Master System Prompt injection, multimodal image/PDF parsing, and offline deterministic fallback.
 */
export class OpenRouterAIService implements IAIService {
  private apiKey: string;
  private model: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = env.OPENROUTER_API_KEY || env.AI_API_KEY || '';
    this.model = env.OPENROUTER_MODEL || env.AI_MODEL || 'google/gemini-2.0-flash-001';
    this.baseUrl = (env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1').replace(/\/+$/, '');
  }

  /* NOV-COMMENT-27: Academic Query Classification & Multi-Tier AI Fallback
   * Analyzes incoming student prompts through 'QueryClassifier' to identify subject domain and research requirements.
   * Dispatches queries to OpenRouter with a conservative temperature of 0.2 to enforce factual precision.
   * If remote API calls fail or timeout, transparently falls back to the deterministic local 'BEUKnowledgeEngine' without throwing errors. */
  async generateAcademicResponse(messages: AIChatMessage[]): Promise<string> {
    const latestMsg = messages[messages.length - 1];
    const latestUserMessage = latestMsg?.content || '';

    if (!latestUserMessage.trim()) {
      return 'Please provide a question or upload a syllabus diagram / numerical / question paper.';
    }

    // Classify user intent & check fresh research triggers
    const queryClassification = QueryClassifier.classify(latestUserMessage);
    Logger.debug(`[OpenRouterAIService] Query classified as: ${queryClassification.category}`, {
      requiresFreshResearch: queryClassification.requiresFreshResearch,
      keywords: queryClassification.detectedKeywords,
    });

    // Call OpenRouter API if a valid key is provided
    if (this.apiKey && this.apiKey !== 'your_key' && this.apiKey !== 'your_gemini_or_openai_api_key_here') {
      try {
        const response = await this.callOpenRouter(messages);
        if (response && response.trim()) {
          return response;
        }
      } catch (err: any) {
        Logger.warn('[OpenRouterAIService] OpenRouter call failed, falling back to BEUKnowledgeEngine:', {
          error: err.message,
          model: this.model,
        });
      }
    }

    // High-precision offline BEU Academic Knowledge Engine fallback
    return BEUKnowledgeEngine.generateAcademicResponse(latestUserMessage);
  }

  /* NOV-COMMENT-28: Multimodal Message Assembly & BEU System Prompt Injection
   * Formats chat history with the authoritative 18-section 'BEU_MASTER_SYSTEM_PROMPT'.
   * Detects base64 data URLs for diagrams, numerical formulas, or question paper snapshots,
   * structuring them into OpenAI-compatible multimodal content objects ('image_url') for visual reasoning. */
  private async callOpenRouter(messages: AIChatMessage[]): Promise<string | null> {
    const endpoint = `${this.baseUrl}/chat/completions`;

    // System prompt with full 18-section BEU guidance
    const formattedMessages: any[] = [
      {
        role: 'system',
        content: BEU_MASTER_SYSTEM_PROMPT,
      },
    ];

    for (const msg of messages) {
      const role = msg.role === 'assistant' ? 'assistant' : msg.role === 'system' ? 'system' : 'user';

      if (msg.attachment && msg.attachment.dataUrl) {
        // OpenAI / OpenRouter Multimodal content array
        formattedMessages.push({
          role,
          content: [
            {
              type: 'text',
              text: msg.content || 'Please analyze this attached document / diagram in accordance with BEU examination standards.',
            },
            {
              type: 'image_url',
              image_url: {
                url: msg.attachment.dataUrl,
              },
            },
          ],
        });
      } else {
        formattedMessages.push({
          role,
          content: msg.content,
        });
      }
    }

    const requestBody = {
      model: this.model,
      messages: formattedMessages,
      temperature: 0.2, // Low temperature for high academic precision and zero hallucination
      max_tokens: 2500,
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
        'HTTP-Referer': 'https://beuconnecthub.ac.in',
        'X-Title': 'BEU Connect Hub AI Assistant',
      },
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenRouter API responded with status ${res.status}: ${errText}`);
    }

    const data: any = await res.json();
    const replyText = data?.choices?.[0]?.message?.content;
    return replyText || null;
  }

  /**
   * Generates a 16-point examination frequency analysis report mapping recurring question trends across past BEU papers.
   */
  async analyzePYQPatterns(
    subjectName: string,
    branch?: string,
    semester?: number,
    _papersMetadata?: any[]
  ): Promise<BEUFullPatternAnalysisReport> {
    return BEUPatternAnalyzerEngine.generateReport(subjectName, branch, semester);
  }
}

export const openRouterAIService = new OpenRouterAIService();
