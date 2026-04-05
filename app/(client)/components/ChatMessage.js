import { User, Bot } from 'lucide-react';
import ProductSuggestion from './ProductSuggestion';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
        }`}
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      {/* Message Content */}
      <div className={`flex flex-col gap-2 max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-2 rounded-2xl ${
            isUser
              ? 'bg-blue-600 text-white rounded-br-md'
              : 'bg-gray-100 text-gray-800 rounded-bl-md'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* Product Suggestions */}
        {message.suggestedProducts?.length > 0 && (
          <div className="space-y-2 w-full">
            {message.suggestedProducts.map((product) => (
              <ProductSuggestion key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
