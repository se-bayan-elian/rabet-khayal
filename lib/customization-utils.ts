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
  fileUrl?: string | null;
  filePublicId?: string | null;
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
  fileUrl?: string | null | undefined;
  hasImage: boolean;
  hasFile: boolean;
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
  let fileUrl: string | null | undefined = null;
  let hasImage = false;
  let hasFile = false;

  // Check for image URLs in order customizations (selectedValueImageUrl) or cart customizations (selectedAnswerImageUrl)
  imageUrl = customization.selectedValueImageUrl || customization.selectedAnswerImageUrl;
  hasImage = !!imageUrl;

  // Check for file URLs
  fileUrl = customization.fileUrl;
  hasFile = !!fileUrl;

  // Determine if this is an image question based on question text
  const isImageQuestion = customization.questionText && (
    customization.questionText.includes('صورة') || 
    customization.questionText.includes('image') ||
    customization.questionText.includes('أرسل')
  );

  // Determine if this is a file question based on question text
  const isFileQuestion = customization.questionText && (
    customization.questionText.includes('ملف') || 
    customization.questionText.includes('file') ||
    customization.questionText.includes('document') ||
    customization.questionText.includes('PDF')
  );

  if (isImageQuestion) {
    // For image questions, show image URL or indicate image was uploaded
    answerText = imageUrl ? 'Image uploaded' : 'No image provided';
  } else if (isFileQuestion) {
    // For file questions, show file URL or indicate file was uploaded
    answerText = fileUrl ? 'File uploaded' : 'No file provided';
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
    fileUrl,
    hasImage,
    hasFile,
    additionalPrice
  };
}

/**
 * Get all customizations for an item with proper display data
 */
export function getItemCustomizations(customizations: CustomizationData[]): CustomizationDisplay[] {
  return customizations.map(getCustomizationDisplay);
}


