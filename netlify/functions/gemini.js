// File: netlify/functions/gemini.js

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { prompt, schema } = JSON.parse(event.body);
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error('La chiave API di Gemini non è stata configurata sul server.');
    }
    if (!prompt) {
      throw new Error('Il prompt non può essere vuoto.');
    }

    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    };

    if (schema) {
      payload.generationConfig = {
        responseMimeType: "application/json",
        responseSchema: schema,
      };
    }

    const response = await fetch(`${API_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Errore API:', errorData);
      throw new Error(errorData.error?.message || 'Errore sconosciuto dall\'API di Gemini.');
    }

    const data = await response.json();

    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content.parts[0].text) {
        const text = data.candidates[0].content.parts[0].text;
        return {
            statusCode: 200,
            body: JSON.stringify({ text: text }),
        };
    } else {
         throw new Error('La risposta dall\'AI era vuota o in un formato inatteso.');
    }

  } catch (error) {
    console.error('Errore nella funzione Netlify:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
