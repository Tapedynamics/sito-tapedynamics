// File: netlify/functions/gemini.js

// Usiamo 'node-fetch' per fare chiamate API dal backend
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Funzione di utility per l'attesa (delay)
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

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

        // NUOVA LOGICA: Retry con exponential backoff
        let apiResponse;
        const maxRetries = 3;
        let attempt = 0;
        let lastError = null;

        while (attempt < maxRetries) {
            try {
                apiResponse = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                // Se la risposta è 503 (Service Unavailable / Overloaded) o 429 (Too Many Requests), ritenta
                if (apiResponse.status === 503 || apiResponse.status === 429) {
                    const errorJson = await apiResponse.json();
                    throw new Error(errorJson.error?.message || 'Model is overloaded');
                }

                // Se la risposta è ok, esci dal ciclo
                if (apiResponse.ok) {
                    break;
                } else {
                    // Per altri errori, salva l'errore e interrompi
                    const result = await apiResponse.json();
                    lastError = result.error?.message || `Errore API con status ${apiResponse.status}`;
                    break;
                }

            } catch (error) {
                lastError = error.message;
                attempt++;
                if (attempt < maxRetries) {
                    const delayTime = Math.pow(2, attempt) * 1000; // Attesa di 2s, 4s
                    await delay(delayTime);
                } else {
                    // Se si è raggiunto il numero massimo di tentativi
                    lastError = 'Il modello è attualmente sovraccarico. Riprova tra qualche minuto.';
                }
            }
        }
        
        // Se dopo i tentativi la risposta non è ancora valida, restituisci l'ultimo errore
        if (!apiResponse || !apiResponse.ok) {
             return {
                statusCode: apiResponse ? apiResponse.status : 503,
                body: JSON.stringify({ error: lastError })
            };
        }

        const result = await apiResponse.json();
        
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
