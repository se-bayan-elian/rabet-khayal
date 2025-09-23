# Backend Response Mapping Fix

## Issue
The frontend cart store had incorrect property mappings that didn't match the actual backend API response structure.

## Actual Backend Response Analysis

Based on the provided cart API response, here are the correct mappings:

### Cart Item Structure
```json
{
  "id": "57def7f9-3cbe-4e23-ba15-0a04121b04dd",
  "cartId": "2e1c8144-6415-44fc-a277-5ac61a151f18",
  "productId": "2eecc098-31ef-4101-8c9f-23075f5473b7",
  "quantity": 1,
  "unitPrice": "15.00", // STRING, not number
  "product": {
    "originalPrice": "20.00", // NOT "price"
    "discountedPrice": "15.00", // NOT "salePrice"
    // ... other product fields
  },
  "customizations": [...]
}
```

### Product Structure  
```json
{
  "id": "2eecc098-31ef-4101-8c9f-23075f5473b7",
  "name": "طباعة مستند A4",
  "description": "<p>طباعة مستندات بأحجام <strong>A4</strong></p>",
  "originalPrice": "20.00", // NOT "price"
  "discountedPrice": "15.00", // NOT "salePrice"
  "weight": "0.500",
  "isFeatured": true,
  "imageUrl": "https://...",
  "imagePublicId": "...",
  "subcategoryId": "...",
  "averageRating": "4.00", // STRING
  "reviewCount": 1, // NUMBER
  "subcategory": { ... }
}
```

### Customization Structure
```json
{
  "id": "57b87ee4-bcf9-493b-bc5b-ecdaebe89c5a",
  "cartItemId": "57def7f9-3cbe-4e23-ba15-0a04121b04dd",
  "optionId": "b4717ca7-0ee2-4a63-8768-e41edf53fc8b",
  "questionText": "Question b4717ca7-0ee2-4a63-8768-e41edf53fc8b", // Generic fallback
  "selectedAnswer": "09735e26-32e0-4806-bfea-b6a10b704150", // Answer ID
  "selectedAnswerImageUrl": null,
  "selectedAnswerImagePublicId": "product-question-images/...", // For image uploads
  "customerInput": null,
  "additionalPrice": "0.00", // STRING
  "question": {
    "id": "b4717ca7-0ee2-4a63-8768-e41edf53fc8b",
    "questionText": "هل التصوير ملون أو أسود", // ACTUAL question text
    "type": "select",
    "required": true,
    "answers": [
      {
        "id": "ec96ab78-1512-45ac-8998-2f71c32ae942",
        "answerText": "ملون", // ACTUAL answer text
        "extraPrice": "2.00"
      },
      {
        "id": "09735e26-32e0-4806-bfea-b6a10b704150", 
        "answerText": "أسود وأبيض", // ACTUAL answer text
        "extraPrice": "0.00"
      }
    ]
  }
}
```

## Fixes Applied

### 1. ✅ Updated Backend Interfaces

**BackendCartItem**:
- Added `cartId` field
- Changed `unitPrice` from `number` to `string`
- Updated product structure:
  - `price` → `originalPrice` (string)
  - `salePrice` → `discountedPrice` (string)
  - Added missing fields: `weight`, `isFeatured`, `imagePublicId`, `subcategoryId`, etc.

**BackendCartCustomization**:
- Added `cartItemId` field
- Changed `additionalPrice` from `number` to `string`
- Added complete `question` object with `answers` array

### 2. ✅ Fixed Property Transformations

**Price Mapping**:
```typescript
// OLD (Incorrect)
price: backendItem.product.price,
salePrice: backendItem.product.salePrice,
unitPrice: backendItem.unitPrice,

// NEW (Correct)
price: parseFloat(backendItem.product.originalPrice),
salePrice: backendItem.product.discountedPrice ? parseFloat(backendItem.product.discountedPrice) : undefined,
unitPrice: parseFloat(backendItem.unitPrice),
```

**Customization Mapping**:
```typescript
// OLD (Incorrect)
questionText: cust.questionText, // Generic fallback text
answerText: cust.selectedAnswer, // Answer ID, not text

// NEW (Correct)  
questionText: cust.question.questionText, // Actual question text
answerText: selectedAnswerObj?.answerText || undefined, // Actual answer text from answers array
```

### 3. ✅ Enhanced Customization Display

**Question Text**: Now uses `cust.question.questionText` instead of generic fallback

**Answer Text**: Looks up actual answer text from the answers array:
```typescript
const selectedAnswerObj = cust.question.answers.find(answer => answer.id === cust.selectedAnswer);
const answerText = selectedAnswerObj?.answerText || null;
```

**Image URLs**: Constructs proper Cloudinary URLs from public IDs:
```typescript
const imageUrl = cust.selectedAnswerImagePublicId 
  ? `https://res.cloudinary.com/nextjs-bayan/image/upload/${cust.selectedAnswerImagePublicId}.jpg`
  : cust.selectedAnswerImageUrl;
```

### 4. ✅ Type Safety Improvements

All string-to-number conversions now use `parseFloat()`:
- `unitPrice`: `parseFloat(backendItem.unitPrice)`
- `originalPrice`: `parseFloat(backendItem.product.originalPrice)`
- `discountedPrice`: `parseFloat(backendItem.product.discountedPrice)`
- `additionalPrice`: `parseFloat(cust.additionalPrice)`

## Expected Results

### Cart Items Display
- ✅ Correct prices (original vs discounted)
- ✅ Proper HTML description rendering
- ✅ Accurate unit prices from backend

### Customization Display
- ✅ **Question Text**: "هل التصوير ملون أو أسود" (not "Question b4717ca7-...")
- ✅ **Answer Text**: "أسود وأبيض" or "ملون" (not IDs)
- ✅ **Image Links**: Clickable Cloudinary URLs for uploaded images

### Data Consistency  
- ✅ All numeric fields properly parsed from strings
- ✅ Proper fallbacks for optional fields
- ✅ Type-safe transformations

## Testing

Test with the provided cart response to verify:

1. **Question Display**: Should show "هل التصوير ملون أو أسود" 
2. **Answer Display**: Should show "أسود وأبيض" for first item, "ملون" for second item
3. **Image Display**: Should show clickable links for uploaded document images
4. **Price Display**: Should show ﷼15.00 (discounted) vs ﷼20.00 (original)
5. **HTML Description**: Should render bold **A4** and italic ***وأسود*** text

The cart now correctly maps all backend response properties and displays human-readable customization information! 🎉
