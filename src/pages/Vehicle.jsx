import React, { useEffect, useState } from "react";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [search, setSearch] = useState("");

  // Fetch all available vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/vehicles");
        const data = await res.json();
        setVehicles(data);
        setFilteredVehicles(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchVehicles();
  }, []);

  // Filter whenever filter changes
  useEffect(() => {
    let filtered = vehicles;

    if (typeFilter) {
      filtered = filtered.filter((v) => v.type === typeFilter);
    }
    if (brandFilter) {
      filtered = filtered.filter((v) =>
        v.brand.toLowerCase().includes(brandFilter.toLowerCase())
      );
    }
    if (search) {
      filtered = filtered.filter((v) =>
        v.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredVehicles(filtered);
  }, [typeFilter, brandFilter, search, vehicles]);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Available Vehicles</h1>

      {/* Filters */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded flex-1"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Types</option>
          <option value="electric">Electric</option>
          <option value="petrol">Petrol</option>
          <option value="diesel">Diesel</option>
          <option value="hybrid">Hybrid</option>
        </select>
        <input
          type="text"
          placeholder="Filter by brand..."
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
          className="p-2 border rounded flex-1"
        />
      </div>

      {/* Vehicle Grid */}
      <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-3 sm:grid-cols-2">
        {filteredVehicles.length === 0 ? (
          <p className="text-center col-span-full">No vehicles found.</p>
        ) : (
          filteredVehicles.map((vehicle) => (
            <div
              key={vehicle._id}
              className="bg-white rounded shadow hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={
                  vehicle.images[0] || "https://via.placeholder.com/400x250"
                }
                alt={vehicle.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-xl mb-1">{vehicle.name}</h3>
                <p className="text-gray-600 mb-1">{vehicle.brand}</p>
                <p className="text-gray-600 mb-1">Type: {vehicle.type}</p>
                <p className="font-semibold">Ksh {vehicle.ratePerDay}/day</p>
                <button
                  onClick={() => alert("Hire functionality coming soon")}
                  className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                  Hire Vehicle
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
