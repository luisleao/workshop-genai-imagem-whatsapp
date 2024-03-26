// Define as Variaveis de Ambiente
const {
    ACCOUNT_SID,
    AUTH_TOKEN,
    OPENAI_API_KEY,
    // GEMINI_API_KEY
} = process.env;


// Configura as APIs das IAs

// Função auxiliar para baixar arquivo do Twilio (necessário pela autenticação)
const downloadTwilioMedia = async (mediaUrl) => {
    const axios = require('axios'); // Para chamadas HTTP
    return await axios
        .get(mediaUrl, {
            responseType: 'arraybuffer',
            auth: {
                username: ACCOUNT_SID,
                password: AUTH_TOKEN
            }
        })
        .then(response => {
            const result = {
                contentType: response.headers['content-type'],
                base64: Buffer.from(response.data, 'binary').toString('base64')
            }
            return result;
        }).catch(e => {
            console.error('ERROR!', e);
            return null;
        });
}


// Define o Prompt
const promptAI = `Esta é a imagem de um lixo, faça uma análise completa e retorne um arquivo json seguinte formato:
            
    {
        "obj" : <nome do objeto>,
        "mat": <composição aproximada do material>,
        "descarte" : <explicação simples sobre como descartar adequadamente">,
    }

    Retorne APENAS o conteúdo do JSON de forma textual e nada mais. Deve ser um JSON válido.`




// Função auxiliar para extrair o JSON
const parseJSON = (jsonString) => {
    let resposta;
    try {
        resposta = JSON.parse(jsonString.split('```json').join('').split('```').join(''))
    }
    catch (error) {
        resposta = { 'mensagem' : jsonString }
    }
    return resposta;
}




// Função para Analisar a Imagem e chamar o Modelo
async function analyzeImageWithOpenAI(imageUrl, from) {
    const imageBase64 = await downloadTwilioMedia(imageUrl);

    imageData = {
        url: `data:${imageBase64.contentType};base64,${imageBase64.base64}`,
        detail: "low"
    }
    const OpenAI = require('openai');
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
    const openAIResponse = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: promptAI },
            {
              type: "image_url",
              image_url: imageData,
            },
          ],
        },
      ],
    });

    let response = parseJSON(openAIResponse.choices[0].message.content)
    return response
}

/* CODIGO ACESSO API DA GEMINI
//Função para analisar a imagem usando Gemini
async function analyzeImageWithGemini(imageUrl, from) {
    const imageBase64 = await downloadTwilioMedia(imageUrl);
    
    imageData = {
        inlineData: { data: imageBase64.base64, mimeType: imageBase64.contentType },
    }
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    const result = await model.generateContent([promptAI, [imageData]]);
    let response = parseJSON(result.response);
    return response;
}
*/


// Função Handler para processar as mensagens
/*
    Parâmetros: url, from
*/
exports.handler = async function(context, event, callback) {
    

    const imageUrl = event.url; // A URL da imagem enviada via Twilio.
    if (!imageUrl) {
        console.error('Nenhuma URL de imagem fornecida');
        callback('Nenhuma URL de imagem fornecida');
        return;
    }
  
    try {
        let response = await analyzeImageWithOpenAI(imageUrl, event.from);
        // let response = await analyzeImageWithGemini(imageUrl, event.from);
        callback(null, response);
    } catch (error) {
        console.error('Erro ao processar a imagem', error);
        callback('Erro interno', null);
    }
  
};