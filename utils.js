const crypto = require('crypto');
const uuid = require('uuid');
const fetch = require('node-fetch');


const signOpenApiHeaders = (method, url,apiKey,apiSecret) => {
    const SIGN_STRING_PATTERN = "{method}|{url}|{ts}|{nonce}";
    const ts = Date.now();
    const nonce = uuid.v4();
    const toSign = SIGN_STRING_PATTERN
        .replace("{method}", method.toUpperCase())
        .replace("{url}", url)
        .replace("{ts}", ts)
        .replace("{nonce}", nonce);

    const signed = crypto
        .createHmac('sha256', apiSecret)
        .update(toSign)
        .digest('hex');

    return {
        "Content-Type": "application/json; charset=utf-8",
        "key": apiKey,
        "ts": ts.toString(),
        "nonce": nonce,
        "sign": signed
    };
};

const makeVideoFromScript = (script,webhookUrl,apiKey,apiSecret) => {
    const headers = signOpenApiHeaders('POST','https://openapi.visla.us/openapi/project/script-to-video',apiKey,apiSecret);
    const options = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          script: script,   
          bgm_options: {use_free_stocks: true},
          completion_webhook: webhookUrl,
          footage_options: {
            use_free_stocks: true,
            use_premium_stocks: true
          },
          target_video: {burn_subtitles: true},
          bgm_options: {use_free_stocks: true},
          footage_options: {"use_free_stocks": true,"use_premium_stocks": true,"use_premium_stocks_getty": true}
        })
      };
      
      return fetch('https://openapi.visla.us/openapi/project/script-to-video', options)
        .then(res => res.json());
};

const checkVideoStatus = (videoId, apiKey, apiSecret) => {
    const url = `https://openapi.visla.us/openapi/project/${videoId}/info`;
    const headers = signOpenApiHeaders('GET', url, apiKey, apiSecret);
    const options = {method: 'GET', headers: headers};

    return fetch(url, options)
        .then(res => res.json());
}

const exportVideoToClip = (videoId, apiKey, apiSecret) => {
    const url = `https://openapi.visla.us/openapi/project/${videoId}/export-video`;
    const headers = signOpenApiHeaders('POST', url, apiKey, apiSecret);
    const options = {method: 'POST', headers: headers};

    return fetch(url, options)
        .then(res => res.json());
}

const getClipDownloadUrl = (clipId, apiKey, apiSecret) => {
    const url = `https://openapi.visla.us/openapi/clip/${clipId}/get-download-link`;
    const headers = signOpenApiHeaders('GET', url, apiKey, apiSecret);
    const options = {method: 'GET', headers: headers};

    return fetch(url, options)
        .then(res => res.json());
}

module.exports = {
    makeVideoFromScript,
    checkVideoStatus,
    exportVideoToClip,
    getClipDownloadUrl
};
