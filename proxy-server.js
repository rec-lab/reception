const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors'); // CORSを有効化

const app = express();
const PORT = 3000;
const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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'; // Slack Webhook URL を設定

app.use(cors()); // CORSを有効化
app.use(bodyParser.json());

// Slack 通知を送信するエンドポイント
app.post('/send-slack-notification', async (req, res) => {
  try {
    const { text } = req.body;

    // Slack Webhook にリクエストを送信
    const response = await axios.post(SLACK_WEBHOOK_URL, { text });
    res.status(200).send({ success: true, data: response.data });
  } catch (error) {
    console.error('Slack Webhook Error:', error.response?.data || error.message);
    res.status(500).send({ success: false, error: 'Failed to send Slack notification' });
  }
});

app.listen(PORT, () => {
    console.log('SLACK_WEBHOOK_URL:', process.env.SLACK_WEBHOOK_URL);
});
