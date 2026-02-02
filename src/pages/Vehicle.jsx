import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  // Fetch all available vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/vehicles");
        const data = await res.json();
        setVehicles(data);
        setFilteredVehicles(data);
        
        // Set initial price range based on data
        if (data.length > 0) {
          const prices = data.map(v => v.ratePerDay);
          setPriceRange([0, Math.max(...prices)]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  // Filter and sort whenever filters change
  useEffect(() => {
    let filtered = vehicles;

    // Apply search filter
    if (search) {
      filtered = filtered.filter((v) =>
        v.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply type filter
    if (typeFilter) {
      filtered = filtered.filter((v) => v.type === typeFilter);
    }

    // Apply brand filter
    if (brandFilter) {
      filtered = filtered.filter((v) =>
        v.brand.toLowerCase().includes(brandFilter.toLowerCase())
      );
    }

    // Apply price range filter
    filtered = filtered.filter(
      (v) => v.ratePerDay >= priceRange[0] && v.ratePerDay <= priceRange[1]
    );

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.ratePerDay - b.ratePerDay);
        break;
      case "price-high":
        filtered.sort((a, b) => b.ratePerDay - a.ratePerDay);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "brand":
        filtered.sort((a, b) => a.brand.localeCompare(b.brand));
        break;
      default:
        break;
    }

    setFilteredVehicles(filtered);
  }, [typeFilter, brandFilter, search, priceRange, sortBy, vehicles]);

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setTypeFilter("");
    setBrandFilter("");
    setSortBy("name");
    if (vehicles.length > 0) {
      const prices = vehicles.map(v => v.ratePerDay);
      setPriceRange([0, Math.max(...prices)]);
    }
  };

  // Get unique brands from vehicles
  const uniqueBrands = [...new Set(vehicles.map(v => v.brand))].sort();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 pb-12">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Browse Our Fleet
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find the perfect vehicle for your journey from our wide selection of quality cars
          </p>
        </div>

        {/* Stats Bar */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-blue-600">{vehicles.length}</p>
              <p className="text-sm text-gray-600">Total Vehicles</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">{filteredVehicles.length}</p>
              <p className="text-sm text-gray-600">Available Now</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">{uniqueBrands.length}</p>
              <p className="text-sm text-gray-600">Brands</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">24/7</p>
              <p className="text-sm text-gray-600">Support</p>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search vehicles by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              />
            </div>

            {/* Filter Toggle Button (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </button>

            {/* View Mode Toggle */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className={`mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 ${showFilters ? 'block' : 'hidden md:grid'}`}>
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Vehicle Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              >
                <option value="">All Types</option>
                <option value="electric">Electric</option>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Brand
              </label>
              <select
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              >
                <option value="">All Brands</option>
                {uniqueBrands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              >
                <option value="name">Name (A-Z)</option>
                <option value="brand">Brand</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {(search || typeFilter || brandFilter || sortBy !== "name") && (
          <div className="flex flex-wrap gap-2 mb-6">
            {search && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Search: {search}
                <button onClick={() => setSearch("")} className="hover:text-blue-900">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </span>
            )}
            {typeFilter && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Type: {typeFilter}
                <button onClick={() => setTypeFilter("")} className="hover:text-blue-900">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </span>
            )}
            {brandFilter && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Brand: {brandFilter}
                <button onClick={() => setBrandFilter("")} className="hover:text-blue-900">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Vehicle Grid/List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          // Loading State
          <div className={viewMode === "grid" ? "grid gap-8 md:grid-cols-3 sm:grid-cols-2" : "space-y-6"}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
                <div className="w-full h-56 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredVehicles.length === 0 ? (
          // Empty State
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No vehicles found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search criteria</p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Clear All Filters
            </button>
          </div>
        ) : viewMode === "grid" ? (
          // Grid View



          <div
              key={vehicles._id}
              onClick={() => navigate(`/vehicles/${vehicles._id}`)}  // ✅ Add this
              className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 hover:-translate-y-2 cursor-pointer"  // ✅ Add cursor-pointer
            >

          <div className="grid gap-8 md:grid-cols-3 sm:grid-cols-2">
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle._id}
                className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 hover:-translate-y-2"
              >
                {/* Image Container */}
                <div className="relative overflow-hidden h-56">
                  <img
                    src={vehicle.images[0] || "https://via.placeholder.com/400x250"}
                    alt={vehicle.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Badges */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                      Available
                    </span>
                    <span className="bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-xs font-semibold shadow-lg capitalize">
                      {vehicle.type}
                    </span>
                  </div>
                  {/* Quick Actions */}
                  <div className="absolute top-4 left-4">
                    <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                      <svg className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                    {vehicle.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                    <p className="text-gray-600 text-sm font-medium">{vehicle.brand}</p>
                  </div>

                  {/* Features */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>5 Seats</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="capitalize">{vehicle.type}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        Ksh {vehicle.ratePerDay.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">per day</p>
                    </div>
                    <button
                      onClick={() => alert("Hire functionality coming soon")}
                      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all font-medium shadow-md hover:shadow-lg"
                    >
                      Hire Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>
        ) : (


          
          // List View


          <div
              key={vehicles._id}
              onClick={() => navigate(`/vehicles/${vehicles._id}`)}  // ✅ Add this
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 cursor-pointer"  // ✅ Add cursor-pointer
            >


          <div className="space-y-6">
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="md:w-80 h-64 md:h-auto relative overflow-hidden">
                    <img
                      src={vehicle.images[0] || "https://via.placeholder.com/400x250"}
                      alt={vehicle.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                    <span className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                      Available
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-2xl text-gray-900 mb-2">
                            {vehicle.name}
                          </h3>
                          <div className="flex items-center gap-2 mb-3">
                            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                            </svg>
                            <p className="text-gray-600 font-medium">{vehicle.brand}</p>
                          </div>
                        </div>
                        <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                          <svg className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>5 Seats</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <span className="capitalize">{vehicle.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          <span>Verified</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                      <div>
                        <p className="text-3xl font-bold text-gray-900">
                          Ksh {vehicle.ratePerDay.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">per day</p>
                      </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click
                      navigate(`/vehicles/${vehicle._id}`);
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all font-medium shadow-md hover:shadow-lg"
                  >
                    View Details
                  </button>


                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>
        )}
      </div>
    </div>
  );
}