export interface CartLineItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const STORAGE_KEY = 'cartItems';

export function getCart(): CartLineItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartLineItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  try {
    window.dispatchEvent(new CustomEvent('cart:updated'));
  } catch {}
}

export function addItem(item: CartLineItem): void {
  const cart = getCart();
  const idx = cart.findIndex(i => i.id === item.id);
  if (idx >= 0) {
    cart[idx] = { ...cart[idx], quantity: cart[idx].quantity + item.quantity };
  } else {
    cart.push(item);
  }
  saveCart(cart);
}

export function clearCart(): void {
  saveCart([]);
}


