
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { categoryAPI, Category } from "@/api/categories";

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [editData, setEditData] = useState({ name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryAPI.getAdminCategories();
      if (response.success) {
        setCategories(response.data || []);
      } else {
        throw new Error(response.message || 'Failed to fetch categories');
      }
    } catch (error: any) {
      console.error('Fetch categories error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch categories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory.name.trim() || !newCategory.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in both name and description",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const response = await categoryAPI.createCategory(newCategory);
      if (response.success) {
        setCategories([...categories, response.data!]);
        setNewCategory({ name: '', description: '' });
        toast({
          title: "Success",
          description: "Category created successfully",
        });
      } else {
        throw new Error(response.message || 'Failed to create category');
      }
    } catch (error: any) {
      console.error('Create category error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create category",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateCategory = async (id: string) => {
    if (!editData.name.trim() || !editData.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in both name and description",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const response = await categoryAPI.updateCategory(id, editData);
      if (response.success) {
        setCategories(categories.map(cat => 
          cat._id === id ? response.data! : cat
        ));
        setEditingId(null);
        toast({
          title: "Success",
          description: "Category updated successfully",
        });
      } else {
        throw new Error(response.message || 'Failed to update category');
      }
    } catch (error: any) {
      console.error('Update category error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update category",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    try {
      setSubmitting(true);
      const response = await categoryAPI.deleteCategory(id);
      if (response.success) {
        setCategories(categories.filter(cat => cat._id !== id));
        toast({
          title: "Success",
          description: "Category deleted successfully",
        });
      } else {
        throw new Error(response.message || 'Failed to delete category');
      }
    } catch (error: any) {
      console.error('Delete category error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete category",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (category: Category) => {
    setEditingId(category._id);
    setEditData({ name: category.name, description: category.description });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ name: '', description: '' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Categories</h1>
        <Badge variant="outline">{categories.length} Categories</Badge>
      </div>

      {/* Add New Category */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Category</CardTitle>
          <CardDescription>Create categories for freelancers to list their services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Category name (e.g., Video Editing, App Development)"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              disabled={submitting}
            />
            <Input
              placeholder="Description"
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              disabled={submitting}
            />
            <Button 
              onClick={handleCreateCategory} 
              disabled={!newCategory.name.trim() || !newCategory.description.trim() || submitting}
            >
              <Plus className="h-4 w-4 mr-2" />
              {submitting ? 'Adding...' : 'Add'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Categories List */}
      <Card>
        <CardHeader>
          <CardTitle>Categories ({categories.length})</CardTitle>
          <CardDescription>Manage your service categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                {editingId === category._id ? (
                  <div className="flex gap-2 flex-1">
                    <Input
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      disabled={submitting}
                    />
                    <Input
                      value={editData.description}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      disabled={submitting}
                    />
                    <Button 
                      size="sm" 
                      onClick={() => handleUpdateCategory(category._id)}
                      disabled={submitting}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={cancelEdit}
                      disabled={submitting}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <h3 className="font-medium">{category.name}</h3>
                      <p className="text-sm text-gray-600">{category.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {category.servicesCount} services
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">
                          Created {new Date(category.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={category.isActive ? "default" : "secondary"}>
                        {category.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => startEdit(category)}
                        disabled={submitting}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDeleteCategory(category._id)}
                        disabled={submitting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
            {categories.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No categories yet. Create your first category above.</p>
                <p className="text-sm text-gray-400">Categories help organize services and make them easier to find.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCategories;
