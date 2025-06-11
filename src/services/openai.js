import OpenAI from 'openai';
import EncryptedStorage from 'react-native-encrypted-storage';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are an empathetic AI listener who helps people process their thoughts and feelings. 
Your primary role is to provide a safe, non-judgmental space for people to express themselves.
- Focus on understanding and validation first
- Only offer advice if explicitly requested
- Maintain a warm, supportive tone
- Ask thoughtful follow-up questions
- Respect privacy and confidentiality`;

export const getAIResponse = async (userMessage, includeAdvice = false) => {
  try {
    const conversationHistory = await loadConversationHistory();
    
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];

    if (!includeAdvice) {
      messages[0].content += '\nFocus only on listening and understanding. Do not provide advice.';
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages,
      temperature: 0.7,
      max_tokens: 150,
    });

    const aiResponse = response.choices[0].message.content;
    await saveToConversationHistory(userMessage, aiResponse);
    
    return aiResponse;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
};

const loadConversationHistory = async () => {
  try {
    const history = await EncryptedStorage.getItem('conversation_history');
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error loading conversation history:', error);
    return [];
  }
};

const saveToConversationHistory = async (userMessage, aiResponse) => {
  try {
    const history = await loadConversationHistory();
    const updatedHistory = [
      ...history,
      { role: 'user', content: userMessage },
      { role: 'assistant', content: aiResponse }
    ].slice(-10); // Keep last 5 exchanges
    
    await EncryptedStorage.setItem(
      'conversation_history',
      JSON.stringify(updatedHistory)
    );
  } catch (error) {
    console.error('Error saving conversation history:', error);
  }
};

export const clearConversationHistory = async () => {
  try {
    await EncryptedStorage.removeItem('conversation_history');
  } catch (error) {
    console.error('Error clearing conversation history:', error);
  }
}; 