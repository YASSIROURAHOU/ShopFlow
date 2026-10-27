import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Lock } from 'lucide-react';

interface CheckoutFormProps {
  clientSecret: string;
  totalAmount: number;
  onSuccess: () => void;
  onError: (msg: string) => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  clientSecret,
  totalAmount,
  onSuccess,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (result.error) {
      onError(result.error.message || 'Le paiement a échoué.');
      setProcessing(false);
    } else if (result.paymentIntent?.status === 'succeeded') {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-3 border border-slate-200 rounded-xl bg-slate-50">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '15px',
                color: '#1e293b',
                '::placeholder': { color: '#94a3b8' },
              },
              invalid: { color: '#e11d48' },
            },
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition"
      >
        <Lock className="w-4 h-4" />
        <span>{processing ? 'Paiement en cours...' : `Payer ${totalAmount.toFixed(2)} €`}</span>
      </button>
    </form>
  );
};