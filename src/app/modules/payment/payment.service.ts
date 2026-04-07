/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { PaymentStatus } from "../../../generated/prisma/enums";

const handleStripeWebhookEvent = async (event: Stripe.Event) => {
  const existingPayment = await prisma.payment.findFirst({
    where: {
      stripeEventId: event.id,
    },
  });

  if (existingPayment) {
    console.log(`Event ${event.id} already processed, skipping`);
    return { message: `Event ${event.id} already processed, skipping` };
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      const { applicationId, fromFillupId, paymentId } = session.metadata || {};

      await prisma.$transaction(async (tx) => {
        if (paymentId) {
          await tx.payment.update({
            where: { id: paymentId },
            data: {
              stripeEventId: event.id,
              status:
                session.payment_status === "paid"
                  ? PaymentStatus.PAID
                  : PaymentStatus.UNPAID,
              paymentGatewayData: session as any,
            },
          });
        }
        if (applicationId) {
          await tx.application.update({
            where: { id: applicationId },
            data: {
              paymentStatus:
                session.payment_status === "paid"
                  ? PaymentStatus.PAID
                  : PaymentStatus.UNPAID,
            },
          });
        }

        if (fromFillupId) {
          await tx.formFillup.update({
            where: { id: fromFillupId },
            data: {
              paymentStatus:
                session.payment_status === "paid"
                  ? PaymentStatus.PAID
                  : PaymentStatus.UNPAID,
            },
          });
        }
      });

      break;
    }
    case "checkout.session.expired": {
      const session = event.data.object;
      console.log(
        `Checkout session ${session.id} expired. Marking associated payment as failed.`,
      );
      break;
    }
    case "payment_intent.payment_failed": {
      const session = event.data.object;

      console.log(
        `Payment intent ${session.id} failed. Marking associated payment as failed.`,
      );
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return { message: `Webhook Event ${event.id} processed successfully` };
};

export const PaymentService = { handleStripeWebhookEvent };
