import { useQuery } from "@tanstack/react-query";
import type { MenuCategory, MenuItem } from "@shared/schema";

export function SimpleMenu() {
  const { data: categories, isLoading: categoriesLoading } = useQuery<MenuCategory[]>({
    queryKey: ["/api/menu/categories"],
  });

  const { data: items, isLoading: itemsLoading } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu/items"],
  });

  if (categoriesLoading || itemsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Menü yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  const itemsByCategory = items?.reduce((acc, item) => {
    if (!acc[item.categoryId]) {
      acc[item.categoryId] = [];
    }
    acc[item.categoryId].push(item);
    return acc;
  }, {} as Record<number, MenuItem[]>);

  return (
    <div className="min-h-screen" style={{ background: 'var(--datca-white)' }}>
      {/* Navigation Bar */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-blue-50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 datca-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <h1 className="text-xl font-semibold" style={{ color: 'var(--datca-text-blue)' }}>Datça Café</h1>
            </div>
          </div>
        </div>
      </nav>

      {/* Category Quick Navigation */}
      <div className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-blue-100 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-1">
            {/* Navigation indicator */}
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
            
            {categories?.map((category) => {
              const categoryItems = itemsByCategory?.[category.id] || [];
              if (categoryItems.length === 0) return null;
              
              // Category icon mapping
              const getIconForCategory = (categoryName: string) => {
                const name = categoryName.toLowerCase();
                if (name.includes('kahve')) return '☕';
                if (name.includes('tost')) return '🥪';
                if (name.includes('gözleme')) return '🫓';
                if (name.includes('kahvaltı')) return '🍳';
                if (name.includes('salata') || name.includes('atıştırmalık')) return '🥗';
                if (name.includes('ekmek') || name.includes('sandviç')) return '🥙';
                if (name.includes('porsiyon')) return '🍽️';
                if (name.includes('tatlı')) return '🧁';
                if (name.includes('soğuk')) return '🧊';
                if (name.includes('sıcak') || name.includes('içecek')) return '🍵';
                return '🍴';
              };
              
              return (
                <a
                  key={category.id}
                  href={`#category-${category.id}`}
                  className="group inline-flex items-center gap-2.5 px-4 py-2.5 bg-gradient-to-r from-slate-50 to-gray-50 hover:from-blue-50 hover:to-indigo-50 text-gray-700 hover:text-blue-700 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap border border-gray-200/50 hover:border-blue-300/50 hover:shadow-md transform hover:-translate-y-0.5"
                >
                  <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                    {getIconForCategory(category.name)}
                  </span>
                  <span className="font-semibold">{category.name}</span>
                  <div className="flex items-center justify-center min-w-[24px] h-6 bg-white/80 group-hover:bg-blue-100 text-gray-600 group-hover:text-blue-700 px-2 rounded-full text-xs font-bold shadow-sm transition-colors">
                    {categoryItems.length}
                  </div>
                </a>
              );
            })}
            
            {/* Scroll indicator */}
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>



      {/* Menu Content */}
      <main id="menu" className="max-w-6xl mx-auto px-4 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {categories?.map((category) => {
            const categoryItems = itemsByCategory?.[category.id] || [];
            
            if (categoryItems.length === 0) return null;

            return (
              <div id={`category-${category.id}`} key={category.id} className="bg-white rounded-2xl border border-blue-50 hover:border-blue-100 transition-all duration-300 overflow-hidden datca-hover scroll-mt-32">
                <div className="datca-soft p-6 border-b border-blue-50">
                  <h3 className="text-xl font-medium text-center" style={{ color: 'var(--datca-text-blue)' }}>{category.name}</h3>
                </div>
                
                <div className="p-6 space-y-4">
                  {categoryItems.map((item) => (
                    <div key={item.id} className="group border border-blue-50 rounded-xl p-4 hover:bg-blue-25 hover:border-blue-100 transition-all duration-300">
                      <div className="flex items-start space-x-4">
                        {/* Image */}
                        <div className="flex-shrink-0">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-16 h-16 rounded-xl object-cover shadow-sm group-hover:shadow-md transition-shadow border border-blue-50"
                            />
                          ) : (
                            <div className="w-16 h-16 datca-sea-subtle rounded-xl flex items-center justify-center border border-blue-50">
                              <span className="text-2xl">🍽️</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm leading-tight mb-3" style={{ color: 'var(--datca-text-blue)' }}>
                            {item.name}
                          </h4>
                          <div className="flex items-center justify-between">
                            <div className="datca-accent text-white px-3 py-1 rounded-full text-sm font-medium">
                              {item.price === '0' ? 'Fiyat sorulur' : `${item.price} ₺`}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 transform hover:scale-110 active:scale-95"
        aria-label="Sayfanın üstüne çık"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>

      {/* Footer */}
      <footer className="datca-sea-subtle border-t border-blue-50 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 datca-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
          </div>
          <h3 className="text-xl font-light mb-2" style={{ color: 'var(--datca-text-blue)' }}>Datça Café</h3>
          <p className="mb-6" style={{ color: 'var(--datca-gray)' }}>Ege'nin lezzetleri burada</p>
          <p className="text-sm" style={{ color: 'var(--datca-gray)' }}>© 2025 Datça Café. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}