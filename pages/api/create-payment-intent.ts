import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16' as any,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  try {
    const { items } = req.body;
    let totalAmount = 0;
    items.forEach((item: any) => { totalAmount += Math.round(item.price * 100); });
    if (totalAmount === 0) return res.status(400).json({ message: 'Cart is empty' });

    // Generate Intent IMMEDIATELY to render the Stripe UI quickly.
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'eur',
    });

    res.status(200).json({ 
      clientSecret: paymentIntent.client_secret,
      intentId: paymentIntent.id
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}
