import React from 'react';
import { ShoppingCart, LogOut, Package } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  userEmail: string | null;
  onLogout: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  userEmail,
  onLogout,
  onOpenAuth,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-7 h-7 text-indigo-600" />
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            ShopFlow
          </span>
        </div>

        <div className="flex items-center gap-4">
          {userEmail ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-600 hidden sm:inline">
                {userEmail}
              </span>
              <button
                onClick={onLogout}
                className="p-2 text-slate-500 hover:text-rose-600 transition"
                title="Déconnexion"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="text-sm font-semibold bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-100 transition"
            >
              Connexion
            </button>
          )}

          <button
            onClick={onOpenCart}
            className="relative p-2 text-slate-700 hover:text-indigo-600 transition"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};