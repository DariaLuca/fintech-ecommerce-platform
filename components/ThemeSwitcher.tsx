import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Palette, Coffee, ChevronDown } from 'lucide-react';

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!mounted) return null;

  const currentIcon = () => {
    switch(theme) {
      case 'dark': return <Moon size={18} className="text-blue-600" />;
      case 'pastel': return <Palette size={18} className="text-blue-600" />;
      case 'cappuccino': return <Coffee size={18} className="text-blue-600" />;
      case 'light':
      default: return <Sun size={18} className="text-blue-600" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full border border-card-border bg-card-bg hover:bg-gray-50 transition-colors flex items-center justify-center shadow-sm"
        aria-label="Theme menu"
      >
        {currentIcon()}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-card-bg border border-card-border rounded-xl shadow-lg py-2 z-50">
          <button onClick={() => { setTheme('light'); setIsOpen(false); }} className="w-full text-left px-4 py-2 hover:opacity-80 flex items-center space-x-3 text-sm">
             <Sun size={16} className={theme === 'light' ? 'text-blue-600' : 'text-foreground'} />
             <span className={theme === 'light' ? 'text-blue-600 font-medium' : 'text-foreground font-medium'}>Light</span>
          </button>
          
          <button onClick={() => { setTheme('dark'); setIsOpen(false); }} className="w-full text-left px-4 py-2 hover:opacity-80 flex items-center space-x-3 text-sm">
             <Moon size={16} className={theme === 'dark' ? 'text-blue-600' : 'text-foreground'} />
             <span className={theme === 'dark' ? 'text-blue-600 font-medium' : 'text-foreground font-medium'}>Dark</span>
          </button>

          <button onClick={() => { setTheme('pastel'); setIsOpen(false); }} className="w-full text-left px-4 py-2 hover:opacity-80 flex items-center space-x-3 text-sm">
             <Palette size={16} className={theme === 'pastel' ? 'text-blue-600' : 'text-foreground'} />
             <span className={theme === 'pastel' ? 'text-blue-600 font-medium' : 'text-foreground font-medium'}>Powder Pink</span>
          </button>

          <button onClick={() => { setTheme('cappuccino'); setIsOpen(false); }} className="w-full text-left px-4 py-2 hover:opacity-80 flex items-center space-x-3 text-sm">
             <Coffee size={16} className={theme === 'cappuccino' ? 'text-blue-600' : 'text-foreground'} />
             <span className={theme === 'cappuccino' ? 'text-blue-600 font-medium' : 'text-foreground font-medium'}>Cappuccino</span>
          </button>
        </div>
      )}
    </div>
  );
}
