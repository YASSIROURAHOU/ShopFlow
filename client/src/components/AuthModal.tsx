import React, { useState } from 'react';
import api from '../services/api';
import { X, Lock, Mail, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const endpoint = isRegister ? '/auth/register' : '/auth/login';

    try {
      const response = await api.post(endpoint, { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userEmail', email);
      onAuthSuccess(email);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Identifiants invalides ou erreur serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-slate-900 mb-1">
          {isRegister ? 'Créer un compte professionnel' : 'Connexion à votre espace'}
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          {isRegister ? 'Rejoignez le réseau B2B ShopFlow' : 'Accédez à vos commandes et tarifs négociés'}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Adresse e-mail
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@entreprise.com"
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:outline-hidden text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:outline-hidden text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition disabled:opacity-50 text-sm"
          >
            {loading ? 'Chargement...' : isRegister ? "S'inscrire" : 'Se connecter'}
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-slate-500">
          {isRegister ? 'Déjà un compte ?' : 'Nouveau client ?'}{' '}
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError(null);
            }}
            className="font-semibold text-indigo-600 hover:underline"
          >
            {isRegister ? 'Se connecter' : 'Créer un compte'}
          </button>
        </div>
      </div>
    </div>
  );
};





