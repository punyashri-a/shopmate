import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Sparkles,
  Laptop,
  Smartphone,
  Headphones,
  Tv,
  Refrigerator,
  X,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { productService } from '../services/productService';
import ProductCard from '../components/products/ProductCard';
import Button from '../components/common/Button';

export const Home = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [priceFilter, setPriceFilter] = useState('all');

  const categories = [
    { id: 'all', label: 'All Products', icon: null },
    { id: 'laptops', label: 'Laptops', icon: Laptop },
    { id: 'home-appliances', label: 'Home Appliances', icon: Refrigerator },
    { id: 'smartphones', label: 'Smartphones', icon: Smartphone },
    { id: 'headphones', label: 'Audio', icon: Headphones },
    { id: 'monitors', label: 'Monitors', icon: Tv },
  ];

  // Fetch real products from Spring Boot backend / database
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (selectedCategory && selectedCategory !== 'all') {
        params.category = selectedCategory;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      if (priceFilter && priceFilter !== 'all') {
        params.priceFilter = priceFilter;
      }
      if (sortBy && sortBy !== 'featured') {
        params.sortBy = sortBy;
      }

      const response = await productService.getProducts(params);
      const data = Array.isArray(response) ? response : response?.content || response?.products || [];
      setProducts(data);
    } catch (err) {
      console.warn('Backend API request error:', err);
      setError(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery, priceFilter, sortBy]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('featured');
    setPriceFilter('all');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Sleek Modern Hero & Omnibar */}
      <section className="bg-gradient-to-b from-white via-white to-ivory-50/50 dark:from-charcoal-800 dark:via-charcoal-800 dark:to-charcoal-900/50 border border-taupe-200/80 dark:border-charcoal-700/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-charcoal-900 dark:text-white tracking-tight leading-tight">
            Discover Curated Gear & Appliances
          </h1>
        </div>

        {/* Modern Omnibar Search with integrated "Ask AI ✨" action */}
        <div className="max-w-2xl mx-auto">
          <div className="relative flex items-center p-1.5 rounded-2xl bg-white dark:bg-charcoal-900 border border-taupe-300 dark:border-charcoal-700 shadow-md focus-within:border-sage-500 focus-within:ring-2 focus-within:ring-sage-500/20 transition-all">
            <Search className="w-5 h-5 text-charcoal-400 ml-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products or ask AI (e.g. RTX 4050, Refrigerator, Pixel)..."
              className="flex-1 px-3 py-2 bg-transparent text-sm text-charcoal-900 dark:text-white placeholder:text-charcoal-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1.5 mr-1 text-charcoal-400 hover:text-charcoal-700 dark:hover:text-charcoal-200"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => {
                const q = searchQuery.trim() || 'Recommend a laptop with GPU for AI model training under ₹80,000';
                navigate(`/ai?q=${encodeURIComponent(q)}`);
              }}
              icon={Sparkles}
              className="text-xs px-3.5 py-2 rounded-xl shrink-0 font-semibold"
            >
              Ask AI
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Category Filter Pills */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-2 shrink-0">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all border ${
                    isSelected
                      ? 'bg-sage-600 text-white border-sage-700 shadow-sm shadow-sage-600/20'
                      : 'bg-white dark:bg-charcoal-800 text-charcoal-600 dark:text-charcoal-300 border-taupe-200/80 dark:border-charcoal-700 hover:border-taupe-300 dark:hover:border-charcoal-600'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Clear All */}
          {(searchQuery || selectedCategory !== 'all' || priceFilter !== 'all') && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-semibold text-terracotta-600 dark:text-terracotta-400 hover:underline shrink-0 flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Secondary Filter & Sort Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-charcoal-500 pt-2 pb-1 border-b border-taupe-200/80 dark:border-charcoal-700/80">
          <div>
            Showing <strong className="text-charcoal-900 dark:text-white font-bold">{products.length}</strong> products
            {selectedCategory !== 'all' && (
              <span> in <strong className="text-charcoal-900 dark:text-white capitalize">{selectedCategory.replace('-', ' ')}</strong></span>
            )}
            {searchQuery && (
              <span> matching "<strong className="text-charcoal-900 dark:text-white">{searchQuery}</strong>"</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Price quick filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-charcoal-400">Price:</span>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-charcoal-800 border border-taupe-200 dark:border-charcoal-700 text-charcoal-700 dark:text-charcoal-200 font-medium focus:outline-none text-xs"
              >
                <option value="all">All Prices</option>
                <option value="under-30k">Under ₹30,000</option>
                <option value="30k-70k">₹30,000 – ₹70,000</option>
                <option value="above-70k">Above ₹70,000</option>
              </select>
            </div>

            {/* Sort by */}
            <div className="flex items-center gap-1.5">
              <span className="text-charcoal-400">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-charcoal-800 border border-taupe-200 dark:border-charcoal-700 text-charcoal-700 dark:text-charcoal-200 font-medium focus:outline-none text-xs"
              >
                <option value="featured">Featured / Match</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Products Grid / Loading Skeletons / Backend Connection Status */}
      <section>
        {loading ? (
          // Loading Skeletons
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="rounded-2xl border border-taupe-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 p-4 space-y-4 animate-pulse"
              >
                <div className="aspect-[16/10] bg-taupe-200 dark:bg-charcoal-700 rounded-xl" />
                <div className="space-y-2">
                  <div className="h-3 w-1/4 bg-taupe-200 dark:bg-charcoal-700 rounded" />
                  <div className="h-4 w-3/4 bg-taupe-200 dark:bg-charcoal-700 rounded" />
                  <div className="h-5 w-1/3 bg-taupe-200 dark:bg-charcoal-700 rounded" />
                </div>
                <div className="pt-2 flex gap-2">
                  <div className="h-6 w-1/3 bg-taupe-100 dark:bg-charcoal-700 rounded-lg" />
                  <div className="h-6 w-1/3 bg-taupe-100 dark:bg-charcoal-700 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          // Production-Grade Service Error State
          <div className="p-8 sm:p-12 text-center bg-white dark:bg-charcoal-800 border border-taupe-200 dark:border-charcoal-700 rounded-3xl space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-ivory-100 dark:bg-charcoal-700 text-charcoal-500 dark:text-charcoal-300 mx-auto flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-sage-600 dark:text-sage-400" />
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-base sm:text-lg font-bold text-charcoal-900 dark:text-white">
                Unable to Load Products
              </h3>
              <p className="text-xs text-charcoal-600 dark:text-charcoal-300 leading-relaxed">
                We are currently experiencing difficulty retrieving product listings from our catalog services. Please verify your connection or try again.
              </p>
            </div>
            <div className="pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={loadProducts}
                icon={RefreshCw}
                className="text-xs font-semibold px-4 py-2"
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : products.length > 0 ? (
          // Real Products Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, idx) => (
              <ProductCard
                key={product.id || idx}
                product={product}
                rank={idx + 1}
              />
            ))}
          </div>
        ) : (
          // Empty State
          <div className="p-12 text-center bg-white dark:bg-charcoal-800 border border-taupe-200 dark:border-charcoal-700 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-ivory-100 dark:bg-charcoal-700 text-charcoal-400 mx-auto flex items-center justify-center">
              <Filter className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-charcoal-800 dark:text-white">
                No matching products found
              </h3>
              <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
                No products found matching your search or category filter in the database.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className="text-xs"
            >
              Reset All Filters
            </Button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
