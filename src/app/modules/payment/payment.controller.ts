import { Request, Response } from "express";
import { envVars } from "../../config/env";
import { stripe } from "../../config/stripe.config";
import status from "http-status";
import { PaymentService } from "./payment.service";
import { sendResponse } from "../../shared/sendResponse";
import { catchAsync } from "../../shared/cathAsync";

const handleStripeWebhookEvent = async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string;
  const webhookSecret = envVars.STRIPE.STRIPE_WEBHOOK_KEY;

  if (!signature || !webhookSecret) {
    console.log("Missing stripe signature or webhook secret");
    return { message: "Missing stripe signature or webhook secret" };
  }
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (err) {
    console.log("Error processing stripe webhook", err);
    return res.status(status.BAD_REQUEST).json({
      success: false,
      message: "Error processing stripe webhook",
    });
  }
  try {
    const result = await PaymentService.handleStripeWebhookEvent(event);

    sendResponse(res, {
      httpStatusCode: status.OK,
      message: "Payment processed successfully",
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("Error handling Stripe webhook event:", err);
    sendResponse(res, {
      httpStatusCode: status.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Error handling Stripe webhook event",
    });
  }
};

const getAllPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.getAllPayment();
  sendResponse(res, {
    httpStatusCode: status.OK,
    message: "Payment fetched successfully",
    success: true,
    data: result,
  });
});

const getPaymentByStudentId = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.getPaymentByStudentId(req.params.studentId as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    message: "Payment fetched successfully",
    success: true,
    data: result,
  });
});

const getPaymentByApplicantId = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.getPaymentByApplicantId(req.params.applicantId as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    message: "Payment fetched successfully",
    success: true,
    data: result,
  });
});

export const PaymentController = {
  handleStripeWebhookEvent,
  getAllPayment,
  getPaymentByStudentId,
  getPaymentByApplicantId,
};
