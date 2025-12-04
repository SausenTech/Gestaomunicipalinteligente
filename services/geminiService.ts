import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const MODEL_NAME = 'gemini-2.5-flash';

export const askCityAssistant = async (question: string, context: string): Promise<string> => {
  if (!apiKey) {
    return "Erro: Chave de API não configurada. Por favor, configure a variável de ambiente API_KEY.";
  }

  try {
    const systemInstruction = `Você é o Assistente Virtual do sistema Gestão Municipal Inteligente - Sausen Tech. 
    Sua função é ajudar cidadãos, servidores e gestores com informações sobre o município.
    Contexto atual do usuário: ${context}.
    Seja educado, prestativo e conciso. Use formatação Markdown para listas se necessário.
    Se a pergunta for sobre serviços, explique o passo a passo.
    Se a pergunta for técnica ou administrativa, seja profissional.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [
        {
          role: 'user',
          parts: [{ text: question }]
        }
      ],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "Desculpe, não consegui processar sua solicitação no momento.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Ocorreu um erro ao comunicar com o assistente inteligente.";
  }
};

export const summarizeLaw = async (lawText: string): Promise<string> => {
   if (!apiKey) return "API Key missing";
   
   try {
     const response: GenerateContentResponse = await ai.models.generateContent({
       model: MODEL_NAME,
       contents: `Resuma este projeto de lei em termos simples para um cidadão comum entender:\n\n${lawText}`,
     });
     return response.text || "Não foi possível resumir.";
   } catch (error) {
     return "Erro ao resumir.";
   }
}