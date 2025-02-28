
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, PackageOpen, MapPin, Truck, Users, AlertTriangle } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { useLanguage } from "@/contexts/language-context";

export default function Dashboard() {
  const { t } = useLanguage();
  
  // Get products count
  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await apiRequest('/api/products');
      return response;
    }
  });
  
  // Get locations count
  const { data: locations } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const response = await apiRequest('/api/locations');
      return response;
    }
  });
  
  // Get suppliers count
  const { data: suppliers } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const response = await apiRequest('/api/suppliers');
      return response;
    }
  });
  
  // Get recent stock movements
  const { data: stockMovements } = useQuery({
    queryKey: ['recentStockMovements'],
    queryFn: async () => {
      const response = await apiRequest('/api/stock-movements');
      return response;
    }
  });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">{t('dashboard')}</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('totalProducts')}</CardTitle>
            <PackageOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {t('productsInInventory')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('locations')}</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{locations?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {t('activeLocations')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('suppliers')}</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suppliers?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {t('activeSuppliers')}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('recentStockMovements')}</CardTitle>
            <CardDescription>
              {t('latestInventoryTransactions')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stockMovements && stockMovements.length > 0 ? (
              <div className="space-y-2">
                {stockMovements.slice(0, 5).map((movement) => (
                  <div key={movement._id} className="flex items-center gap-2 rounded-md border p-2">
                    <div className="flex-1">
                      <div className="font-medium">{movement.product?.name || 'Unknown Product'}</div>
                      <div className="text-sm text-muted-foreground">
                        {movement.type === 'transfer' 
                          ? `${movement.fromLocation?.name || 'Unknown'} → ${movement.toLocation?.name || 'Unknown'}`
                          : `${movement.fromLocation?.name || 'Unknown'} (${t('adjustment')})`}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{movement.quantity}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(movement.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                  <a href="/dashboard/stock/movements">{t('viewAllMovements')}</a>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <BarChart3 className="h-10 w-10 mb-3 opacity-20" />
                <p>{t('noStockMovementsYet')}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('stockMovementsWillAppearHere')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('lowStockItems')}</CardTitle>
            <CardDescription>
              {t('productsRequiringAttention')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertTriangle className="h-10 w-10 mb-3 opacity-20" />
              <p>{t('lowStockItemsList')}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {t('comingSoon')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutGrid, 
  Users, 
  ShoppingBag, 
  BarChart3, 
  TrendingUp, 
  ArrowUp, 
  ArrowDown, 
  Package,
  Layers,
  DollarSign,
  AlertTriangle,
  ChevronRight,
  RefreshCw,
  Bell,
  Calendar,
  Filter,
  ArrowDownRight,
  ArrowUpRight
} from 'lucide-react';

import MainLayout from '../../components/layout/MainLayout';

// This would normally be fetched from your API
const mockData = {
  stats: {
    totalStock: { value: "247,891", change: 2.5, currency: "$" },
    lowStock: { value: "8", change: -3, currency: "" },
    stockTurnover: { value: "4.2x", change: 0.8, currency: "" },
    monthlySales: { value: "42,594", change: 8.2, currency: "$" }
  },
  activities: [
    { id: 1, type: "stock", message: "Added 24 new items to stock", time: "2 hours ago" },
    { id: 2, type: "order", message: "New order #3859 received", time: "3 hours ago" },
    { id: 3, type: "sale", message: "Completed sale with ABC Corp", time: "5 hours ago" },
    { id: 4, type: "alert", message: "Low stock alert: Product XYZ-123", time: "Yesterday" },
    { id: 5, type: "system", message: "System backup completed", time: "Yesterday" }
  ],
  notifications: [
    { id: 1, type: "alert", message: "Low stock alert for 3 products", time: "Just now" },
    { id: 2, type: "info", message: "Monthly report is ready", time: "1 hour ago" },
    { id: 3, type: "success", message: "Order #3842 fulfilled", time: "2 hours ago" }
  ]
};

const IconMap = {
  stock: Package,
  order: ShoppingBag,
  sale: DollarSign,
  alert: AlertTriangle,
  system: RefreshCw,
  info: Bell,
  success: TrendingUp
};

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(mockData);
  
  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <MainLayout>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        <motion.div variants={item}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">Overview of your business performance and stock management.</p>
            </div>
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <button className="flex items-center gap-1 text-sm px-3 py-1 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors">
                <Calendar className="h-4 w-4" />
                Last 30 days
              </button>
              <button className="flex items-center gap-1 text-sm px-3 py-1 border rounded-md hover:bg-accent transition-colors">
                <Filter className="h-4 w-4" />
                Filter
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* Key Metrics */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 h-[120px] animate-pulse"
              >
                <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                <div className="h-8 bg-muted rounded w-1/2 mb-4" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            variants={item}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          >
            <MetricCard
              title="Total Stock Value"
              value={data.stats.totalStock.value}
              change={data.stats.totalStock.change}
              currency={data.stats.totalStock.currency}
              icon={<LayoutGrid className="h-5 w-5 text-muted-foreground" />}
            />
            <MetricCard
              title="Low Stock Items"
              value={data.stats.lowStock.value}
              change={data.stats.lowStock.change}
              currency={data.stats.lowStock.currency}
              icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
            />
            <MetricCard
              title="Stock Turnover"
              value={data.stats.stockTurnover.value}
              change={data.stats.stockTurnover.change}
              currency={data.stats.stockTurnover.currency}
              icon={<Layers className="h-5 w-5 text-green-500" />}
            />
            <MetricCard
              title="Monthly Sales"
              value={data.stats.monthlySales.value}
              change={data.stats.monthlySales.change}
              currency={data.stats.monthlySales.currency}
              icon={<DollarSign className="h-5 w-5 text-blue-500" />}
            />
          </motion.div>
        )}
        
        {/* Charts & Activity */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Chart Section */}
          <motion.div variants={item} className="space-y-6">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6 flex items-center justify-between">
                <h3 className="text-lg font-medium">Sales Overview</h3>
                <select className="text-xs border rounded p-1">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                </select>
              </div>
              <div className="p-6 pt-0">
                {isLoading ? (
                  <div className="h-64 bg-muted/40 rounded animate-pulse flex items-center justify-center">
                    <RefreshCw className="h-8 w-8 text-muted animate-spin" />
                  </div>
                ) : (
                  <div className="h-64 bg-muted/10 rounded flex flex-col items-center justify-center">
                    <BarChart3 className="h-16 w-16 mb-3 text-muted-foreground opacity-40" />
                    <p className="text-sm text-muted-foreground">Sales chart will display here</p>
                    <p className="text-xs text-muted-foreground mt-1">(Demo purposes only)</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6 flex items-center justify-between">
                <h3 className="text-lg font-medium">Inventory Health</h3>
                <button className="text-sm text-primary hover:underline">View Details</button>
              </div>
              <div className="p-6 pt-0">
                {isLoading ? (
                  <div className="h-40 bg-muted/40 rounded animate-pulse flex items-center justify-center">
                    <RefreshCw className="h-8 w-8 text-muted animate-spin" />
                  </div>
                ) : (
                  <div className="h-40 bg-muted/10 rounded flex flex-col items-center justify-center">
                    <Package className="h-12 w-12 mb-3 text-muted-foreground opacity-40" />
                    <p className="text-sm text-muted-foreground">Inventory chart will display here</p>
                    <p className="text-xs text-muted-foreground mt-1">(Demo purposes only)</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          
          {/* Activity & Notifications */}
          <motion.div variants={item} className="space-y-6">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6 flex items-center justify-between">
                <h3 className="text-lg font-medium">Recent Activity</h3>
                <button className="text-sm text-primary hover:underline">View All</button>
              </div>
              {isLoading ? (
                <div className="p-6 pt-0 space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-start gap-4 animate-pulse">
                      <div className="h-8 w-8 bg-muted rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-3 bg-muted rounded w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 pt-0 space-y-4">
                  {data.activities.map((activity) => {
                    const IconComponent = IconMap[activity.type as keyof typeof IconMap] || Package;
                    return (
                      <motion.div 
                        key={activity.id}
                        whileHover={{ x: 4 }}
                        className="flex items-start gap-4 p-2 hover:bg-accent rounded-md cursor-pointer transition-colors"
                      >
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center 
                          ${activity.type === 'alert' ? 'bg-red-100 text-red-600' : 
                            activity.type === 'sale' ? 'bg-green-100 text-green-600' : 
                              'bg-primary/10 text-primary'}`}
                        >
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium leading-none">{activity.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
            
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6 flex items-center justify-between">
                <h3 className="text-lg font-medium">Notifications</h3>
                <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                  {data.notifications.length}
                </div>
              </div>
              {isLoading ? (
                <div className="p-6 pt-0 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-4 animate-pulse">
                      <div className="h-8 w-8 bg-muted rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-3 bg-muted rounded w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 pt-0 space-y-4">
                  {data.notifications.map((notification) => {
                    const IconComponent = IconMap[notification.type as keyof typeof IconMap] || Bell;
                    return (
                      <motion.div 
                        key={notification.id}
                        whileHover={{ x: 4 }}
                        className="flex items-start gap-4 p-2 hover:bg-accent rounded-md cursor-pointer transition-colors"
                      >
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center 
                          ${notification.type === 'alert' ? 'bg-red-100 text-red-600' : 
                            notification.type === 'success' ? 'bg-green-100 text-green-600' : 
                              'bg-blue-100 text-blue-600'}`}
                        >
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium leading-none">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </MainLayout>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  currency: string;
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, currency, icon }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="rounded-lg border bg-card text-card-foreground shadow-sm p-6"
    >
      <div className="flex items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium">{title}</h3>
        {icon}
      </div>
      <div className="text-2xl font-bold">
        {currency}{value}
      </div>
      <div className="flex items-center pt-1">
        {change > 0 ? (
          <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
        ) : change < 0 ? (
          <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
        ) : (
          <div className="mr-1 h-4 w-4" />
        )}
        <p className={`text-xs ${
          change > 0 ? 'text-green-500' : 
          change < 0 ? 'text-red-500' : 
          'text-muted-foreground'
        }`}>
          {change > 0 ? '+' : ''}{Math.abs(change)}% from last month
        </p>
      </div>
    </motion.div>
  );
};
