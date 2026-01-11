import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/common/DashboardLayout';
import {
  TrendingUp,
  Wrench,
  ClipboardList,
  AlertTriangle,
  Users,
  Package,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import productionService from '../services/productionService';
import equipmentService from '../services/equipmentService';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProduction: 0,
    totalEquipment: 0,
    activeOperators: 0,
    pendingApprovals: 0,
  });
  const [productionData, setProductionData] = useState([]);
  const [equipmentStats, setEquipmentStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [prodStats, equipStats] = await Promise.all([
        productionService.getStatistics(),
        equipmentService.getStatistics(),
      ]);

      setStats({
        totalProduction: prodStats.data?.overall?.totalProduction || 0,
        totalEquipment: equipStats.data?.total || 0,
        activeOperators: 12, // This would come from user service
        pendingApprovals: 3, // This would come from production records
      });

      // Mock production trend data
      setProductionData([
        { date: 'Mon', production: 450 },
        { date: 'Tue', production: 520 },
        { date: 'Wed', production: 480 },
        { date: 'Thu', production: 590 },
        { date: 'Fri', production: 610 },
        { date: 'Sat', production: 420 },
        { date: 'Sun', production: 380 },
      ]);

      // Equipment status data
      const statusData = equipStats.data?.byStatus || [];
      setEquipmentStats(statusData);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Production',
      value: `${stats.totalProduction.toLocaleString()} tons`,
      icon: TrendingUp,
      color: 'bg-blue-500',
      trend: '+12%',
    },
    {
      title: 'Equipment',
      value: stats.totalEquipment,
      icon: Wrench,
      color: 'bg-green-500',
      trend: '8 Active',
    },
    {
      title: 'Active Operators',
      value: stats.activeOperators,
      icon: Users,
      color: 'bg-purple-500',
      trend: 'On Duty',
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingApprovals,
      icon: AlertTriangle,
      color: 'bg-orange-500',
      trend: 'Review',
    },
  ];

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6b7280'];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {user?.userName}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your mining operations today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {stat.value}
                    </h3>
                    <p className="text-sm text-green-600 mt-1">{stat.trend}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Production Trend */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Production Trend (Last 7 Days)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="production"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Equipment Status */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Equipment Status
            </h3>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={equipmentStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => entry._id}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {equipmentStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            {[
              { action: 'Production record created', time: '5 minutes ago', user: 'John Doe' },
              { action: 'Equipment maintenance completed', time: '1 hour ago', user: 'Jane Smith' },
              { action: 'Report generated', time: '2 hours ago', user: 'Admin' },
              { action: 'New mineral added', time: '3 hours ago', user: 'Supervisor' },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b last:border-b-0"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">by {activity.user}</p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;