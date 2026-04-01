import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  try {
    const { intentId, customerName, customerEmail, items, totalAmount } = req.body;
    if (!intentId || !customerName || !customerEmail) return res.status(400).json({ message: 'Missing info' });

    // Upsert or insert a pending order before stripe confirms the payment
    const { data: existing } = await supabase.from('orders').select('id').eq('stripe_payment_intent_id', intentId).maybeSingle();

    if (existing) {
      await supabase.from('orders').update({
        customer_name: customerName,
        customer_email: customerEmail,
        total_amount: totalAmount,
        items: items
      }).eq('stripe_payment_intent_id', intentId);
    } else {
      await supabase.from('orders').insert({
        stripe_payment_intent_id: intentId,
        customer_name: customerName,
        customer_email: customerEmail,
        total_amount: totalAmount,
        items: items,
        status: 'pending'
      });
    }

    res.status(200).json({ success: true });
  } catch (err: any) {
    console.error('Save Order Error:', err.message);
    res.status(500).json({ message: err.message });
  }
}
