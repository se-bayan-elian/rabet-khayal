import { axiosAuthClient as axiosClient } from "@/lib/axios";

export interface CreateOrderRequest {
  cartId: string;
  paymentMethod: 'visa' | 'mastercard' | 'apple_pay' | 'stc_pay';
  googleAddress: string;
  deliveryEnabled?: boolean;
  deliveryFee?: number;
  tax?: number;
  couponId?: string;
}

export interface ProcessPaymentRequest {
  paymentMethod: 'visa' | 'mastercard' | 'apple_pay' | 'stc_pay';
  transactionId?: string;
  amount?: number;
  paymentReference?: string;
}

export interface Order {
  id: string;
  userId: string;
  cartId: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refund';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled';
  googleAddress: string;
  deliveryEnabled: boolean;
  deliveryFee: number;
  tax: number;
  couponId?: string;
  discountAmount: number;
  total: number;
  subtotal: number;
  createdAt: string;
  cart: {
    id: string;
    items: Array<{
      id: string;
      productId: string;
      quantity: number;
      price: number;
      salePrice?: number;
      customizationCost?: number;
      customizations?: Array<{
        id: string;
        questionId: string;
        answerId?: string;
        textValue?: string;
        imagePublicId?: string;
      }>;
      product: {
        id: string;
        name: string;
        description: string;
        imageUrl?: string;
        price: number;
        salePrice?: number;
      };
    }>;
  };
  items: Array<{
    id: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    salePrice?: number;
    customizationCost: number;
    customizations?: Array<{
      id: string;
      optionId: string;
      questionText: string;
      selectedAnswer?: string;
      selectedValueImageUrl?: string;
      selectedValueImagePublicId?: string;
      customerInput?: string;
      additionalPrice: number;
    }>;
    product: {
      id: string;
      name: string;
      description: string;
      imageUrl?: string;
      price: number;
      salePrice?: number;
    };
  }>;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface OrderStats {
  totalOrders: number;
  totalSpent: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
}

export interface PaginatedOrdersResponse {
  data: Order[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Create order from cart
export const createOrder = async (data: CreateOrderRequest): Promise<Order> => {
  const response = await axiosClient.post<{ data: Order }>('/orders', data);
  return response.data.data;
};

// Process payment for order
export const processPayment = async (orderId: string, data: ProcessPaymentRequest): Promise<Order> => {
  const response = await axiosClient.post<{ data: Order }>(`/orders/${orderId}/process-payment`, data);
  return response.data.data;
};

// Get user orders
export const getUserOrders = async (params?: {
  page?: number;
  limit?: number;
  orderStatus?: string;
  paymentStatus?: string;
}): Promise<PaginatedOrdersResponse> => {
  const response = await axiosClient.get<{ data: PaginatedOrdersResponse }>('/orders/my-orders', { params });
  return response.data.data;
};

// Get order by ID
export const getOrderById = async (orderId: string): Promise<Order> => {
  const response = await axiosClient.get<{ data: Order }>(`/orders/${orderId}`);
  return response.data.data;
};

// Get user order stats
export const getUserOrderStats = async (): Promise<OrderStats> => {
  const response = await axiosClient.get<OrderStats>('/orders/my-stats');
  return response.data;
};

// Cancel order
export const cancelOrder = async (orderId: string): Promise<Order> => {
  const response = await axiosClient.patch<{ data: Order }>(`/orders/${orderId}/cancel`);
  return response.data.data;
};

// Apply coupon to order
export const applyCouponToOrder = async (orderId: string, couponId: string): Promise<Order> => {
  const response = await axiosClient.patch<{ data: Order }>(`/orders/${orderId}/apply-coupon`, {
    couponId,
  });
  return response.data.data;
};
