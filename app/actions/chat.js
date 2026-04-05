'use server';

import {prisma} from '@/lib/prisma';
import { generateResponse, createProductContext } from '@/lib/gemini';

const SYSTEM_PROMPT = `Bạn là trợ lý tư vấn mua laptop của cửa hàng Laptop Shop.

NHIỆM VỤ:
- Tư vấn khách hàng chọn laptop phù hợp
- Trả lời câu hỏi về thông số kỹ thuật
- So sánh các sản phẩm
- Giải thích thuật ngữ kỹ thuật một cách dễ hiểu

QUY TẮC:
- Luôn trả lời bằng tiếng Việt
- Thân thiện, nhiệt tình
- Chỉ tư vấn sản phẩm có trong cửa hàng
- Nếu không biết, hãy nói "Tôi không có thông tin về vấn đề này"
- KHÔNG bịa đặt thông tin không có trong dữ liệu

DỮ LIỆU SẢN PHẨM:
{product_context}

LỊCH SỬ CUỘC TRÒN CHUYỆN:
{chat_history}

Hãy trả lời câu hỏi của khách hàng dựa trên dữ liệu sản phẩm ở trên.`;

export async function sendMessage(message, chatHistory = []) {
  try {
    // Validate input
    if (!message || typeof message !== 'string') {
      return { error: 'Message is required' };
    }

    // Lấy sản phẩm từ database
    const products = await prisma.product.findMany({
      where: { isVisible: true },
      include: {
        brand: true,
        category: true,
        reviews: true,
      },
    });

    // Tạo product context
    const productContext = createProductContext(products);

    // Tạo prompt với context
    const historyText = chatHistory
      .map(msg => `${msg.role === 'user' ? 'Khách' : 'Tư vấn viên'}: ${msg.parts?.[0]?.text ?? ''}`)
      .join('\n');

    const fullPrompt = SYSTEM_PROMPT
      .replace('{product_context}', productContext)
      .replace('{chat_history}', historyText || 'Chưa có lịch sử')
      + `\n\nCâu hỏi của khách hàng: ${message}`;

    // Gọi Gemini API
    const response = await generateResponse(fullPrompt, []);

    // Tìm sản phẩm được gợi ý (nếu có)
    const suggestedProducts = findSuggestedProducts(response, products);

    return {
      success: true,
      response,
      suggestedProducts,
    };
  } catch (error) {
    console.error('Chat error:', error);
    return { error: 'Internal server error' };
  }
}

function findSuggestedProducts(response, products) {
  // Logic tìm sản phẩm được nhắc đến trong response
  const suggested = [];
  const responseLower = response.toLowerCase();

  for (const product of products) {
    if (responseLower.includes(product.name.toLowerCase())) {
      suggested.push({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.image,
        reason: 'Được gợi ý bởi AI',
      });
    }
  }

  return suggested.slice(0, 3); // Giới hạn 3 sản phẩm
}