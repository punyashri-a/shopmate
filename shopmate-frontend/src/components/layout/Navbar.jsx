import React from 'react';
import { NavLink } from 'react-router-dom';
import { Sparkles, ShoppingBag, Sun, Moon, Home as HomeIcon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 dark:bg-charcoal-900/90 backdrop-blur-md border-b border-taupe-200/80 dark:border-charcoal-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-sage-600 text-white flex items-center justify-center shadow-sm group-hover:bg-sage-700 transition-colors">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-base sm:text-lg text-charcoal-900 dark:text-white tracking-tight">
              ShopMate
            </span>
            <span className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sage-100 dark:bg-charcoal-800 text-sage-800 dark:text-sage-200 border border-sage-200/80 dark:border-charcoal-700">
              Store
            </span>
          </div>
        </NavLink>

        {/* Strictly Two Navigation Destinations: Home and AI Mode */}
        <nav className="flex items-center gap-1 bg-ivory-200/70 dark:bg-charcoal-800/80 p-1 rounded-2xl border border-taupe-200/70 dark:border-charcoal-700/80">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-white dark:bg-charcoal-900 text-charcoal-900 dark:text-white shadow-sm border border-taupe-200/60 dark:border-charcoal-700'
                  : 'text-charcoal-500 dark:text-charcoal-400 hover:text-charcoal-800 dark:hover:text-charcoal-200'
              }`
            }
          >
            <HomeIcon className="w-4 h-4" />
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/ai"
            className={({ isActive }) =>
              `flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-sage-600 text-white shadow-sm shadow-sage-600/20'
                  : 'text-charcoal-500 dark:text-charcoal-400 hover:text-charcoal-800 dark:hover:text-charcoal-200'
              }`
            }
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Mode</span>
          </NavLink>
        </nav>

        {/* Right: Theme Switcher */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-charcoal-600 dark:text-charcoal-300 hover:bg-ivory-200 dark:hover:bg-charcoal-800 border border-transparent hover:border-taupe-200 dark:hover:border-charcoal-700 transition-colors"
            aria-label={isDark ? 'Switch to Light' : 'Switch to Dark'}
          >
            {isDark ? (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-charcoal-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
