
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Package, Building, ShoppingCart, Calendar, TrendingUp, DollarSign, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAllUsers, getProducts, getProperties, getAllOrders, getAllBookings } from '@/services/firestore';

const AdminDashboard = () => {
  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: getAllUsers,
  });

  const { data: products = [] } = useQuery({
    queryKey: ['admin-products'],
    queryFn: getProducts,
  });

  const { data: properties = [] } = useQuery({
    queryKey: ['admin-properties'],
    queryFn: getProperties,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: getAllOrders,
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: getAllBookings,
  });

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0) + 
                      bookings.reduce((sum, booking) => sum + booking.total, 0);

  const stats = [
    {
      title: 'Total Users',
      value: users.length,
      icon: Users,
      description: 'Registered users',
      color: 'text-blue-600'
    },
    {
      title: 'Products',
      value: products.length,
      icon: Package,
      description: 'Total products',
      color: 'text-green-600'
    },
    {
      title: 'Properties',
      value: properties.length,
      icon: Building,
      description: 'Listed properties',
      color: 'text-purple-600'
    },
    {
      title: 'Orders',
      value: orders.length,
      icon: ShoppingCart,
      description: 'Total orders',
      color: 'text-orange-600'
    },
    {
      title: 'Bookings',
      value: bookings.length,
      icon: Calendar,
      description: 'Property bookings',
      color: 'text-pink-600'
    },
    {
      title: 'Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      description: 'Total revenue',
      color: 'text-emerald-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-olive-800">Admin Dashboard</h1>
        <Button className="bg-olive-600 hover:bg-olive-700">
          <TrendingUp className="mr-2 h-4 w-4" />
          View Analytics
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-pearl-50 border-olive-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-olive-700">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-olive-800">{stat.value}</div>
              <p className="text-xs text-olive-600">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-pearl-50 border-olive-200">
          <CardHeader>
            <CardTitle className="text-olive-800">Recent Orders</CardTitle>
            <CardDescription>Latest customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between border-b border-olive-100 pb-2">
                  <div>
                    <p className="font-medium text-olive-800">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-olive-600">{order.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-olive-800">${order.total}</p>
                    <p className="text-sm text-olive-600">{order.items.length} items</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-pearl-50 border-olive-200">
          <CardHeader>
            <CardTitle className="text-olive-800">Recent Bookings</CardTitle>
            <CardDescription>Latest property bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between border-b border-olive-100 pb-2">
                  <div>
                    <p className="font-medium text-olive-800">{booking.guestDetails.name}</p>
                    <p className="text-sm text-olive-600">{booking.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-olive-800">${booking.total}</p>
                    <p className="text-sm text-olive-600">{booking.guests} guests</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
