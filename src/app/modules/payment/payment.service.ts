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
      const applicationId = session.metadata?.applicationId;
      const paymentId = session.metadata?.paymentId;
  

      if (!applicationId || !paymentId) {
        console.error("Missing applicantId or paymentId in metadata");
        return { message: "Missing applicantId or paymentId in metadata" };
      }

      const application = await prisma.application.findUnique({
        where: {
          id: applicationId,
        },
      });

      if (!application) {
        console.error("Application not found");
        return { message: "Application not found" };
      }

    //   Update both application and payment in a transaction
        await prisma.$transaction(async (tx) => {
          const updatedApplication = await tx.application.update({
            where: {
              id: applicationId,
            },
            data: {
              paymentStatus:
                session.payment_status === "paid"
                  ? PaymentStatus.PAID
                  : PaymentStatus.UNPAID,
            },
          });
          const updatedPayment = await tx.payment.update({
            where: {
              id: paymentId,
            },
            data: {
              stripeEventId: event.id,
              status:
                session.payment_status === "paid"
                  ? PaymentStatus.PAID
                  : PaymentStatus.UNPAID,
              paymentGatewayData: session as any,
            },
          });
          return { updatedApplication, updatedPayment };
        });

    //   await prisma.$transaction(async (tx) => {
    //     const statusToUpdate =
    //       session.payment_status === "paid"
    //         ? PaymentStatus.PAID
    //         : PaymentStatus.UNPAID;

    //     await tx.application.update({
    //       where: { id: applicationId },
    //       data: { paymentStatus: statusToUpdate },
    //     });

    //     await tx.payment.update({
    //       where: { id: paymentId },
    //       data: {
    //         stripeEventId: event.id,
    //         status: statusToUpdate,
    //         paymentGatewayData: session as any,
    //       },
    //     });
    //   });

      console.log(
        `✅ Payment ${session.payment_status} for application ${applicationId}`,
      );
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
