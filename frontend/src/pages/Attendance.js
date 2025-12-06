import React, { useState, useEffect } from 'react';
import { FiClock, FiCheckCircle } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const Attendance = () => {
  const [attendances, setAttendances] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    employeeId: '',
    day: new Date().toISOString().split('T')[0],
    timeIn: '',
    timeOut: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [attendancesRes, employeesRes] = await Promise.all([
        fetch(`${API_URL}/attendances`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch(`${API_URL}/employees`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ]);

      if (attendancesRes.ok) {
        const data = await attendancesRes.json();
        setAttendances(data.data);
      }
      if (employeesRes.ok) {
        const data = await employeesRes.json();
        setEmployees(data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          employeeId: formData.employeeId,
          day: formData.day,
          timeIn: formData.timeIn || undefined,
          timeOut: formData.timeOut || undefined,
        }),
      });

      if (response.ok) {
        alert('Attendance marked successfully');
        setFormData({
          employeeId: '',
          day: new Date().toISOString().split('T')[0],
          timeIn: '',
          timeOut: '',
        });
        fetchData();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to mark attendance');
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('Failed to mark attendance');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
        <p className="mt-1 text-sm text-gray-500">Mark employee attendance</p>
      </div>

      {/* Mark Attendance Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Mark Attendance</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">
                Employee *
              </label>
              <select
                id="employeeId"
                name="employeeId"
                required
                value={formData.employeeId}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.firstName} {emp.lastName || ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="day" className="block text-sm font-medium text-gray-700">
                Date *
              </label>
              <input
                type="date"
                id="day"
                name="day"
                required
                value={formData.day}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label htmlFor="timeIn" className="block text-sm font-medium text-gray-700">
                Time In (e.g., 09:00 AM)
              </label>
              <input
                type="text"
                id="timeIn"
                name="timeIn"
                value={formData.timeIn}
                onChange={handleChange}
                placeholder="09:00 AM"
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label htmlFor="timeOut" className="block text-sm font-medium text-gray-700">
                Time Out (e.g., 05:00 PM)
              </label>
              <input
                type="text"
                id="timeOut"
                name="timeOut"
                value={formData.timeOut}
                onChange={handleChange}
                placeholder="05:00 PM"
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <FiCheckCircle className="mr-2 h-5 w-5" />
            Mark Attendance
          </button>
        </form>
      </div>

      {/* Attendance Records */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Attendance Records</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Working Hours
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendances.length > 0 ? (
                attendances.map((attendance) => (
                  <tr key={attendance._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {attendance.employee?.firstName} {attendance.employee?.lastName || ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {attendance.day}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {attendance.timeIn ? (
                        <span className="flex items-center text-green-600">
                          <FiClock className="mr-1 h-4 w-4" />
                          {attendance.timeIn}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {attendance.timeOut ? (
                        <span className="flex items-center text-blue-600">
                          <FiClock className="mr-1 h-4 w-4" />
                          {attendance.timeOut}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {attendance.workingHours ? (
                        <span className="font-medium text-gray-900">
                          {attendance.workingHours}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No attendance records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;

