const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Payment processing service for handling multiple payment providers
 */
class PaymentService {
  constructor() {
    this.providers = {
      stripe: {
        createPaymentIntent: this.createStripePaymentIntent,
        processPayment: this.processStripePayment,
        refundPayment: this.refundStripePayment
      },
      applePay: {
        validateMerchant: this.validateApplePayMerchant,
        processPayment: this.processApplePayPayment
      },
      paypal: {
        createOrder: this.createPaypalOrder,
        capturePayment: this.capturePaypalPayment
      }
    };
  }

  /**
   * Get available payment methods
   */
  getAvailablePaymentMethods() {
    return [
      {
        id: 'credit_card',
        name: 'Credit / Debit Card',
        description: 'Pay with Visa, Mastercard, American Express, or Discover',
        provider: 'stripe',
        icon: 'credit-card'
      },
      {
        id: 'apple_pay',
        name: 'Apple Pay',
        description: 'Fast, secure payment with Apple Pay',
        provider: 'applePay',
        icon: 'apple'
      },
      {
        id: 'paypal',
        name: 'PayPal',
        description: 'Pay with your PayPal account',
        provider: 'paypal',
        icon: 'paypal'
      }
    ];
  }

  /**
   * Process a payment with the specified provider
   * @param {string} provider - Payment provider (stripe, applePay, paypal)
   * @param {object} paymentData - Payment data including amount, currency, etc.
   * @returns {Promise<object>} Payment result
   */
  async processPayment(provider, paymentData) {
    if (!this.providers[provider] || !this.providers[provider].processPayment) {
      throw new Error(`Payment provider ${provider} not supported`);
    }

    try {
      return await this.providers[provider].processPayment(paymentData);
    } catch (error) {
      console.error(`Payment processing error with ${provider}:`, error);
      throw error;
    }
  }

  /**
   * Create a Stripe payment intent
   * @param {object} paymentData - Payment data including amount, currency, etc.
   * @returns {Promise<object>} Stripe payment intent
   */
  async createStripePaymentIntent(paymentData) {
    try {
      const { amount, currency = 'usd', customer = null, metadata = {} } = paymentData;

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        customer,
        metadata: {
          orderId: metadata.orderId,
          ...metadata
        },
        payment_method_types: ['card'],
        receipt_email: paymentData.email
      });

      return {
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      };
    } catch (error) {
      console.error('Error creating Stripe payment intent:', error);
      throw error;
    }
  }

  /**
   * Process a Stripe payment
   * @param {object} paymentData - Payment data including payment intent ID, etc.
   * @returns {Promise<object>} Payment result
   */
  async processStripePayment(paymentData) {
    try {
      const { paymentIntentId } = paymentData;

      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status === 'succeeded') {
        return {
          success: true,
          paymentId: paymentIntent.id,
          amount: paymentIntent.amount / 100, // Convert from cents
          status: paymentIntent.status,
          paymentMethod: paymentIntent.payment_method
        };
      } else if (paymentIntent.status === 'requires_capture') {
        // Capture the payment if it requires capture
        const capturedIntent = await stripe.paymentIntents.capture(paymentIntentId);
        return {
          success: true,
          paymentId: capturedIntent.id,
          amount: capturedIntent.amount / 100,
          status: capturedIntent.status,
          paymentMethod: capturedIntent.payment_method
        };
      } else {
        return {
          success: false,
          status: paymentIntent.status,
          message: `Payment not completed. Status: ${paymentIntent.status}`
        };
      }
    } catch (error) {
      console.error('Error processing Stripe payment:', error);
      throw error;
    }
  }

  /**
   * Refund a Stripe payment
   * @param {object} refundData - Refund data including payment intent ID, amount, etc.
   * @returns {Promise<object>} Refund result
   */
  async refundStripePayment(refundData) {
    try {
      const { paymentIntentId, amount = null, reason = 'requested_by_customer' } = refundData;

      const refundParams = {
        payment_intent: paymentIntentId,
        reason
      };

      if (amount) {
        refundParams.amount = Math.round(amount * 100); // Convert to cents
      }

      const refund = await stripe.refunds.create(refundParams);

      return {
        success: true,
        refundId: refund.id,
        amount: refund.amount / 100, // Convert from cents
        status: refund.status
      };
    } catch (error) {
      console.error('Error refunding Stripe payment:', error);
      throw error;
    }
  }

  /**
   * Validate Apple Pay merchant
   * @param {object} validationData - Validation data
   * @returns {Promise<object>} Validation result
   */
  async validateApplePayMerchant(validationData) {
    try {
      const { validationURL, domain } = validationData;

      const session = await stripe.applePay.sessions.create({
        domain,
        validation_url: validationURL
      });

      return {
        success: true,
        merchantSession: session
      };
    } catch (error) {
      console.error('Error validating Apple Pay merchant:', error);
      throw error;
    }
  }

  /**
   * Process an Apple Pay payment
   * @param {object} paymentData - Payment data including token, amount, etc.
   * @returns {Promise<object>} Payment result
   */
  async processApplePayPayment(paymentData) {
    try {
      const { token, amount, currency = 'usd', metadata = {} } = paymentData;

      // Create a payment method using the Apple Pay token
      const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
          token
        }
      });

      // Create a payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        payment_method: paymentMethod.id,
        confirm: true,
        metadata: {
          orderId: metadata.orderId,
          ...metadata
        }
      });

      return {
        success: true,
        paymentId: paymentIntent.id,
        amount: paymentIntent.amount / 100, // Convert from cents
        status: paymentIntent.status
      };
    } catch (error) {
      console.error('Error processing Apple Pay payment:', error);
      throw error;
    }
  }

  /**
   * Create a PayPal order
   * @param {object} orderData - Order data including amount, currency, etc.
   * @returns {Promise<object>} PayPal order
   */
  async createPaypalOrder(orderData) {
    // In a real implementation, this would use the PayPal SDK
    // This is a placeholder for the PayPal integration
    return {
      success: true,
      orderId: 'paypal-order-' + Date.now(),
      status: 'CREATED'
    };
  }

  /**
   * Capture a PayPal payment
   * @param {object} captureData - Capture data including order ID, etc.
   * @returns {Promise<object>} Capture result
   */
  async capturePaypalPayment(captureData) {
    // In a real implementation, this would use the PayPal SDK
    // This is a placeholder for the PayPal integration
    return {
      success: true,
      captureId: 'paypal-capture-' + Date.now(),
      status: 'COMPLETED'
    };
  }
}

module.exports = new PaymentService(); 