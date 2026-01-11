import { useState, useEffect } from 'react';
import DashboardLayout from '../components/common/DashboardLayout';
import incidentService from '../services/IncidentService';
import { Plus, Edit, Trash2, AlertTriangle, CheckCircle, Clock, X, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Incidents = () => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    severity: '',
    status: '',
  });

  useEffect(() => {
    fetchIncidents();
  }, [filters]);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const response = await incidentService.getAll(filters);
      setIncidents(response.data || []);
    } catch (error) {
      console.error('Error fetching incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this incident?')) {
      try {
        await incidentService.delete(id);
        fetchIncidents();
      } catch (error) {
        console.error('Error deleting incident:', error);
        alert('Failed to delete incident');
      }
    }
  };

  const canCreate = ['Admin', 'Supervisor', 'Technician', 'FieldOperator', 'Auditor'].includes(user?.role);
  const canEdit = ['Admin', 'Supervisor'].includes(user?.role);
  const canDelete = ['Admin'].includes(user?.role);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-100 text-red-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800';
      case 'InProgress':
        return 'bg-blue-100 text-blue-800';
      case 'Open':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // eslint-disable-next-line no-unused-vars
  const getTypeIcon = (type) => {
    return <AlertTriangle className="w-5 h-5" />;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Incident Management</h1>
            <p className="text-gray-600 mt-1">Track and manage safety and operational incidents</p>
          </div>
          {canCreate && (
            <button
              onClick={() => {
                setEditData(null);
                setShowForm(true);
              }}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Record Incident
            </button>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Incidents', value: incidents.length, color: 'bg-blue-500' },
            { label: 'Open', value: incidents.filter(i => i.status === 'Open').length, color: 'bg-red-500' },
            { label: 'In Progress', value: incidents.filter(i => i.status === 'InProgress').length, color: 'bg-yellow-500' },
            { label: 'Resolved', value: incidents.filter(i => i.status === 'Resolved' || i.status === 'Closed').length, color: 'bg-green-500' },
          ].map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="input-field"
              >
                <option value="">All Types</option>
                <option value="Safety">Safety</option>
                <option value="Equipment">Equipment</option>
                <option value="Environmental">Environmental</option>
                <option value="Production">Production</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="label">Severity</label>
              <select
                value={filters.severity}
                onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                className="input-field"
              >
                <option value="">All Severities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
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
                <option value="Open">Open</option>
                <option value="InProgress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Incidents List */}
        <div className="card">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : incidents.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No incidents found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Incident ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {incidents.map((incident) => (
                    <tr key={incident._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{incident.incidentId}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{incident.title}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{incident.type}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(incident.severity)}`}>
                          {incident.severity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{incident.location}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(incident.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(incident.status)}`}>
                          {incident.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {canEdit && (
                            <button
                              onClick={() => {
                                setEditData(incident);
                                setShowForm(true);
                              }}
                              className="p-1 hover:bg-gray-100 rounded"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4 text-blue-600" />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(incident._id)}
                              className="p-1 hover:bg-gray-100 rounded"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Incident Form Modal */}
      {showForm && (
        <IncidentForm
          onClose={() => {
            setShowForm(false);
            setEditData(null);
          }}
          onSuccess={fetchIncidents}
          editData={editData}
          user={user}
        />
      )}
    </DashboardLayout>
  );
};

// Incident Form Component
const IncidentForm = ({ onClose, onSuccess, editData, user }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    incidentId: editData?.incidentId || `INC-${Date.now()}`,
    title: editData?.title || '',
    description: editData?.description || '',
    type: editData?.type || 'Safety',
    severity: editData?.severity || 'Medium',
    location: editData?.location || '',
    date: editData?.date ? new Date(editData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    reportedBy: editData?.reportedBy?._id || user._id,
    status: editData?.status || 'Open',
    actionTaken: editData?.actionTaken || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editData) {
        await incidentService.update(editData._id, formData);
      } else {
        await incidentService.create(formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving incident:', error);
      alert(error.response?.data?.message || 'Failed to save incident');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {editData ? 'Edit Incident' : 'Record Incident'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Incident ID</label>
              <input
                type="text"
                name="incidentId"
                value={formData.incidentId}
                readOnly
                className="input-field bg-gray-100"
              />
            </div>

            <div>
              <label className="label">Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                placeholder="Brief description of the incident"
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
                <option value="Safety">Safety</option>
                <option value="Equipment">Equipment</option>
                <option value="Environmental">Environmental</option>
                <option value="Production">Production</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="label">Severity *</label>
              <select
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="label">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input-field"
                placeholder="Where did the incident occur?"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field"
                rows="4"
                placeholder="Detailed description of what happened..."
                required
              />
            </div>

            {editData && (
              <>
                <div>
                  <label className="label">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="Open">Open</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="label">Action Taken</label>
                  <textarea
                    name="actionTaken"
                    value={formData.actionTaken}
                    onChange={handleChange}
                    className="input-field"
                    rows="3"
                    placeholder="Describe actions taken to resolve..."
                  />
                </div>
              </>
            )}
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

export default Incidents;