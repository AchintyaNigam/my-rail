// Types and Interfaces
"use client";
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

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
const BookingPage: React.FC = () => {
  const searchParams = useSearchParams();
  const [train, setTrain] = useState<Train | null>(null);
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

  useEffect(() => {
    const trainData = searchParams.get("trainData");
    if (trainData) {
      setTrain(JSON.parse(trainData));
    }
  }, [searchParams]);

  const coachTypes: CoachType[] = [
    { id: "AC Second Class", name: "AC Second Class", price: 100 },
    { id: "AC Third Class", name: "AC Third Class", price: 75 },
    { id: "Sleeper", name: "Sleeper", price: 50 },
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

  if (!train) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  const basePrice = parseInt(train.price.replace("₹", ""));
  const coachPrice =
    coachTypes.find((c) => c.id === formData.coachType)?.price || 0;
  const totalPrice = (basePrice + coachPrice) * formData.seats;

  return (
    <div className="p-4 flex w-screen h-screen lg:flex-row flex-col overflow-hidden">
      {/* Train Details Summary Card */}
      <div className="lg:w-1/2 lg:p-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Train Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-blue-600">{train.name}</h2>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{train.departure}</span>
                <ArrowRight className="text-gray-400" size={20} />
                <span className="font-semibold">{train.destination}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-600">
                <div>
                  <p className="font-medium">Departure Time</p>
                  <p>{train.time}</p>
                </div>
                <div>
                  <p className="font-medium">Duration</p>
                  <p>{train.duration}</p>
                </div>
                <div>
                  <p className="font-medium">Base Price</p>
                  <p>{train.price}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="lg:w-1/2 lg:p-4 overflow-scroll">
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
                    <p className="text-gray-600">+₹{coach.price}</p>
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
                <div
                  key={index}
                  className="space-y-4 p-4 border rounded-lg mb-4"
                >
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
            {/* Price Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Price Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Base Price General ({formData.seats} seats)</span>
                  <span>₹{basePrice * formData.seats}</span>
                </div>
                {formData.coachType && (
                  <div className="flex justify-between">
                    <span>Coach Upgrade ({formData.seats} seats)</span>
                    <span>₹{coachPrice * formData.seats}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total Price</span>
                  <span>₹{totalPrice}</span>
                </div>
              </div>
            </div>
            {/* Payment Button */}
            <button
              className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              onClick={() =>
                alert(`Proceeding to payment for total amount: ₹${totalPrice}`)
              }
            >
              Proceed to Payment
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingPage;
