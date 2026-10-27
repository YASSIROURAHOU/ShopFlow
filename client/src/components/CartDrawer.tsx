import React, { useState } from 'react';
import type { CartItem } from '../types';
import api from '../services/api';
import { stripePromise } from '../services/stripe';
import { CheckoutForm } from './Checkoutform';
import { Elements } from '@stripe/react-stripe-js';
import { X, Trash2, ArrowRight, CheckCircle2, CreditCard } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: number, delta: number) => void;
  onClearCart: () => void;
  userEmail: string | null;
  onRequireAuth: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onClearCart,
  userEmail,
  onRequireAuth,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderSuccessId, setOrderSuccessId] = useState<number | null>(null);

  if (!isOpen) return null;

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleStartPayment = async () => {
    if (!userEmail) {
      onRequireAuth();
      return;
    }

    setSubmitting(true);
    try {
      // 1. Initialise l'intention de paiement côté backend
      const res = await api.post('/orders/create-payment-intent', {
        amount: Math.round(total * 100),
      });
      setClientSecret(res.data.clientSecret);
    } catch {
      // Si la route spécifique n'est pas configurée, on valide directement la commande
      await handleDirectOrder();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDirectOrder = async () => {
    try {
      const payload = {
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
      };
      const res = await api.post('/orders', payload);
      setOrderSuccessId(res.data.id);
      onClearCart();
      setClientSecret(null);
    } catch {
      alert('Erreur lors de la validation de la commande');
    }
  };

  const handlePaymentSuccess = async () => {
    await handleDirectOrder();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">
                {clientSecret ? 'Paiement sécurisé' : 'Votre panier'}
              </h2>
              <button
                onClick={() => {
                  setClientSecret(null);
                  onClose();
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {orderSuccessId ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
                <h3 className="text-xl font-bold text-slate-800">Commande confirmée !</h3>
                <p className="text-sm text-slate-500">
                  Numéro de référence : <span className="font-semibold text-slate-700">#{orderSuccessId}</span>
                </p>
                <button
                  onClick={() => {
                    setOrderSuccessId(null);
                    onClose();
                  }}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition"
                >
                  Continuer les achats
                </button>
              </div>
            ) : clientSecret ? (
              <div className="py-6 space-y-4">
                <div className="flex items-center gap-2 text-slate-700 text-sm font-medium">
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  <span>Saisissez vos coordonnées bancaires de test</span>
                </div>
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm
                    clientSecret={clientSecret}
                    totalAmount={total}
                    onSuccess={handlePaymentSuccess}
                    onError={(err) => alert(err)}
                  />
                </Elements>
                <button
                  onClick={() => setClientSecret(null)}
                  className="text-xs text-slate-400 hover:text-slate-600 underline block mx-auto pt-2"
                >
                  Retour au récapitulatif
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                Votre panier est vide.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 overflow-y-auto max-h-[60vh] mt-4">
                {items.map((item) => (
                  <div key={item.product.id} className="py-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900">{item.product.title}</h4>
                      <p className="text-xs text-slate-500">{item.product.price.toFixed(2)} € / unité</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, -1)}
                          className="px-2 py-1 hover:bg-slate-100 text-slate-600 text-sm font-bold"
                        >
                          -
                        </button>
                        <span className="px-3 text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, 1)}
                          className="px-2 py-1 hover:bg-slate-100 text-slate-600 text-sm font-bold"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, -item.quantity)}
                        className="text-slate-400 hover:text-rose-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {!orderSuccessId && !clientSecret && items.length > 0 && (
            <div className="pt-6 border-t border-slate-200 space-y-4">
              <div className="flex justify-between items-center text-base font-bold text-slate-900">
                <span>Total HT</span>
                <span>{total.toFixed(2)} €</span>
              </div>
              <button
                onClick={handleStartPayment}
                disabled={submitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition"
              >
                <span>{submitting ? 'Préparation...' : 'Passer à la caisse'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};