import { useEffect, useState } from 'react';
import api from './services/api';
import type { Product, CartItem } from './types';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';
import { ShoppingBag, Check } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(
    localStorage.getItem('userEmail')
  );

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      const data = res.data.content ? res.data.content : res.data;
      setProducts(data);
    } catch (err) {
      console.error('Erreur de chargement des produits :', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: number, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setUserEmail(null);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        userEmail={userEmail}
        onLogout={handleLogout}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Catalogue B2B</h1>
          <p className="text-slate-500 mt-1">
            Approvisionnement direct pour entreprises et professionnels.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition"
              >
                <div className="h-48 bg-slate-100 flex items-center justify-center overflow-hidden">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ShoppingBag className="w-12 h-12 text-slate-400" />
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg">
                      {p.title}
                    </h3>
                    <p className="text-slate-500 text-sm mt-1 line-clamp-2">
                      {p.description}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 uppercase font-semibold">
                        Prix HT
                      </span>
                      <p className="text-xl font-bold text-slate-900">
                        {p.price.toFixed(2)} €
                      </p>
                    </div>

                    <button
                      onClick={() => addToCart(p)}
                      disabled={p.stockQuantity <= 0}
                      className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-3.5 py-2 rounded-xl text-sm font-semibold transition"
                    >
                      <Check className="w-4 h-4" />
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(email) => setUserEmail(email)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={() => setCart([])}
        userEmail={userEmail}
        onRequireAuth={() => {
          setIsCartOpen(false);
          setIsAuthOpen(true);
        }}
      />
    </div>
  );
}