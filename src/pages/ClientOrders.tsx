
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, DollarSign, FileText, MessageSquare, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '@/api/orders';
import Navbar from '@/components/Navbar';
import { formatDistanceToNow } from 'date-fns';

const ClientOrders = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['client-orders', activeTab],
    queryFn: () => orderAPI.getMyOrders({ 
      status: activeTab === 'all' ? undefined : 
              activeTab === 'active' ? 'pending,accepted,in_progress,delivered,revision_requested' : 
              activeTab === 'completed' ? 'completed' : 
              activeTab
    }),
  });

  const orders = ordersData?.data || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'revision_requested': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-emerald-100 text-emerald-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">Track your service orders and communicate with freelancers</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {orders.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                  <p className="text-gray-600 mb-4">Browse services to place your first order</p>
                  <Button onClick={() => navigate('/services')}>
                    Browse Services
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {orders.map((order: any) => (
                  <Card key={order._id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            Order #{order.orderNumber}
                          </CardTitle>
                          <CardDescription>
                            {order.service?.title}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-600">Total Amount</p>
                            <p className="font-semibold">₹{order.totalAmount}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-600">Delivery</p>
                            <p className="font-semibold">
                              {formatDistanceToNow(new Date(order.deliveryDate), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-600">Progress</p>
                            <p className="font-semibold">{order.progress}%</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-600">Plan</p>
                            <p className="font-semibold capitalize">{order.selectedPlan}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-1">Freelancer:</p>
                        <p className="font-medium">
                          {order.freelancer?.firstName} {order.freelancer?.lastName}
                        </p>
                      </div>

                      <div className="flex space-x-3">
                        <Button 
                          onClick={() => navigate(`/orders/${order._id}`)}
                          className="flex-1"
                        >
                          View Details
                        </Button>
                        <Button variant="outline">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                        {order.status === 'delivered' && (
                          <>
                            <Button variant="outline">Accept Work</Button>
                            <Button variant="outline">Request Revision</Button>
                          </>
                        )}
                        {order.status === 'completed' && !order.rating?.clientRating && (
                          <Button variant="outline">
                            <Star className="h-4 w-4 mr-2" />
                            Rate
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientOrders;
