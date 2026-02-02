import { useState } from "react";

export default function AddVehicle() {
  const [form, setForm] = useState({
    name: "",
    brand: "",
    engine: "",
    type: "",
    ratePerDay: "",
    features: ""
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.type) {
      alert("Please select a vehicle type");
      return;
    }

    setLoading(true);

    const formData = new FormData();

    formData.append("name", form.name.trim());
    formData.append("brand", form.brand.trim());
    formData.append("engine", form.engine.trim());
    formData.append("type", form.type);
    formData.append("ratePerDay", Number(form.ratePerDay));

    // Convert comma-separated features to array
    const featuresArray = form.features
      .split(",")
      .map(f => f.trim())
      .filter(Boolean);

    formData.append("features", JSON.stringify(featuresArray));

    images.forEach((img) => formData.append("images", img));

    try {
      const res = await fetch("http://localhost:5000/api/admin/vehicles", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to add vehicle");

      alert("✅ Vehicle added successfully");

      setForm({
        name: "",
        brand: "",
        engine: "",
        type: "",
        ratePerDay: "",
        features: ""
      });
      setImages([]);
    } catch (err) {
      alert(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add Vehicle</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow">

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Vehicle Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Brand</label>
            <input
              name="brand"
              value={form.brand}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Engine</label>
            <input
              name="engine"
              value={form.engine}
              onChange={handleChange}
              placeholder="e.g. 2.0L Turbo"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Vehicle Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select type</option>
              <option value="electric">Electric</option>
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Rate per Day</label>
            <input
              name="ratePerDay"
              type="number"
              min="0"
              value={form.ratePerDay}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        {/* Features */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Features (comma separated)
          </label>
          <input
            name="features"
            value={form.features}
            onChange={handleChange}
            placeholder="Heated seats, Wireless charging, GPS"
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium mb-2">Vehicle Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages([...e.target.files])}
          />

          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-4">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(img)}
                  alt="preview"
                  className="h-24 w-full object-cover rounded border"
                />
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Adding vehicle..." : "Add Vehicle"}
        </button>
      </form>
    </div>
  );
}
