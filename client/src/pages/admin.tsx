import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Edit, Trash2, Package, FolderOpen } from "lucide-react";
import type { MenuCategory, MenuItem, InsertMenuCategory, InsertMenuItem } from "@shared/schema";
import { ImageUpload } from "@/components/image-upload";

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [categoryImage, setCategoryImage] = useState<string>("");
  const [itemImage, setItemImage] = useState<string>("");

  const { data: categories, isLoading: categoriesLoading } = useQuery<MenuCategory[]>({
    queryKey: ["/api/menu/categories"],
  });

  const { data: items, isLoading: itemsLoading } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu/items"],
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data: InsertMenuCategory) => {
      const res = await apiRequest("POST", "/api/admin/categories", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu/categories"] });
      setIsAddingCategory(false);
      setCategoryImage("");
      toast({
        title: "Başarılı",
        description: "Kategori eklendi",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: "Kategori eklenirken bir hata oluştu",
        variant: "destructive",
      });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertMenuCategory> }) => {
      const res = await apiRequest("PUT", `/api/admin/categories/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu/categories"] });
      setEditingCategory(null);
      setCategoryImage("");
      toast({
        title: "Başarılı",
        description: "Kategori güncellendi",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: "Kategori güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/admin/categories/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu/categories"] });
      toast({
        title: "Başarılı",
        description: "Kategori silindi",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: "Kategori silinirken bir hata oluştu",
        variant: "destructive",
      });
    },
  });

  const createItemMutation = useMutation({
    mutationFn: async (data: InsertMenuItem) => {
      const res = await apiRequest("POST", "/api/admin/items", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu/items"] });
      setIsAddingItem(false);
      setItemImage("");
      toast({
        title: "Başarılı",
        description: "Ürün eklendi",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: "Ürün eklenirken bir hata oluştu",
        variant: "destructive",
      });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertMenuItem> }) => {
      const res = await apiRequest("PUT", `/api/admin/items/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu/items"] });
      setEditingItem(null);
      setItemImage("");
      toast({
        title: "Başarılı",
        description: "Ürün güncellendi",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: "Ürün güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/admin/items/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu/items"] });
      toast({
        title: "Başarılı",
        description: "Ürün silindi",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: "Ürün silinirken bir hata oluştu",
        variant: "destructive",
      });
    },
  });

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get("name") as string,
      nameEn: null,
      color: null,
      image: categoryImage || null,
      sortOrder: parseInt(formData.get("sortOrder") as string),
    };

    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory.id, data });
    } else {
      createCategoryMutation.mutate(data);
    }
  };

  const handleItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string || null,
      price: formData.get("price") as string,
      categoryId: parseInt(formData.get("categoryId") as string),
      iconName: null,
      image: itemImage || null,
      sortOrder: parseInt(formData.get("sortOrder") as string),
    };

    if (editingItem) {
      updateItemMutation.mutate({ id: editingItem.id, data });
    } else {
      createItemMutation.mutate(data);
    }
  };

  if (categoriesLoading || itemsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Yönetici Paneli</h1>
          <p className="text-gray-600">Menü kategorilerini ve ürünleri yönetin</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Menü Yönetimi</h2>
          <div className="flex gap-3">
            <Button 
              variant="secondary" 
              onClick={() => window.open('/', '_blank')}
              className="flex items-center gap-2"
            >
              <Package className="h-4 w-4" />
              Menüyü Görüntüle
            </Button>
            
            <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Kategori Ekle
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Yeni Kategori Ekle</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Kategori Adı</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div>
                    <Label>Kategori Resmi</Label>
                    <ImageUpload
                      currentImage={categoryImage}
                      onImageChange={setCategoryImage}
                      onRemove={() => setCategoryImage("")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sortOrder">Sıralama</Label>
                    <Input id="sortOrder" name="sortOrder" type="number" required />
                  </div>
                  <Button type="submit" className="w-full">
                    Kaydet
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ürün Ekle
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Yeni Ürün Ekle</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleItemSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Ürün Adı</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div>
                    <Label htmlFor="description">Açıklama</Label>
                    <Textarea id="description" name="description" />
                  </div>
                  <div>
                    <Label htmlFor="price">Fiyat</Label>
                    <Input id="price" name="price" required />
                  </div>
                  <div>
                    <Label htmlFor="categoryId">Kategori</Label>
                    <Select name="categoryId" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Kategori seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((category: MenuCategory) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Ürün Resmi</Label>
                    <ImageUpload
                      currentImage={itemImage}
                      onImageChange={setItemImage}
                      onRemove={() => setItemImage("")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sortOrder">Sıralama</Label>
                    <Input id="sortOrder" name="sortOrder" type="number" required />
                  </div>
                  <Button type="submit" className="w-full">
                    Kaydet
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="space-y-6">
          {categories?.sort((a, b) => a.sortOrder - b.sortOrder).map((category: MenuCategory) => {
            const categoryItems = items?.filter((item: MenuItem) => item.categoryId === category.id)
              .sort((a, b) => a.sortOrder - b.sortOrder) || [];
            
            return (
              <Card key={category.id}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-xl">{category.name}</CardTitle>
                      <Badge variant="outline" className="text-sm">
                        {categoryItems.length} ürün
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Sıra: {category.sortOrder}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Dialog open={editingCategory?.id === category.id} onOpenChange={(open) => !open && setEditingCategory(null)}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingCategory(category);
                              setCategoryImage(category.image || "");
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Kategoriyi Düzenle</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleCategorySubmit} className="space-y-4">
                            <div>
                              <Label htmlFor="name">Kategori Adı</Label>
                              <Input id="name" name="name" defaultValue={category.name} required />
                            </div>
                            <div>
                              <Label>Kategori Resmi</Label>
                              <ImageUpload
                                currentImage={editingCategory?.image || ""}
                                onImageChange={setCategoryImage}
                                onRemove={() => setCategoryImage("")}
                              />
                            </div>
                            <div>
                              <Label htmlFor="sortOrder">Sıralama</Label>
                              <Input id="sortOrder" name="sortOrder" type="number" defaultValue={category.sortOrder} required />
                            </div>
                            <Button type="submit" className="w-full">
                              Güncelle
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteCategoryMutation.mutate(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {categoryItems.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Bu kategoride henüz ürün bulunmuyor.</p>
                      <p className="text-sm">Yukarıdaki "Ürün Ekle" butonunu kullanarak ürün ekleyebilirsiniz.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categoryItems.map((item: MenuItem) => (
                        <Card key={item.id} className="p-4 border-l-4 border-l-blue-500">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-sm mb-1">{item.name}</h3>
                              {item.description && (
                                <p className="text-xs text-gray-600 mb-2">{item.description}</p>
                              )}
                            </div>
                            <Badge variant="secondary" className="ml-2">{item.price} TL</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Sıra: {item.sortOrder}</span>
                            <div className="flex gap-1">
                              <Dialog open={editingItem?.id === item.id} onOpenChange={(open) => !open && setEditingItem(null)}>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setEditingItem(item);
                                      setItemImage(item.image || "");
                                    }}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Ürünü Düzenle</DialogTitle>
                                  </DialogHeader>
                                  <form onSubmit={handleItemSubmit} className="space-y-4">
                                    <div>
                                      <Label htmlFor="name">Ürün Adı</Label>
                                      <Input id="name" name="name" defaultValue={item.name} required />
                                    </div>
                                    <div>
                                      <Label htmlFor="description">Açıklama</Label>
                                      <Textarea id="description" name="description" defaultValue={item.description || ""} />
                                    </div>
                                    <div>
                                      <Label htmlFor="price">Fiyat</Label>
                                      <Input id="price" name="price" defaultValue={item.price} required />
                                    </div>
                                    <div>
                                      <Label htmlFor="categoryId">Kategori</Label>
                                      <Select name="categoryId" defaultValue={item.categoryId.toString()} required>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Kategori seçin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {categories?.map((category: MenuCategory) => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                              {category.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label>Ürün Resmi</Label>
                                      <ImageUpload
                                        currentImage={editingItem?.image || ""}
                                        onImageChange={setItemImage}
                                        onRemove={() => setItemImage("")}
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="sortOrder">Sıralama</Label>
                                      <Input id="sortOrder" name="sortOrder" type="number" defaultValue={item.sortOrder} required />
                                    </div>
                                    <Button type="submit" className="w-full">
                                      Güncelle
                                    </Button>
                                  </form>
                                </DialogContent>
                              </Dialog>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteItemMutation.mutate(item.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}