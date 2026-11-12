import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { image, subject } = await request.json();

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a Sri Lankan ${subject} teacher. Analyze this textbook page image and create study notes in Sinhala.

Return JSON format:
{
  "summary": "2-3 sentence summary in Sinhala",
  "keyPoints": ["point1", "point2", "point3", "point4", "point5"],
  "flashcards": [
    {"question": "Q1", "answer": "A1"},
    {"question": "Q2", "answer": "A2"},
    {"question": "Q3", "answer": "A3"}
  ]
}

Requirements:
- Use simple Sinhala language
- Key points should be exam-focused
- Flashcards for active recall
- Maximum 5 key points, 3 flashcards
- If text is unclear, mark with [?]`;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: image.split(',')[1], mimeType: 'image/jpeg' } }
    ]);

    const response = await result.response;
    const text = response.text();
    
    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }
    
    const data = JSON.parse(jsonMatch[0]);

    return Response.json({
      success: true,
      summary: data.summary,
      keyPoints: data.keyPoints,
      flashcards: data.flashcards,
    });
  } catch (error) {
    console.error('API Error:', error);
    return Response.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}