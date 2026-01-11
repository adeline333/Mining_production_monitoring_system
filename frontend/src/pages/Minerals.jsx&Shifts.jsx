// Minerals.jsx
import { useState, useEffect } from 'react';
import DashboardLayout from '../components/common/DashboardLayout';
import { mineralService } from '../services/mineralService.js&shiftService';
import { Plus, Edit, Trash2, Package, X, Save } from 'lucide-react';

export const Minerals = () => {
  const [minerals, setMinerals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchMinerals();
  }, []);

  const fetchMinerals = async () => {
    try {
      setLoading(true);
      const response = await mineralService.getAll();
      setMinerals(response.data || []);
    } catch (error) {
      console.error('Error fetching minerals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this mineral?')) {
      try {
        await mineralService.delete(id);
        fetchMinerals();
      } catch  {
        alert('Failed to delete mineral');
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Minerals</h1>
            <p className="text-gray-600 mt-1">Manage mineral types and grades</p>
          </div>
          <button
            onClick={() => {
              setEditData(null);
              setShowForm(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Mineral
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-3 flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : minerals.length === 0 ? (
            <div className="col-span-3 card text-center py-8">
              <p className="text-gray-500">No minerals found</p>
            </div>
          ) : (
            minerals.map((mineral) => (
              <div key={mineral._id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Package className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{mineral.name}</h3>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p><span className="font-medium">ID:</span> {mineral.mineralId}</p>
                  <p><span className="font-medium">Grade:</span> {mineral.grade}</p>
                  {mineral.description && (
                    <p className="text-xs">{mineral.description}</p>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <button
                    onClick={() => {
                      setEditData(mineral);
                      setShowForm(true);
                    }}
                    className="flex-1 btn-secondary text-sm py-2"
                  >
                    <Edit className="w-4 h-4 inline mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(mineral._id)}
                    className="btn-danger text-sm py-2 px-4"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showForm && (
        <MineralForm
          onClose={() => {
            setShowForm(false);
            setEditData(null);
          }}
          onSuccess={fetchMinerals}
          editData={editData}
        />
      )}
    </DashboardLayout>
  );
};

const MineralForm = ({ onClose, onSuccess, editData }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    mineralId: editData?.mineralId || `MIN-${Date.now()}`,
    name: editData?.name || '',
    grade: editData?.grade || '',
    description: editData?.description || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editData) {
        await mineralService.update(editData._id, formData);
      } else {
        await mineralService.create(formData);
      }
      onSuccess();
      onClose();
    } catch  {
      alert('Failed to save mineral');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">{editData ? 'Edit Mineral' : 'Add Mineral'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="label">Mineral ID</label>
            <input
              type="text"
              value={formData.mineralId}
              readOnly
              className="input-field bg-gray-100"
            />
          </div>
          <div>
            <label className="label">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="label">Grade *</label>
            <input
              type="text"
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              rows="3"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 btn-primary">
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Shifts.jsx
import { shiftService } from '../services/mineralService.js&shiftService';
import { Clock } from 'lucide-react';

export const Shifts = () => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    try {
      setLoading(true);
      const response = await shiftService.getAll();
      setShifts(response.data || []);
    } catch (error) {
      console.error('Error fetching shifts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await shiftService.delete(id);
        fetchShifts();
      } catch  {
        alert('Failed to delete shift');
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Shifts</h1>
            <p className="text-gray-600 mt-1">Manage work shifts</p>
          </div>
          <button
            onClick={() => {
              setEditData(null);
              setShowForm(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Shift
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-3 flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            shifts.map((shift) => (
              <div key={shift._id} className="card">
                <div className="bg-blue-100 p-3 rounded-lg w-fit mb-4">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{shift.name}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {shift.startTime} - {shift.endTime}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditData(shift);
                      setShowForm(true);
                    }}
                    className="flex-1 btn-secondary text-sm py-2"
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(shift._id)} className="btn-danger text-sm py-2 px-4">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showForm && (
        <ShiftForm
          onClose={() => {
            setShowForm(false);
            setEditData(null);
          }}
          onSuccess={fetchShifts}
          editData={editData}
        />
      )}
    </DashboardLayout>
  );
};

const ShiftForm = ({ onClose, onSuccess, editData }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shiftId: editData?.shiftId || `SH-${Date.now()}`,
    name: editData?.name || 'Morning',
    startTime: editData?.startTime || '',
    endTime: editData?.endTime || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editData) {
        await shiftService.update(editData._id, formData);
      } else {
        await shiftService.create(formData);
      }
      onSuccess();
      onClose();
    } catch  {
      alert('Failed to save shift');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">{editData ? 'Edit Shift' : 'Add Shift'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="label">Shift ID</label>
            <input type="text" value={formData.shiftId} readOnly className="input-field bg-gray-100" />
          </div>
          <div>
            <label className="label">Name *</label>
            <select
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              required
            >
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Night">Night</option>
            </select>
          </div>
          <div>
            <label className="label">Start Time *</label>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="label">End Time *</label>
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 btn-primary">
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};