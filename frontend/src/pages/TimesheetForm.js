import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { timesheetAPI, employeeAPI, projectAPI, taskAPI } from '../services/api';
import { FiSave, FiX } from 'react-icons/fi';

const TimesheetForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    employee: '',
    project: '',
    task: '',
    date: new Date().toISOString().split('T')[0],
    timeSpent: '',
    progress: 0,
    notes: '',
    type: 'Development',
  });

  useEffect(() => {
    fetchEmployeesAndProjects();
    if (isEdit) {
      fetchTimesheet();
    }
  }, [id]);

  useEffect(() => {
    if (formData.project) {
      fetchTasksForProject();
    }
  }, [formData.project]);

  const fetchEmployeesAndProjects = async () => {
    try {
      const [employeesRes, projectsRes] = await Promise.all([
        employeeAPI.getAll(),
        projectAPI.getAll(),
      ]);
      setEmployees(employeesRes.data.data);
      setProjects(projectsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchTasksForProject = async () => {
    if (!formData.project) return;
    try {
      const response = await taskAPI.getByProject(formData.project);
      setTasks(response.data.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchTimesheet = async () => {
    try {
      const response = await timesheetAPI.getById(id);
      const timesheet = response.data.data;
      setFormData({
        employee: timesheet.employee?._id || timesheet.employee || '',
        project: timesheet.project?._id || timesheet.project || '',
        task: timesheet.task?._id || timesheet.task || '',
        date: timesheet.date ? new Date(timesheet.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        timeSpent: timesheet.timeSpent || '',
        progress: timesheet.progress || 0,
        notes: timesheet.notes || '',
        type: timesheet.type || 'Development',
      });
      if (timesheet.project?._id || timesheet.project) {
        fetchTasksForProject();
      }
    } catch (error) {
      console.error('Error fetching timesheet:', error);
      alert('Failed to load timesheet');
    }
  };

  const handleChange = (e) => {
    const value = e.target.name === 'progress' ? parseInt(e.target.value) || 0 : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        await timesheetAPI.update(id, formData);
      } else {
        await timesheetAPI.create(formData);
      }
      navigate('/timesheets');
    } catch (error) {
      console.error('Error saving timesheet:', error);
      alert(error.response?.data?.message || 'Failed to save timesheet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? 'Edit Timesheet' : 'Create New Timesheet'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {isEdit ? 'Update timesheet details' : 'Add a new timesheet entry'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="employee" className="block text-sm font-medium text-gray-700">
              Employee *
            </label>
            <select
              id="employee"
              name="employee"
              required
              value={formData.employee}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.firstName} {emp.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="project" className="block text-sm font-medium text-gray-700">
              Project *
            </label>
            <select
              id="project"
              name="project"
              required
              value={formData.project}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select Project</option>
              {projects.map((proj) => (
                <option key={proj._id} value={proj._id}>
                  {proj.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="task" className="block text-sm font-medium text-gray-700">
              Task *
            </label>
            <select
              id="task"
              name="task"
              required
              value={formData.task}
              onChange={handleChange}
              disabled={!formData.project}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
            >
              <option value="">{formData.project ? 'Select Task' : 'Select Project First'}</option>
              {tasks.map((task) => (
                <option key={task._id} value={task._id}>
                  {task.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              required
              value={formData.date}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="timeSpent" className="block text-sm font-medium text-gray-700">
              Time Spent *
            </label>
            <input
              type="text"
              id="timeSpent"
              name="timeSpent"
              required
              value={formData.timeSpent}
              onChange={handleChange}
              placeholder="e.g., 8 hours"
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Type *
            </label>
            <select
              id="type"
              name="type"
              required
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="Development">Development</option>
              <option value="Testing">Testing</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="progress" className="block text-sm font-medium text-gray-700">
              Progress (%)
            </label>
            <input
              type="number"
              id="progress"
              name="progress"
              min="0"
              max="100"
              value={formData.progress}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all"
                style={{ width: `${formData.progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows="4"
            value={formData.notes}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Add any additional notes..."
          />
        </div>

        <div className="flex items-center justify-end space-x-4 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate('/timesheets')}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            <FiX className="mr-2 h-5 w-5" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            <FiSave className="mr-2 h-5 w-5" />
            {loading ? 'Saving...' : isEdit ? 'Update Timesheet' : 'Create Timesheet'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TimesheetForm;

