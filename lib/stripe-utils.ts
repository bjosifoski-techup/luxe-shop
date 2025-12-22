import { supabase } from './supabase/client';

export interface CheckoutSessionParams {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  mode: 'payment' | 'subscription';
}

export async function createCheckoutSession(params: CheckoutSessionParams) {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('You must be logged in to checkout');
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/stripe-checkout`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price_id: params.priceId,
        success_url: params.successUrl,
        cancel_url: params.cancelUrl,
        mode: params.mode,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create checkout session');
  }

  const data = await response.json();
  return data;
}

export function redirectToCheckout(checkoutUrl: string) {
  window.location.href = checkoutUrl;
}
