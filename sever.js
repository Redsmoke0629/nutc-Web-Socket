// server.js
const WebSocket = require('ws');

// 1. 建立 Server 並監聽 8080 Port
const wss = new WebSocket.Server({ port: 8080 });

console.log('Echo 機器人伺服器啟動中 (Port: 8080)...');

// 2. 當有「任何」使用者連線成功時，觸發此事件
wss.on('connection', function connection(ws) {
  console.log('有一位使用者連線了！');

  // 3. 綁定訊息監聽器：只針對「這一位」使用者
  ws.on('message', function incoming(message) {
    // 收到的是字串，先用 JSON.parse 轉成物件
    // 假設前端傳來的是：{ "name": "小明", "text": "你好" }
    let data = {};
    try {
        data = JSON.parse(message.toString());
    } catch (e) {
        data = { name: "未知", text: message.toString() }; // 防呆機制
    }

    const userName = data.name || "訪客";
    const userText = data.text;

    console.log(`收到來自 ${userName} 的訊息：${userText}`);

    // 4. 回傳訊息 (1對1)：只傳給「這一位」使用者
    // 我們讓機器人更有禮貌一點，加上名字回應
    ws.send(`Echo 機器人：嗨 ${userName}，我聽到你說「${userText}」`);
  });

  // 5. 監聽連線斷開
  ws.on('close', function() {
    console.log('這位使用者離開了');
  });

  // 連線建立後的歡迎語
  ws.send('歡迎來到 Echo 測試區，請輸入名字與訊息！');
});
