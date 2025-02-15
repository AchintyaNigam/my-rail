'use client';

interface Train {
    id: number;
    name: string;
    departure: string;
    destination: string;
    time: string;
    duration: string;
    price: string;
  }
  
  interface Passenger {
    name: string;
    age: string;
    gender: string;
  }
  
  interface FormData {
    coachType: string;
    seats: number;
    passengers: Passenger[];
  }
  
  interface CoachType {
    id: string;
    name: string;
    price: number;
  }
  
  import React, { useState } from 'react';
  import { Search, Calendar, MapPin, Filter } from 'lucide-react';
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
  
  // Train Schedule Page Component
  const TrainSchedulePage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [departureStation, setDepartureStation] = useState<string>('');
    const [destinationStation, setDestinationStation] = useState<string>('');
  
    // Sample train data
    const trains: Train[] = [
      { id: 1, name: 'Express 101', departure: 'New York', destination: 'Boston', time: '08:00', duration: '4h', price: '$50' },
      { id: 2, name: 'Regional 202', departure: 'Boston', destination: 'Washington', time: '09:30', duration: '6h', price: '$75' },
    ];
  
    const stations: string[] = ['New York', 'Boston', 'Washington', 'Philadelphia', 'Chicago'];
  
    return (
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search trains by name or station..."
              className="w-full p-4 pl-12 border rounded-lg"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-4 text-gray-400" size={20} />
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="date"
                className="w-full p-4 pl-12 border rounded-lg"
                value={selectedDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedDate(e.target.value)}
              />
              <Calendar className="absolute left-4 top-4 text-gray-400" size={20} />
            </div>
  
            <select
              className="w-full p-4 border rounded-lg"
              value={departureStation}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDepartureStation(e.target.value)}
            >
              <option value="">Select Departure Station</option>
              {stations.map(station => (
                <option key={station} value={station}>{station}</option>
              ))}
            </select>
  
            <select
              className="w-full p-4 border rounded-lg"
              value={destinationStation}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDestinationStation(e.target.value)}
            >
              <option value="">Select Destination Station</option>
              {stations.map(station => (
                <option key={station} value={station}>{station}</option>
              ))}
            </select>
          </div>
        </div>
  
        {/* Train List */}
        <div className="space-y-4">
          {trains.map((train) => (
            <Card key={train.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{train.name}</h3>
                    <div className="flex items-center text-gray-600 space-x-4">
                      <MapPin size={16} />
                      <span>{train.departure} → {train.destination}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{train.price}</p>
                    <p className="text-gray-600">Duration: {train.duration}</p>
                    <button 
                      className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      onClick={() => window.location.href = `/booking/${train.id}`}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  export default TrainSchedulePage;