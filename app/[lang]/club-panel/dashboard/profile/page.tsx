'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { Upload, Image as ImageIcon, MapPin, Loader2 } from '@/lib/icons';
import { cn } from '@/lib/utils';

// Default values for empty form
const defaultValues = {
  name: '',
  description: '',
  neighborhood: '',
  addressDisplay: '',
  contactEmail: '',
  phoneNumber: '',
  capacity: 50,
  foundedYear: new Date().getFullYear(),
};

// Schema Definition
const clubProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  neighborhood: z.string().min(2, 'Neighborhood is required'),
  addressDisplay: z.string().min(5, 'Address is required'),
  contactEmail: z.string().email('Invalid email address'),
  phoneNumber: z.string().optional(),
  capacity: z.coerce.number().min(1, 'Capacity must be at least 1'),
  foundedYear: z.coerce.number()
    .min(1900, 'Year must be after 1900')
    .max(new Date().getFullYear(), 'Year cannot be in the future'),
});

type ClubProfileFormValues = z.infer<typeof clubProfileSchema>;

export default function ClubProfilePage() {
  const [isSaving, setIsSaving] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);

  // Initialize form with default values
  const form = useForm<ClubProfileFormValues>({
    resolver: zodResolver(clubProfileSchema),
    defaultValues: defaultValues,
  });

  async function onSubmit(data: ClubProfileFormValues) {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Form data:', data);
    toast.success('Club profile updated successfully');
    setIsSaving(false);
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
        toast.success('Cover image updated');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Club Profile</h1>
        <p className="text-muted-foreground">Manage your club's public information and appearance.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Media Section */}
          <Card>
            <CardHeader>
              <CardTitle>Media & Branding</CardTitle>
              <CardDescription>Upload your club's cover image and logo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <FormLabel>Cover Image</FormLabel>
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 hover:bg-muted/80 transition-colors group cursor-pointer">
                  {coverImage ? (
                    <>
                      <Image
                        src={coverImage}
                        alt="Cover"
                        fill
                        sizes="100vw"
                        className="object-cover transition-opacity group-hover:opacity-75"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-background/80 backdrop-blur-sm p-3 rounded-full shadow-lg">
                          <Upload className="h-6 w-6 text-foreground" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <ImageIcon className="h-10 w-10 mb-2" />
                      <span>Upload cover image</span>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                  />
                </div>
                <FormDescription>Recommended size: 1920x1080px (16:9 aspect ratio).</FormDescription>
              </div>
            </CardContent>
          </Card>

          {/* General Information */}
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>Basic details about your social club.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Club Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter club name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="foundedYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Founded Year</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us about your club..." 
                        className="min-h-[150px] resize-y" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      This will be displayed on your public profile page.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Member Capacity</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Location & Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Location & Contact</CardTitle>
              <CardDescription>How members can find and reach you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="addressDisplay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-9" placeholder="Street address" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="neighborhood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Neighborhood</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Gràcia" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="club@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+34 ..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-4 sticky bottom-6 bg-background/80 backdrop-blur-md p-4 rounded-xl border shadow-lg z-10">
            <Button type="button" variant="ghost" onClick={() => form.reset()}>
              Discard Changes
            </Button>
            <Button type="submit" disabled={isSaving} className="min-w-[150px]">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
