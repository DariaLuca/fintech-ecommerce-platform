import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16' as any,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  try {
    const { payment_intent_id } = req.body;
    if (!payment_intent_id) return res.status(400).json({ message: 'Missing intent ID' });

    // Securely retrieve from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

    if (paymentIntent.status === 'succeeded') {
      
      // Update order to officially completed
      const { data: orderData, error: updateError } = await supabase.from('orders')
        .update({ status: 'completed' })
        .eq('stripe_payment_intent_id', paymentIntent.id)
        .select();
        
      if (updateError) {
         console.error('Order Update Failed:', updateError);
      }

      // Stock deduction
      if (orderData && orderData.length > 0) {
        for (const order of orderData) {
          if (order.items) {
            for (const item of order.items) {
               await supabase.rpc('decrement_stock', { p_id: item.id, qty: 1 });
            }
          }
        }
      }

      // Log successful transaction
      const { error } = await supabase.from('transactions').insert({
        stripe_payment_id: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
      });

      if (error && error.code !== '23505') {
        console.error('Supabase Sync Error:', error.message);
      }
      
      return res.status(200).json({ success: true, status: 'succeeded' });
    }

    return res.status(400).json({ success: false, status: paymentIntent.status });
  } catch (err: any) {
    console.error('Verification Error:', err.message);
    res.status(500).json({ message: err.message });
  }
}
