/**
 * Utility functions for handling customization display
 */

export interface CustomizationData {
  id: string;
  optionId?: string;
  questionId?: string;
  questionText?: string;
  selectedAnswer?: string | null;
  selectedAnswerImageUrl?: string | null;
  selectedValueImageUrl?: string | null;
  customerInput?: string | null;
  additionalPrice?: string | number;
  answerId?: string;
  textValue?: string;
  imagePublicId?: string;
  selectedValueImagePublicId?: string;
  question?: {
    id: string;
    type: string;
    answers?: Array<{
      id: string;
      answerText: string;
      imageUrl?: string | null;
    }>;
  };
  // Product context for order items
  product?: {
    questions?: Array<{
      id: string;
      questionText: string;
      type: string;
      answers?: Array<{
        id: string;
        answerText: string;
        imageUrl?: string | null;
      }>;
    }>;
  };
}

// The backend now provides the actual answer text instead of IDs
// No more hardcoded mappings needed!

export interface CustomizationDisplay {
  questionText: string;
  answerText: string;
  imageUrl?: string | null | undefined;
  hasImage: boolean;
  additionalPrice: number;
}

/**
 * Extract proper display information from customization data
 */
export function getCustomizationDisplay(customization: CustomizationData): CustomizationDisplay {
  // Get question text - use fallback if empty
  const questionText = customization.questionText || 
                      (customization.questionId ? `Question ${customization.questionId}` : 
                       customization.question?.id ? `Question ${customization.question.id}` : 'Customization');

  // Get answer text based on question type
  let answerText = '';
  let imageUrl: string | null | undefined = null;
  let hasImage = false;

  // Check for image URLs in order customizations (selectedValueImageUrl) or cart customizations (selectedAnswerImageUrl)
  imageUrl = customization.selectedValueImageUrl || customization.selectedAnswerImageUrl;
  hasImage = !!imageUrl;

  // Determine if this is an image question based on question text
  const isImageQuestion = customization.questionText && (
    customization.questionText.includes('صورة') || 
    customization.questionText.includes('image') ||
    customization.questionText.includes('أرسل')
  );

  if (isImageQuestion) {
    // For image questions, show image URL or indicate image was uploaded
    answerText = imageUrl ? 'Image uploaded' : 'No image provided';
  } else if (customization.customerInput) {
    // For text input questions
    answerText = customization.customerInput;
  } else if (customization.textValue) {
    // For text value (cart customizations)
    answerText = customization.textValue;
  } else if (customization.selectedAnswer) {
    // For order customizations - the backend now provides the actual answer text
    answerText = customization.selectedAnswer;
  } else if (customization.answerId) {
    // For answer ID (cart customizations)
    answerText = customization.answerId;
  } else {
    answerText = 'No answer provided';
  }

  // Parse additional price
  const additionalPrice = typeof customization.additionalPrice === 'string' 
    ? parseFloat(customization.additionalPrice) 
    : customization.additionalPrice || 0;

  return {
    questionText,
    answerText,
    imageUrl,
    hasImage,
    additionalPrice
  };
}

/**
 * Get all customizations for an item with proper display data
 */
export function getItemCustomizations(customizations: CustomizationData[]): CustomizationDisplay[] {
  return customizations.map(getCustomizationDisplay);
}


