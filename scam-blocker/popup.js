// popup.js

// 取得介面上的元素
const loadingBox = document.getElementById('loading');
const safeBox = document.getElementById('safe');
const dangerBox = document.getElementById('danger');
const infoBox = document.getElementById('info');
const resultDetails = document.getElementById('result-details');
const reportButton = document.getElementById('report-button');

// 顯示特定狀態的函數
function showStatus(status, message = '') {
  loadingBox.classList.add('hidden');
  safeBox.classList.add('hidden');
  dangerBox.classList.add('hidden');
  infoBox.classList.add('hidden');
  
  if (status === 'safe') {
    safeBox.classList.remove('hidden');
  } else if (status === 'danger') {
    dangerBox.classList.remove('hidden');
    infoBox.classList.remove('hidden');
    resultDetails.textContent = message;
  } else {
    loadingBox.classList.remove('hidden');
  }
}

// 檢查 URL 的核心函數，現在改為呼叫你的後端伺服器
async function checkUrlWithVirusTotal(url) {
  // 你的後端代理伺服器網址
  const proxyUrl = 'http://localhost:3000/check-url';

  try {
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // 將要檢查的 URL 以 JSON 格式發送給你的伺服器
      body: JSON.stringify({ url: url })
    });

    const data = await response.json();
    
    // 處理伺服器回傳的錯誤
    if (data.error) {
        console.error('後端伺服器回傳錯誤:', data.error.message);
        return { isSafe: true, reason: `偵測失敗：${data.error.message}。` };
    }

    // 檢查從伺服器回傳的 VirusTotal 資料
    const stats = data.data.attributes.last_analysis_stats;
    
    if (stats.malicious > 0 || stats.suspicious > 0) {
      return { isSafe: false, reason: `被 ${stats.malicious} 個資安引擎標記為惡意或可疑。` };
    } else {
      return { isSafe: true, reason: '' };
    }
    
  } catch (error) {
    console.error('呼叫後端伺服器失敗:', error);
    return { isSafe: true, reason: '偵測失敗，請確認伺服器是否運行。' };
  }
}

// 在你的 detectWebsite() 函數中使用
async function detectWebsite() {
  showStatus('loading');
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let url = tab.url;
  
  if (url.startsWith('chrome://')) {
    showStatus('safe');
    return;
  }
  
  const result = await checkUrlWithVirusTotal(url);

  if (result.isSafe) {
    showStatus('safe');
  } else {
    showStatus('danger', result.reason);
  }
}

// 執行偵測
document.addEventListener('DOMContentLoaded', detectWebsite);

// 修改回報按鈕的邏輯
reportButton.addEventListener('click', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let url = tab.url;

  // 蒐集額外資訊
  const reportedData = {
    reportedUrl: url,
    timestamp: new Date().toISOString(), // 取得當前時間戳記
    // 取得使用者瀏覽器資訊，從使用者代理字串中解析
    userAgent: navigator.userAgent,
    // 這裡可以加入更多你想蒐集的資訊，例如偵測結果
    detectionStatus: '未知'
  };

  try {
    const response = await fetch('http://localhost:3000/report-scam', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportedData) // 將所有資料一起發送
    });

    const result = await response.json();
    alert('回報已送出，感謝您的貢獻！');
  } catch (error) {
    console.error('回報網站失敗:', error);
    alert('回報失敗，請確認伺服器是否運行。');
  }
});