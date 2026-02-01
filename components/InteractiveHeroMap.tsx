'use client';

import { useState, useEffect, useRef } from 'react';
import { Badge } from './ui/badge';
import { MapPin, Star, Users, Verified } from 'lucide-react';

interface ClubMarker {
  id: string;
  name: string;
  neighborhood: string;
  rating: number;
  members: number;
  isVerified: boolean;
  position: { x: number; y: number; z: number };
  color: string;
}

interface FloatingUser {
  id: string;
  name: string;
  avatar: string;
  review: string;
  position: { x: number; y: number };
}

export default function InteractiveHeroMap() {
  const [hoveredClub, setHoveredClub] = useState<ClubMarker | null>(null);
  const [discoveredToday, setDiscoveredToday] = useState(0);
  const mapRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mock club data for Barcelona neighborhoods
  const clubMarkers: ClubMarker[] = [
    {
      id: '1',
      name: 'Green Harmony',
      neighborhood: 'Gràcia',
      rating: 4.8,
      members: 245,
      isVerified: true,
      position: { x: 35, y: 25, z: 0 },
      color: '#22c55e'
    },
    {
      id: '2',
      name: 'Cannabis Culture',
      neighborhood: 'Eixample',
      rating: 4.9,
      members: 312,
      isVerified: true,
      position: { x: 50, y: 45, z: 0 },
      color: '#16a34a'
    },
    {
      id: '3',
      name: 'Chill Zone',
      neighborhood: 'Born',
      rating: 4.5,
      members: 189,
      isVerified: false,
      position: { x: 65, y: 35, z: 0 },
      color: '#15803d'
    },
    {
      id: '4',
      name: 'Latina Green',
      neighborhood: 'Poble Sec',
      rating: 4.7,
      members: 156,
      isVerified: true,
      position: { x: 40, y: 60, z: 0 },
      color: '#166534'
    },
    {
      id: '5',
      name: 'Barcelona Social',
      neighborhood: 'Barceloneta',
      rating: 4.6,
      members: 203,
      isVerified: true,
      position: { x: 70, y: 55, z: 0 },
      color: '#14532d'
    }
  ];

  // Mock floating users
  const floatingUsers: FloatingUser[] = [
    {
      id: '1',
      name: 'María',
      avatar: '👩‍🦱',
      review: 'Amazing atmosphere!',
      position: { x: 20, y: 30 }
    },
    {
      id: '2',
      name: 'Carlos',
      avatar: '👨‍🦲',
      review: 'Great community',
      position: { x: 80, y: 20 }
    },
    {
      id: '3',
      name: 'Ana',
      avatar: '👩‍🦰',
      review: 'Very professional',
      position: { x: 15, y: 70 }
    }
  ];

  // Counter animation for discovered clubs
  useEffect(() => {
    const timer = setInterval(() => {
      setDiscoveredToday(prev => {
        if (prev < 50) return prev + 1;
        return prev;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  // Mouse tracking for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (mapRef.current) {
        const rect = mapRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x, y });
      }
    };

    const mapElement = mapRef.current;
    if (mapElement) {
      mapElement.addEventListener('mousemove', handleMouseMove);
      return () => mapElement.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <div 
      ref={mapRef}
      className="relative w-full h-full overflow-hidden parallax-container"
    >
      {/* Background Layers with Parallax */}
      <div 
        className="parallax-layer parallax-back"
        style={{
          transform: `translateX(${mousePosition.x * -10}px) translateY(${mousePosition.y * -10}px)`
        }}
      >
        {/* Organic Background Shapes */}
        <div className="absolute top-10 left-10 w-32 h-32 organic-shape opacity-30 float-gentle"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 organic-shape-alt opacity-20 float-gentle" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-20 h-20 organic-shape opacity-25 float-gentle" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Mid Layer - Neighborhoods */}
      <div 
        className="parallax-layer parallax-mid"
        style={{
          transform: `translateX(${mousePosition.x * -5}px) translateY(${mousePosition.y * -5}px)`
        }}
      >
        {/* Barcelona Neighborhoods - Isometric Blocks */}
        <div className="absolute inset-0 isometric-map breathe-animation">
          {/* Gràcia */}
          <div 
            className="absolute map-neighborhood"
            style={{ left: '30%', top: '20%', width: '15%', height: '15%' }}
          >
            <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 rounded-lg shadow-lg border border-green-300 hemp-texture"></div>
          </div>

          {/* Eixample */}
          <div 
            className="absolute map-neighborhood"
            style={{ left: '45%', top: '40%', width: '20%', height: '20%' }}
          >
            <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg shadow-lg border border-emerald-300 hemp-texture"></div>
          </div>

          {/* Born */}
          <div 
            className="absolute map-neighborhood"
            style={{ left: '60%', top: '30%', width: '18%', height: '18%' }}
          >
            <div className="w-full h-full bg-gradient-to-br from-lime-100 to-lime-200 rounded-lg shadow-lg border border-lime-300 hemp-texture"></div>
          </div>

          {/* Poble Sec */}
          <div 
            className="absolute map-neighborhood"
            style={{ left: '35%', top: '55%', width: '16%', height: '16%' }}
          >
            <div className="w-full h-full bg-gradient-to-br from-green-50 to-green-150 rounded-lg shadow-lg border border-green-200 hemp-texture"></div>
          </div>

          {/* Barceloneta */}
          <div 
            className="absolute map-neighborhood"
            style={{ left: '65%', top: '50%', width: '17%', height: '17%' }}
          >
            <div className="w-full h-full bg-gradient-to-br from-teal-100 to-teal-200 rounded-lg shadow-lg border border-teal-300 hemp-texture"></div>
          </div>
        </div>
      </div>

      {/* Front Layer - Interactive Elements */}
      <div className="parallax-layer parallax-front">
        {/* Club Markers */}
        {clubMarkers.map((club, index) => (
          <div
            key={club.id}
            className="absolute club-marker pulse-marker cursor-pointer"
            style={{
              left: `${club.position.x}%`,
              top: `${club.position.y}%`,
              animationDelay: `${index * 0.5}s`
            }}
            onMouseEnter={() => setHoveredClub(club)}
            onMouseLeave={() => setHoveredClub(null)}
          >
            {/* Marker Pin */}
            <div 
              className="w-6 h-6 rounded-full shadow-lg border-2 border-white flex items-center justify-center transform transition-all duration-300 hover:scale-125"
              style={{ backgroundColor: club.color }}
            >
              <MapPin className="w-3 h-3 text-white" />
            </div>

            {/* Hover Preview Card */}
            {hoveredClub?.id === club.id && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bounce-in">
                <div className="bg-white rounded-xl shadow-2xl p-4 min-w-[200px] border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-gray-900">{club.name}</h3>
                    {club.isVerified && (
                      <Verified className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{club.neighborhood}</p>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{club.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-gray-500" />
                      <span>{club.members}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Floating User Avatars */}
        {floatingUsers.map((user, index) => (
          <div
            key={user.id}
            className="absolute float-gentle"
            style={{
              left: `${user.position.x}%`,
              top: `${user.position.y}%`,
              animationDelay: `${index * 2}s`
            }}
          >
            <div className="group relative">
              <div className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-lg border-2 border-green-200 hover:border-green-400 transition-colors cursor-pointer">
                {user.avatar}
              </div>
              <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-gray-900 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap">
                  &quot;{user.review}&quot; - {user.name}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Live Counter */}
        <div className="absolute top-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-green-200">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium text-gray-900">
                <span className="counter-animation font-bold text-green-600">{discoveredToday}</span> clubs discovered today
              </span>
            </div>
          </div>
        </div>

        {/* Safety Badge */}
        <div className="absolute bottom-4 right-4">
          <Badge variant="verified" className="shadow-lg text-sm px-4 py-2">
            <Verified className="w-4 h-4 mr-2" />
            100% Legal & Verified
          </Badge>
        </div>

        {/* Cannabis Leaf Pattern Overlay */}
        <div className="absolute inset-0 cannabis-pattern opacity-10 pointer-events-none"></div>
      </div>
    </div>
  );
}