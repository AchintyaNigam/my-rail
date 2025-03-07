'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Train, ArrowLeft, CreditCard, Calendar, User, Shield } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../constants';

interface BookingDetails {
  fullName: string;
  train_name: string;
  price: string;
  coach: string;
  passengers: string;
}

const PaymentPage: React.FC = () => {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    upiId: ''
  });
  const [processingPayment, setProcessingPayment] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Parse URL query parameters on component mount
    if (typeof window !== 'undefined') {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Get basic booking params
        const fullName = urlParams.get('fullName') || '';
        const train_name = urlParams.get('train_name') || '';
        const price = urlParams.get('price') || '0';
        const coach = urlParams.get('coach') || '';
        
        // Get passenger data with better handling for number of passengers
        const passengersParam = urlParams.get('passengers');
        let passengers = [];
        
        if (passengersParam) {
          try {
            // First try to parse as JSON
            passengers = JSON.parse(decodeURIComponent(passengersParam));
          } catch (e) {
            console.log('Error parsing passengers JSON:', e);
          }
        }
        
        // If key booking details are missing, show error
        if (!fullName || !train_name || !price || !coach) {
          setError('Missing booking details in URL parameters');
        } else {
          // Set the booking details state
          setBookingDetails({
            fullName,
            train_name,
            price,
            coach,
            passengers
          });
        }
      } catch (err) {
        console.error('Error parsing URL parameters:', err);
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    }
  }, []);  

  // Handle payment input changes
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle payment method selection
  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value);
  };

  // Handle payment submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (paymentMethod === 'credit_card') {
      if (!paymentDetails.cardNumber || !paymentDetails.cardHolder || !paymentDetails.expiryDate || !paymentDetails.cvv) {
        setError('Please fill in all card details');
        return;
      }
    } else if (paymentMethod === 'upi') {
      if (!paymentDetails.upiId) {
        setError('Please enter your UPI ID');
        return;
      }
    }
    
    // Process payment
    setProcessingPayment(true);
    const response = await axios.post(`${API_URL}/tickets/records`, bookingDetails);
    if(response.status == 200)
    {
      console.log('Payment successful', paymentDetails);
      setProcessingPayment(false);
      setSuccess(true);
    }
    else
    {
      setError('Payment failed');
    }
  };

  // Generate booking summary JSON
  const getBookingSummaryJSON = () => {
    if (!bookingDetails) return '{}';
    return JSON.stringify(bookingDetails, null, 2);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="py-4 px-6">
        <Link href="/booking" className="inline-flex items-center text-blue-600 hover:text-blue-700">
          <ArrowLeft size={20} className="mr-2" />
          <span>Back to Booking</span>
        </Link>
      </div>
      
      <div className="flex-grow flex flex-col md:flex-row items-start justify-center px-4 py-8 gap-8 max-w-6xl mx-auto w-full">
        {/* Left side - Booking Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6 w-full md:w-1/2">
          <div className="flex items-center mb-6">
            <Train size={24} className="text-blue-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-800">Booking Summary</h2>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error && !bookingDetails ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          ) : bookingDetails ? (
            <div>
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <div className="flex justify-between border-b border-blue-100 pb-2 mb-2">
                  <span className="text-gray-600">Passenger Name:</span>
                  <span className="font-medium">{bookingDetails.fullName}</span>
                </div>
                <div className="flex justify-between border-b border-blue-100 pb-2 mb-2">
                  <span className="text-gray-600">Train:</span>
                  <span className="font-medium">{bookingDetails.train_name}</span>
                </div>
                <div className="flex justify-between border-b border-blue-100 pb-2 mb-2">
                  <span className="text-gray-600">Coach:</span>
                  <span className="font-medium">{bookingDetails.coach}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Amount:</span>
                  <span>₹{bookingDetails.price}</span>
                </div>
              </div>
            
              
              <div className="mt-5">
                <h3 className="font-medium text-gray-800 mb-2">Booking JSON</h3>
                <pre className="bg-gray-100 p-3 rounded overflow-auto text-xs max-h-40">{getBookingSummaryJSON()}</pre>
              </div>
            </div>
          ) : null}
        </div>
        
        {/* Right side - Payment Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 w-full md:w-1/2">
          <div className="flex items-center mb-6">
            <CreditCard size={24} className="text-blue-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-800">Payment Details</h2>
          </div>
          
          {success ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-6 rounded mb-4 text-center">
              <h3 className="text-lg font-bold mb-2">Payment Successful!</h3>
              <p>Your ticket has been booked successfully.</p>
              <p className="mt-2">Booking reference: {Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              
              <div className="mb-6">
                <div className="flex space-x-4 mb-4">
                  <div className="flex items-center">
                    <input
                      id="credit_card"
                      name="paymentMethod"
                      type="radio"
                      value="credit_card"
                      checked={paymentMethod === 'credit_card'}
                      onChange={handlePaymentMethodChange}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <label htmlFor="credit_card" className="ml-2 block text-sm text-gray-700">
                      Credit/Debit Card
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="upi"
                      name="paymentMethod"
                      type="radio"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={handlePaymentMethodChange}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <label htmlFor="upi" className="ml-2 block text-sm text-gray-700">
                      UPI
                    </label>
                  </div>
                </div>
              </div>
              
              {paymentMethod === 'credit_card' ? (
                <>
                  <div className="mb-4">
                    <label htmlFor="cardNumber" className="block text-gray-700 font-medium mb-2">Card Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CreditCard size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="1234 5678 9012 3456"
                        value={paymentDetails.cardNumber}
                        onChange={handlePaymentChange}
                        maxLength={19}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="cardHolder" className="block text-gray-700 font-medium mb-2">Card Holder Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="cardHolder"
                        name="cardHolder"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="JOHN DOE"
                        value={paymentDetails.cardHolder}
                        onChange={handlePaymentChange}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label htmlFor="expiryDate" className="block text-gray-700 font-medium mb-2">Expiry Date</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar size={18} className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="MM/YY"
                          value={paymentDetails.expiryDate}
                          onChange={handlePaymentChange}
                          maxLength={5}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-gray-700 font-medium mb-2">CVV</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Shield size={18} className="text-gray-400" />
                        </div>
                        <input
                          type="password"
                          id="cvv"
                          name="cvv"
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="•••"
                          value={paymentDetails.cvv}
                          onChange={handlePaymentChange}
                          maxLength={3}
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="mb-6">
                  <label htmlFor="upiId" className="block text-gray-700 font-medium mb-2">UPI ID</label>
                  <input
                    type="text"
                    id="upiId"
                    name="upiId"
                    className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="name@upi"
                    value={paymentDetails.upiId}
                    onChange={handlePaymentChange}
                  />
                </div>
              )}
              
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>₹{bookingDetails?.price ? (bookingDetails.price) : '0.00'}</span>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={processingPayment || !bookingDetails}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75"
              >
                {processingPayment ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Payment...
                  </>
                ) : (
                  `Pay ₹${bookingDetails?.price ? bookingDetails.price : '0.00'}`
                )}
              </button>
              
              <div className="mt-4 text-center text-xs text-gray-500">
                <p>Your payment information is encrypted and secure.</p>
                <p className="mt-1">By proceeding with the payment, you agree to our <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>.</p>
              </div>
            </form>
          )}
        </div>
      </div>
      
      <footer className="py-6 px-4 shadow-md mt-auto">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Achintya Nigam. All rights reserved.</p>
        </div>
      </footer>
    </div>
)};

export default PaymentPage;
