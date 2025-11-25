import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// 健康檢查
app.get("/", (req, res) => {
    res.send("AI search backend is running");
});

// 核心 API：接收 query，轉給 OpenAI，回傳 answer
app.post("/ai_search", async (req, res) => {
    const userQuery = req.body.query;

    if (!userQuery) {
        return res.status(400).json({ error: "缺少 query 欄位" });
    }

    // --- 假資料模式 (Mock Mode) ---
    // 因為 OpenAI 額度不足，暫時回傳固定資料以測試前端串接
    const mockAnswer = `(測試模式) 針對您的問題：「${userQuery}」，建議您可以嘗試：
1. 健走：每天 30 分鐘，有助於心肺功能。
2. 游泳：減少關節負擔，適合膝蓋不好的長輩。
3. 太極拳：訓練平衡感，預防跌倒。

請注意：以上建議僅供參考，請諮詢專業醫師。`;

    return res.json({
        answer: mockAnswer,
        source: "測試資料 (Mock Data)"
    });

    /* 
    // --- 真實 OpenAI 呼叫 (暫時註解) ---
    try {
      const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content:
                "你是一位幫助中高齡者搜尋健康與生活資訊的助手，請用簡單、具體、非恐嚇的文字回答，並提醒使用者仍需以官方醫療資訊為準。"
            },
            {
              role: "user",
              content: userQuery
            }
          ]
        })
      });
  
      const data = await openaiRes.json();
  
      if (!openaiRes.ok || !data.choices || !data.choices[0]) {
        console.error("OpenAI API Error:", JSON.stringify(data, null, 2));
        return res.status(500).json({ error: "AI 回覆格式錯誤", details: data });
      }
  
      const answer = data.choices[0].message.content;
  
      return res.json({
        answer,
        source: "AI 生成結果，實際請以官方與醫療機構資訊為準"
      });
  
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "AI 搜尋失敗" });
    }
    */
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`AI search backend listening on port ${port}`);
});
