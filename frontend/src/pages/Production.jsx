import { useState, useEffect } from 'react';
import DashboardLayout from '../components/common/DashboardLayout';
import ProductionForm from '../components/production/ProductionForm';
import productionService from '../services/productionService';
import { Plus, Edit, Trash2, CheckCircle, Eye, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Production = () => {
  const { user } = useAuth();
  const [productions, setProductions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchProductions();
  }, [filters]);

  const fetchProductions = async () => {
    try {
      setLoading(true);
      const response = await productionService.getAll(filters);
      setProductions(response.data || []);
    } catch (error) {
      console.error('Error fetching productions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (production) => {
    setEditData(production);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await productionService.delete(id);
        fetchProductions();
      } catch (error) {
        console.error('Error deleting production:', error);
        alert('Failed to delete production record');
      }
    }
  };

  const handleApprove = async (id) => {
    try {
      await productionService.approve(id);
      fetchProductions();
    } catch (error) {
      console.error('Error approving production:', error);
      alert('Failed to approve production record');
    }
  };

  const canEdit = ['Admin', 'Supervisor', 'FieldOperator'].includes(user?.role);
  const canDelete = ['Admin', 'Supervisor'].includes(user?.role);
  const canApprove = ['Supervisor'].includes(user?.role);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Production Records</h1>
            <p className="text-gray-600 mt-1">Manage daily mining production data</p>
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
              New Record
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="input-field"
              >
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="label">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Production List */}
        <div className="card">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : productions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No production records found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Record ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mineral</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {productions.map((prod) => (
                    <tr key={prod._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{prod.recordId}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(prod.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{prod.mineral?.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{prod.quantity} tons</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{prod.location}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(prod.status)}`}>
                          {prod.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {canEdit && prod.status === 'Pending' && (
                            <button
                              onClick={() => handleEdit(prod)}
                              className="p-1 hover:bg-gray-100 rounded"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4 text-blue-600" />
                            </button>
                          )}
                          {canApprove && prod.status === 'Pending' && (
                            <button
                              onClick={() => handleApprove(prod._id)}
                              className="p-1 hover:bg-gray-100 rounded"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(prod._id)}
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

      {/* Production Form Modal */}
      {showForm && (
        <ProductionForm
          onClose={() => {
            setShowForm(false);
            setEditData(null);
          }}
          onSuccess={fetchProductions}
          editData={editData}
        />
      )}
    </DashboardLayout>
  );
};

export default Production;