"use client"

import { useState, useEffect, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ImageUpload } from "@/components/ui/image-upload";
import { FileUpload } from "@/components/ui/file-upload";
import {
  ShoppingCart,
  X,
  AlertCircle,
  DollarSign
} from "lucide-react";
import Image from "next/image";

interface ProductQuestion {
  id: string;
  questionText: string;
  type: "select" | "text" | "note" | "checkbox" | "image" | "file";
  required: boolean;
  answers: ProductAnswer[];
}

interface ProductAnswer {
  id: string;
  answerText: string;
  extraPrice: number;
  imageUrl?: string;
  imagePublicId?: string;
  fileUrl?: string;
  filePublicId?: string;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  salePrice?: number;
  imageUrl?: string;
  questions?: ProductQuestion[];
}

interface AddToCartWithQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  quantity: number;
  onAddToCart: (product: Product, quantity: number, customizations: any[], totalCost: number) => void;
}

// Simple validation function
const validateForm = (formData: Record<string, any>, questions: ProductQuestion[], t: any): Record<string, string> => {
  const errors: Record<string, string> = {};

  questions.forEach((question) => {
    const fieldName = `question_${question.id}`;
    const value = formData[fieldName];

    if (question.required) {
      if (!value || (Array.isArray(value) && value.length === 0) || (typeof value === 'string' && value.trim() === '')) {
        switch (question.type) {
          case 'select':
            errors[fieldName] = t("validation.selectOption");
            break;
          case 'text':
            errors[fieldName] = t("validation.enterText");
            break;
          case 'note':
            errors[fieldName] = t("validation.addNote");
            break;
          case 'checkbox':
            errors[fieldName] = t("validation.selectAtLeastOne");
            break;
          case 'image':
            errors[fieldName] = t("validation.uploadImage");
            break;
          case 'file':
            errors[fieldName] = t("validation.uploadFile");
            break;
        }
      }
    }
  });

  return errors;
};

export function AddToCartWithQuestionsModal({
  isOpen,
  onClose,
  product,
  quantity,
  onAddToCart
}: AddToCartWithQuestionsModalProps) {
  const t = useTranslations("cart");
  const tProducts = useTranslations("products");
  const [isLoading, setIsLoading] = useState(false);
  const [customizationCost, setCustomizationCost] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";
  // Always call useMemo unconditionally - use empty array as fallback
  const questions = useMemo(() => {
    return product?.questions || [];
  }, [product?.questions]);

  // Calculate customization cost - always call useEffect
  useEffect(() => {
    if (!questions || questions.length === 0) {
      setCustomizationCost(0);
      return;
    }

    let totalCost = 0;

    questions.forEach((question) => {
      const fieldName = `question_${question.id}`;
      const selectedValue = formData[fieldName];

      if (selectedValue) {
        if (question.type === 'checkbox' && Array.isArray(selectedValue)) {
          selectedValue.forEach((answerId: string) => {
            const answer = question.answers.find((a: ProductAnswer) => a.id === answerId);
            if (answer) totalCost += parseFloat(answer.extraPrice.toString());
          });
        } else if (typeof selectedValue === 'string') {
          const answer = question.answers.find((a: ProductAnswer) => a.id === selectedValue);
          if (answer) totalCost += parseFloat(answer.extraPrice.toString());
        }
      }
    });

    setCustomizationCost(totalCost);
  }, [formData, questions]);

  // Reset form when modal opens - always call useEffect
  useEffect(() => {
    if (isOpen) {
      setFormData({});
      setErrors({});
      setCustomizationCost(0);
    }
  }, [isOpen]);

  // Early return after all hooks
  if (!product) return null;

  const handleAddToCart = async () => {
    // Validate form
    const validationErrors = validateForm(formData, questions, t);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      const customizations: any[] = [];

      questions.forEach((question) => {
        const fieldName = `question_${question.id}`;
        const selectedValue = formData[fieldName];

        if (selectedValue) {
          if (question.type === 'checkbox' && Array.isArray(selectedValue)) {
            selectedValue.forEach((answerId: string) => {
              const answer = question.answers.find((a: ProductAnswer) => a.id === answerId);
              customizations.push({
                questionId: question.id,
                answerId: answerId,
                additionalPrice: answer?.extraPrice ? parseFloat(answer.extraPrice.toString()) : 0, // ✅ FIX: Parse string to number
              });
            });
          } else if (question.type === 'select') {
            const answer = question.answers.find((a: ProductAnswer) => a.id === selectedValue);
            customizations.push({
              questionId: question.id,
              answerId: selectedValue,
              additionalPrice: answer?.extraPrice ? parseFloat(answer.extraPrice.toString()) : 0, // ✅ FIX: Parse string to number
            });
          } else if (question.type === 'text' || question.type === 'note') {
            customizations.push({
              questionId: question.id,
              textValue: selectedValue,
              additionalPrice: 0, // ✅ FIX: Text/note customizations have no additional price
            });
          } else if (question.type === 'image') {
            let imageUrl, imagePublicId;
            if (typeof selectedValue === 'object' && selectedValue) {
              imageUrl = selectedValue.url;
              imagePublicId = selectedValue.publicId;
            } else if (typeof selectedValue === 'string' && selectedValue.startsWith('http')) {
              imageUrl = selectedValue;
            } else if (typeof selectedValue === 'string' && selectedValue) {
              imagePublicId = selectedValue;
            }

            if (imageUrl || imagePublicId) {
              customizations.push({
                questionId: question.id,
                imageUrl: imageUrl, // ✅ FIX: Include image URL
                imagePublicId: imagePublicId, // ✅ FIX: Include image public ID
                additionalPrice: 0, // ✅ FIX: Image customizations have no additional price
              });
            }
          } else if (question.type === 'file') {
            let fileUrl, filePublicId;
            if (typeof selectedValue === 'object' && selectedValue) {
              fileUrl = selectedValue.url;
              filePublicId = selectedValue.publicId;
            } else if (typeof selectedValue === 'string' && selectedValue.startsWith('http')) {
              fileUrl = selectedValue;
            } else if (typeof selectedValue === 'string' && selectedValue) {
              filePublicId = selectedValue;
            }

            if (fileUrl || filePublicId) {
              customizations.push({
                questionId: question.id,
                fileUrl: fileUrl,
                filePublicId: filePublicId,
                additionalPrice: 0, // File customizations have no additional price
              });
            }
          }
        }
      });

     
      
      

      await onAddToCart(product, quantity, customizations, customizationCost);
      // Don't close the modal here - let the parent handle it after showing success modal
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions for form field updates
  const updateFormField = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  const finalPrice = product.salePrice || product.price;
  const totalPrice = (finalPrice * quantity) + customizationCost;
  const isOnSale = product.salePrice && product.salePrice < product.price;


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-0 p-0 backdrop-blur-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-700 shadow-lg flex items-center justify-center transition-all duration-200"
        >
          <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>

        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <ShoppingCart className="w-5 h-5 text-brand-gold" />
            {tProducts("addToCart")}
          </DialogTitle>
          <div className="flex items-center gap-3 pt-2">
            {product.imageUrl && (
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1 text-right rtl:text-right">
              <Badge variant="outline" className="text-sm font-medium">
                {product.name}
              </Badge>
              {product.description && (
                <div className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2 text-right rtl:text-right html-content"
                dangerouslySetInnerHTML={{ __html: product.description || "" }}
                >
                </div>
                
                  
              )}
            </div>
          </div>
        </DialogHeader>

        {questions.length === 0 ? (
          <div className="text-center py-8 px-6">
            <p className="text-gray-500 dark:text-gray-400 mb-4">{t("noCustomizationsAvailable")}</p>
            <Button onClick={onClose} className="mt-4">
              {t("close")}
            </Button>
          </div>
        ) : (
          <div className="px-6 pb-6 space-y-6">
            {/* Current customization cost */}
            {customizationCost > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {t("customizationCost")}:
                  </span>
                  <div className="flex items-center gap-1 text-lg font-bold text-blue-900 dark:text-blue-100">
                    {customizationCost.toFixed(2)} ﷼
                  </div>
                </div>
              </div>
            )}

            {/* Questions */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white text-right rtl:text-right">{t("productQuestions")}</h3>
                <Badge variant="secondary" className="text-xs">
                  {questions.length} {questions.length === 1 ? t("question") : t("questions")}
                </Badge>
              </div>

              {questions.map((question, index) => {
                const fieldName = `question_${question.id}`;
                const error = errors[fieldName];

                return (
                  <div key={question.id} className="space-y-3 border border-gray-100 dark:border-gray-700 rounded-lg p-4 bg-gray-50/30 dark:bg-gray-800/30">
                    <Label className="text-sm font-medium flex items-center gap-2 text-gray-900 dark:text-white text-right rtl:text-right">
                      {question.questionText}
                      {question.required ? (
                        <Badge variant="destructive" className="text-xs bg-red-500 text-white hover:bg-red-600 border-red-500">
                          {t("required")}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          {t("optional")}
                        </Badge>
                      )}
                    </Label>

                    {question.type === 'select' && (
                      <Select onValueChange={(value) => updateFormField(fieldName, value)} value={formData[fieldName] || ""} dir={dir}>
                        <SelectTrigger className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-start rtl:text-right ${error ? "border-red-500" : ""}`}>
                          <SelectValue placeholder={t("selectOption")} />
                        </SelectTrigger>
                        <SelectContent>
                          {question.answers.map((answer: ProductAnswer) => (
                            <SelectItem key={answer.id} value={answer.id}>
                              <div className="flex items-center justify-between w-full">
                                <span className="text-start rtl:text-right">{answer.answerText}</span>
                                {parseFloat(answer.extraPrice.toString()) > 0 && (
                                  <span className="text-xs text-brand-gold ml-2 rtl:ml-0 rtl:mr-2 font-medium">
                                    +﷼{parseFloat(answer.extraPrice.toString()).toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {question.type === 'text' && (
                      <Input
                        value={formData[fieldName] || ""}
                        onChange={(e) => updateFormField(fieldName, e.target.value)}
                        placeholder={t("enterText")}
                        className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-start rtl:text-right ${error ? "border-red-500" : ""}`}
                        dir="auto"
                      />
                    )}

                    {question.type === 'note' && (
                      <Textarea
                        value={formData[fieldName] || ""}
                        onChange={(e) => updateFormField(fieldName, e.target.value)}
                        placeholder={t("addNote")}
                        className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 resize-none text-start rtl:text-right ${error ? "border-red-500" : ""}`}
                        rows={3}
                        dir="auto"
                      />
                    )}

                    {question.type === 'checkbox' && (
                      <div className="space-y-2">
                        {question.answers.map((answer: ProductAnswer) => (
                          <div key={answer.id} className="flex items-center space-x-2 rtl:space-x-reverse">
                            <Checkbox
                              id={`${fieldName}_${answer.id}`}
                              checked={formData[fieldName]?.includes(answer.id) || false}
                              onCheckedChange={(checked) => {
                                const current = formData[fieldName] || [];
                                if (checked) {
                                  updateFormField(fieldName, [...current, answer.id]);
                                } else {
                                  updateFormField(fieldName, current.filter((id: string) => id !== answer.id));
                                }
                              }}
                            />
                            <Label
                              htmlFor={`${fieldName}_${answer.id}`}
                              className="text-sm font-normal flex items-center gap-2 text-start rtl:text-right text-gray-900 dark:text-white"
                            >
                              {answer.answerText}
                              {parseFloat(answer.extraPrice.toString()) > 0 && (
                                <span className="text-xs text-brand-gold">
                                  +﷼{parseFloat(answer.extraPrice.toString()).toFixed(2)}
                                </span>
                              )}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}

                    {question.type === 'image' && (() => {
                      const currentValue = formData[fieldName];
                      let imageUrl, imagePublicId;

                      if (typeof currentValue === 'object' && currentValue) {
                        imageUrl = currentValue.url;
                        imagePublicId = currentValue.publicId;
                      } else if (typeof currentValue === 'string' && currentValue.startsWith('http')) {
                        imageUrl = currentValue;
                      } else if (typeof currentValue === 'string' && currentValue) {
                        imagePublicId = currentValue;
                      }

                      return (
                        <ImageUpload
                          imageUrl={imageUrl}
                          imagePublicId={imagePublicId}
                          onImageChange={(url, publicId) => {
                            updateFormField(fieldName, { url, publicId });
                          }}
                          placeholder={t("uploadImage")}
                          folder="product-question-images"
                          required={question.required}
                          error={error}
                        />
                      );
                    })()}

                    {question.type === 'file' && (() => {
                      const currentValue = formData[fieldName];
                      let fileUrl, filePublicId;

                      if (typeof currentValue === 'object' && currentValue) {
                        fileUrl = currentValue.url;
                        filePublicId = currentValue.publicId;
                      } else if (typeof currentValue === 'string' && currentValue.startsWith('http')) {
                        fileUrl = currentValue;
                      } else if (typeof currentValue === 'string' && currentValue) {
                        filePublicId = currentValue;
                      }

                      return (
                        <FileUpload
                          fileUrl={fileUrl}
                          filePublicId={filePublicId}
                          onFileChange={(url, publicId) => {
                            updateFormField(fieldName, { url, publicId });
                          }}
                          placeholder={t("uploadFile")}
                          folder="product-question-files"
                          required={question.required}
                          error={error}
                        />
                      );
                    })()}

                    {error && question.type !== 'image' && question.type !== 'file' && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {error}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Total Price */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300 font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {t("total")}:
                </span>
                <span className="text-xl font-bold text-brand-navy dark:!text-brand-gold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {totalPrice.toFixed(2)} ﷼
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                disabled={isLoading}
              >
                <X className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                {t("cancel")}
              </Button>
              <Button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 btn-primary"
                disabled={isLoading}
              >
                <ShoppingCart className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                {isLoading ? t("saving") : t("addToCart")}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
