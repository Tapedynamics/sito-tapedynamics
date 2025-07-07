exports.handler = async function(event) {
    console.log("Function started."); // Log 1: La funzione è partita

    if (event.httpMethod !== 'POST') {
        console.log("Method not POST, exiting.");
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { prompt } = JSON.parse(event.body);
        console.log("Received prompt:", prompt); // Log 2: Ho ricevuto il prompt

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("FATAL: GEMINI_API_KEY not found in environment variables.");
            return { statusCode: 500, body: JSON.stringify({ error: 'La chiave API non è configurata sul server.' }) };
        }
        console.log("API Key found. Ready to call Google."); // Log 3: Chiave API trovata

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        const payload = {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        idee: {
                            type: "ARRAY",
                            items: {
                                type: "OBJECT",
                                properties: {
                                    titolo: { type: "STRING" },
                                    descrizione: { type: "STRING" }
                                },
                                required: ["titolo", "descrizione"]
                            }
                        }
                    },
                    required: ["idee"]
                }
            }
        };

        console.log("Calling Google API..."); // Log 4: Sto chiamando Google
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        console.log("Google API response status:", response.status); // Log 5: Google ha risposto

        const data = await response.json();

        if (!response.ok) {
            console.error("Error from Google API:", data);
            return { statusCode: response.status, body: JSON.stringify({ error: `Errore dall'API di Google: ${data.error?.message || 'Errore sconosciuto'}` }) };
        }

        console.log("Successfully received data from Google API. Sending response."); // Log 6: Successo!
        return { statusCode: 200, body: JSON.stringify(data) };

    } catch (error) {
        console.error("CRITICAL ERROR in Netlify function:", error);
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};
