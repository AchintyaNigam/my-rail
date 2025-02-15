// Types and Interfaces
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

import React, { useState } from "react";
import { Search, Calendar, MapPin, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const BookingPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    coachType: "",
    seats: 1,
    passengers: [
      {
        name: "",
        age: "",
        gender: "",
      },
    ],
  });

  const coachTypes: CoachType[] = [
    { id: "first", name: "First Class", price: 100 },
    { id: "business", name: "Business Class", price: 75 },
    { id: "economy", name: "Economy Class", price: 50 },
  ];

  const handlePassengerChange = (
    index: number,
    field: keyof Passenger,
    value: string
  ): void => {
    const newPassengers = [...formData.passengers];
    newPassengers[index] = { ...newPassengers[index], [field]: value };
    setFormData({ ...formData, passengers: newPassengers });
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Book Your Train Journey</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Coach Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Select Coach Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {coachTypes.map((coach) => (
                <div
                  key={coach.id}
                  className={`p-4 border rounded-lg cursor-pointer ${
                    formData.coachType === coach.id
                      ? "border-blue-600 bg-blue-50"
                      : ""
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, coachType: coach.id })
                  }
                >
                  <h4 className="font-semibold">{coach.name}</h4>
                  <p className="text-gray-600">${coach.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Number of Seats */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Number of Seats</h3>
            <select
              className="w-full p-4 border rounded-lg"
              value={formData.seats}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const seats = parseInt(e.target.value);
                setFormData({
                  ...formData,
                  seats,
                  passengers: Array(seats)
                    .fill(null)
                    .map((_, i) => ({
                      name: "",
                      age: "",
                      gender: "",
                    })),
                });
              }}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num} Seat(s)
                </option>
              ))}
            </select>
          </div>

          {/* Passenger Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Passenger Details</h3>
            {formData.passengers.map((passenger, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg mb-4">
                <h4 className="font-medium">Passenger {index + 1}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="p-2 border rounded"
                    value={passenger.name}
                    onChange={(e) =>
                      handlePassengerChange(index, "name", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    placeholder="Age"
                    className="p-2 border rounded"
                    value={passenger.age}
                    onChange={(e) =>
                      handlePassengerChange(index, "age", e.target.value)
                    }
                  />
                  <select
                    className="p-2 border rounded"
                    value={passenger.gender}
                    onChange={(e) =>
                      handlePassengerChange(index, "gender", e.target.value)
                    }
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Button */}
          <button
            className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            onClick={() => alert("Proceeding to payment...")}
          >
            Proceed to Payment
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingPage;
