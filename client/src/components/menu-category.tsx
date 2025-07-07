import { useQuery } from "@tanstack/react-query";
import { MenuItem } from "./menu-item";
import type { MenuCategory, MenuItem as MenuItemType } from "@shared/schema";

interface MenuCategoryProps {
  category: MenuCategory;
}

export function MenuCategoryComponent({ category }: MenuCategoryProps) {
  const { data: items, isLoading, error } = useQuery<MenuItemType[]>({
    queryKey: ["/api/menu/categories", category.id, "items"],
  });

  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="flex items-center mb-6">
          <div className={`w-1 h-8 menu-category-${category.color} rounded-full mr-4`}></div>
          <h2 className="text-xl font-semibold text-gray-800">{category.name}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 animate-pulse">
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
    );
  }

  if (error) {
    return (
      <section className="mb-12">
        <div className="flex items-center mb-6">
          <div className={`w-1 h-8 menu-category-${category.color} rounded-full mr-4`}></div>
          <h2 className="text-xl font-semibold text-gray-800">{category.name}</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-red-500">Bu kategori için menü yüklenirken bir hata oluştu.</p>
        </div>
      </section>
    );
  }

  if (!items || items.length === 0) {
    return (
      <section className="mb-12">
        <div className="flex items-center mb-6">
          <div className={`w-1 h-8 menu-category-${category.color} rounded-full mr-4`}></div>
          <h2 className="text-xl font-semibold text-gray-800">{category.name}</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">Bu kategoride henüz ürün bulunmamaktadır.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12" data-category={category.nameEn}>
      <div className="flex items-center mb-6">
        <div className={`w-1 h-8 menu-category-${category.color} rounded-full mr-4`}></div>
        <h2 className="text-xl font-semibold text-gray-800">{category.name}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <MenuItem key={item.id} item={item} categoryColor={category.color || "blue"} />
        ))}
      </div>
    </section>
  );
}
