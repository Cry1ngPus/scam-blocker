// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 3000;

// 將你的 API 金鑰儲存在這裡，這是最安全的地方
const VIRUSTOTAL_API_KEY = 'UR-API-KEY';

// 使用 CORS 中介軟體，允許來自任何來源的請求
app.use(cors());

// 啟用 Express 內建的 JSON 請求主體解析器
app.use(express.json());

// 建立一個 API 端點，你的擴充功能將會呼叫這個網址
app.post('/check-url', async (req, res) => {
    const urlToCheck = req.body.url;

    if (!urlToCheck) {
        return res.status(400).json({ error: 'URL is required.' });
    }

    const apiUrl = `https://www.virustotal.com/api/v3/urls/${Buffer.from(urlToCheck).toString('base64').replace(/=/g, '')}`;

    try {
        const vtResponse = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'x-apikey': VIRUSTOTAL_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        const vtData = await vtResponse.json();
        res.json(vtData); // 將 VirusTotal 的回應回傳給擴充功能

    } catch (error) {
        console.error('Error proxying request to VirusTotal:', error);
        res.status(500).json({ error: 'Failed to check URL.' });
    }
});

// 新增一個 API 端點來接收使用者回報的網站，並將資料儲存到 JSON 檔案
app.post('/report-scam', (req, res) => {
    const { reportedUrl, timestamp, userAgent } = req.body;
    
    // 定義 JSON 檔案路徑
    const filePath = './reports.json';

    // 準備新的回報資料物件
    const newReport = { reportedUrl, timestamp, userAgent };

    // 讀取現有檔案，如果檔案不存在則建立一個空的陣列
    fs.readFile(filePath, (err, data) => {
        let reports = [];
        if (!err) {
            try {
                reports = JSON.parse(data);
            } catch (parseErr) {
                console.error('解析 JSON 檔案失敗:', parseErr);
            }
        }

        // 將新的回報資料加入到陣列中
        reports.push(newReport);

        // 將整個陣列寫入檔案
        fs.writeFile(filePath, JSON.stringify(reports, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('寫入檔案失敗:', writeErr);
                return res.status(500).json({ message: '寫入回報失敗' });
            }

            console.log('收到並儲存新的詐騙網站回報:', reportedUrl);
            res.json({ message: 'URL reported successfully.' });
        });
    });
});

app.listen(port, () => {
    console.log(`Proxy server is running on http://localhost:${port}`);

});
