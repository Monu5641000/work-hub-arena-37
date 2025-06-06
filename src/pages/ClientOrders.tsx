
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, DollarSign, FileText, MessageSquare, Star, ArrowRight, Filter } from 'lucide-react';
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
      case 'pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'accepted': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'in_progress': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'delivered': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'revision_requested': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'completed': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass-card rounded-2xl p-6">
                <div className="h-32 bg-white/10 rounded-xl"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <Navbar />
      
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white text-glow mb-2">My Orders</h1>
          <p className="text-white/70 text-lg">Track your service orders and communicate with freelancers</p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-white/10">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-6 bg-white/10 border border-white/20">
              <TabsTrigger value="active" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white">
                Active
              </TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white">
                Completed
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white">
                Cancelled
              </TabsTrigger>
              <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white">
                All
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {orders.length === 0 ? (
                <Card className="glass-card border-white/10">
                  <CardContent className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FileText className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">No orders found</h3>
                    <p className="text-white/70 mb-6">Browse services to place your first order</p>
                    <Button 
                      onClick={() => navigate('/services')}
                      className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 btn-3d group"
                    >
                      Browse Services
                      <ArrowRight className="ml-2 h-4 w-4 arrow-hover" />
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {orders.map((order: any, index) => (
                    <Card 
                      key={order._id} 
                      className="group card-3d hover:shadow-3d transition-all duration-500 glass-card border-white/10 overflow-hidden"
                      style={{ 
                        animationDelay: `${index * 0.1}s`,
                        ['--stagger' as any]: index
                      }}
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl text-white group-hover:text-glow transition-all duration-300">
                              Order #{order.orderNumber}
                            </CardTitle>
                            <CardDescription className="text-white/70 text-lg mt-1">
                              {order.service?.title}
                            </CardDescription>
                          </div>
                          <Badge className={`${getStatusColor(order.status)} border`}>
                            {order.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                          <div className="flex items-center space-x-3 p-3 rounded-xl glass">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                              <DollarSign className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="text-sm text-white/60">Total Amount</p>
                              <p className="font-semibold text-white text-lg">₹{order.totalAmount}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 p-3 rounded-xl glass">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <Calendar className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="text-sm text-white/60">Delivery</p>
                              <p className="font-semibold text-white">
                                {formatDistanceToNow(new Date(order.deliveryDate), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 p-3 rounded-xl glass">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                              <Clock className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="text-sm text-white/60">Progress</p>
                              <p className="font-semibold text-white">{order.progress}%</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 p-3 rounded-xl glass">
                            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <FileText className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="text-sm text-white/60">Plan</p>
                              <p className="font-semibold text-white capitalize">{order.selectedPlan}</p>
                            </div>
                          </div>
                        </div>

                        <div className="mb-6 p-4 rounded-xl glass">
                          <p className="text-sm text-white/60 mb-2">Freelancer:</p>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                              {order.freelancer?.firstName?.[0] || 'F'}
                            </div>
                            <p className="font-medium text-white text-lg">
                              {order.freelancer?.firstName} {order.freelancer?.lastName}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <Button 
                            onClick={() => navigate(`/orders/${order._id}`)}
                            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 btn-3d group"
                          >
                            View Details
                            <ArrowRight className="ml-2 h-4 w-4 arrow-hover" />
                          </Button>
                          <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 btn-3d">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                          {order.status === 'delivered' && (
                            <>
                              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 btn-3d">
                                Accept Work
                              </Button>
                              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 btn-3d">
                                Request Revision
                              </Button>
                            </>
                          )}
                          {order.status === 'completed' && !order.rating?.clientRating && (
                            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 btn-3d">
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
    </div>
  );
};

export default ClientOrders;
