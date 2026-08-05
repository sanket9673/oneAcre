import Groq from 'groq-sdk';
import fs from 'fs';
import path from 'path';
import { ExtractedLand } from '@/types/api';

const apiKey = process.env.GROQ_API_KEY || '';
const isPlaceholder = !apiKey || apiKey.includes('your_groq_api_key');
export const groq = !isPlaceholder ? new Groq({ apiKey }) : null;

/**
 * Multimodal extraction using Groq Cloud API:
 * 1. Transcribes audio if provided via whisper-large-v3-turbo
 * 2. Processes payload text via llama-3.3-70b-versatile with JSON response format
 * 3. Scrubs PII and normalizes units
 */
export async function extractLandWithGroq(
  textPrompt?: string,
  audioBase64?: string,
  mimeType: string = 'audio/mp3'
): Promise<ExtractedLand> {
  if (!groq) {
    throw new Error('Groq client is not initialized or GROQ_API_KEY is missing.');
  }

  let transcribedText = '';

  // Transcribe audio using Whisper model
  if (audioBase64) {
    const scratchDir = path.join(process.cwd(), 'scratch');
    if (!fs.existsSync(scratchDir)) {
      fs.mkdirSync(scratchDir, { recursive: true });
    }
    const tempFileName = `temp_audio_${Date.now()}.mp3`;
    const tempFilePath = path.join(scratchDir, tempFileName);

    try {
      fs.writeFileSync(tempFilePath, Buffer.from(audioBase64, 'base64'));
      const transcription = await groq.audio.transcriptions.create({
        file: fs.createReadStream(tempFilePath),
        model: 'whisper-large-v3-turbo',
      });
      transcribedText = transcription.text;
    } finally {
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    }
  }

  // Combine user text input and transcribed voice note
  let payload = '';
  if (transcribedText) {
    payload += `[Transcribed Audio Voice Note]\n"${transcribedText}"\n`;
  }
  if (textPrompt) {
    payload += `[Raw Text Input]\n"${textPrompt}"\n`;
  }

  if (!payload.trim()) {
    throw new Error('No input text prompt or transcribed audio was found to process.');
  }

  const systemPrompt = `
You are an expert Indian Real Estate Ingestion Agent for AcreGrid.in. Extract land deal metadata from the input payload.

CRITICAL INSTRUCTIONS:
1. PII SCRUBBING: Remove ALL personal phone numbers, email addresses, names of landowners/agents, bank accounts, and Aadhaar numbers.
2. CONVERSION: Normalize land extent into decimal Acres (e.g., 40 Guntas = 1 Acre). Convert price into absolute INR (e.g., 2.5 Cr = 25000000).

Return ONLY a valid JSON object matching this schema:
{
  "location": "string",
  "extentAcres": number,
  "roadWidthFt": number,
  "askingPricePerAcreInr": number,
  "dealType": "Joint Development" | "Outright Purchase",
  "rawCleanedSummary": "string"
}
`;

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Input Payload:\n${payload}` },
    ],
    model: 'llama-3.3-70b-versatile',
    response_format: { type: 'json_object' },
    temperature: 0.1,
  });

  const responseContent = chatCompletion.choices[0]?.message?.content || '{}';
  return JSON.parse(responseContent) as ExtractedLand;
}
