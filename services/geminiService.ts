import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Character } from "../types";

// Lazy initialization of the AI client to prevent runtime crashes if API_KEY is missing at startup
const getAiClient = () => {
  // Access process.env safely. The index.html shim ensures 'process' exists.
  // We provide a fallback dummy key if empty to allow the app to load, 
  // though actual API calls will fail gracefully later.
  const apiKey = process.env.API_KEY || 'MISSING_API_KEY';
  return new GoogleGenAI({ apiKey });
};

// System instruction to set the persona
const SYSTEM_INSTRUCTION = `
Você é o "Guardião dos Mistérios", um assistente de mestre de jogo onisciente para um RPG de Mesa baseado no universo de "Lord of Mysteries".
Seu tom deve ser misterioso, ligeiramente vitoriano, Eldritch, mas prestativo.
O usuário é um jogador ou GM gerenciando um personagem.
RESPONDA SEMPRE EM PORTUGUÊS BRASILEIRO.
IMPORTANTE: Mantenha os nomes dos Caminhos (Pathways) e Habilidades (Abilities/Sequences) em INGLÊS. Exemplo: Use "Seer" ao invés de "Vidente", use "Clown" ao invés de "Palhaço".

Ao ser questionado sobre regras, assuma as mecânicas padrão de Lord of Mysteries:
- 22 Pathways, Sequência 9 (Baixa) até Sequência 0 (Deus).
- Método de Atuação (Acting Method): Interpretação de papéis para digerir poções.
- Características Beyonder: Indestrutíveis, lei da conservação.
- Perda de Controle: Mecânicas de Sanidade/Corrupção.

Você pode ser solicitado a:
1. Gerar ganchos de cenário.
2. Descrever os efeitos de uma poção ou artefato selado.
3. Interpretar um resultado de rolagem de dados se o usuário fornecer contexto.
4. Explicar as habilidades de uma Sequência específica.

Mantenha as respostas concisas, a menos que uma história seja solicitada. Use markdown para formatação.
`;

export const createMysteryChat = (characterContext?: Character): Chat => {
  const contextString = characterContext 
    ? `\n\nContexto Atual do Personagem:\nNome: ${characterContext.name}\nPathway: ${characterContext.pathway} (Seq ${characterContext.sequence})\nSanidade: ${characterContext.stats.sanity}/${characterContext.stats.maxSanity}`
    : "";

  const ai = getAiClient();
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION + contextString,
      temperature: 0.9,
    },
  });
};

export const generateLoreSnippet = async (prompt: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "Você é um guardião do conhecimento críptico do mundo de Lord of Mysteries. Forneça uma descrição curta e atmosférica em Português Brasileiro.",
        // When maxOutputTokens is set, thinkingBudget should also be provided to ensure tokens are available for the final response
        maxOutputTokens: 150,
        thinkingConfig: { thinkingBudget: 50 }
      }
    });
    // Accessing .text as a property (not a method) as per guidelines
    return response.text || " O nevoeiro é muito espesso... Não consigo ver.";
  } catch (error) {
    console.error("Lore generation failed:", error);
    return "Algo interferiu na divinação. (Verifique sua API Key)";
  }
};

export const generateImage = async (prompt: string): Promise<string | null> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation failed:", error);
    return null;
  }
};