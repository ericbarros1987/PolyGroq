import { NextRequest, NextResponse } from 'next/server';

const VOICE_MAP: Record<string, { voice: string; lang: string; name: string }> = {
  'en-US': { voice: 'en-US-AriaNeural', lang: 'en-US', name: 'Aria' },
  'en-GB': { voice: 'en-GB-SoniaNeural', lang: 'en-GB', name: 'Sonia' },
  'es-ES': { voice: 'es-ES-ElviraNeural', lang: 'es-ES', name: 'Elvira' },
  'es-MX': { voice: 'es-MX-DaliaNeural', lang: 'es-MX', name: 'Dalia' },
  'fr-FR': { voice: 'fr-FR-DeniseNeural', lang: 'fr-FR', name: 'Denise' },
  'de-DE': { voice: 'de-DE-KatjaNeural', lang: 'de-DE', name: 'Katja' },
  'it-IT': { voice: 'it-IT-ElsaNeural', lang: 'it-IT', name: 'Elsa' },
  'pt-BR': { voice: 'pt-BR-FranciscaNeural', lang: 'pt-BR', name: 'Francisca' },
  'pt-PT': { voice: 'pt-PT-RaquelNeural', lang: 'pt-PT', name: 'Raquel' },
  'ja-JP': { voice: 'ja-JP-NanamiNeural', lang: 'ja-JP', name: 'Nanami' },
  'ko-KR': { voice: 'ko-KR-SunHiNeural', lang: 'ko-KR', name: 'SunHi' },
  'zh-CN': { voice: 'zh-CN-XiaoxiaoNeural', lang: 'zh-CN', name: 'Xiaoxiao' },
  'zh-TW': { voice: 'zh-TW-HsiaoYuNeural', lang: 'zh-TW', name: 'HsiaoYu' },
  'ru-RU': { voice: 'ru-RU-DariyaNeural', lang: 'ru-RU', name: 'Dariya' },
  'nl-NL': { voice: 'nl-NL-ColetteNeural', lang: 'nl-NL', name: 'Colette' },
  'pl-PL': { voice: 'pl-PL-AgnieszkaNeural', lang: 'pl-PL', name: 'Agnieszka' },
  'ar-SA': { voice: 'ar-SA-ZariyahNeural', lang: 'ar-SA', name: 'Zariyah' },
};

function getVoiceForLanguage(lang: string): { voice: string; lang: string; name: string } {
  const exact = VOICE_MAP[lang];
  if (exact) return exact;
  
  const prefix = lang.split('-')[0];
  const match = Object.values(VOICE_MAP).find(v => v.lang.startsWith(prefix));
  return match || VOICE_MAP['en-US'];
}

export async function POST(request: NextRequest) {
  try {
    const { text, language = 'pt-BR', rate = '+0%', pitch = '+0Hz', volume = '+0%' } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const voiceConfig = getVoiceForLanguage(language);

    const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='${voiceConfig.lang}'>
  <voice name='${voiceConfig.voice}'>
    <prosody rate='${rate}' pitch='${pitch}' volume='${volume}'>
      ${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')}
    </prosody>
  </voice>
</speak>`;

    const response = await fetch(
      'https://speech.platform.bing.com/consumer/ssml',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/ssml+xml',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
        },
        body: ssml,
      }
    );

    if (!response.ok) {
      throw new Error('Edge TTS request failed');
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');

    return NextResponse.json({
      audio: `data:audio/mp3;base64,${base64Audio}`,
      voice: voiceConfig.voice,
      voiceName: voiceConfig.name,
      language: voiceConfig.lang,
    });

  } catch (error) {
    console.error('TTS Error:', error);
    return NextResponse.json({ error: 'Failed to generate speech' }, { status: 500 });
  }
}
