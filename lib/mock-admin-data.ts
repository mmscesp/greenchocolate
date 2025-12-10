export interface ClubData {
  id: string;
  name: string;
  location: string;
  capacity: number;
  description: string;
  image: string;
  members: number;
  foundedYear: number;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  status: 'active' | 'pending';
}

export interface Request {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  message: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  attendees: number;
  image: string;
  description: string;
}

export const mockClubData: ClubData = {
  id: '1',
  name: 'Green Harmony',
  location: 'Madrid, Spain',
  capacity: 150,
  description: 'Premier cannabis social club in Madrid with focus on community and education.',
  image: 'https://images.pexels.com/photos/3594650/pexels-photo-3594650.jpeg?auto=compress&cs=tinysrgb&w=600',
  members: 87,
  foundedYear: 2018,
};

export const mockMembers: Member[] = [
  { id: '1', name: 'Carlos Rodriguez', email: 'carlos@example.com', joinDate: '2023-01-15', status: 'active' },
  { id: '2', name: 'Maria Garcia', email: 'maria@example.com', joinDate: '2023-06-20', status: 'active' },
  { id: '3', name: 'Juan Martinez', email: 'juan@example.com', joinDate: '2024-02-10', status: 'active' },
  { id: '4', name: 'Sofia Lopez', email: 'sofia@example.com', joinDate: '2024-03-05', status: 'pending' },
  { id: '5', name: 'Antonio Fernandez', email: 'antonio@example.com', joinDate: '2024-04-12', status: 'active' },
];

export const mockRequests: Request[] = [
  { id: '1', name: 'Diego Sanchez', email: 'diego@example.com', status: 'pending', requestDate: '2024-10-15', message: 'I would like to join your amazing community' },
  { id: '2', name: 'Laura Moreno', email: 'laura@example.com', status: 'pending', requestDate: '2024-10-18', message: 'Interested in cannabis culture and education' },
  { id: '3', name: 'Pablo Ruiz', email: 'pablo@example.com', status: 'approved', requestDate: '2024-10-10', message: 'Great club, looking forward to events' },
  { id: '4', name: 'Ana Torres', email: 'ana@example.com', status: 'rejected', requestDate: '2024-10-05', message: 'Interested in membership' },
];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Monthly Tasting Session',
    date: '2024-11-15',
    time: '19:00',
    location: 'Main Hall',
    capacity: 50,
    attendees: 42,
    image: 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Experience curated cannabis strains with expert guidance',
  },
  {
    id: '2',
    title: 'Educational Workshop: Cultivation Basics',
    date: '2024-11-22',
    time: '18:00',
    location: 'Conference Room',
    capacity: 30,
    attendees: 28,
    image: 'https://images.pexels.com/photos/3808516/pexels-photo-3808516.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Learn the fundamentals of growing cannabis at home',
  },
  {
    id: '3',
    title: 'Social Gathering & Networking',
    date: '2024-11-29',
    time: '20:00',
    location: 'Main Hall',
    capacity: 100,
    attendees: 0,
    image: 'https://images.pexels.com/photos/3801366/pexels-photo-3801366.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Casual evening to meet members and discuss recent trends',
  },
];
