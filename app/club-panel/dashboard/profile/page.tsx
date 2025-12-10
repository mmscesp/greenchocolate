'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { mockClubData } from '@/lib/mock-admin-data';
import { toast } from 'sonner';

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: mockClubData.name,
    location: mockClubData.location,
    capacity: mockClubData.capacity,
    description: mockClubData.description,
  });

  const [savedImage, setSavedImage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSavedImage(reader.result as string);
        toast.success('Image uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile updated successfully');
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Club Profile</h1>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-6">Club Image</h2>
        <div className="mb-6">
          {savedImage || mockClubData.image ? (
            <img src={savedImage || mockClubData.image} alt="Club" className="w-full h-64 object-cover rounded-lg" />
          ) : (
            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">No image uploaded</span>
            </div>
          )}
        </div>
        <input type="file" accept="image/*" onChange={handleImageUpload} className="block mb-4" />
        <p className="text-sm text-gray-600">Upload a new club image (JPG, PNG)</p>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Club Details</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Club Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" value={formData.location} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="capacity">Member Capacity</Label>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              required
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Save Changes
            </Button>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
