const express = require('express');
const { google } = require('googleapis');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// publicフォルダを静的ファイルとして提供
app.use(express.static(path.join(__dirname, 'public')));

// APIエンドポイント：Google Slides の内容を取得してJSONで返す
app.get('/api/slides', async (req, res) => {
  try {
    // Google認証設定（サービスアカウントを使用）
    const auth = new google.auth.GoogleAuth({
      keyFile: 'service-account-key.json', // サービスアカウントのキーファイルパス
      scopes: ['https://www.googleapis.com/auth/presentations.readonly']
    });
    const authClient = await auth.getClient();
    const slidesApi = google.slides({ version: 'v1', auth: authClient });

    // ここに対象のプレゼンテーションIDを設定してください
    const presentationId = '1u8QnjYinET5kNPWvFjJ5xhn2HNoDpUleTAsd2ivio6o'; // ※実際のIDに置き換える

    // プレゼンテーションデータを取得
    const presentation = await slidesApi.presentations.get({ presentationId });
    
    // 各スライドのテキストを抽出（各スライドの全テキストを結合）
    const slideData = presentation.data.slides.map((slide, index) => {
      let slideText = '';
      if (slide.pageElements) {
        slide.pageElements.forEach(element => {
          if (element.shape && element.shape.text && element.shape.text.textElements) {
            element.shape.text.textElements.forEach(textElem => {
              if (textElem.textRun && textElem.textRun.content) {
                slideText += textElem.textRun.content;
              }
            });
          }
        });
      }
      return {
        index: index,
        text: slideText.trim()
      };
    });

    res.json({ slides: slideData });
  } catch (err) {
    console.error('Error fetching slides:', err);
    res.status(500).json({ error: 'Failed to fetch slides data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
