import { redirect } from 'next/navigation';
import { stripe } from '../../lib/stripe';

export default async function Success({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session_id = Array.isArray(searchParams.session_id)
    ? searchParams.session_id[0]
    : searchParams.session_id;

  if (!session_id)
    throw new Error('Please provide a valid session_id (`cs_test_...`)');

  const {
    status,
    customer_details,
  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent'],
  });

  const customerEmail = customer_details?.email ?? 'Unknown email';

  if (status === 'open') {
    redirect('/');
  }

  if (status === 'complete') {
    return (
      <section id="success">
        <p>
          We appreciate your business! A confirmation email will be sent to {customerEmail}. If you
          have any questions, please email
        </p>
        <a href="mailto:orders@example.com">orders@example.com</a>.
      </section>
    );
  }

  return null;
}