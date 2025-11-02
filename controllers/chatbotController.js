const axios = require("axios");
require("dotenv").config();

exports.chat = async (req, res) => {
  const { message, history } = req.body;
  const models = process.env.GROQ_MODEL.split(","); // fallback list
  const messages = [
    ...(history || []).map(msg => ({
      role: msg.role || "user",
      content: msg.content || "",
    })),
    { role: "user", content: message },
  ];

  for (let i = 0; i < models.length; i++) {
    const model = models[i].trim();
    try {
      const response = await axios.post(
        process.env.GROQ_API_URL,
        {
          model,
          messages,
        },
        {
          headers: {
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Success: return response
      return res.json({
        usedModel: model,
        reply: response.data.choices[0].message.content,
      });
    } catch (err) {
      console.warn(`⚠️ Model ${model} failed:`, err.response?.data?.error?.message || err.message);

      // Try next model if current one failed
      if (i === models.length - 1) {
        return res.status(500).json({
          error: "All models failed",
          details: err.response?.data || err.message,
        });
      }
    }
  }
};
