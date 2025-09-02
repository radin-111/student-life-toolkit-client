import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { FaTrashAlt, FaEdit, FaFilePdf, FaCalendarAlt } from "react-icons/fa";
import useAxios from "../../hooks/useAxios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import Loading from "../../Components/Loading";
import { jsPDF } from "jspdf";

export default function ClassScheduleTracker() {
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [editingClass, setEditingClass] = useState(null);
  const classesPerPage = 5;
  const navigate = useNavigate();
  const { user } = useAuth();

  // Tailwind colors to RGB mapping for PDF
  const colorMap = {
    "red-500": [239, 68, 68],
    "blue-500": [59, 130, 246],
    "green-500": [34, 197, 94],
    "yellow-400": [250, 204, 21],
    "purple-500": [139, 92, 246],
    "pink-500": [236, 72, 153],
    "indigo-500": [79, 70, 229],
    "orange-500": [251, 146, 60],
    "teal-500": [20, 184, 166],
    "lime-500": [132, 204, 22],
  };

  // Fetch classes
  const { data: classes = [], isLoading } = useQuery({
    queryKey: ["classes", user?.providerData[0]?.email],
    queryFn: async () => {
      if (!user?.providerData[0]?.email) return [];
      const res = await axiosSecure.get(
        `/classes?email=${user?.providerData[0]?.email}`
      );
      return Array.isArray(res.data) ? res.data : [];
    },
    enabled: !!user?.providerData[0]?.email,
  });

  // Delete class
  const deleteMutation = useMutation({
    mutationFn: async (id) => await axiosSecure.delete(`/classes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["classes"]);
      Swal.fire("Deleted!", "Class deleted successfully.", "success");
    },
    onError: () => Swal.fire("Error!", "Failed to delete class.", "error"),
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  // Update class
  const updateMutation = useMutation({
    mutationFn: async ({ id, updated }) =>
      await axiosSecure.put(`/classes/${id}`, updated),
    onSuccess: () => {
      queryClient.invalidateQueries(["classes"]);
      Swal.fire("Success!", "Class updated successfully.", "success");
      setEditingClass(null);
    },
    onError: () => Swal.fire("Error!", "Failed to update class.", "error"),
  });

  // Pagination
  const indexOfLast = currentPage * classesPerPage;
  const indexOfFirst = indexOfLast - classesPerPage;
  const currentClasses = classes.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(classes.length / classesPerPage);

  // Group by date
  const groupedByDate = currentClasses.reduce((acc, cls) => {
    const date = cls.datetime.split("T")[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(cls);
    return acc;
  }, {});

  // Drag start
  const handleDragStart = (e, cls) =>
    e.dataTransfer.setData("classId", cls._id);

  // --- EXPORT FUNCTIONS ---
  const exportPDF = () => {
    const doc = new jsPDF("p", "pt", "a4");
    doc.setFontSize(20);
    doc.text("📅 Class Schedule Tracker", 40, 40);

    let y = 70;

    Object.keys(groupedByDate)
      .sort()
      .forEach((date) => {
        doc.setFontSize(16);
        doc.setTextColor(40, 40, 40);
        doc.text(format(new Date(date), "EEEE, MMMM dd, yyyy"), 40, y);
        y += 20;

        groupedByDate[date].forEach((cls) => {
          // Colored left border
          const color = colorMap[cls.color] || [0, 0, 0];
          doc.setFillColor(...color);
          doc.rect(40, y, 5, 50, "F");

          // Card background
          doc.setFillColor(255, 255, 255);
          doc.rect(45, y, 500, 50, "F");

          // Card text
          doc.setFontSize(14);
          doc.setTextColor(0, 0, 0);
          doc.text(`Subject: ${cls.subject}`, 50, y + 15);
          doc.text(`Instructor: ${cls.instructor}`, 50, y + 30);
          doc.text(`Time: ${cls.datetime.split("T")[1]}`, 50, y + 45);

          y += 60;
          if (y > 750) {
            // new page
            doc.addPage();
            y = 40;
          }
        });
        y += 10;
      });

    doc.save("class_schedule.pdf");
  };

  const exportICS = () => {
    let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
METHOD:PUBLISH
`;
    classes.forEach((cls) => {
      const start = cls.datetime.replace(/-|:/g, "").split(".")[0]; // YYYYMMDDTHHMMSS
      const endDate = new Date(cls.datetime);
      endDate.setHours(endDate.getHours() + 1); // 1 hour default duration
      const end = endDate.toISOString().replace(/-|:|\.\d+/g, "");
      icsContent += `BEGIN:VEVENT
SUMMARY:${cls.subject}
DTSTART:${start}Z
DTEND:${end}Z
DESCRIPTION:Instructor: ${cls.instructor}
END:VEVENT
`;
    });
    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "class_schedule.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) return <Loading />;

  if (classes.length === 0) {
    return (
      <div className="text-center space-y-5 mt-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-700">
          No classes added yet
        </h1>
        <button
          className="btn btn-success"
          onClick={() => navigate("/dashboard/add_class")}
        >
          ➕ Add Class
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center text-primary mb-6">
        📅 Class Schedule Tracker
      </h1>
      <div className="flex gap-2 mb-4 flex-wrap justify-center">
        <button
          className="btn btn-success"
          onClick={() => navigate("/dashboard/add_class")}
        >
          ➕ Add Class
        </button>
        <button className="btn btn-primary" onClick={exportPDF}>
          <FaFilePdf className="mr-1" /> Export PDF
        </button>
        <button className="btn btn-secondary" onClick={exportICS}>
          <FaCalendarAlt className="mr-1" /> Export ICS
        </button>
      </div>

      {Object.keys(groupedByDate)
        .sort()
        .map((date) => (
          <div key={date} className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-700 border-b pb-1 mb-2">
              {format(new Date(date), "EEEE, MMMM dd, yyyy")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedByDate[date].map((cls) => (
                <div
                  key={cls._id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, cls)}
                  className={`relative p-5 rounded-xl shadow-lg border-l-8 hover:shadow-2xl transition-all duration-300 cursor-grab border-${cls.color} bg-white`}
                >
                  <span
                    className={`absolute top-3 right-3 w-3 h-3 rounded-full bg-${cls.color}`}
                  ></span>
                  <h3 className="font-bold text-lg mb-1">{cls.subject}</h3>
                  <p className="text-sm text-gray-600">
                    Instructor: {cls.instructor}
                  </p>
                  <p className="text-sm text-gray-500">
                    ⏰ {cls.datetime.split("T")[1]}
                  </p>
                  <div className="flex gap-3 mt-3">
                    <label
                      htmlFor="edit-class-modal"
                      onClick={() => setEditingClass(cls)}
                      className="flex items-center gap-1 btn btn-sm btn-outline btn-primary hover:bg-primary hover:text-white cursor-pointer transition"
                    >
                      <FaEdit /> Edit
                    </label>
                    <button
                      onClick={() => handleDelete(cls._id)}
                      className="flex items-center gap-1 btn btn-sm btn-outline btn-error hover:bg-error hover:text-white transition"
                    >
                      <FaTrashAlt /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`btn btn-sm ${
              currentPage === i + 1 ? "btn-primary" : "btn-outline"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Modal */}
      <input
        type="checkbox"
        id="edit-class-modal"
        className="modal-toggle"
        checked={!!editingClass}
        readOnly
      />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor="edit-class-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={() => setEditingClass(null)}
          >
            ✕
          </label>
          <h3 className="text-lg font-bold mb-4">Edit Class</h3>
          {editingClass && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const updated = {
                  subject: formData.get("subject"),
                  datetime: formData.get("datetime"),
                  instructor: formData.get("instructor"),
                  color: formData.get("color"),
                };
                updateMutation.mutate({ id: editingClass._id, updated });
              }}
              className="space-y-3"
            >
              <input
                name="subject"
                defaultValue={editingClass.subject}
                placeholder="Subject"
                className="input input-bordered w-full"
                required
              />
              <input
                name="datetime"
                type="datetime-local"
                defaultValue={editingClass.datetime}
                className="input input-bordered w-full"
                required
              />
              <input
                name="instructor"
                defaultValue={editingClass.instructor}
                placeholder="Instructor"
                className="input input-bordered w-full"
                required
              />
              <select
                name="color"
                defaultValue={editingClass.color}
                className="select select-bordered w-full"
                required
              >
                <option value="red-500">Red</option>
                <option value="blue-500">Blue</option>
                <option value="green-500">Green</option>
                <option value="yellow-400">Yellow</option>
                <option value="purple-500">Purple</option>
                <option value="pink-500">Pink</option>
                <option value="indigo-500">Indigo</option>
                <option value="orange-500">Orange</option>
                <option value="teal-500">Teal</option>
                <option value="lime-500">Lime</option>
              </select>
              <button type="submit" className="btn btn-primary w-full mt-2">
                Save Changes
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
