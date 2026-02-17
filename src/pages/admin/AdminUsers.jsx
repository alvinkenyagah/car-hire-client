import { useEffect, useState } from "react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  // Fetch all users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load users");
      }
    };

    fetchUsers();
  }, []);

  // Approve user
  const approveUser = async (id) => {
    const res = await fetch(`http://localhost:5000/api/admin/users/${id}/approve`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    if (res.ok) {
      alert(data.message);
      setUsers(users.map(u => u._id === id ? { ...u, isVerified: true } : u));
    } else {
      alert(data.message);
    }
  };

  // Suspend user
  const suspendUser = async (id) => {
    const res = await fetch(`http://localhost:5000/api/admin/users/${id}/suspend`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    if (res.ok) {
      alert(data.message);
      setUsers(users.map(u => u._id === id ? { ...u, isSuspended: true } : u));
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Suspended</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  {user.isVerified ? (
                    <span className="text-green-600 font-semibold">Verified</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Pending</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {user.isSuspended ? (
                    <span className="text-red-600 font-semibold">Suspended</span>
                  ) : (
                    <span className="text-green-600 font-semibold">Active</span>
                  )}
                </td>
                <td className="px-6 py-4 space-y-1">
                  {user.portraitPhoto && (
                    <img src={user.portraitPhoto} alt="Portrait" className="w-16 h-16 rounded object-cover border" />
                  )}
                  {user.idDocument && (
                    <img src={user.idDocument} alt="ID" className="w-16 h-16 rounded object-cover border" />
                  )}
                  {user.drivingLicense && (
                    <img src={user.drivingLicense} alt="DL" className="w-16 h-16 rounded object-cover border" />
                  )}
                </td>
                <td className="px-6 py-4 space-x-2">
                  {!user.isVerified && (
                    <button
                      onClick={() => approveUser(user._id)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                      Verify
                    </button>
                  )}
                  {!user.isSuspended && (
                    <button
                      onClick={() => suspendUser(user._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Suspend
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
