"use client"

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ShoppingCart, Upload, AlertTriangle, CheckCircle, X } from 'lucide-react'
import { ProductItem, ProductQuestion } from '@/services'
import { useCartStore } from '@/store/cart-api'
import Image from 'next/image'

// Dynamic schema builder based on product questions
const buildValidationSchema = (questions: ProductQuestion[]) => {
  const schemaObject: Record<string, z.ZodTypeAny> = {}

  questions.forEach((question) => {
    const fieldName = `question_${question.id}`

    switch (question.type) {
      case 'select':
        if (question.required) {
          schemaObject[fieldName] = z.string().min(1, "Please select an option")
        } else {
          schemaObject[fieldName] = z.string().optional()
        }
        break
      case 'text':
        if (question.required) {
          schemaObject[fieldName] = z.string().min(1, "This field is required")
        } else {
          schemaObject[fieldName] = z.string().optional()
        }
        break
      case 'note':
        if (question.required) {
          schemaObject[fieldName] = z.string().min(1, "Please add a note")
        } else {
          schemaObject[fieldName] = z.string().optional()
        }
        break
      case 'checkbox':
        schemaObject[fieldName] = z.boolean().optional()
        break
      case 'image':
        if (question.required) {
          schemaObject[fieldName] = z.any().refine(
            (files) => files && files.length > 0,
            "Please upload an image"
          )
        } else {
          schemaObject[fieldName] = z.any().optional()
        }
        break
    }
  })

  return z.object(schemaObject)
}

interface ProductCustomizationModalProps {
  isOpen: boolean
  onClose: () => void
  product: ProductItem
  quantity: number
  onSuccess: () => void
}

const ProductCustomizationModal = ({ 
  isOpen, 
  onClose, 
  product, 
  quantity,
  onSuccess 
}: ProductCustomizationModalProps) => {
  const t = useTranslations('productDetails.questions')
  const tCart = useTranslations('cart')
  const [totalPrice, setTotalPrice] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const addToCart = useCartStore((state) => state.addItem)

  const requiredQuestions = product.questions?.filter(q => q.required) || []
  const hasRequiredQuestions = requiredQuestions.length > 0

  const validationSchema = hasRequiredQuestions 
    ? buildValidationSchema(product.questions || [])
    : z.object({})

  const { control, handleSubmit, watch, formState: { errors }, reset } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {}
  })

  const watchedValues = watch()

  // Calculate total price including customizations
  useEffect(() => {
    let basePrice = Number(product.discountedPrice || product.originalPrice)
    let extraCost = 0

    // Calculate extra costs from selected options
    Object.entries(watchedValues).forEach(([fieldName, value]) => {
      if (value && fieldName.startsWith('question_')) {
        const questionId = fieldName.replace('question_', '')
        const question = product.questions?.find(q => q.id === questionId)
        
        if (question?.type === 'select' && value) {
          const selectedAnswer = question.answers?.find(a => a.id === value)
          if (selectedAnswer?.extraPrice) {
            extraCost += Number(selectedAnswer.extraPrice)
          }
        }
      }
    })

    setTotalPrice((basePrice + extraCost) * quantity)
  }, [watchedValues, product, quantity])

  const onSubmit = (data: any) => {
    // Process customization data
    const options: Record<string, any> = {}
    
    Object.entries(data).forEach(([fieldName, value]) => {
      if (fieldName.startsWith('question_') && value) {
        const questionId = fieldName.replace('question_', '')
        const question = product.questions?.find(q => q.id === questionId)
        
        if (question) {
          options[question.questionText] = value
        }
      }
    })

    // Add to cart with customizations
    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.discountedPrice || product.originalPrice),
      image: product.imageUrl || '',
      quantity: quantity,
      options: Object.keys(options).length > 0 ? options : undefined,
    })

    setShowSuccess(true)
    
    // Close modal and show success after 2 seconds
    setTimeout(() => {
      setShowSuccess(false)
      reset()
      onClose()
      onSuccess()
    }, 2000)
  }

  const handleClose = () => {
    if (!showSuccess) {
      reset()
      onClose()
    }
  }

  const renderQuestionField = (question: ProductQuestion) => {
    const fieldName = `question_${question.id}`
    
    switch (question.type) {
      case 'select':
        return (
          <Controller
            name={fieldName}
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder={t('selectOption')} />
                </SelectTrigger>
                <SelectContent>
                  {question.answers?.map((answer) => (
                    <SelectItem key={answer.id} value={answer.id}>
                      {answer.answerText}
                      {answer.extraPrice > 0 && (
                        <span className="text-green-600 ml-2">
                          +${answer.extraPrice}
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )

      case 'text':
        return (
          <Controller
            name={fieldName}
            control={control}
            render={({ field }) => (
              <Input 
                {...field} 
                placeholder={t('enterText')}
              />
            )}
          />
        )

      case 'note':
        return (
          <Controller
            name={fieldName}
            control={control}
            render={({ field }) => (
              <Textarea 
                {...field} 
                placeholder={t('addNote')}
                rows={3}
              />
            )}
          />
        )

      case 'checkbox':
        return (
          <Controller
            name={fieldName}
            control={control}
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id={fieldName}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor={fieldName} className="text-sm">
                  {question.questionText}
                </Label>
              </div>
            )}
          />
        )

      case 'image':
        return (
          <Controller
            name={fieldName}
            control={control}
            render={({ field }) => (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <Input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => field.onChange(e.target.files)}
                  className="hidden"
                  id={fieldName}
                />
                <Label htmlFor={fieldName} className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-500">
                    {t('uploadImage')}
                  </span>
                </Label>
              </div>
            )}
          />
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="brand-heading flex items-center gap-2">
            {showSuccess ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-500" />
                {tCart('addToCart.success')}
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                {t('title')}
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        {showSuccess ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h3 className="text-lg font-semibold mb-2">{tCart('addToCart.successTitle')}</h3>
            <p className="text-gray-600">{tCart('addToCart.successMessage')}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Product Summary */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              {product.imageUrl && (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={60}
                  height={60}
                  className="rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-600">
                  {t('quantity')}: {quantity}
                </p>
                <p className="text-lg font-bold" style={{ color: 'var(--brand-navy)' }}>
                  ﷼{totalPrice.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Customization Form */}
            {hasRequiredQuestions ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  {product.questions?.map((question) => (
                    <div key={question.id}>
                      <Label className="text-base font-medium">
                        {question.questionText}
                        {question.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      <div className="mt-2">
                        {renderQuestionField(question)}
                      </div>
                      {errors[`question_${question.id}`] && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors[`question_${question.id}`]?.message as string}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">{t('totalPrice')}</span>
                    <span className="text-2xl font-bold" style={{ color: 'var(--brand-navy)' }}>
                      ﷼{totalPrice.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleClose}
                      className="flex-1"
                    >
                      <X className="w-4 h-4 mr-2" />
                      {tCart('cancel')}
                    </Button>
                    <Button 
                      type="submit" 
                      className="btn-primary flex-1"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {tCart('addToCart')}
                    </Button>
                  </div>
                </div>
              </form>
            ) : (
              // No customization needed, direct add to cart
              <div className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {t('noCustomizationsAvailable')}
                  </AlertDescription>
                </Alert>
                
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={handleClose}
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-2" />
                    {tCart('cancel')}
                  </Button>
                  <Button 
                    onClick={() => onSubmit({})} 
                    className="btn-primary flex-1"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {tCart('addToCart')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ProductCustomizationModal
