const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || '';
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || '';
const EVOLUTION_INSTANCE_NAME = process.env.EVOLUTION_INSTANCE_NAME || 'reviewflow';

interface SendMessagePayload {
  number: string;
  text: string;
}

export async function sendWhatsAppMessage(payload: SendMessagePayload): Promise<boolean> {
  try {
    const response = await fetch(`${EVOLUTION_API_URL}/message/sendText/${EVOLUTION_INSTANCE_NAME}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': EVOLUTION_API_KEY,
      },
      body: JSON.stringify({
        number: payload.number,
        text: payload.text,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('WhatsApp send error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('WhatsApp send error:', error);
    return false;
  }
}

export async function sendWhatsAppLink(payload: SendMessagePayload & { mediaUrl: string }): Promise<boolean> {
  try {
    const response = await fetch(`${EVOLUTION_API_URL}/message/sendLink/${EVOLUTION_INSTANCE_NAME}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': EVOLUTION_API_KEY,
      },
      body: JSON.stringify({
        number: payload.number,
        text: payload.text,
        link: payload.mediaUrl,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('WhatsApp link send error:', error);
    return false;
  }
}

export async function checkWhatsAppConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${EVOLUTION_API_URL}/instance/connect/${EVOLUTION_INSTANCE_NAME}`, {
      method: 'GET',
      headers: {
        'apikey': EVOLUTION_API_KEY,
      },
    });

    return response.ok;
  } catch {
    return false;
  }
}