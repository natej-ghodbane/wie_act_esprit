/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { productAPI } from '@/utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Edit3, Trash2, Plus, X, Save, AlertTriangle, Sun, Moon } from 'lucide-react';

// Normalize various backend product shapes to a consistent UI row
interface ProductRow {
  id: string;
  name: string;
  category: string;
  price: number;
  inventory: number;
  isActive: boolean;
  image?: string;
  description?: string;
  vendorId?: string;
}

function resolveImageUrl(src?: string): string | undefined {
  if (!src) return undefined;
  if (src.startsWith('http')) return src;
  const api = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api');
  const origin = api.replace(/\/api$/, '');
  if (src.startsWith('/')) return `${origin}${src}`;
  return `${origin}/${src}`;
}

function mapToRow(p: any): ProductRow {
  const imageCandidate: string | undefined = p?.imageUrl || (Array.isArray(p?.images) ? p.images[0] : undefined);
  return {
    id: String(p?._id || p?.id || ''),
    name: p?.name || p?.title || 'Untitled',
    category: p?.category || (Array.isArray(p?.categories) ? p.categories[0] : '-') || '-',
    price: Number(p?.price) || 0,
    inventory: typeof p?.inventory === 'object' && p?.inventory !== null
      ? Number(p?.inventory?.available ?? 0)
      : Number(p?.inventory ?? 0),
    isActive: typeof p?.isActive === 'boolean' ? p.isActive : true,
    image: resolveImageUrl(imageCandidate),
    description: p?.description || '',
    vendorId: p?.vendorId ? String(p.vendorId) : undefined,
  };
}

export default function VendorProductsPage() {
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<ProductRow[]>([]);

  // Search
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  useEffect(() => {
    const id = setTimeout(() => setDebounced(search.trim().toLowerCase()), 250);
    return () => clearTimeout(id);
  }, [search]);

  const filtered = useMemo(() => {
    if (!debounced) return rows;
    return rows.filter((p) =>
      p.name.toLowerCase().includes(debounced) ||
      p.category.toLowerCase().includes(debounced) ||
      p.description?.toLowerCase().includes(debounced) ||
      p.id.toLowerCase().includes(debounced)
    );
  }, [rows, debounced]);

  // Edit modal
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete modal
  const [deleting, setDeleting] = useState<ProductRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Add modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Fetch products + auth
  useEffect(() => {
    // Auth check (align with vendor dashboard behavior)
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    let uid: string | null = null;

    if (!token || !userData) {
      router.replace('/auth/login');
      return;
    }

    try {
      const parsed = JSON.parse(userData);
      if (parsed.role !== 'farmer') {
        router.replace('/auth/login');
        return;
      }
      uid = String(parsed.id || parsed._id || '');
      setCurrentUserId(uid);
    } catch {
      router.replace('/auth/login');
      return;
    }

    const fetchProducts = async (vendorId?: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await productAPI.getAll();
        console.log('Raw API response:', data);
        console.log('Current vendor ID:', vendorId);
        
        const list = Array.isArray(data) ? data.map(mapToRow) : [];
        console.log('Mapped products:', list);
        
        // Show all products for now (remove vendorId filtering)
        setRows(list);
        console.log('Products set to state:', list.length);
      } catch (e: any) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch products', e);
        console.error('Error details:', e.response?.data);
        setError('Failed to load products');
        setRows([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts(uid || undefined);
  }, [router]);

  // Actions
  const onSave = async (payload: Partial<ProductRow>) => {
    if (!editing) return;
    setIsSaving(true);
    setError(null);
    try {
      const updatePayload: any = {
        name: payload.name,
        title: payload.name, // backend may use title
        price: payload.price,
        category: payload.category,
        inventory: payload.inventory,
        isActive: payload.isActive,
        description: payload.description,
      };
      await productAPI.update(editing.id, updatePayload);
      setRows((prev) => prev.map((r) => (r.id === editing.id ? { ...r, ...payload } as ProductRow : r)));
      setEditing(null);
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error('Update failed', e);
      setError('Failed to update product');
    } finally {
      setIsSaving(false);
    }
  };

  const onDelete = async () => {
    if (!deleting) return;
    setIsDeleting(true);
    setError(null);
    try {
      await productAPI.delete(deleting.id);
      setRows((prev) => prev.filter((r) => r.id !== deleting.id));
      setDeleting(null);
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error('Delete failed', e);
      console.error('Delete error response:', e.response?.data);
      const errorMsg = e.response?.data?.message || e.message || 'Failed to delete product';
      setError(`Delete failed: ${errorMsg}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // UI helpers
  const containerBg = isDarkMode
    ? 'bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-900'
    : 'bg-gradient-to-br from-pink-50 via-purple-50 to-fuchsia-50';
  const panelBg = isDarkMode
    ? 'bg-purple-900/40 border-purple-700/50'
    : 'bg-white/70 border-purple-200/70';
  const headerText = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-400' : 'text-slate-600';

  return (
    <div className={`min-h-screen ${containerBg}`}>
      {/* Top bar */}
      <div className="sticky top-0 z-30 backdrop-blur-xl bg-transparent/40 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.05 }} className="w-10 h-10 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25 flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </motion.div>
            <div>
              <h1 className={`text-xl font-bold ${headerText}`}>Manage Products</h1>
              <p className={`text-xs ${subText}`}>Create, update, and organize your catalog</p>
            </div>
          </div>
          <button
            aria-label="Toggle theme"
            onClick={() => setIsDarkMode((v) => !v)}
            className={`p-2 rounded-full border ${isDarkMode ? 'border-purple-700/50 text-yellow-300' : 'border-purple-200/70 text-purple-900'} backdrop-blur-xl`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls panel */}
        <div className={`rounded-2xl border ${panelBg} backdrop-blur-xl p-4 mb-6`}>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className={`flex items-center gap-2 rounded-xl border ${isDarkMode ? 'border-purple-700/50 bg-purple-900/30 text-purple-200' : 'border-purple-200/70 bg-white/80 text-purple-900'} px-3 py-2 flex-1`}> 
              <Search className="w-4 h-4" aria-hidden />
              <input
                aria-label="Search products"
                placeholder="Search by name, category, ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`bg-transparent outline-none w-full text-sm placeholder:${isDarkMode ? 'text-purple-300/60' : 'text-purple-900/50'}`}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Add Product</span>
            </motion.button>
          </div>
        </div>

        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              role="alert"
              className="mb-4 rounded-xl bg-rose-600/10 border border-rose-600/30 text-rose-700 px-4 py-3 flex items-center gap-2"
            >
              <AlertTriangle className="w-5 h-5" aria-hidden />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table panel */}
        <div className={`rounded-2xl border ${panelBg} backdrop-blur-xl overflow-hidden`}>
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <span className={`text-sm ${subText}`} aria-live="polite">
              {isLoading ? 'Loading products…' : `${filtered.length} product${filtered.length === 1 ? '' : 's'}`}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm" role="table">
              <caption className="sr-only">Products table showing name, category, price, inventory, status, and actions</caption>
              <thead>
                <tr className={`${isDarkMode ? 'bg-purple-950/40 text-purple-200' : 'bg-purple-50/80 text-purple-900'} text-xs uppercase tracking-wide`}>
                  <th scope="col" className="px-4 py-3 text-left">Product</th>
                  <th scope="col" className="px-4 py-3 text-left">Category</th>
                  <th scope="col" className="px-4 py-3 text-left">Price</th>
                  <th scope="col" className="px-4 py-3 text-left">Inventory</th>
                  <th scope="col" className="px-4 py-3 text-left">Status</th>
                  <th scope="col" className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`${isDarkMode ? 'divide-purple-800/50' : 'divide-purple-100/80'} divide-y`}>
                {isLoading && Array.from({ length: 6 }).map((_, i) => (
                  <tr key={`sk-${i}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-gradient-to-br from-purple-200 to-pink-200 animate-pulse" />
                        <div>
                          <div className="h-3 w-40 bg-purple-200/70 rounded animate-pulse" />
                          <div className="h-3 w-24 bg-purple-100/70 rounded mt-2 animate-pulse" />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><div className="h-3 w-24 bg-purple-200/70 rounded animate-pulse" /></td>
                    <td className="px-4 py-3"><div className="h-3 w-16 bg-purple-200/70 rounded animate-pulse" /></td>
                    <td className="px-4 py-3"><div className="h-3 w-10 bg-purple-200/70 rounded animate-pulse" /></td>
                    <td className="px-4 py-3"><div className="h-6 w-20 bg-purple-200/70 rounded-full animate-pulse" /></td>
                    <td className="px-4 py-3 text-right"><div className="h-8 w-24 ml-auto bg-purple-200/70 rounded-lg animate-pulse" /></td>
                  </tr>
                ))}

                {!isLoading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-slate-500">No products found</td>
                  </tr>
                )}

                {!isLoading && filtered.map((p) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={isDarkMode ? 'hover:bg-purple-900/30' : 'hover:bg-purple-50/60'}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-slate-100 overflow-hidden flex items-center justify-center" aria-hidden>
                          {p.image ? (
                            <img
                              src={p.image}
                              alt=""
                              width={40}
                              height={40}
                              className="w-10 h-10 object-cover"
                              onError={(ev) => { 
                                const img = ev.currentTarget as HTMLImageElement;
                                img.style.display = 'none';
                                if (img.parentElement) {
                                  img.parentElement.innerHTML = '<span class="text-lg" aria-hidden>🌾</span>';
                                }
                              }}
                            />
                          ) : (
                            <span className="text-lg" aria-hidden>🌾</span>
                          )}
                        </div>
                        <div>
                          <div className={`${headerText} font-medium`}>{p.name}</div>
                          <div className={`${subText}`}>ID: {p.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`${subText}`}>{p.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`${headerText} font-semibold`}>${p.price.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`${subText}`}>{p.inventory}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          p.isActive
                            ? 'bg-green-500/15 text-green-700 dark:text-green-300 border border-green-500/30'
                            : 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border border-slate-500/30'
                        }`}
                      >
                        {p.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setEditing(p)}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border ${isDarkMode ? 'border-purple-700/50 text-purple-200 hover:bg-purple-900/40' : 'border-purple-200/70 text-purple-900 hover:bg-purple-50'}`}
                          aria-label={`Edit ${p.name}`}
                        >
                          <Edit3 className="w-4 h-4" />
                          <span className="text-xs font-medium">Edit</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setDeleting(p)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-rose-300/60 text-rose-700 hover:bg-rose-50"
                          aria-label={`Delete ${p.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="text-xs font-medium">Delete</span>
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      <AnimatePresence>
        {editing && (
          <motion.div
            key="edit-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center"
            aria-modal
            role="dialog"
            aria-labelledby="edit-title"
          >
            <div className="absolute inset-0 bg-black/40" onClick={() => !isSaving && setEditing(null)} />
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              className={`relative w-full max-w-lg mx-4 rounded-2xl border ${panelBg} backdrop-blur-2xl`}
            >
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <h2 id="edit-title" className={`text-lg font-bold ${headerText}`}>Edit Product</h2>
                <button
                  className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-purple-900/40' : 'hover:bg-purple-50'}`}
                  onClick={() => !isSaving && setEditing(null)}
                  aria-label="Close edit dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget as HTMLFormElement & {
                    name: { value: string };
                    category: { value: string };
                    price: { value: string };
                    inventory: { value: string };
                    isActive: { checked: boolean };
                    description: { value: string };
                  };
                  onSave({
                    name: form.name.value,
                    category: form.category.value,
                    price: Number(form.price.value),
                    inventory: Number(form.inventory.value),
                    isActive: form.isActive.checked,
                    description: form.description.value,
                  });
                }}
              >
                <div className="p-5 space-y-4">
                  <div>
                    <label htmlFor="name" className={`block text-xs font-semibold mb-1 ${subText}`}>Name</label>
                    <input
                      id="name"
                      name="name"
                      defaultValue={editing.name}
                      required
                      className={`w-full rounded-xl border px-3 py-2 ${isDarkMode ? 'border-purple-700/50 bg-purple-900/30 text-purple-100' : 'border-purple-200/70 bg-white/80 text-purple-950'}`}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="category" className={`block text-xs font-semibold mb-1 ${subText}`}>Category</label>
                      <input
                        id="category"
                        name="category"
                        defaultValue={editing.category}
                        className={`w-full rounded-xl border px-3 py-2 ${isDarkMode ? 'border-purple-700/50 bg-purple-900/30 text-purple-100' : 'border-purple-200/70 bg-white/80 text-purple-950'}`}
                      />
                    </div>
                    <div>
                      <label htmlFor="price" className={`block text-xs font-semibold mb-1 ${subText}`}>Price</label>
                      <input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        defaultValue={editing.price}
                        required
                        className={`w-full rounded-xl border px-3 py-2 ${isDarkMode ? 'border-purple-700/50 bg-purple-900/30 text-purple-100' : 'border-purple-200/70 bg-white/80 text-purple-950'}`}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="inventory" className={`block text-xs font-semibold mb-1 ${subText}`}>Inventory</label>
                      <input
                        id="inventory"
                        name="inventory"
                        type="number"
                        step="1"
                        min="0"
                        defaultValue={editing.inventory}
                        required
                        className={`w-full rounded-xl border px-3 py-2 ${isDarkMode ? 'border-purple-700/50 bg-purple-900/30 text-purple-100' : 'border-purple-200/70 bg-white/80 text-purple-950'}`}
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-6">
                      <input id="isActive" name="isActive" type="checkbox" defaultChecked={editing.isActive} className="w-4 h-4" />
                      <label htmlFor="isActive" className={`text-sm ${subText}`}>Active</label>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="description" className={`block text-xs font-semibold mb-1 ${subText}`}>Description</label>
                    <textarea
                      id="description"
                      name="description"
                      defaultValue={editing.description}
                      rows={4}
                      className={`w-full rounded-xl border px-3 py-2 ${isDarkMode ? 'border-purple-700/50 bg-purple-900/30 text-purple-100' : 'border-purple-200/70 bg-white/80 text-purple-950'}`}
                    />
                  </div>
                </div>
                <div className="p-5 border-t border-white/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => !isSaving && setEditing(null)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${isDarkMode ? 'border-purple-700/50 text-purple-200 hover:bg-purple-900/40' : 'border-purple-200/70 text-purple-900 hover:bg-purple-50'}`}
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25 disabled:opacity-60"
                  >
                    <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Changes'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            key="add-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center"
            aria-modal
            role="dialog"
            aria-labelledby="add-title"
          >
            <div className="absolute inset-0 bg-black/40" onClick={() => !isAdding && setIsAddModalOpen(false)} />
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              className={`relative w-full max-w-lg mx-4 rounded-2xl border ${panelBg} backdrop-blur-2xl max-h-[90vh] overflow-y-auto`}
            >
              <div className="p-5 border-b border-white/10 flex items-center justify-between sticky top-0 bg-inherit z-10">
                <h2 id="add-title" className={`text-lg font-bold ${headerText}`}>Add New Product</h2>
                <button
                  className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-purple-900/40' : 'hover:bg-purple-50'}`}
                  onClick={() => !isAdding && setIsAddModalOpen(false)}
                  aria-label="Close add dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.currentTarget as HTMLFormElement & {
                    name: { value: string };
                    category: { value: string };
                    price: { value: string };
                    inventory: { value: string };
                    isActive: { checked: boolean };
                    description: { value: string };
                    marketplaceId: { value: string };
                  };
                  
                  setIsAdding(true);
                  setError(null);
                  try {
                    const newProduct = {
                      title: form.name.value,
                      description: form.description.value || 'No description provided',
                      category: form.category.value,
                      price: Number(form.price.value),
                      inventory: Number(form.inventory.value),
                      isActive: form.isActive.checked,
                      marketplaceId: form.marketplaceId.value,
                    };
                    
                    console.log('Sending product data:', newProduct);
                    const { data } = await productAPI.create(newProduct);
                    console.log('Created product response:', data);
                    const mapped = mapToRow(data);
                    setRows((prev) => [mapped, ...prev]);
                    setIsAddModalOpen(false);
                    form.reset();
                  } catch (e: any) {
                    console.error('Add failed', e);
                    console.error('Add error response:', e.response?.data);
                    const errorMsg = e.response?.data?.message || e.message || 'Failed to add product';
                    setError(`Add failed: ${errorMsg}`);
                  } finally {
                    setIsAdding(false);
                  }
                }}
              >
                <div className="p-5 space-y-4">
                  <div>
                    <label htmlFor="add-name" className={`block text-xs font-semibold mb-1 ${subText}`}>Product Name *</label>
                    <input
                      id="add-name"
                      name="name"
                      required
                      placeholder="e.g., Organic Tomatoes"
                      className={`w-full rounded-xl border px-3 py-2 ${isDarkMode ? 'border-purple-700/50 bg-purple-900/30 text-purple-100' : 'border-purple-200/70 bg-white/80 text-purple-950'}`}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="add-category" className={`block text-xs font-semibold mb-1 ${subText}`}>Category *</label>
                      <input
                        id="add-category"
                        name="category"
                        required
                        placeholder="e.g., Vegetables"
                        className={`w-full rounded-xl border px-3 py-2 ${isDarkMode ? 'border-purple-700/50 bg-purple-900/30 text-purple-100' : 'border-purple-200/70 bg-white/80 text-purple-950'}`}
                      />
                    </div>
                    <div>
                      <label htmlFor="add-price" className={`block text-xs font-semibold mb-1 ${subText}`}>Price *</label>
                      <input
                        id="add-price"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        placeholder="0.00"
                        className={`w-full rounded-xl border px-3 py-2 ${isDarkMode ? 'border-purple-700/50 bg-purple-900/30 text-purple-100' : 'border-purple-200/70 bg-white/80 text-purple-950'}`}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="add-inventory" className={`block text-xs font-semibold mb-1 ${subText}`}>Inventory *</label>
                      <input
                        id="add-inventory"
                        name="inventory"
                        type="number"
                        step="1"
                        min="0"
                        required
                        placeholder="0"
                        className={`w-full rounded-xl border px-3 py-2 ${isDarkMode ? 'border-purple-700/50 bg-purple-900/30 text-purple-100' : 'border-purple-200/70 bg-white/80 text-purple-950'}`}
                      />
                    </div>
                    <div>
                      <label htmlFor="add-marketplaceId" className={`block text-xs font-semibold mb-1 ${subText}`}>Marketplace ID *</label>
                      <input
                        id="add-marketplaceId"
                        name="marketplaceId"
                        required
                        defaultValue="68daf705ffef30bb1edac142"
                        placeholder="Enter marketplace ID"
                        className={`w-full rounded-xl border px-3 py-2 ${isDarkMode ? 'border-purple-700/50 bg-purple-900/30 text-purple-100' : 'border-purple-200/70 bg-white/80 text-purple-950'}`}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input id="add-isActive" name="isActive" type="checkbox" defaultChecked={true} className="w-4 h-4" />
                    <label htmlFor="add-isActive" className={`text-sm ${subText}`}>Active (visible to buyers)</label>
                  </div>
                  <div>
                    <label htmlFor="add-description" className={`block text-xs font-semibold mb-1 ${subText}`}>Description *</label>
                    <textarea
                      id="add-description"
                      name="description"
                      rows={4}
                      required
                      placeholder="Describe your product..."
                      className={`w-full rounded-xl border px-3 py-2 ${isDarkMode ? 'border-purple-700/50 bg-purple-900/30 text-purple-100' : 'border-purple-200/70 bg-white/80 text-purple-950'}`}
                    />
                  </div>
                </div>
                <div className="p-5 border-t border-white/10 flex items-center justify-end gap-3 sticky bottom-0 bg-inherit">
                  <button
                    type="button"
                    onClick={() => !isAdding && setIsAddModalOpen(false)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${isDarkMode ? 'border-purple-700/50 text-purple-200 hover:bg-purple-900/40' : 'border-purple-200/70 text-purple-900 hover:bg-purple-50'}`}
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isAdding}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25 disabled:opacity-60"
                  >
                    <Plus className="w-4 h-4" /> {isAdding ? 'Adding...' : 'Add Product'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleting && (
          <motion.div
            key="delete-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center"
            aria-modal
            role="dialog"
            aria-labelledby="delete-title"
          >
            <div className="absolute inset-0 bg-black/40" onClick={() => !isDeleting && setDeleting(null)} />
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              className={`relative w-full max-w-md mx-4 rounded-2xl border ${panelBg} backdrop-blur-2xl`}
            >
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <h2 id="delete-title" className={`text-lg font-bold ${headerText}`}>Delete Product</h2>
                <button
                  className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-purple-900/40' : 'hover:bg-purple-50'}`}
                  onClick={() => !isDeleting && setDeleting(null)}
                  aria-label="Close delete dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5">
                <p className={`${subText}`}>Are you sure you want to delete <span className="font-semibold">{deleting.name}</span>? This action cannot be undone.</p>
              </div>
              <div className="p-5 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => !isDeleting && setDeleting(null)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${isDarkMode ? 'border-purple-700/50 text-purple-200 hover:bg-purple-900/40' : 'border-purple-200/70 text-purple-900 hover:bg-purple-50'}`}
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onDelete}
                  disabled={isDeleting}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-lg shadow-rose-500/25 disabled:opacity-60"
                >
                  <Trash2 className="w-4 h-4" /> {isDeleting ? 'Deleting...' : 'Delete'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
