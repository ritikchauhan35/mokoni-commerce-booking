
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { getAnalytics, getMonthlyRevenue, getTopProducts, getTopProperties } from '@/services/analytics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, ShoppingCart, Calendar, DollarSign } from 'lucide-react';

const AdminAnalytics = () => {
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: getAnalytics,
  });

  const { data: monthlyRevenue, isLoading: revenueLoading } = useQuery({
    queryKey: ['monthly-revenue'],
    queryFn: getMonthlyRevenue,
  });

  const { data: topProducts, isLoading: productsLoading } = useQuery({
    queryKey: ['top-products'],
    queryFn: getTopProducts,
  });

  const { data: topProperties, isLoading: propertiesLoading } = useQuery({
    queryKey: ['top-properties'],
    queryFn: getTopProperties,
  });

  if (analyticsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-olive-600"></div>
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Total Revenue',
      value: `$${analytics?.revenue.toLocaleString()}`,
      icon: DollarSign,
      change: '+12.5%',
      changeType: 'positive' as const
    },
    {
      title: 'Orders',
      value: analytics?.orders.toString(),
      icon: ShoppingCart,
      change: '+8.2%',
      changeType: 'positive' as const
    },
    {
      title: 'Bookings',
      value: analytics?.bookings.toString(),
      icon: Calendar,
      change: '+15.3%',
      changeType: 'positive' as const
    },
    {
      title: 'Active Users',
      value: analytics?.activeUsers.toString(),
      icon: Users,
      change: '+5.7%',
      changeType: 'positive' as const
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-olive-800">Analytics Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="bg-pearl-50 border-olive-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-olive-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-olive-800">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change} from last month</p>
                  </div>
                  <div className="h-8 w-8 bg-olive-100 rounded-full flex items-center justify-center">
                    <Icon className="h-4 w-4 text-olive-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue */}
        <Card className="bg-pearl-50 border-olive-200">
          <CardHeader>
            <CardTitle className="text-olive-800">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            {revenueLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-olive-600"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Line type="monotone" dataKey="revenue" stroke="#6B7F39" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="bg-pearl-50 border-olive-200">
          <CardHeader>
            <CardTitle className="text-olive-800">Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-olive-600"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topProducts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [value, 'Sales']} />
                  <Bar dataKey="sales" fill="#6B7F39" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Properties */}
      <Card className="bg-pearl-50 border-olive-200">
        <CardHeader>
          <CardTitle className="text-olive-800">Top Properties by Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {propertiesLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-olive-600"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProperties}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value, name) => [value, name === 'bookings' ? 'Bookings' : 'Revenue']} />
                <Bar dataKey="bookings" fill="#6B7F39" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
