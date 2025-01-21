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
      console.error('Error: Text is required in the request body');
      return res.status(400).send({ success: false, error: 'Text is required in the request body' });
    }

    if (!SLACK_WEBHOOK_URL) {
      console.error('Error: Slack Webhook URL is not configured');
      return res.status(500).send({ success: false, error: 'Slack Webhook URL is not configured' });
    }

    // Slack Webhook にリクエストを送信
    const response = await axios.post(SLACK_WEBHOOK_URL, { text });
    console.log('Slack notification sent successfully:', response.data);
    res.status(200).send({ success: true, data: response.data });
  } catch (error) {
    console.error('Error sending Slack notification:', error.response?.data || error.message);
    res.status(500).send({
      success: false,
      error: error.response?.data || error.message || 'Unknown error',
    });
  }
});

// サーバーを起動
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
