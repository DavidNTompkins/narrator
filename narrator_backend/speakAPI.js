
// doesn't work but could be fixed
async function speakAPI(text, client) {
  const request = {
    input: { text },
    voice: { languageCode: 'en-US', name: 'en-US-Standard-I' },
    audioConfig: { audioEncoding: 'MP3' },
  };

  const [response] = await client.synthesizeSpeech(request);
  //console.log(response)
  return response.audioContent;
}
module.exports = speakAPI