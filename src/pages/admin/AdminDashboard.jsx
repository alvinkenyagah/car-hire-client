import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-10">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-gray-600">Vehicles</h2>
          <p className="text-3xl font-bold mt-2">—</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-gray-600">Hire Requests</h2>
          <p className="text-3xl font-bold mt-2">—</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-gray-600">Users</h2>
          <p className="text-3xl font-bold mt-2">—</p>
        </div>
      </div>

      {/* Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Link
          to="/admin/vehicles/add"
          className="bg-blue-600 text-white p-6 rounded shadow hover:bg-blue-700 transition"
        >
          <h3 className="text-xl font-bold">Add Vehicle</h3>
          <p className="mt-2">Create and upload new vehicles</p>
        </Link>

        <Link
          to="/admin/vehicles"
          className="bg-white p-6 rounded shadow hover:shadow-lg transition"
        >
          <h3 className="text-xl font-bold">Manage Vehicles</h3>
          <p className="mt-2 text-gray-600">
            Edit, delete, and update vehicle status
          </p>
        </Link>

        <Link
          to="/admin/hires"
          className="bg-white p-6 rounded shadow hover:shadow-lg transition"
        >
          <h3 className="text-xl font-bold">Hire Requests</h3>
          <p className="mt-2 text-gray-600">
            Approve or reject hire requests
          </p>
        </Link>

        <Link
          to="/admin/users"
          className="bg-white p-6 rounded shadow hover:shadow-lg transition"
        >
          <h3 className="text-xl font-bold">Users</h3>
          <p className="mt-2 text-gray-600">
            View users, documents, suspend accounts
          </p>
        </Link>
      </div>
    </div>
  );
}
