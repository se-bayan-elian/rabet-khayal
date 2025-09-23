import { NextRequest, NextResponse } from 'next/server';

const MOYASAR_SECRET_KEY = process.env.MOYASAR_SECRET_KEY;
const MOYASAR_PUBLISHABLE_KEY = process.env.MOYASAR_PUBLISHABLE_KEY;
const MOYASAR_BASE_URL = 'https://api.moyasar.com/v1';

interface MoyasarPaymentRequest {
  amount: number;
  currency: string;
  description: string;
  callback_url: string;
  source: {
    type: 'creditcard';
    name: string;
    number: string;
    cvc: string;
    month: string;
    year: string;
  };
  metadata?: Record<string, any>;
}

interface MoyasarPaymentResponse {
  id: string;
  status: string;
  amount: number;
  currency: string;
  description: string;
  source: {
    type: string;
    company: string;
    name: string;
    number: string;
    gateway_id: string;
    reference_number: string;
    token: string;
    message: string;
    transaction_url: string;
  };
  created_at: string;
  updated_at: string;
  metadata: Record<string, any>;
}

export async function POST(request: NextRequest) {
  try {
    if (!MOYASAR_PUBLISHABLE_KEY) {
      return NextResponse.json(
        { error: 'Moyasar secret key not configured' },
        { status: 500 }
      );
    }

    const body: MoyasarPaymentRequest = await request.json();

    // Validate required fields
    if (!body.amount || !body.currency || !body.description || !body.source) {
      return NextResponse.json(
        { error: 'Missing required payment fields' },
        { status: 400 }
      );
    }

    // Validate source fields
    const { source } = body;
    if (!source.name || !source.number || !source.cvc || !source.month || !source.year) {
      return NextResponse.json(
        { error: 'Missing required card information' },
        { status: 400 }
      );
    }

    // Create payment with Moyasar
    const moyasarResponse = await fetch(`${MOYASAR_BASE_URL}/payments?publishable_api_key=${MOYASAR_PUBLISHABLE_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: body.amount,
        currency: body.currency,
        description: body.description,
        callback_url: body.callback_url,
        source: {
          type: 'creditcard',
          name: source.name,
          number: source.number,
          cvc: source.cvc,
          month: source.month,
          year: source.year,
        },
        metadata: body.metadata || {},
      }),
    });

    const moyasarData: MoyasarPaymentResponse = await moyasarResponse.json();

    if (!moyasarResponse.ok) {
      console.error('Moyasar API error:', moyasarData);
      return NextResponse.json(
        { 
          error: (moyasarData as any)?.error?.message || (moyasarData as any)?.message || 'Payment creation failed',
          details: moyasarData 
        },
        { status: moyasarResponse.status }
      );
    }

    // Return payment information
    return NextResponse.json({
      success: true,
      payment_id: moyasarData.id,
      status: moyasarData.status,
      amount: moyasarData.amount,
      currency: moyasarData.currency,
      payment_url: moyasarData.source.transaction_url,
      gateway_id: moyasarData.source.gateway_id,
      reference_number: moyasarData.source.reference_number,
    });

  } catch (error) {
    console.error('Payment API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get payment status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('id');

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      );
    }

    if (!MOYASAR_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Moyasar secret key not configured' },
        { status: 500 }
      );
    }

    // Get payment status from Moyasar
    const moyasarResponse = await fetch(`${MOYASAR_BASE_URL}/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(MOYASAR_SECRET_KEY + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
    });

    const moyasarData = await moyasarResponse.json();

    if (!moyasarResponse.ok) {
      console.error('Moyasar API error:', moyasarData);
      return NextResponse.json(
        { 
          error: (moyasarData as any)?.message || (moyasarData as any)?.error?.message || 'Failed to get payment status',
          details: moyasarData 
        },
        { status: moyasarResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      payment_id: moyasarData.id,
      status: moyasarData.status,
      amount: moyasarData.amount,
      currency: moyasarData.currency,
      description: moyasarData.description,
      created_at: moyasarData.created_at,
      updated_at: moyasarData.updated_at,
      metadata: moyasarData.metadata,
    });

  } catch (error) {
    console.error('Payment status API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

