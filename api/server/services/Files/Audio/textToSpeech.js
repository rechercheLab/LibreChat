const axios = require('axios');

async function textToSpeech(req, res) {
  let text = req.body.text;

  if (!text) {
    return res.status(400).send('Missing text in request body');
  }
  const url = process.env.TTS_REVERSE_PROXY;

  const headers = {
    Accept: 'audio/mpeg',
    'Content-Type': 'application/json',
    'xi-api-key': process.env.TTS_API_KEY,
  };
  const data = {
    text: text,
    model_id: 'eleven_monolingual_v1',
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.5,
    },
  };

  try {
    const response = await axios.post(url, data, { headers, responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');

    res.set('Content-Disposition', 'attachment; filename="audio.mp3"');
    res.set('Content-Type', 'audio/mpeg');
    res.send(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
}

module.exports = textToSpeech;