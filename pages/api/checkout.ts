import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripeUrl = process.env.STRIPE_SECRET_KEY as string;
const stripe = new Stripe(stripeUrl, {
  apiVersion: '2023-10-16' as any,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { items, customerName, customerEmail } = req.body;

    let totalAmount = 0;

    const lineItems = items.map((item: any) => {
      totalAmount += Math.round(item.price * 100);
      return {
        price_data: {
          currency: 'eur',
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: 1,
      };
    });

    if (totalAmount === 0) return res.status(400).json({ message: 'Cart is empty' });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel`,
      customer_email: customerEmail || undefined,
      metadata: { customerName },
    });

    // Store the order with session.id as the identifier for now 
    // It will be updated when verified via success page
    const { error: insertError } = await supabase.from('orders').insert({
      stripe_payment_intent_id: session.id,
      customer_name: customerName,
      customer_email: customerEmail,
      total_amount: totalAmount / 100,
      items: items,
      status: 'pending'
    });
    
    if (insertError) console.error('Database Sync Error:', insertError);

    res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe Checkout Error:', err);
    res.status(500).json({ statusCode: 500, message: err.message });
  }
}
