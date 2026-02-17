'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Calendar, MapPin, Users, Edit, Trash2, Plus, Image as ImageIcon, Clock, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface EventForm {
  title: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  description: string;
  image: string;
}

interface ClubEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  attendees?: number;
  description: string;
  image?: string;
}

const getStatusBadge = (date: string) => {
  const eventDate = new Date(date);
  const today = new Date();
  const isUpcoming = eventDate > today;
  const isToday = eventDate.toDateString() === today.toDateString();

  if (isToday) {
    return <Badge className="bg-primary text-primary-foreground">Today</Badge>;
  }
  if (isUpcoming) {
    return <Badge variant="secondary">Upcoming</Badge>;
  }
  return <Badge variant="outline" className="text-muted-foreground">Past</Badge>;
};

export default function EventsPage() {
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<EventForm>({
    title: '',
    date: '',
    time: '',
    location: '',
    capacity: 50,
    description: '',
    image: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setEvents(events.map((ev) => (ev.id === editingId ? { ...ev, ...formData } : ev)));
      toast.success('Event updated successfully');
    } else {
      const newEvent = { 
        id: `${formData.title}-${formData.date}-${events.length + 1}`,
        attendees: 0, 
        ...formData,
        image: formData.image || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800'
      };
      setEvents([newEvent, ...events]);
      toast.success('Event created successfully');
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
    toast.success('Event deleted');
  };

  const resetForm = () => {
    setFormData({ title: '', date: '', time: '', location: '', capacity: 50, description: '', image: '' });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (event: any) => {
    setFormData(event);
    setEditingId(event.id);
    setShowForm(true);
  };

  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date());
  const pastEvents = events.filter(e => new Date(e.date) < new Date());

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground mt-1">
            Manage and schedule events for your club members
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Event
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{upcomingEvents.length}</p>
              <p className="text-sm text-muted-foreground">Upcoming Events</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full">
              <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {events.reduce((acc, e) => acc + (e.attendees || 0), 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Attendees</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-muted p-3 rounded-full">
              <Clock className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pastEvents.length}</p>
              <p className="text-sm text-muted-foreground">Past Events</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events Grid */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold tracking-tight">Upcoming Events</h2>
        
        {upcomingEvents.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="bg-muted inline-flex p-4 rounded-full mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No upcoming events</h3>
            <p className="text-muted-foreground mb-4">Create your first event to get started</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="relative aspect-video">
                  <Image
                    src={event.image || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800'}
                    alt={event.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    {getStatusBadge(event.date)}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <CardContent className="p-5">
                  <h3 className="text-lg font-semibold mb-3 line-clamp-1">{event.title}</h3>
                  
                  <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>
                        {new Date(event.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                        <span className="mx-1">•</span>
                        {event.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span>
                        {event.attendees || 0} / {event.capacity} registered
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(event)}
                      className="flex-1 gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(event.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Past Events Section */}
        {pastEvents.length > 0 && (
          <>
            <h2 className="text-xl font-semibold tracking-tight mt-12">Past Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 opacity-75">
              {pastEvents.slice(0, 3).map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="relative aspect-video grayscale">
                    <Image
                      src={event.image || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800'}
                      alt={event.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      {getStatusBadge(event.date)}
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-1">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Held on {new Date(event.date).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={() => resetForm()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Event' : 'Create New Event'}</DialogTitle>
            <DialogDescription>
              {editingId 
                ? 'Update the details of your existing event.' 
                : 'Fill in the details to create a new club event.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Event Cover Image</Label>
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 hover:bg-muted/80 transition-colors group cursor-pointer">
                {formData.image ? (
                  <>
                     <Image
                       src={formData.image}
                       alt="Preview"
                       fill
                       sizes="100vw"
                       className="object-cover"
                     />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: '' })}
                      className="absolute top-2 right-2 p-1 bg-background/80 rounded-full hover:bg-background"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <ImageIcon className="h-10 w-10 mb-2" />
                    <span>Click to upload event image</span>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., Monthly Member Meetup"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="e.g., Main Lounge"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe what attendees can expect..."
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button type="button" variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit">
                {editingId ? 'Update Event' : 'Create Event'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
