import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { FaTrashAlt, FaEdit, FaFilePdf, FaCalendarAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import useAxios from "../../hooks/useAxios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import Loading from "../../Components/Loading";
import { jsPDF } from "jspdf";
import { useLenis, AnimatedPage, AnimatedCard } from "../../utils/animations";

export default function ClassScheduleTracker() {
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [editingClass, setEditingClass] = useState(null);
  const classesPerPage = 5;
  const navigate = useNavigate();
  const { user } = useAuth();

  // Initialize smooth scrolling
  useLenis();

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
      <AnimatedPage className="text-center space-y-5 mt-10">
        <motion.h1 
          className="text-3xl md:text-4xl font-bold text-gray-700"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          No classes added yet
        </motion.h1>
        <motion.button
          className="btn btn-success"
          onClick={() => navigate("/dashboard/add_class")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          ➕ Add Class
        </motion.button>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage className="p-4 max-w-6xl mx-auto space-y-8">
      <motion.h1 
        className="text-3xl md:text-4xl font-extrabold text-center text-primary mb-6"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        📅 Class Schedule Tracker
      </motion.h1>
      <motion.div 
        className="flex gap-2 mb-4 flex-wrap justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <motion.button
          className="btn btn-success"
          onClick={() => navigate("/dashboard/add_class")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ➕ Add Class
        </motion.button>
        <motion.button 
          className="btn btn-primary" 
          onClick={exportPDF}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaFilePdf className="mr-1" /> Export PDF
        </motion.button>
        <motion.button 
          className="btn btn-secondary" 
          onClick={exportICS}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaCalendarAlt className="mr-1" /> Export ICS
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {Object.keys(groupedByDate)
          .sort()
          .map((date, dateIndex) => (
            <motion.div 
              key={date} 
              className="space-y-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dateIndex * 0.1, duration: 0.6 }}
            >
              <motion.h2 
                className="text-xl md:text-2xl font-semibold text-gray-700 border-b pb-1 mb-2"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + dateIndex * 0.1 }}
              >
                {format(new Date(date), "EEEE, MMMM dd, yyyy")}
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {groupedByDate[date].map((cls, clsIndex) => (
                    <motion.div
                      key={cls._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, cls)}
                      className={`relative p-5 rounded-xl shadow-lg border-l-8 hover:shadow-2xl transition-all duration-300 cursor-grab border-${cls.color} bg-white`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ 
                        delay: 0.4 + dateIndex * 0.1 + clsIndex * 0.05,
                        type: "spring", 
                        stiffness: 300 
                      }}
                      whileHover={{ 
                        scale: 1.02, 
                        y: -5,
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                      }}
                      layout
                    >
                      <motion.span
                        className={`absolute top-3 right-3 w-3 h-3 rounded-full bg-${cls.color}`}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      ></motion.span>
                      <h3 className="font-bold text-lg mb-1">{cls.subject}</h3>
                      <p className="text-sm text-gray-600">
                        Instructor: {cls.instructor}
                      </p>
                      <p className="text-sm text-gray-500">
                        ⏰ {cls.datetime.split("T")[1]}
                      </p>
                      <div className="flex gap-3 mt-3">
                        <motion.label
                          htmlFor="edit-class-modal"
                          onClick={() => setEditingClass(cls)}
                          className="flex items-center gap-1 btn btn-sm btn-outline btn-primary hover:bg-primary hover:text-white cursor-pointer transition"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaEdit /> Edit
                        </motion.label>
                        <motion.button
                          onClick={() => handleDelete(cls._id)}
                          className="flex items-center gap-1 btn btn-sm btn-outline btn-error hover:bg-error hover:text-white transition"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaTrashAlt /> Delete
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
      </AnimatePresence>

      {/* Pagination */}
      <motion.div 
        className="flex justify-center gap-2 mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        {Array.from({ length: totalPages }, (_, i) => (
          <motion.button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`btn btn-sm ${
              currentPage === i + 1 ? "btn-primary" : "btn-outline"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 + i * 0.05 }}
          >
            {i + 1}
          </motion.button>
        ))}
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {editingClass && (
          <>
            <input
              type="checkbox"
              id="edit-class-modal"
              className="modal-toggle"
              checked={!!editingClass}
              readOnly
            />
            <motion.div 
              className="modal modal-open"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="modal-box relative"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.label
                  htmlFor="edit-class-modal"
                  className="btn btn-sm btn-circle absolute right-2 top-2"
                  onClick={() => setEditingClass(null)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ✕
                </motion.label>
                <motion.h3 
                  className="text-lg font-bold mb-4"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  Edit Class
                </motion.h3>
                <motion.form
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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.input
                    name="subject"
                    defaultValue={editingClass.subject}
                    placeholder="Subject"
                    className="input input-bordered w-full"
                    required
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  />
                  <motion.input
                    name="datetime"
                    type="datetime-local"
                    defaultValue={editingClass.datetime}
                    className="input input-bordered w-full"
                    required
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  />
                  <motion.input
                    name="instructor"
                    defaultValue={editingClass.instructor}
                    placeholder="Instructor"
                    className="input input-bordered w-full"
                    required
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  />
                  <motion.select
                    name="color"
                    defaultValue={editingClass.color}
                    className="select select-bordered w-full"
                    required
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
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
                  </motion.select>
                  <motion.button 
                    type="submit" 
                    className="btn btn-primary w-full mt-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    Save Changes
                  </motion.button>
                </motion.form>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
}
