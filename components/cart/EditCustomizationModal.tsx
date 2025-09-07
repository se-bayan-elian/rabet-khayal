"use client"

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
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
import {
  Save,
  X,
  AlertCircle,
  DollarSign
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { CartItem, CartItemCustomization } from "@/store/cart";

interface ProductQuestion {
  id: string;
  questionText: string;
  type: "select" | "text" | "note" | "checkbox" | "image";
  required: boolean;
  answers: ProductAnswer[];
}

interface ProductAnswer {
  id: string;
  answerText: string;
  extraPrice: number;
}

interface EditCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItem: CartItem;
  onSave: (customizations: CartItemCustomization[], totalCost: number) => void;
}

// Dynamic schema builder
const buildValidationSchema = (questions: ProductQuestion[]) => {
  const schemaObject: Record<string, z.ZodTypeAny> = {};

  questions.forEach((question) => {
    const fieldName = `question_${question.id}`;

    switch (question.type) {
      case 'select':
        if (question.required) {
          schemaObject[fieldName] = z.string().min(1, "Please select an option");
        } else {
          schemaObject[fieldName] = z.string().optional();
        }
        break;
      case 'text':
        if (question.required) {
          schemaObject[fieldName] = z.string().min(1, "Please enter text");
        } else {
          schemaObject[fieldName] = z.string().optional();
        }
        break;
      case 'note':
        if (question.required) {
          schemaObject[fieldName] = z.string().min(1, "Please add a note");
        } else {
          schemaObject[fieldName] = z.string().optional();
        }
        break;
      case 'checkbox':
        if (question.required) {
          schemaObject[fieldName] = z.array(z.string()).min(1, "Please select at least one option");
        } else {
          schemaObject[fieldName] = z.array(z.string()).optional();
        }
        break;
      case 'image':
        if (question.required) {
          schemaObject[fieldName] = z.union([
            z.string().min(1, "Please upload an image"),
            z.object({
              url: z.string(),
              publicId: z.string()
            })
          ]).refine((value) => {
            if (typeof value === 'string') {
              return value.length > 0;
            }
            return value && value.url && value.publicId;
          }, {
            message: "Please upload an image"
          });
        } else {
          schemaObject[fieldName] = z.union([
            z.string(),
            z.object({
              url: z.string(),
              publicId: z.string()
            }),
            z.undefined()
          ]).optional();
        }
        break;
    }
  });

  return z.object(schemaObject);
};

export function EditCustomizationModal({
  isOpen,
  onClose,
  cartItem,
  onSave
}: EditCustomizationModalProps) {
  const t = useTranslations("cart");
  const [isLoading, setIsLoading] = useState(false);
  const [customizationCost, setCustomizationCost] = useState(0);

  const questions = cartItem.questions || [];
  const validationSchema = questions.length > 0 ? buildValidationSchema(questions) : z.object({});

  // Build default values from existing customizations
  const getDefaultValues = () => {
    const defaults: any = {};

    if (cartItem.customizations) {
      cartItem.customizations.forEach((customization) => {
        const fieldName = `question_${customization.questionId}`;
        if (customization.answerId) {
          // Check if it's a checkbox question
          const question = questions.find(q => q.id === customization.questionId);
          if (question?.type === 'checkbox') {
            if (!defaults[fieldName]) defaults[fieldName] = [];
            defaults[fieldName].push(customization.answerId);
          } else {
            defaults[fieldName] = customization.answerId;
          }
        } else if (customization.textValue) {
          defaults[fieldName] = customization.textValue;
        } else if (customization.imagePublicId) {
          defaults[fieldName] = customization.imagePublicId;
        }
      });
    }

    return defaults;
  };

  const { control, handleSubmit, watch, formState: { errors }, reset } = useForm<any>({
    resolver: zodResolver(validationSchema),
    defaultValues: getDefaultValues()
  });

  const watchedValues = watch();

  // Calculate customization cost
  useEffect(() => {
    let totalCost = 0;

    questions.forEach((question) => {
      const fieldName = `question_${question.id}`;
      const selectedValue = watchedValues[fieldName];

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
  }, [watchedValues, questions]);

  // Reset form when modal opens with new data
  useEffect(() => {
    if (isOpen) {
      reset(getDefaultValues());
    }
  }, [isOpen, cartItem, reset]);

  const handleSave = async (formData: any) => {
    setIsLoading(true);

    try {
      const customizations: CartItemCustomization[] = [];

      questions.forEach((question) => {
        const fieldName = `question_${question.id}`;
        const selectedValue = formData[fieldName];

        if (selectedValue) {
          if (question.type === 'checkbox' && Array.isArray(selectedValue)) {
            selectedValue.forEach((answerId: string) => {
              customizations.push({
                questionId: question.id,
                answerId: answerId,
              });
            });
          } else if (question.type === 'select') {
            customizations.push({
              questionId: question.id,
              answerId: selectedValue,
            });
          } else if (question.type === 'text' || question.type === 'note') {
            customizations.push({
              questionId: question.id,
              textValue: selectedValue,
            });
          } else if (question.type === 'image') {
            let imageValue;
            if (typeof selectedValue === 'object' && selectedValue) {
              imageValue = selectedValue.publicId;
            } else if (typeof selectedValue === 'string' && selectedValue) {
              imageValue = selectedValue;
            }

            if (imageValue) {
              customizations.push({
                questionId: question.id,
                imagePublicId: imageValue,
              });
            }
          }
        }
      });

      onSave(customizations, customizationCost);
      onClose();
    } catch (error) {
      console.error('Failed to save customizations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            {t("editCustomizations")}
          </DialogTitle>
          <div className="flex items-center gap-3 pt-2">
            {cartItem.imageUrl && (
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                <Image
                  src={cartItem.imageUrl}
                  alt={cartItem.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <Badge variant="outline" className="text-sm font-medium">
                {cartItem.name}
              </Badge>
              {cartItem.description && (
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {cartItem.description}
                </p>
              )}
            </div>
          </div>
        </DialogHeader>

        {questions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">{t("noCustomizationsAvailable")}</p>
            <Button onClick={onClose} className="mt-4">
              {t("close")}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
            {/* Current customization cost */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">
                  {t("customizationCost")}:
                </span>
                <div className="flex items-center gap-1 text-lg font-bold text-blue-900">
                  <DollarSign className="w-4 h-4" />
                  {customizationCost.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                <h3 className="text-sm font-medium text-gray-900">{t("productQuestions")}</h3>
                <Badge variant="secondary" className="text-xs">
                  {questions.length} {questions.length === 1 ? t("question") : t("questions")}
                </Badge>
              </div>

              {questions.map((question, index) => {
                const fieldName = `question_${question.id}`;
                const error = errors[fieldName];

                return (
                  <div key={question.id} className="space-y-3 border border-gray-100 rounded-lg p-4 bg-gray-50/30">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      {question.questionText}
                      {question.required ? (
                        <Badge variant="destructive" className="text-xs">
                          {t("required")}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          {t("optional")}
                        </Badge>
                      )}
                    </Label>

                    {question.type === 'select' && (
                      <Controller
                        name={fieldName}
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className={`bg-white border-gray-200 text-start rtl:text-right ${error ? "border-red-500" : ""}`}>
                              <SelectValue placeholder={t("selectOption")} />
                            </SelectTrigger>
                            <SelectContent>
                              {question.answers.map((answer: ProductAnswer) => (
                                <SelectItem key={answer.id} value={answer.id}>
                                  <div className="flex items-center justify-between w-full">
                                    <span className="text-start rtl:text-right">{answer.answerText}</span>
                                    {parseFloat(answer.extraPrice.toString()) > 0 && (
                                      <span className="text-xs text-brand-gold ml-2 rtl:ml-0 rtl:mr-2 font-medium">
                                        +${parseFloat(answer.extraPrice.toString()).toFixed(2)}
                                      </span>
                                    )}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    )}

                    {question.type === 'text' && (
                      <Controller
                        name={fieldName}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder={t("enterText")}
                            className={`bg-white border-gray-200 text-start rtl:text-right ${error ? "border-red-500" : ""}`}
                            dir="auto"
                          />
                        )}
                      />
                    )}

                    {question.type === 'note' && (
                      <Controller
                        name={fieldName}
                        control={control}
                        render={({ field }) => (
                          <Textarea
                            {...field}
                            placeholder={t("addNote")}
                            className={`bg-white border-gray-200 resize-none text-start rtl:text-right ${error ? "border-red-500" : ""}`}
                            rows={3}
                            dir="auto"
                          />
                        )}
                      />
                    )}

                    {question.type === 'checkbox' && (
                      <Controller
                        name={fieldName}
                        control={control}
                        render={({ field }) => (
                          <div className="space-y-2">
                            {question.answers.map((answer: ProductAnswer) => (
                              <div key={answer.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`${fieldName}_${answer.id}`}
                                  checked={field.value?.includes(answer.id)}
                                  onCheckedChange={(checked) => {
                                    const current = field.value || [];
                                    if (checked) {
                                      field.onChange([...current, answer.id]);
                                    } else {
                                      field.onChange(current.filter((id: string) => id !== answer.id));
                                    }
                                  }}
                                />
                                <Label
                                  htmlFor={`${fieldName}_${answer.id}`}
                                  className="text-sm font-normal flex items-center gap-2 text-start rtl:text-right"
                                >
                                  {answer.answerText}
                                  {parseFloat(answer.extraPrice.toString()) > 0 && (
                                    <span className="text-xs text-brand-gold">
                                      +${parseFloat(answer.extraPrice.toString()).toFixed(2)}
                                    </span>
                                  )}
                                </Label>
                              </div>
                            ))}
                          </div>
                        )}
                      />
                    )}

                    {question.type === 'image' && (
                      <Controller
                        name={fieldName}
                        control={control}
                        render={({ field }) => {
                          const currentValue = field.value;
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
                                field.onChange({ url, publicId });
                              }}
                              placeholder={t("uploadImage")}
                              folder="product-question-images"
                              required={question.required}
                              error={error?.message as string}
                            />
                          );
                        }}
                      />
                    )}

                    {error && question.type !== 'image' && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {error?.message as string}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isLoading}
              >
                <X className="w-4 h-4 mr-2" />
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                className="flex-1 btn-primary"
                disabled={isLoading}
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? t("saving") : t("saveChanges")}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
