
import React, { useState, useEffect } from 'react';
import { Clock, MessageCircle, Download, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { orderAPI } from '@/api/orders';
import Chat from './Chat';

interface OrderDetailProps {
  orderId: string;
  onOrderUpdate?: (order: any) => void;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ orderId, onOrderUpdate }) => {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [revisionReason, setRevisionReason] = useState('');
  const [isSubmittingRevision, setIsSubmittingRevision] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const response = await orderAPI.getOrder(orderId);
      if (response.success) {
        setOrder(response.data);
        onOrderUpdate?.(response.data);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load order details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus: string, note?: string) => {
    setIsUpdatingStatus(true);
    try {
      const response = await orderAPI.updateOrderStatus(orderId, { status: newStatus, note });
      if (response.success) {
        setOrder(response.data);
        toast({
          title: "Success",
          description: `Order status updated to ${newStatus}`,
        });
        onOrderUpdate?.(response.data);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const requestRevision = async () => {
    if (!revisionReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for revision",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingRevision(true);
    try {
      const response = await orderAPI.requestRevision(orderId, { reason: revisionReason });
      if (response.success) {
        setOrder(response.data);
        setRevisionReason('');
        toast({
          title: "Success",
          description: "Revision requested successfully",
        });
        onOrderUpdate?.(response.data);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to request revision",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingRevision(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'accepted': return 'bg-blue-500';
      case 'in_progress': return 'bg-purple-500';
      case 'delivered': return 'bg-green-500';
      case 'completed': return 'bg-green-600';
      case 'cancelled': return 'bg-red-500';
      case 'revision_requested': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    return status.replace('_', ' ').toUpperCase();
  };

  const canUpdateStatus = (currentStatus: string, userRole: string) => {
    if (userRole === 'freelancer') {
      return ['pending', 'accepted', 'in_progress', 'revision_requested'].includes(currentStatus);
    }
    if (userRole === 'client') {
      return ['delivered'].includes(currentStatus);
    }
    return false;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">Order not found</p>
      </div>
    );
  }

  const isClient = order.userRole === 'client';
  const isFreelancer = order.userRole === 'freelancer';
  const otherUser = isClient ? order.freelancer : order.client;

  if (showChat) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => setShowChat(false)}>
          Back to Order Details
        </Button>
        <Chat
          recipientId={otherUser._id}
          recipientName={`${otherUser.firstName} ${otherUser.lastName}`}
          onClose={() => setShowChat(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Order #{order.orderNumber}</CardTitle>
              <CardDescription>{order.service?.title}</CardDescription>
            </div>
            <div className="text-right">
              <Badge className={getStatusColor(order.status)}>
                {getStatusText(order.status)}
              </Badge>
              <p className="text-sm text-gray-500 mt-1">
                Progress: {order.progress}%
              </p>
            </div>
          </div>
          <Progress value={order.progress} className="mt-4" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Amount</p>
              <p className="text-lg font-semibold text-green-600">₹{order.totalAmount?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Delivery Date</p>
              <p className="text-sm">{new Date(order.deliveryDate).toLocaleDateString()}</p>
              {order.isOverdue && (
                <Badge variant="destructive" className="mt-1">Overdue</Badge>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Days Remaining</p>
              <p className="text-sm">{order.daysRemaining > 0 ? order.daysRemaining : 0} days</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Button onClick={() => setShowChat(true)}>
          <MessageCircle className="h-4 w-4 mr-2" />
          Chat with {isClient ? 'Freelancer' : 'Client'}
        </Button>
        
        {isFreelancer && canUpdateStatus(order.status, 'freelancer') && (
          <>
            {order.status === 'pending' && (
              <Button 
                onClick={() => updateOrderStatus('accepted')}
                disabled={isUpdatingStatus}
              >
                Accept Order
              </Button>
            )}
            {order.status === 'accepted' && (
              <Button 
                onClick={() => updateOrderStatus('in_progress')}
                disabled={isUpdatingStatus}
              >
                Start Work
              </Button>
            )}
            {(order.status === 'in_progress' || order.status === 'revision_requested') && (
              <Button 
                onClick={() => updateOrderStatus('delivered')}
                disabled={isUpdatingStatus}
              >
                Mark as Delivered
              </Button>
            )}
          </>
        )}

        {isClient && order.status === 'delivered' && (
          <>
            <Button 
              onClick={() => updateOrderStatus('completed')}
              disabled={isUpdatingStatus}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Accept Delivery
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Request Revision
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Revision</DialogTitle>
                  <DialogDescription>
                    Please explain what changes you need
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Describe the changes needed..."
                    value={revisionReason}
                    onChange={(e) => setRevisionReason(e.target.value)}
                  />
                  <Button 
                    onClick={requestRevision}
                    disabled={isSubmittingRevision}
                    className="w-full"
                  >
                    Submit Revision Request
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Order Details</TabsTrigger>
          <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
          <TabsTrigger value="history">Status History</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{order.requirements}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{isClient ? 'Freelancer' : 'Client'} Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <img 
                  src={otherUser.profilePicture || "/placeholder.svg"}
                  alt={`${otherUser.firstName} ${otherUser.lastName}`}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-medium">{otherUser.firstName} {otherUser.lastName}</p>
                  <p className="text-sm text-gray-500">{otherUser.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deliverables" className="space-y-4">
          {order.deliverables?.length > 0 ? (
            order.deliverables.map((deliverable: any, index: number) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">Delivery #{index + 1}</CardTitle>
                  <CardDescription>
                    Submitted on {new Date(deliverable.submittedAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{deliverable.message}</p>
                  {deliverable.files?.length > 0 && (
                    <div className="space-y-2">
                      <p className="font-medium">Files:</p>
                      {deliverable.files.map((file: any, fileIndex: number) => (
                        <div key={fileIndex} className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">{file.fileName}</span>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No deliverables submitted yet</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {order.statusHistory?.map((entry: any, index: number) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{getStatusText(entry.status)}</p>
                    {entry.note && <p className="text-sm text-gray-600">{entry.note}</p>}
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(entry.updatedAt).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrderDetail;
