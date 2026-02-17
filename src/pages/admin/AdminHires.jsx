import { useEffect, useState } from "react";

export default function AdminHires() {
  const [hires, setHires] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/hires", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setHires(data));
  }, []);

  const updateStatus = async (id, status) => {
    await fetch(`http://localhost:5000/api/admin/hires/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });

    window.location.reload();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Hire Requests</h1>

      {hires.map(hire => {
        const isOverdue =
          hire.status === "approved" &&
          new Date(hire.endDate) < new Date();

        return (
          <div
            key={hire._id}
            className={`p-4 mb-4 rounded shadow ${
              isOverdue ? "bg-red-100" : "bg-white"
            }`}
          >
            <p><strong>User:</strong> {hire.user.name}</p>
            <p><strong>Vehicle:</strong> {hire.vehicle.name}</p>
            <p><strong>Status:</strong> {hire.status}</p>

            {hire.status === "pending" && (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => updateStatus(hire._id, "approved")}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Approve
                </button>

                <button
                  onClick={() => updateStatus(hire._id, "rejected")}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </div>
            )}

            {isOverdue && (
              <p className="text-red-600 font-bold mt-2">
                ⚠ Overdue
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
