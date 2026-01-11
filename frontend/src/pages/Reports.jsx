import { useState, useEffect } from 'react';
import DashboardLayout from '../components/common/DashboardLayout';
import reportService from '../services/reportService';
import { FileText, Download, Eye, Trash2, CheckCircle, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Reports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGenerator, setShowGenerator] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await reportService.getAll();
      setReports(response.data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await reportService.delete(id);
        fetchReports();
      } catch (error) {
        console.error('Error deleting report:', error);
        alert('Failed to delete report');
      }
    }
  };

  const handleApprove = async (id) => {
    try {
      await reportService.approve(id);
      fetchReports();
    } catch (error) {
      console.error('Error approving report:', error);
      alert('Failed to approve report');
    }
  };

  const canGenerate = ['Admin', 'Supervisor', 'Auditor'].includes(user?.role);
  const canDelete = ['Admin'].includes(user?.role);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Generated':
        return 'bg-blue-100 text-blue-800';
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Production':
        return 'bg-blue-500';
      case 'Equipment':
        return 'bg-green-500';
      case 'Environmental':
        return 'bg-emerald-500';
      case 'Safety':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
            <p className="text-gray-600 mt-1">Generate and manage mining reports</p>
          </div>
          {canGenerate && (
            <button
              onClick={() => setShowGenerator(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Generate Report
            </button>
          )}
        </div>

        {/* Report Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Reports', value: reports.length, color: 'bg-blue-500' },
            { label: 'Approved', value: reports.filter(r => r.status === 'Approved').length, color: 'bg-green-500' },
            { label: 'Pending', value: reports.filter(r => r.status === 'Generated').length, color: 'bg-yellow-500' },
            { label: 'Draft', value: reports.filter(r => r.status === 'Draft').length, color: 'bg-gray-500' },
          ].map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reports List */}
        <div className="card">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No reports found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Report ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Range</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Generated By</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reports.map((report) => (
                    <tr key={report._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{report.reportId}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{report.title}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-medium text-white rounded ${getTypeColor(report.type)}`}>
                          {report.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(report.dateFrom).toLocaleDateString()} - {new Date(report.dateTo).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{report.generatedBy?.userName}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => window.location.href = `/reports/${report._id}`}
                            className="p-1 hover:bg-gray-100 rounded"
                            title="View"
                          >
                            <Eye className="w-4 h-4 text-blue-600" />
                          </button>
                          {report.status === 'Generated' && (
                            <button
                              onClick={() => handleApprove(report._id)}
                              className="p-1 hover:bg-gray-100 rounded"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(report._id)}
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

      {/* Report Generator Modal */}
      {showGenerator && (
        <ReportGenerator
          onClose={() => setShowGenerator(false)}
          onSuccess={fetchReports}
        />
      )}
    </DashboardLayout>
  );
};

// Report Generator Component
const ReportGenerator = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('Production');
  const [formData, setFormData] = useState({
    dateFrom: new Date().toISOString().split('T')[0],
    dateTo: new Date().toISOString().split('T')[0],
  });

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        generatedBy: user._id,
      };

      if (reportType === 'Production') {
        await reportService.generateProductionSummary(data);
      } else if (reportType === 'Equipment') {
        await reportService.generateEquipmentReport(data);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Generate Report</h2>
          
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="label">Report Type *</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="input-field"
                required
              >
                <option value="Production">Production Summary</option>
                <option value="Equipment">Equipment Status</option>
              </select>
            </div>

            <div>
              <label className="label">Date From *</label>
              <input
                type="date"
                value={formData.dateFrom}
                onChange={(e) => setFormData({ ...formData, dateFrom: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="label">Date To *</label>
              <input
                type="date"
                value={formData.dateTo}
                onChange={(e) => setFormData({ ...formData, dateTo: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button type="button" onClick={onClose} className="flex-1 btn-secondary">
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary"
              >
                {loading ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reports;