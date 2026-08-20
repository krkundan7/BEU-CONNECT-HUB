import { IAIService, AIChatMessage, BEUFullPatternAnalysisReport } from './ai.interface.js';
import { BEUPatternAnalyzerEngine } from './beuAnalyzerEngine.js';
import { BEU_MASTER_SYSTEM_PROMPT } from './beuMasterPrompt.js';
import { BEUKnowledgeEngine } from './beuKnowledgeEngine.js';

export class GeminiAIService implements IAIService {
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.AI_API_KEY || '';
    this.model = process.env.AI_MODEL || 'gemini-1.5-flash';
  }

  /**
   * Generates academic tutoring responses by attempting online Gemini LLM inference first,
   * falling back automatically to the offline deterministic BEUKnowledgeEngine on network or API failures.
   */
  async generateAcademicResponse(messages: AIChatMessage[]): Promise<string> {
    const latestMsg = messages[messages.length - 1];
    const latestUserMessage = latestMsg?.content || '';
    if (!latestUserMessage.trim()) {
      return 'Please provide a question or upload a syllabus diagram / numerical / question paper.';
    }

    // Try calling external LLM API if valid API key is present
    if (this.apiKey && this.apiKey !== 'your_gemini_or_openai_api_key_here') {
      try {
        const response = await this.callExternalLLM(messages);
        if (response && response.trim()) {
          return response;
        }
      } catch (err) {
        console.warn('[GeminiAIService] External LLM call failed, falling back to BEUKnowledgeEngine:', err);
      }
    }

    // High-precision built-in BEU Academic Knowledge Engine
    return BEUKnowledgeEngine.generateAcademicResponse(latestUserMessage);
  }

  /**
   * Dispatches multimodal requests to Google Gemini REST endpoint, formatting base64 image/PDF attachments into inline parts
   * and injecting the comprehensive BEU system prompt.
   */
  private async callExternalLLM(messages: AIChatMessage[]): Promise<string | null> {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    const formattedContents = messages.map(msg => {
      const parts: any[] = [{ text: msg.content }];

      // Multimodal Image / PDF attachment support with MIME type extraction
      if (msg.attachment && msg.attachment.dataUrl) {
        try {
          const [header, base64Data] = msg.attachment.dataUrl.split(',');
          let mimeType = 'image/jpeg';
          if (header && header.includes(':') && header.includes(';')) {
            mimeType = header.split(':')[1].split(';')[0];
          } else if (msg.attachment.type === 'pdf') {
            mimeType = 'application/pdf';
          }

          if (base64Data) {
            parts.unshift({
              inline_data: {
                mime_type: mimeType,
                data: base64Data,
              },
            });
          }
        } catch (e) {
          console.warn('[GeminiAIService] Error parsing attachment base64:', e);
        }
      }

      return {
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts,
      };
    });

    // Enforce low temperature (0.2) to minimize hallucinations and maximize adherence to official BEU curriculum facts
    const requestBody = {
      systemInstruction: {
        parts: [{ text: BEU_MASTER_SYSTEM_PROMPT }],
      },
      contents: formattedContents,
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2048,
      },
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API responded with status ${res.status}: ${errText}`);
    }

    const data: any = await res.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return candidateText || null;
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

export const aiService = new GeminiAIService();
