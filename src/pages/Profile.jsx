import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api";

export default function Profile() {
  const [user, setUser] = useState(null);
const [form, setForm] = useState({
  name: "",
  phone: "",
  idNumber: ""
});


  const [files, setFiles] = useState({
    portrait: null,
    idDocument: null,
    drivingLicense: null
  });

  const token = localStorage.getItem("token");

  // ===============================
  // Fetch Profile
  // ===============================
  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setUser(data);
        setForm({
        name: data.name || "",
        phone: data.phone || "",
        idNumber: data.idNumber || ""
        });

    };

    fetchProfile();
  }, []);

  // ===============================
  // Handle Form Change
  // ===============================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ===============================
  // Update Profile
  // ===============================
  const handleUpdate = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_URL}/user/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    setUser(data);
    alert("Profile updated successfully");
  };

  // ===============================
  // Handle File Change
  // ===============================
  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  // ===============================
  // Upload Documents
  // ===============================
  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    if (files.portrait) formData.append("portrait", files.portrait);
    if (files.idDocument) formData.append("idDocument", files.idDocument);
    if (files.drivingLicense)
      formData.append("drivingLicense", files.drivingLicense);

    const res = await fetch(`${API_URL}/user/upload-documents`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    const data = await res.json();
    setUser(data.user);
    alert("Documents uploaded successfully");
  };

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">

      <h2 className="text-2xl font-bold">My Profile</h2>

      {/* ================= ACCOUNT INFO CARD ================= */}
      <div className="bg-white shadow rounded p-6">
        <h3 className="text-xl font-semibold mb-4">
          Account Information
        </h3>

        <div className="grid grid-cols-2 gap-4 text-gray-700">

          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="font-medium">{user.name}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium">
              {user.phone || "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">National ID</p>
            <p className="font-medium">
              {user.idNumber || "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Verification</p>
            <p className={`font-medium ${user.isVerified ? "text-green-600" : "text-red-500"}`}>
              {user.isVerified ? "Verified" : "Pending"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Account Status</p>
            <p className={`font-medium ${user.isSuspended ? "text-red-600" : "text-green-600"}`}>
              {user.isSuspended ? "Suspended" : "Active"}
            </p>
          </div>

        </div>
      </div>

      {/* ================= UPDATE PROFILE CARD ================= */}
      <div className="bg-white shadow rounded p-6">
        <h3 className="text-xl font-semibold mb-4">
          Update Profile
        </h3>

        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full border p-2 rounded"
          />

          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full border p-2 rounded"
          />
        <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        name="idNumber"
        value={form.idNumber}
        onChange={(e) => {
            const onlyNums = e.target.value.replace(/\D/g, "");
            setForm({ ...form, idNumber: onlyNums });
        }}
        placeholder="National ID Number"
        className="w-full border p-2 rounded"
        disabled={user.idNumber}
        />



          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Update
          </button>
        </form>
      </div>

      {/* ================= DOCUMENT UPLOAD CARD ================= */}
      <div className="bg-white shadow rounded p-6">
        <h3 className="text-xl font-semibold mb-4">
          Upload Documents
        </h3>

        <form onSubmit={handleUpload} className="space-y-4">

          <input
            type="file"
            name="portrait"
            onChange={handleFileChange}
          />

          <input
            type="file"
            name="idDocument"
            onChange={handleFileChange}
          />

          <input
            type="file"
            name="drivingLicense"
            onChange={handleFileChange}
          />

          <button className="bg-green-600 text-white px-4 py-2 rounded">
            Upload
          </button>
        </form>
      </div>

      {/* ================= DOCUMENT PREVIEW ================= */}
      <div className="grid grid-cols-3 gap-4">
        {user.portraitPhoto && (
          <img src={user.portraitPhoto} alt="Portrait" className="rounded shadow" />
        )}
        {user.idDocument && (
          <img src={user.idDocument} alt="ID" className="rounded shadow" />
        )}
        {user.drivingLicense && (
          <img src={user.drivingLicense} alt="DL" className="rounded shadow" />
        )}
      </div>

    </div>
  );
}
