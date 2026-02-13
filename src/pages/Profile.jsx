import { useEffect, useState } from "react";
import { User, Mail, Phone, CreditCard, CheckCircle, XCircle, Upload, Camera, FileText, Loader2, AlertCircle } from "lucide-react";

const API_URL = "http://localhost:5000/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
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

  const [filePreviews, setFilePreviews] = useState({
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
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        setUser(data);
        setForm({
          name: data.name || "",
          phone: data.phone || "",
          idNumber: data.idNumber || ""
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

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
    
    try {
      setUpdating(true);
      setError(null);
      setSuccess(null);

      const res = await fetch(`${API_URL}/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const data = await res.json();
      setUser(data);
      setSuccess("Profile updated successfully!");
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  // ===============================
  // Handle File Change with Preview
  // ===============================
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const fieldName = e.target.name;
    
    if (file) {
      setFiles({ ...files, [fieldName]: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreviews({ ...filePreviews, [fieldName]: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // ===============================
  // Upload Documents
  // ===============================
  const handleUpload = async (e) => {
    e.preventDefault();

    try {
      setUploading(true);
      setError(null);
      setSuccess(null);

      const formData = new FormData();

      if (files.portrait) formData.append("portrait", files.portrait);
      if (files.idDocument) formData.append("idDocument", files.idDocument);
      if (files.drivingLicense) formData.append("drivingLicense", files.drivingLicense);

      const res = await fetch(`${API_URL}/user/upload-documents`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) throw new Error("Failed to upload documents");

      const data = await res.json();
      setUser(data.user);
      setSuccess("Documents uploaded successfully!");
      
      // Clear file inputs
      setFiles({ portrait: null, idDocument: null, drivingLicense: null });
      setFilePreviews({ portrait: null, idDocument: null, drivingLicense: null });
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  // ===============================
  // Loading State
  // ===============================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8 mt-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information and documents</p>
        </div>

        {/* Alert Messages */}
        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg shadow-sm animate-fade-in">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
              <p className="text-green-800 font-medium">{success}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Account Overview */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-24"></div>
              <div className="px-6 pb-6">
                <div className="relative -mt-12 mb-4">
                  <div className="w-24 h-24 rounded-full border-4 border-white bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg">
                    {user.portraitPhoto ? (
                      <img 
                        src={user.portraitPhoto} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-white" />
                    )}
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h2>
                <p className="text-gray-500 mb-4">{user.email}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Verification</span>
                    <div className="flex items-center">
                      {user.isVerified ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                          <span className="text-sm font-semibold text-green-600">Verified</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-amber-500 mr-1" />
                          <span className="text-sm font-semibold text-amber-600">Pending</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Account Status</span>
                    <span className={`text-sm font-semibold ${user.isSuspended ? "text-red-600" : "text-green-600"}`}>
                      {user.isSuspended ? "Suspended" : "Active"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Details</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                    <p className="text-gray-900 font-medium">{user.phone || "Not provided"}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CreditCard className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">National ID</p>
                    <p className="text-gray-900 font-medium">{user.idNumber || "Not provided"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Forms and Documents */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Update Profile Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Update Profile</h3>
                  <p className="text-sm text-gray-500">Keep your information up to date</p>
                </div>
              </div>

              <form onSubmit={handleUpdate} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    National ID Number
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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
                      placeholder="Enter your national ID number"
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none disabled:bg-gray-50 disabled:text-gray-500"
                      disabled={user.idNumber}
                    />
                  </div>
                  {user.idNumber && (
                    <p className="mt-2 text-xs text-gray-500">ID number cannot be changed once set</p>
                  )}
                </div>

                <button 
                  type="submit"
                  disabled={updating}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {updating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Update Profile
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Document Upload */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <Upload className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Upload Documents</h3>
                  <p className="text-sm text-gray-500">Required for account verification</p>
                </div>
              </div>

              <form onSubmit={handleUpload} className="space-y-5">
                
                {/* Portrait Photo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Camera className="w-4 h-4 inline mr-2" />
                    Portrait Photo
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors text-center">
                        {filePreviews.portrait ? (
                          <img src={filePreviews.portrait} alt="Preview" className="w-24 h-24 object-cover rounded-lg mx-auto mb-2" />
                        ) : (
                          <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        )}
                        <p className="text-sm text-gray-600">Click to upload</p>
                        <p className="text-xs text-gray-400 mt-1">JPG, PNG (max 5MB)</p>
                      </div>
                      <input
                        type="file"
                        name="portrait"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* ID Document */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <CreditCard className="w-4 h-4 inline mr-2" />
                    ID Document
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors text-center">
                        {filePreviews.idDocument ? (
                          <img src={filePreviews.idDocument} alt="Preview" className="w-24 h-24 object-cover rounded-lg mx-auto mb-2" />
                        ) : (
                          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        )}
                        <p className="text-sm text-gray-600">Click to upload</p>
                        <p className="text-xs text-gray-400 mt-1">JPG, PNG, PDF (max 5MB)</p>
                      </div>
                      <input
                        type="file"
                        name="idDocument"
                        onChange={handleFileChange}
                        accept="image/*,application/pdf"
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Driving License */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <CreditCard className="w-4 h-4 inline mr-2" />
                    Driving License
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors text-center">
                        {filePreviews.drivingLicense ? (
                          <img src={filePreviews.drivingLicense} alt="Preview" className="w-24 h-24 object-cover rounded-lg mx-auto mb-2" />
                        ) : (
                          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        )}
                        <p className="text-sm text-gray-600">Click to upload</p>
                        <p className="text-xs text-gray-400 mt-1">JPG, PNG, PDF (max 5MB)</p>
                      </div>
                      <input
                        type="file"
                        name="drivingLicense"
                        onChange={handleFileChange}
                        accept="image/*,application/pdf"
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={uploading || (!files.portrait && !files.idDocument && !files.drivingLicense)}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-2" />
                      Upload Documents
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Document Preview */}
            {(user.portraitPhoto || user.idDocument || user.drivingLicense) && (
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Uploaded Documents</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {user.portraitPhoto && (
                    <div className="group relative">
                      <div className="aspect-square rounded-xl overflow-hidden shadow-md border-2 border-gray-100 group-hover:border-blue-500 transition-all">
                        <img 
                          src={user.portraitPhoto} 
                          alt="Portrait" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <p className="mt-2 text-sm font-medium text-gray-700 text-center">Portrait Photo</p>
                    </div>
                  )}
                  {user.idDocument && (
                    <div className="group relative">
                      <div className="aspect-square rounded-xl overflow-hidden shadow-md border-2 border-gray-100 group-hover:border-blue-500 transition-all">
                        <img 
                          src={user.idDocument} 
                          alt="ID Document" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <p className="mt-2 text-sm font-medium text-gray-700 text-center">ID Document</p>
                    </div>
                  )}
                  {user.drivingLicense && (
                    <div className="group relative">
                      <div className="aspect-square rounded-xl overflow-hidden shadow-md border-2 border-gray-100 group-hover:border-blue-500 transition-all">
                        <img 
                          src={user.drivingLicense} 
                          alt="Driving License" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <p className="mt-2 text-sm font-medium text-gray-700 text-center">Driving License</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}