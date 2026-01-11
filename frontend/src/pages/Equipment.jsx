import { useState, useEffect } from 'react';
import DashboardLayout from '../components/common/DashboardLayout';
import equipmentService from '../services/equipmentService';
import { Plus, Edit, Trash2, Wrench, X, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Equipment = () => {
  const { user } = useAuth();
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
  });

  useEffect(() => {
    fetchEquipment();
  }, [filters]);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const response = await equipmentService.getAll(filters);
      setEquipment(response.data || []);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      try {
        await equipmentService.delete(id);
        fetchEquipment();
      } catch (error) {
        console.error('Error deleting equipment:', error);
        alert('Failed to delete equipment');
      }
    }
  };

  const canEdit = ['Admin', 'Supervisor', 'Technician'].includes(user?.role);
  const canDelete = ['Admin'].includes(user?.role);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Operational':
        return 'bg-green-100 text-green-800';
      case 'UnderMaintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'Broken':
        return 'bg-red-100 text-red-800';
      case 'Idle':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Equipment Management</h1>
            <p className="text-gray-600 mt-1">Track and manage mining equipment</p>
          </div>
          {canEdit && (
            <button
              onClick={() => {
                setEditData(null);
                setShowForm(true);
              }}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Equipment
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="input-field"
              >
                <option value="">All Types</option>
                <option value="Excavator">Excavator</option>
                <option value="Drill">Drill</option>
                <option value="Truck">Truck</option>
                <option value="Loader">Loader</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="input-field"
              >
                <option value="">All Status</option>
                <option value="Operational">Operational</option>
                <option value="UnderMaintenance">Under Maintenance</option>
                <option value="Broken">Broken</option>
                <option value="Idle">Idle</option>
              </select>
            </div>
          </div>
        </div>

        {/* Equipment Grid */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : equipment.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-gray-500">No equipment found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipment.map((equip) => (
              <div key={equip._id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Wrench className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(equip.status)}`}>
                    {equip.status}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{equip.name}</h3>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p><span className="font-medium">ID:</span> {equip.equipmentId}</p>
                  <p><span className="font-medium">Type:</span> {equip.type}</p>
                  <p><span className="font-medium">Location:</span> {equip.location || 'N/A'}</p>
                  {equip.assignedTo && (
                    <p><span className="font-medium">Assigned:</span> {equip.assignedTo.userName}</p>
                  )}
                  {equip.nextMaintenanceDate && (
                    <p><span className="font-medium">Next Maintenance:</span> {new Date(equip.nextMaintenanceDate).toLocaleDateString()}</p>
                  )}
                </div>

                {canEdit && (
                  <div className="flex gap-2 pt-4 border-t">
                    <button
                      onClick={() => {
                        setEditData(equip);
                        setShowForm(true);
                      }}
                      className="flex-1 btn-secondary text-sm py-2"
                    >
                      <Edit className="w-4 h-4 inline mr-1" />
                      Edit
                    </button>
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(equip._id)}
                        className="btn-danger text-sm py-2 px-4"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Equipment Form Modal */}
      {showForm && (
        <EquipmentForm
          onClose={() => {
            setShowForm(false);
            setEditData(null);
          }}
          onSuccess={fetchEquipment}
          editData={editData}
        />
      )}
    </DashboardLayout>
  );
};

// Equipment Form Component
const EquipmentForm = ({ onClose, onSuccess, editData }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    equipmentId: editData?.equipmentId || `EQ-${Date.now()}`,
    name: editData?.name || '',
    type: editData?.type || 'Excavator',
    status: editData?.status || 'Operational',
    location: editData?.location || '',
    lastMaintenanceDate: editData?.lastMaintenanceDate ? new Date(editData.lastMaintenanceDate).toISOString().split('T')[0] : '',
    nextMaintenanceDate: editData?.nextMaintenanceDate ? new Date(editData.nextMaintenanceDate).toISOString().split('T')[0] : '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editData) {
        await equipmentService.update(editData._id, formData);
      } else {
        await equipmentService.create(formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving equipment:', error);
      alert(error.response?.data?.message || 'Failed to save equipment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {editData ? 'Edit Equipment' : 'Add Equipment'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Equipment ID</label>
              <input
                type="text"
                name="equipmentId"
                value={formData.equipmentId}
                readOnly
                className="input-field bg-gray-100"
              />
            </div>

            <div>
              <label className="label">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="label">Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="Excavator">Excavator</option>
                <option value="Drill">Drill</option>
                <option value="Truck">Truck</option>
                <option value="Loader">Loader</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="label">Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="Operational">Operational</option>
                <option value="UnderMaintenance">Under Maintenance</option>
                <option value="Broken">Broken</option>
                <option value="Idle">Idle</option>
              </select>
            </div>

            <div>
              <label className="label">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Last Maintenance</label>
              <input
                type="date"
                name="lastMaintenanceDate"
                value={formData.lastMaintenanceDate}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Next Maintenance</label>
              <input
                type="date"
                name="nextMaintenanceDate"
                value={formData.nextMaintenanceDate}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : editData ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Equipment;