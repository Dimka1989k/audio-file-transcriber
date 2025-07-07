import Stripe from 'stripe';
import type { NextApiRequest, NextApiResponse } from 'next';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const sig = req.headers['stripe-signature'];
    if (!sig || typeof sig !== 'string') {
  return res.status(400).send('Missing or invalid Stripe signature');
}
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret!);
     } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error';
      console.error('Error verifying webhook signature:', errorMessage);
      return res.status(400).send(`Webhook Error: ${errorMessage}`);
    }
    
    switch (event.type) {
      case 'checkout.session.completed':     
        break;
      case 'invoice.payment_succeeded':       
        break;
    
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    res.status(200).json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
export const config = {
  api: {
    bodyParser: false,
  },
};