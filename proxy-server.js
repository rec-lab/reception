const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Slack Webhook URL を環境変数から取得
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

app.use(bodyParser.json());

// トップページのルート
app.get('/', (req, res) => {
  res.send('Proxy server is running!');
});

// Slack 通知を送信するエンドポイント
app.post('/send-slack-notification', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).send({ success: false, error: 'Text is required in the request body' });
    }

    const response = await axios.post(SLACK_WEBHOOK_URL, { text });
    res.status(200).send({ success: true, data: response.data });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});

// サーバーを起動
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});

// CORS を許可する Middleware を追加
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // 必要なら特定のオリジンに限定
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
