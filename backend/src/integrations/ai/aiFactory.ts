import { IAIService } from './ai.interface.js';
import { openRouterAIService } from './openrouterAI.service.js';
import { aiService as geminiService } from './geminiAI.service.js';
import { env } from '../../config/env.js';
import { Logger } from '../../utils/logger.js';

/**
 * Modular AI Provider Resolver
 * Dynamically resolves the active AI Service implementation based on environment configuration.
 * Allows seamless switching of LLM providers (OpenRouter, Gemini, etc.) and models without frontend alterations.
 */
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
