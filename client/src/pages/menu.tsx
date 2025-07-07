import { useQuery } from "@tanstack/react-query";
import { MenuHeader } from "@/components/menu-header";
import { MenuCategoryComponent } from "@/components/menu-category";
import type { MenuCategory } from "@shared/schema";

export default function Menu() {
  const { data: categories, isLoading, error } = useQuery<MenuCategory[]>({
    queryKey: ["/api/menu/categories"],
  });

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <MenuHeader />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="space-y-12">
            {Array.from({ length: 10 }).map((_, index) => (
              <section key={index} className="mb-12">
                <div className="flex items-center mb-6">
                  <div className="w-1 h-8 bg-gray-300 rounded-full mr-4 animate-pulse"></div>
                  <div className="h-6 bg-gray-300 rounded w-48 animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, itemIndex) => (
                    <div key={itemIndex} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 animate-pulse">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                            <div className="h-4 bg-gray-200 rounded w-12"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <MenuHeader />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Menü Yüklenirken Hata Oluştu</h2>
            <p className="text-gray-600 mb-8">Lütfen sayfayı yenilemeyi deneyin.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Sayfayı Yenile
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <MenuHeader />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Menü Bulunamadı</h2>
            <p className="text-gray-600">Şu anda görüntülenecek menü kategorisi bulunmamaktadır.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <MenuHeader />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {categories.map((category) => (
          <MenuCategoryComponent key={category.id} category={category} />
        ))}
      </main>
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm">Afiyet olsun! | Café Menü © 2024</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
