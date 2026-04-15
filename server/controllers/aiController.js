const OpenAI = require('openai');
const Milestone = require('../models/Milestone');
const AIResult = require('../models/AIResult');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const analyzeWork = async (req, res) => {
  try {
    const { milestoneId, content } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert work arbiter for the TrustChain platform. 
          Analyze the provided submission content against professional standards. 
          Return a JSON object with:
          - quality: Scored 0-100 (overall craftsmanship and utility)
          - completion: Scored 0-100 (percentage of requirements met)
          - plagiarism: Scored 0-100 (detected non-original or low-effort content)
          - feedback: A concise summary of your verdict (max 200 chars)`
        },
        {
          role: "user",
          content: `Evaluate this submission:\n\n${content}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    
    // Logic: If quality > 80 and plagiarism < 10: Recommended for Approval
    const status = (result.quality > 80 && result.plagiarism < 10) ? 'Recommended for Approval' : 'Needs Review';

    const aiResult = new AIResult({
      milestoneId,
      quality: result.quality,
      completion: result.completion,
      plagiarism: result.plagiarism,
      feedback: result.feedback,
      status
    });
    await aiResult.save();

    // Update milestone with AI result reference
    await Milestone.findByIdAndUpdate(milestoneId, { aiResult: aiResult._id });

    res.json(aiResult);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { analyzeWork };
