/**
 * 🧧 server.js - 新年彈幕後端伺服器
 * 功能：建立 WebSocket 連線，接收訊息並廣播給所有人
 */

const WebSocket = require('ws');

// 建立伺服器，監聽 8080 端口
const wss = new WebSocket.Server({ port: 8080 });

console.log("==========================================");
console.log(" 2026 馬年彈幕伺服器已啟動");
console.log("📡 服務位置：ws://localhost:8080");
console.log("==========================================");

wss.on('connection', (ws) => {
    // 1. 監聽連線
    console.log(`✅ 新親戚上線了！(目前線上人數: ${wss.clients.size})`);

    // 2. 監聽訊息
    ws.on('message', (message) => {
        // 收到訊息 (Buffer 轉字串)
        const msgString = message.toString();
        
        // 在終端機印出收到的內容 (方便除錯)
        console.log(`📩 收到留言: ${msgString}`);

        // 3. 廣播：把訊息傳送給「所有」連線中的人
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(msgString);
            }
        });
    });

    // 4. 監聽離線
    ws.on('close', () => {
        console.log(`👋 有人離線了。(剩餘線上人數: ${wss.clients.size})`);
    });
});