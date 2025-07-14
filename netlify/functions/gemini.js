// File: netlify/functions/gemini.js

// Usiamo 'node-fetch' per fare chiamate API dal backend
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.handler = async function(event) {
    // Accetta solo richieste di tipo POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { prompt, schema } = JSON.parse(event.body);
        const apiKey = process.env.GEMINI_API_KEY; // Prende la chiave API dalle variabili di Netlify

        if (!apiKey) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'API Key non configurata sul server.' })
            };
        }

        if (!prompt) {
             return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Il prompt non può essere vuoto.' })
            };
        }

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const payload = {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        };

        if (schema) {
            payload.generationConfig = {
                responseMimeType: "application/json",
                responseSchema: schema
            };
        }

        const apiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await apiResponse.json();

        if (!apiResponse.ok) {
            console.error('API Error:', result);
            return {
                statusCode: apiResponse.status,
                body: JSON.stringify({ error: result.error?.message || 'Errore durante la chiamata all\'API di Google.' })
            };
        }
        
        // NUOVO CONTROLLO DI SICUREZZA: Verifica che la risposta abbia il formato atteso
        if (result.candidates && result.candidates.length > 0 && result.candidates[0].content && result.candidates[0].content.parts && result.candidates[0].content.parts.length > 0 && result.candidates[0].content.parts[0].text) {
            const text = result.candidates[0].content.parts[0].text;
            
            // Restituisce il risultato al frontend
            return {
                statusCode: 200,
                body: JSON.stringify({ text: text })
            };
        } else {
            // Se la struttura è inattesa o la risposta è bloccata, restituisce un errore chiaro
            console.error('Unexpected API response structure:', result);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'La risposta dall\'AI era vuota o in un formato inatteso. Riprova.' })
            };
        }

    } catch (error) {
        console.error('Serverless Function Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
