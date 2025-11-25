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
    res.send("USR AI_Search_demo backend (GPT-5.1) is running");
});

app.post("/ai_search", async (req, res) => {
    const userQuery = req.body.query;

    if (!userQuery) {
        return res.status(400).json({ error: "缺少 query 欄位" });
    }

    try {
        const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content:
                            "你是一位協助台灣中高齡者搜尋資訊的 AI 助手。你的回答需簡潔、具體、容易懂，並提醒使用者請以官方資訊為準。並且，此為搭配 Playreal AI 搜尋功能設計的 AI 助手，回覆長度請控制在 100 字以內並條列式整理重點。"
                    },
                    {
                        role: "user",
                        content: userQuery
                    }
                ]
            })
        });

        const data = await openaiRes.json();

        if (!data.choices || !data.choices[0]) {
            return res.status(500).json({ error: "AI 回覆格式錯誤" });
        }

        const answer = data.choices[0].message.content;

        return res.json({
            answer,
            source: "AI 生成結果，請查閱相關官方資訊"
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "AI 搜尋失敗，請稍後再試" });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`USR AI_Search_demo backend (GPT-5.1) listening on port ${port}`);
});
