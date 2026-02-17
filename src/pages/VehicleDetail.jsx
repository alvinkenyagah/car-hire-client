import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDates, setBookingDates] = useState({
    startDate: "",
    endDate: ""
  });

  // Fetch vehicle details
  useEffect(() => {
    const fetchVehicle = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/vehicles/${id}`);
        if (!res.ok) throw new Error("Vehicle not found");
        const data = await res.json();
        setVehicle(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load vehicle details");
        navigate("/vehicles");
      } finally {
        setIsLoading(false);
      }
    };
    fetchVehicle();
  }, [id, navigate]);

  // Calculate rental days and total price
  const calculateRental = () => {
    if (!bookingDates.startDate || !bookingDates.endDate) return { days: 0, total: 0 };
    
    const start = new Date(bookingDates.startDate);
    const end = new Date(bookingDates.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const total = days * vehicle.ratePerDay;
    
    return { days: days > 0 ? days : 0, total: total > 0 ? total : 0 };
  };

  const handleBooking = () => {
    const { days } = calculateRental();
    if (days <= 0) {
      alert("Please select valid dates");
      return;
    }
    // Implement booking logic here
    alert(`Booking submitted for ${days} days!`);
    setShowBookingModal(false);
  };



              const handleHire = async () => {
              const res = await fetch("http://localhost:5000/api/hires", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                  vehicleId: vehicle._id,
                  startDate,
                  endDate
                })
              });

              const data = await res.json();
              if (!res.ok) return alert(data.message);

              alert("Hire request sent. Await admin approval.");
            };





  // Vehicle Type Icons
  const getTypeIcon = (type) => {
    switch (type) {
      case "electric":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case "hybrid":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
          </svg>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-2xl mb-8"></div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
              <div>
                <div className="h-64 bg-gray-200 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!vehicle) return null;

  const rental = calculateRental();
  const images = vehicle.images.length > 0 
    ? vehicle.images 
    : ["https://via.placeholder.com/800x600"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button
          onClick={() => navigate("/vehicles")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-medium">Back to Vehicles</span>
        </button>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Main Image */}
              <div className="relative h-96 lg:h-[500px] overflow-hidden bg-gray-100">
                <img
                  src={images[selectedImage]}
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    Available
                  </span>
                </div>

                {/* Image Navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
                    >
                      <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setSelectedImage((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
                    >
                      <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="p-4 flex gap-3 overflow-x-auto">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-24 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? "border-blue-600 scale-105"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${vehicle.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Vehicle Information */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{vehicle.name}</h1>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                    <span className="font-medium text-lg">{vehicle.brand}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(vehicle.type)}
                    <span className="capitalize font-medium">{vehicle.type}</span>
                  </div>
                </div>
              </div>

              {/* Specifications Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-sm">Engine</span>
                  </div>
                  <p className="font-bold text-gray-900">{vehicle.engine}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-sm">Seats</span>
                  </div>
                  <p className="font-bold text-gray-900">5 Seats</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    <span className="text-sm">Type</span>
                  </div>
                  <p className="font-bold text-gray-900 capitalize">{vehicle.type}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-sm">Status</span>
                  </div>
                  <p className="font-bold text-green-600 capitalize">{vehicle.status}</p>
                </div>
              </div>

              {/* Features */}
              {vehicle.features && vehicle.features.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Features & Amenities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {vehicle.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-700 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Condition Score */}
              {vehicle.conditionScore && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">Condition Score</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[...Array(10)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-8 h-2 rounded-full ${
                              i < vehicle.conditionScore ? "bg-blue-600" : "bg-gray-200"
                            }`}
                          ></div>
                        ))}
                      </div>
                      <span className="text-2xl font-bold text-blue-600">{vehicle.conditionScore}/10</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Rental Information</h3>
              <div className="space-y-4 text-gray-600">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Flexible Cancellation</p>
                    <p className="text-sm">Cancel up to 24 hours before pickup for a full refund</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Insurance Included</p>
                    <p className="text-sm">Comprehensive coverage for your peace of mind</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Multiple Pickup Locations</p>
                    <p className="text-sm">Choose from various convenient pickup points</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">24/7 Roadside Assistance</p>
                    <p className="text-sm">Help is always available whenever you need it</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 p-6">
                <div className="mb-6">
                  <p className="text-gray-600 text-sm mb-1">Daily Rate</p>
                  <p className="text-4xl font-bold text-gray-900">
                    Ksh {vehicle.ratePerDay.toLocaleString()}
                  </p>
                  <p className="text-gray-500 text-sm">per day</p>
                </div>

                {/* Date Selection */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Pick-up Date
                    </label>
                    <input
                      type="date"
                      value={bookingDates.startDate}
                      onChange={(e) => setBookingDates({ ...bookingDates, startDate: e.target.value })}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Return Date
                    </label>
                    <input
                      type="date"
                      value={bookingDates.endDate}
                      onChange={(e) => setBookingDates({ ...bookingDates, endDate: e.target.value })}
                      min={bookingDates.startDate || new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Price Breakdown */}
                {rental.days > 0 && (
                  <div className="bg-blue-50 rounded-xl p-4 mb-6 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Ksh {vehicle.ratePerDay.toLocaleString()} × {rental.days} {rental.days === 1 ? 'day' : 'days'}
                      </span>
                      <span className="font-semibold text-gray-900">
                        Ksh {rental.total.toLocaleString()}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-blue-200 flex justify-between">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="font-bold text-blue-600 text-xl">
                        Ksh {rental.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Book Button */}
                <button
                  onClick={() => setShowBookingModal(true)}
                  disabled={rental.days <= 0}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {rental.days > 0 ? 'Book Now' : 'Select Dates'}
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                  You won't be charged yet
                </p>

                {/* Trust Signals */}
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Free cancellation</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Instant confirmation</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Verified vehicle</span>
                  </div>
                </div>
              </div>

              {/* Contact Card */}
              <div className="mt-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-6 text-white">
                <h3 className="font-bold text-lg mb-2">Need Help?</h3>
                <p className="text-blue-100 text-sm mb-4">
                  Our team is available 24/7 to assist you
                </p>
                <button className="w-full py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-scale-in">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm Booking</h2>
                <p className="text-gray-600">Review your rental details</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Vehicle</p>
                  <p className="font-bold text-gray-900">{vehicle.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Pick-up</p>
                    <p className="font-bold text-gray-900">
                      {new Date(bookingDates.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Return</p>
                    <p className="font-bold text-gray-900">
                      {new Date(bookingDates.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">Total ({rental.days} days)</span>
                    <span className="text-2xl font-bold text-blue-600">
                      Ksh {rental.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBooking}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all font-semibold shadow-lg"
                >
                  Confirm
                </button>


                  {token ? (
                    <button
                      onClick={handleHire}
                      className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Request Hire
                    </button>
                  ) : (
                    <p className="text-red-500">
                      Login to hire this vehicle
                    </p>
                  )}






              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}