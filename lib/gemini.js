import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

export async function generateResponse(prompt, chatHistory = []) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
    
    // Gemini API yêu cầu history bắt đầu bằng 'user' message
    // Chuyển đổi role 'assistant' thành 'model' và lọc bỏ message đầu tiên nếu là assistant
    let formattedHistory = chatHistory
      .filter((msg, index) => {
        // Bỏ qua message đầu tiên nếu là assistant (greeting message)
        if (index === 0 && msg.role === 'assistant') {
          return false;
        }
        return true;
      })
      .map(msg => ({
        role: msg.role === 'assistant' ? 'model' : msg.role,
        parts: [{ text: msg.content }],
      }));

    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}

export function createProductContext(products) {
  return products.map(p => `
- ${p.name} (${p.brand.name})
  + Giá: ${Number(p.price).toLocaleString('vi-VN')} VND
  + CPU: ${p.specs?.cpu || 'N/A'}
  + RAM: ${p.specs?.ram || 'N/A'}
  + Ổ cứng: ${p.specs?.storage || 'N/A'}
  + Màn hình: ${p.specs?.display || 'N/A'}
  + Đồ họa: ${p.specs?.graphics || 'N/A'}
  + Pin: ${p.specs?.battery || 'N/A'}
  + Phân loại: ${p.category.name}
  + Đánh giá: ${p.reviews?.length || 0} đánh giá
`).join('\n');
}