import React, { useState } from 'react';
import { formatCurrency } from '../../utils/formatters';
import { useShopping } from '../../context/ShoppingContext';

export const ProductCard = ({ product, rank = 1 }) => {
  const { openProductModal } = useShopping();
  const [imgSrc, setImgSrc] = useState(product.image);

  const handleImageError = () => {
    setImgSrc(
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80'
    );
  };

  // Extract only the top 3 important specifications
  const getTopSpecs = () => {
    const specs = [];
    if (product.hasDedicatedGpu || product.gpuModel) {
      const gpu = product.gpuModel || product.specs?.graphics || '';
      specs.push({ label: 'GPU', value: gpu.split('(')[0].trim() });
    }
    if (product.specs?.processor) {
      specs.push({ label: 'CPU', value: product.specs.processor.split('(')[0].trim() });
    }
    if (product.specs?.ram) {
      const mem = product.specs.ram.split('(')[0].trim();
      const st = product.specs?.storage ? ` • ${product.specs.storage.split(' ')[0]}` : '';
      specs.push({ label: 'Memory', value: `${mem}${st}` });
    }
    if (product.specs?.capacity) {
      specs.push({ label: 'Capacity', value: product.specs.capacity.split('(')[0].trim() });
    }
    if (product.specs?.energyRating) {
      specs.push({ label: 'Efficiency', value: product.specs.energyRating.split('(')[0].trim() });
    }
    if (product.specs?.motor || product.specs?.power || product.specs?.compressor || product.specs?.suctionPower) {
      const val = product.specs.motor || product.specs.power || product.specs.compressor || product.specs.suctionPower;
      specs.push({ label: 'Power', value: val.split('(')[0].trim() });
    }
    if (product.specs?.display) {
      specs.push({ label: 'Display', value: product.specs.display.split(',')[0].trim() });
    } else if (product.specs?.battery) {
      specs.push({ label: 'Battery', value: product.specs.battery.split(',')[0].trim() });
    }
    return specs.slice(0, 3);
  };

  const topSpecs = getTopSpecs();

  return (
    <div
      onClick={() => openProductModal(product)}
      className="card-warm overflow-hidden flex flex-col bg-white dark:bg-charcoal-800 border border-taupe-200/90 dark:border-charcoal-700/80 rounded-2xl shadow-sm hover:shadow-lg hover:border-sage-400 dark:hover:border-sage-600 transition-all duration-200 cursor-pointer h-full group"
    >
      {/* 1. TOP: Clean Product Image */}
      <div className="relative aspect-[16/10] bg-ivory-100 dark:bg-charcoal-900/60 overflow-hidden shrink-0">
        <img
          src={imgSrc}
          alt={product.name}
          onError={handleImageError}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badge in corner if present */}
        {product.badge && (
          <div className="absolute top-3 left-3">
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/95 dark:bg-charcoal-900/95 text-sage-800 dark:text-sage-300 shadow-sm border border-taupe-200/60 dark:border-charcoal-700/60">
              {product.badge}
            </span>
          </div>
        )}

        {/* Match Score */}
        {product.matchScore && (
          <div className="absolute top-3 right-3">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-sage-600 text-white shadow-sm">
              {product.matchScore}% Match
            </span>
          </div>
        )}
      </div>

      {/* 2. Brand, Product Name, Price, and Specs (No action buttons on card) */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-charcoal-400 font-semibold mb-0.5">
              {product.brand}
            </div>
            <h3 className="text-base font-bold text-charcoal-800 dark:text-charcoal-100 group-hover:text-sage-700 dark:group-hover:text-sage-300 transition-colors leading-snug">
              {product.name}
            </h3>
          </div>

          {/* Price Row */}
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-charcoal-900 dark:text-white tracking-tight">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-charcoal-400 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Specifications */}
          {topSpecs.length > 0 && (
            <div className="pt-2 border-t border-taupe-100 dark:border-charcoal-700/50 space-y-1 text-xs text-charcoal-600 dark:text-charcoal-300">
              {topSpecs.map((spec, i) => (
                <div key={i} className="flex items-baseline gap-2">
                  <span className="text-charcoal-400 font-medium w-16 shrink-0 text-[11px]">
                    {spec.label}:
                  </span>
                  <span className="text-charcoal-700 dark:text-charcoal-200 truncate">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Click indicator */}
        <div className="pt-2 text-[11px] font-semibold text-sage-700 dark:text-sage-400 group-hover:underline flex items-center justify-end">
          View full details →
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
