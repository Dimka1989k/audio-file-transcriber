import { redirect } from "next/navigation";
import { stripe } from "../../lib/stripe";

interface SuccessPageProps {
  searchParams: { session_id?: string };
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const session_id = searchParams.session_id;

  if (!session_id) {
    throw new Error("Missing session_id in searchParams");
  }

  const { status, customer_details } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  const customerEmail = customer_details?.email ?? "Unknown email";

  if (status === "open") {
    redirect("/");
  }

  if (status === "complete") {
    return (
      <section id="success">
        <p>
          We appreciate your business! A confirmation email will be sent to {customerEmail}.
          If you have any questions, please email
        </p>
        <a href="mailto:orders@example.com">orders@example.com</a>.
      </section>
    );
  }

  return null;
}
