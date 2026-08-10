import React from 'react';
import { useApp } from '../../context/AppContext';
import { SITE_CONFIG, CATEGORIES, TOOLS } from '../../config/site';
import { Wrench, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                {SITE_CONFIG.name}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {SITE_CONFIG.description}
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs font-semibold text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>100% Client-Side Privacy — Files Never Leave Your Browser</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => navigate(`/category/${cat.id}`)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => navigate('/categories')}
                  className="text-blue-400 hover:text-blue-300 font-semibold"
                >
                  View All Categories →
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Tools */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Popular Tools
            </h4>
            <ul className="space-y-2 text-xs">
              {TOOLS.filter((t) => t.popular).slice(0, 5).map((tool) => (
                <li key={tool.id}>
                  <button
                    onClick={() => navigate(tool.slug)}
                    className="text-slate-400 hover:text-white transition-colors text-left line-clamp-1"
                  >
                    {tool.title}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => navigate('/all-tools')}
                  className="text-blue-400 hover:text-blue-300 font-semibold"
                >
                  Explore 10 Free Tools →
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Navigation */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Company & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('/about')} className="text-slate-400 hover:text-white transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="text-slate-400 hover:text-white transition-colors">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/privacy-policy')} className="text-slate-400 hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/terms-of-service')} className="text-slate-400 hover:text-white transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/disclaimer')} className="text-slate-400 hover:text-white transition-colors">
                  Disclaimer
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/sitemap')} className="text-slate-400 hover:text-white transition-colors">
                  HTML Sitemap
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {SITE_CONFIG.fullName}. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built for speed, privacy, and simplicity</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};
