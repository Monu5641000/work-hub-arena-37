
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Package, MessageSquare, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { orderAPI } from '@/api/orders';
import { useAuth } from '@/contexts/AuthContext';

interface OrderDetailProps {
  orderId: string;
  onOrderUpdate?: (order: any) => void;
}

const OrderDetail = ({ orderId, onOrderUpdate }: OrderDetailProps) => {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [revisionReason, setRevisionReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getOrder(orderId);
      if (response.success) {
        setOrder(response.data);
        if (onOrderUpdate) {
          onOrderUpdate(response.data);
        }
      } else {
        throw new Error(response.message);
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

  const handleStatusUpdate = async (status: string, note?: string) => {
    try {
      setSubmitting(true);
      const response = await orderAPI.updateOrderStatus(orderId, { status, note });
      if (response.success) {
        toast({
          title: "Success",
          description: "Order status updated successfully",
        });
        loadOrder();
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestRevision = async () => {
    if (!revisionReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for revision",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const response = await orderAPI.requestRevision(orderId, { reason: revisionReason });
      if (response.success) {
        toast({
          title: "Success",
          description: "Revision requested successfully",
        });
        setRevisionReason('');
        loadOrder();
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to request revision",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
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

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!order) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-gray-500">Order not found</p>
        </CardContent>
      </Card>
    );
  }

  const isClient = order.userRole === 'client';
  const isFreelancer = order.userRole === 'freelancer';

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Order #{order.orderNumber}</CardTitle>
              <CardDescription>{order.service?.title}</CardDescription>
            </div>
            <Badge className={getStatusColor(order.status)}>
              {getStatusText(order.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">
                  {isClient ? 'Freelancer' : 'Client'}
                </p>
                <p className="font-medium">
                  {isClient 
                    ? `${order.freelancer?.firstName} ${order.freelancer?.lastName}`
                    : `${order.client?.firstName} ${order.client?.lastName}`
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Delivery Date</p>
                <p className="font-medium">
                  {new Date(order.deliveryDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Package className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-medium">₹{order.totalAmount?.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-gray-500">{order.progress}%</span>
            </div>
            <Progress value={order.progress} />
          </div>

          {order.isOverdue && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">
                <Clock className="h-4 w-4 inline mr-1" />
                This order is overdue by {Math.abs(order.daysRemaining)} days
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{order.requirements}</p>
        </CardContent>
      </Card>

      {/* Deliverables */}
      {order.deliverables && order.deliverables.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Deliverables</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.deliverables.map((deliverable: any, index: number) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">Submission {index + 1}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(deliverable.submittedAt).toLocaleDateString()}
                  </p>
                </div>
                {deliverable.message && (
                  <p className="text-gray-700 mb-3">{deliverable.message}</p>
                )}
                {deliverable.files && deliverable.files.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Files:</p>
                    {deliverable.files.map((file: any, fileIndex: number) => (
                      <div key={fileIndex} className="flex items-center space-x-2">
                        <Download className="h-4 w-4 text-gray-400" />
                        <a 
                          href={file.fileUrl} 
                          className="text-blue-600 hover:underline text-sm"
                          download
                        >
                          {file.fileName}
                        </a>
                        <span className="text-xs text-gray-500">
                          ({(file.fileSize / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Client Actions */}
          {isClient && order.status === 'delivered' && (
            <div className="space-y-4">
              <div>
                <Button 
                  onClick={() => handleStatusUpdate('completed')}
                  disabled={submitting}
                  className="mr-2"
                >
                  Accept Delivery
                </Button>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Request Revision</label>
                <Textarea
                  placeholder="Please describe what changes are needed..."
                  value={revisionReason}
                  onChange={(e) => setRevisionReason(e.target.value)}
                />
                <Button 
                  variant="outline"
                  onClick={handleRequestRevision}
                  disabled={submitting || !revisionReason.trim()}
                >
                  Request Revision
                </Button>
              </div>
            </div>
          )}

          {/* Freelancer Actions */}
          {isFreelancer && order.status === 'pending' && (
            <div className="space-x-2">
              <Button 
                onClick={() => handleStatusUpdate('accepted')}
                disabled={submitting}
              >
                Accept Order
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleStatusUpdate('cancelled', 'Order cancelled by freelancer')}
                disabled={submitting}
              >
                Decline Order
              </Button>
            </div>
          )}

          {isFreelancer && order.status === 'accepted' && (
            <Button 
              onClick={() => handleStatusUpdate('in_progress')}
              disabled={submitting}
            >
              Start Working
            </Button>
          )}

          {/* Chat Button */}
          <Button variant="outline" className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-2" />
            Open Chat
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetail;
