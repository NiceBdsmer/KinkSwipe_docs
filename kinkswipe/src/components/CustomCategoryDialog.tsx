import { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { Trash2, Plus } from 'lucide-react';
import type { CustomCategory } from '../types';

interface CustomCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (category: CustomCategory) => void;
  initialCategory?: CustomCategory;
}

interface ActivityFormData {
  id: string;
  text: string;
  desc: string;
  edge: boolean;
}

export function CustomCategoryDialog({
  open,
  onOpenChange,
  onSave,
  initialCategory
}: CustomCategoryDialogProps) {
  const [categoryName, setCategoryName] = useState(initialCategory?.name ?? '');
  const [activities, setActivities] = useState<ActivityFormData[]>(
    initialCategory?.activities.map(a => ({
      id: a.id,
      text: a.text,
      desc: a.desc ?? '',
      edge: a.edge ?? false
    })) ?? []
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const generateId = () => `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const handleAddActivity = () => {
    const newActivity: ActivityFormData = {
      id: generateId(),
      text: '',
      desc: '',
      edge: false
    };
    setActivities([...activities, newActivity]);
  };

  const handleUpdateActivity = (id: string, field: keyof ActivityFormData, value: string | boolean) => {
    setActivities(activities.map(a =>
      a.id === id ? { ...a, [field]: value } : a
    ));
  };

  const handleRemoveActivity = (id: string) => {
    setActivities(activities.filter(a => a.id !== id));
  };

  const handleSave = () => {
    const newErrors: Record<string, string> = {};

    if (!categoryName.trim()) {
      newErrors.categoryName = 'Category name is required';
    }

    if (activities.length === 0) {
      newErrors.activities = 'Category must have at least one activity';
    }

    activities.forEach((activity, index) => {
      if (!activity.text.trim()) {
        newErrors[`activity-${index}`] = 'Activity name is required';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const customCategory: CustomCategory = {
      id: initialCategory?.id ?? generateId(),
      name: categoryName.trim(),
      activities: activities.map(a => ({
        id: a.id,
        text: a.text.trim(),
        desc: a.desc.trim() || undefined,
        edge: a.edge
      }))
    };

    onSave(customCategory);
    handleClose();
  };

  const handleClose = () => {
    setCategoryName(initialCategory?.name ?? '');
    setActivities(
      initialCategory?.activities.map(a => ({
        id: a.id,
        text: a.text,
        desc: a.desc ?? '',
        edge: a.edge ?? false
      })) ?? []
    );
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialCategory ? 'Edit Custom Category' : 'Add Custom Category'}</DialogTitle>
          <DialogDescription>
            Create your own category with activities that reflect your preferences.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label htmlFor="category-name" className="text-sm font-medium">
              Category Name *
            </label>
            <input
              id="category-name"
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="e.g., My Favorites"
            />
            {errors.categoryName && (
              <p className="text-sm text-destructive">{errors.categoryName}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                Activities *
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddActivity}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Activity
              </Button>
            </div>

            {errors.activities && (
              <p className="text-sm text-destructive">{errors.activities}</p>
            )}

            <div className="space-y-3">
              {activities.map((activity, index) => (
                <div key={activity.id} className="border border-border rounded-md p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={activity.text}
                        onChange={(e) => handleUpdateActivity(activity.id, 'text', e.target.value)}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Activity name *"
                      />
                      {errors[`activity-${index}`] && (
                        <p className="text-sm text-destructive">{errors[`activity-${index}`]}</p>
                      )}

                      <textarea
                        value={activity.desc}
                        onChange={(e) => handleUpdateActivity(activity.id, 'desc', e.target.value)}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                        rows={2}
                        placeholder="Description (optional)"
                      />
                    </div>

                    <div className="flex flex-col items-center gap-4 pt-1">
                      <label className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={activity.edge}
                          onCheckedChange={(checked) =>
                            handleUpdateActivity(activity.id, 'edge', checked === true)
                          }
                        />
                        Edge
                      </label>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveActivity(activity.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {activities.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No activities yet. Click "Add Activity" to create one.
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {initialCategory ? 'Save Changes' : 'Create Category'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
