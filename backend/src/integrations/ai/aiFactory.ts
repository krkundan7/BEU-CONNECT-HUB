import { IAIService } from './ai.interface.js';
import { openRouterAIService } from './openrouterAI.service.js';
import { aiService as geminiService } from './geminiAI.service.js';
import { env } from '../../config/env.js';
import { Logger } from '../../utils/logger.js';

/* NOV-COMMENT-26: Dynamic AI Provider Factory & LLM Gateway Abstraction
 * Implements the Factory design pattern conforming to the common 'IAIService' interface.
 * Reads 'env.AI_PROVIDER' to dynamically instantiate either the OpenRouter multi-model gateway or direct Google Gemini SDK,
 * allowing instant provider failover and zero-downtime model upgrades without changing client-side code. */
export const getAIService = (): IAIService => {
  const provider = (env.AI_PROVIDER || 'openrouter').toLowerCase();

  switch (provider) {
    case 'gemini':
      Logger.debug('Using Gemini AI Service provider');
      return geminiService;
    case 'openrouter':
    default:
      Logger.debug(`Using OpenRouter AI Gateway (Model: ${env.OPENROUTER_MODEL})`);
      return openRouterAIService;
  }
};

export const aiService = getAIService();
