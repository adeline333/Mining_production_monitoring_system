import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/common/DashboardLayout';
import reportService from '../services/reportService';
import { Download, ArrowLeft, FileText, CheckCircle, Calendar, User } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ReportViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchReport();
    }
  }, [id]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const response = await reportService.getById(id);
      setReport(response.data);
    } catch (error) {
      console.error('Error fetching report:', error);
      alert('Failed to load report');
      navigate('/reports');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a JSON blob for download
    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.reportId}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!report) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Report Not Found</h2>
          <p className="text-gray-600 mb-6">The report you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/reports')} className="btn-primary">
            Back to Reports
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 print:space-y-4">
        {/* Header - Hidden in print */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 print:hidden">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/reports')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Report Details</h1>
              <p className="text-gray-600 mt-1">View and download report</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleDownload} className="btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download
            </button>
            <button onClick={handlePrint} className="btn-primary">
              Print Report
            </button>
          </div>
        </div>

        {/* Report Header Card */}
        <div className="card print:shadow-none">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-800">{report.title}</h2>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                  {report.status}
                </span>
              </div>
              <p className="text-gray-600">Report ID: {report.reportId}</p>
            </div>
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(report.dateFrom).toLocaleDateString()} - {new Date(report.dateTo).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Generated by: {report.generatedBy?.userName}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Type: {report.type}</span>
              </div>
            </div>
          </div>

          {/* Report Type Badge */}
          <div className="inline-block px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium">
            {report.type} Report
          </div>
        </div>

        {/* Report Data */}
        {report.type === 'Production' && report.data && (
          <div className="space-y-6">
            {/* Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card print:shadow-none">
                <p className="text-sm text-gray-600 mb-1">Total Production</p>
                <h3 className="text-3xl font-bold text-gray-800">
                  {report.data.totalProduction?.toLocaleString() || 0} <span className="text-lg">tons</span>
                </h3>
              </div>
              <div className="card print:shadow-none">
                <p className="text-sm text-gray-600 mb-1">Total Records</p>
                <h3 className="text-3xl font-bold text-gray-800">
                  {report.data.totalRecords || 0}
                </h3>
              </div>
              <div className="card print:shadow-none">
                <p className="text-sm text-gray-600 mb-1">Average per Record</p>
                <h3 className="text-3xl font-bold text-gray-800">
                  {report.data.totalRecords > 0 
                    ? (report.data.totalProduction / report.data.totalRecords).toFixed(2)
                    : 0} <span className="text-lg">tons</span>
                </h3>
              </div>
            </div>

            {/* Production by Mineral */}
            {report.data.summary && report.data.summary.length > 0 && (
              <div className="card print:shadow-none">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Production by Mineral</h3>
                
                {/* Chart */}
                <div className="mb-8 print:mb-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={report.data.summary}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="_id" 
                        tickFormatter={(value) => {
                          const mineral = report.data.summary.find(m => m._id === value);
                          return mineral?.mineralInfo?.[0]?.name || value;
                        }}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(value) => {
                          const mineral = report.data.summary.find(m => m._id === value);
                          return mineral?.mineralInfo?.[0]?.name || value;
                        }}
                      />
                      <Bar dataKey="totalQuantity" fill="#3b82f6" name="Total Quantity (tons)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mineral</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Grade</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Quantity</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Records</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Average</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {report.data.summary.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {item.mineralInfo?.[0]?.name || 'Unknown'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 text-right">
                            {item.mineralInfo?.[0]?.grade || 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 text-right">
                            {item.totalQuantity?.toLocaleString()} tons
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 text-right">
                            {item.recordCount}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 text-right">
                            {(item.avgQuantity || 0).toFixed(2)} tons
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Equipment Report */}
        {report.type === 'Equipment' && report.data && (
          <div className="space-y-6">
            {/* Equipment Statistics */}
            <div className="card print:shadow-none">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Equipment Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Total Equipment</p>
                  <h3 className="text-3xl font-bold text-gray-800">{report.data.totalEquipment || 0}</h3>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Equipment Types</p>
                  <h3 className="text-3xl font-bold text-gray-800">{report.data.byType?.length || 0}</h3>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Status Categories</p>
                  <h3 className="text-3xl font-bold text-gray-800">{report.data.byStatus?.length || 0}</h3>
                </div>
              </div>
            </div>

            {/* Equipment by Status */}
            {report.data.byStatus && report.data.byStatus.length > 0 && (
              <div className="card print:shadow-none">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Equipment by Status</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Pie Chart */}
                  <div>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={report.data.byStatus}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry) => `${entry._id}: ${entry.count}`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {report.data.byStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Status List */}
                  <div className="space-y-3">
                    {report.data.byStatus.map((status, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></div>
                          <span className="font-medium text-gray-800">{status._id}</span>
                        </div>
                        <span className="text-2xl font-bold text-gray-800">{status.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Equipment by Type */}
            {report.data.byType && report.data.byType.length > 0 && (
              <div className="card print:shadow-none">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Equipment by Type</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {report.data.byType.map((type, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">{type._id}</p>
                      <h4 className="text-2xl font-bold text-gray-800">{type.count} units</h4>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Report Footer */}
        <div className="card print:shadow-none print:mt-8">
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Generated:</strong> {new Date(report.createdAt).toLocaleString()}</p>
            <p><strong>Last Updated:</strong> {new Date(report.updatedAt).toLocaleString()}</p>
            {report.status === 'Approved' && (
              <div className="flex items-center gap-2 text-green-600 mt-4">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">This report has been approved</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportViewer;