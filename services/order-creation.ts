import { axiosAuthClient as axiosClient } from "@/lib/axios";
import { CreateOrderRequest, Order } from "./orders";

export interface CreateOrderFromCartRequest {
  paymentMethod: 'visa' | 'mastercard' | 'apple_pay' | 'stc_pay';
  deliveryType: 'company' | 'home';
  deliveryAddress?: string;
  deliveryOptionId?: string;
  deliveryCost?: number;
  couponId?: string;
}

export const createOrderFromCart = async (
  cartId: string,
  orderData: CreateOrderFromCartRequest
): Promise<Order> => {
  const createOrderRequest: CreateOrderRequest = {
    cartId,
    paymentMethod: orderData.paymentMethod,
    googleAddress: orderData.deliveryAddress || 'Company Pickup',
    deliveryEnabled: orderData.deliveryType === 'home',
    deliveryFee: orderData.deliveryCost || 0,
    tax: 0, // You can calculate tax here if needed
    couponId: orderData.couponId,
  };

  const response = await axiosClient.post<{ data: Order }>('/orders', createOrderRequest);
  return response.data.data;
};

export const processOrderPayment = async (
  orderId: string,
  paymentData: {
    paymentMethod: 'visa' | 'mastercard' | 'apple_pay' | 'stc_pay';
    transactionId?: string;
    amount?: number;
    paymentReference?: string;
  }
): Promise<Order> => {
  const response = await axiosClient.post<{ data: Order }>(`/orders/${orderId}/process-payment`, paymentData);
  return response.data.data;
};
