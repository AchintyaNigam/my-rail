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

import React, { useState, useMemo } from 'react';
import { Search, Calendar, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

// Train Schedule Page Component
const TrainSchedulePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [departureStation, setDepartureStation] = useState<string>('');
  const [destinationStation, setDestinationStation] = useState<string>('');

  // Sample train data
  const trains: Train[] = [
    { id: 1, name: 'Express 101', departure: 'Vellore', destination: 'Chennai', time: '08:00', duration: '2h', price: '₹50 - ₹200' },
    { id: 2, name: 'Regional 202', departure: 'Chennai', destination: 'Mumbai', time: '09:30', duration: '48h', price: '₹75 - ₹300' },
    { id: 3, name: 'Superfast 303', departure: 'Bangalore', destination: 'Hyderabad', time: '10:45', duration: '10h', price: '₹150 - ₹500' },
    { id: 4, name: 'Intercity 404', departure: 'Delhi', destination: 'Agra', time: '06:15', duration: '3h', price: '₹100 - ₹350' },
    { id: 5, name: 'Rajdhani 505', departure: 'Mumbai', destination: 'Delhi', time: '17:00', duration: '16h', price: '₹500 - ₹2000' },
    { id: 6, name: 'Shatabdi 606', departure: 'Pune', destination: 'Goa', time: '12:30', duration: '8h', price: '₹300 - ₹1200' },
    { id: 7, name: 'Mail Express 707', departure: 'Kolkata', destination: 'Bhubaneswar', time: '20:45', duration: '9h', price: '₹250 - ₹900' },
    { id: 8, name: 'Jan Shatabdi 808', departure: 'Ahmedabad', destination: 'Jaipur', time: '05:00', duration: '13h', price: '₹200 - ₹800' },
    { id: 9, name: 'Garib Rath 909', departure: 'Lucknow', destination: 'Patna', time: '22:15', duration: '7h', price: '₹180 - ₹700' },
    { id: 10, name: 'Duronto 1010', departure: 'Hyderabad', destination: 'Visakhapatnam', time: '14:30', duration: '12h', price: '₹400 - ₹1500' },
    { id: 11, name: 'Passenger 1111', departure: 'Chandigarh', destination: 'Amritsar', time: '04:45', duration: '5h', price: '₹80 - ₹300' },
    { id: 12, name: 'Double Decker 1212', departure: 'Bangalore', destination: 'Chennai', time: '19:00', duration: '5h', price: '₹250 - ₹1000' },
  ];

  const stations: string[] = ['Vellore', 'Chennai', 'Mumbai', 'Bangalore', 'Hyderabad', 'Delhi', 'Agra', 'Lucknow', 'Pune', 'Goa', 'Kolkata', 'Bhubaneshwar', 'Jaipur', 'Patna', 'Vishakhapatnam', 'Amritsar', 'Chandigarh'];

  // Filter trains based on search query and selected stations
  const filteredTrains = useMemo(() => {
    return trains.filter(train => {
      // Search query filter
      const searchFilter = !searchQuery || 
        train.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        train.departure.toLowerCase().includes(searchQuery.toLowerCase()) ||
        train.destination.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Departure station filter
      const departureFilter = !departureStation || train.departure === departureStation;
      
      // Destination station filter
      const destinationFilter = !destinationStation || train.destination === destinationStation;
      
      return searchFilter && departureFilter && destinationFilter;
    });
  }, [searchQuery, departureStation, destinationStation, trains]);

  return (
    <div className="mx-auto p-4 max-w-6xl flex flex-col dark:bg-black dark:text-white">
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
      <div className="space-y-4 overflow-auto h-[80vh]">
        {filteredTrains.length > 0 ? (
          filteredTrains.map((train) => (
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
                    <Link 
                      href={{
                        pathname: '/booking',
                        query: { trainData: JSON.stringify(train) }
                      }}
                    >
                      <button 
                        className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Book Now
                      </button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-xl text-gray-500">No trains found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainSchedulePage;