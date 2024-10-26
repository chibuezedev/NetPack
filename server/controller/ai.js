const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const validator = require("validator");

dotenv.config();

const app = express();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(express.json());

const validateUrl = (url) => {
  if (!url || typeof url !== "string") {
    throw new Error("Invalid URL format");
  }
  if (!validator.isURL(url, { require_protocol: true })) {
    throw new Error(
      "Invalid URL format: must include protocol (http:// or https://)"
    );
  }
};

const formatAnalysisResult = (rawText) => {
  try {
    return JSON.parse(rawText);
  } catch (error) {
    const defaultResult = {
      trafficAnalysis: { normal: 0, malicious: 0 },
      protocolDistribution: { tcp: 0, udp: 0, icmp: 0 },
      threats: [],
    };

    try {
      // Extract numbers using regex
      const numbers = rawText.match(/\d+(\.\d+)?/g) || [];
      if (numbers.length >= 2) {
        defaultResult.trafficAnalysis.normal = parseFloat(numbers[0]);
        defaultResult.trafficAnalysis.malicious = parseFloat(numbers[1]);
      }

      // Extract protocol information
      if (rawText.toLowerCase().includes("tcp")) {
        defaultResult.protocolDistribution.tcp = parseFloat(
          rawText.match(/tcp[:\s]+(\d+)/i)?.[1] || 0
        );
      }
      if (rawText.toLowerCase().includes("udp")) {
        defaultResult.protocolDistribution.udp = parseFloat(
          rawText.match(/udp[:\s]+(\d+)/i)?.[1] || 0
        );
      }
      if (rawText.toLowerCase().includes("icmp")) {
        defaultResult.protocolDistribution.icmp = parseFloat(
          rawText.match(/icmp[:\s]+(\d+)/i)?.[1] || 0
        );
      }

      const threatMatches = rawText.match(/threat[^.]*\./gi) || [];
      defaultResult.threats = threatMatches.map((threat) => ({
        type: "Security Threat",
        description: threat.trim(),
        severity: threat.toLowerCase().includes("high")
          ? "High"
          : threat.toLowerCase().includes("medium")
          ? "Medium"
          : "Low",
      }));

      return defaultResult;
    } catch (formatError) {
      console.error("Error formatting analysis:", formatError);
      return defaultResult;
    }
  }
};

app.post("/analyze", async (req, res) => {
  try {
    const { url } = req.body;

    validateUrl(url);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Analyze the network security of this website: ${url}
      Provide a detailed analysis including:
      1. Traffic patterns (normal vs suspicious traffic percentage)
      2. Protocol analysis (TCP/UDP/ICMP distribution in percentage)
      3. Potential security threats or attacks
      4. DDoS indicators

      Important: Format your response EXACTLY as a JSON object with this structure:
      {
        "trafficAnalysis": {
          "normal": <number>,
          "malicious": <number>
        },
        "protocolDistribution": {
          "tcp": <number>,
          "udp": <number>,
          "icmp": <number>
        },
        "threats": [
          {
            "type": "<threat type>",
            "description": "<detailed description>",
            "severity": "<High|Medium|Low>"
          }
        ]
      }`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    const analysisResult = formatAnalysisResult(response);

    res.json(analysisResult);
  } catch (error) {
    console.error("Analysis failed:", error);
    res.status(500).json({
      error: "Analysis failed",
      details: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

module.exports = app;
