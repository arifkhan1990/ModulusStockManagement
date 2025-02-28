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
  AlertTriangle,
  Bell,
  Share2,
  CreditCard
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import MainLayout from '../../components/layout/MainLayout';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../../utils/api';
import { AreaChart, BarChart } from '../../components/charts';
import { FeatureToggle } from '../../components/saas/FeatureToggle';

export default function Dashboard() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - would be replaced with actual API calls
  const { data: stockMovements = [] } = useQuery({
    queryKey: ['stock-movements'],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/stock-movements?limit=5');
        return response.data || [];
      } catch (error) {
        console.error('Failed to fetch stock movements', error);
        return [];
      }
    },
  });

  // Mock stats - would be replaced with actual API calls
  const { data: stats = {} } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/analytics/dashboard');
        return response.data || {
          totalProducts: 358,
          totalCustomers: 1245,
          totalRevenue: 24789,
          totalOrders: 532,
          lowStockItems: 8,
          revenueGrowth: 12.5,
          stockValue: 247890
        };
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
        return {
          totalProducts: 358,
          totalCustomers: 1245,
          totalRevenue: 24789,
          totalOrders: 532,
          lowStockItems: 8,
          revenueGrowth: 12.5,
          stockValue: 247890
        };
      }
    },
  });

  // Animation variants for staggered card animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Sample chart data
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [12500, 15000, 18500, 14000, 19500, 22000],
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const stockTurnoverData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'Turnover Rate',
        data: [3.8, 4.2, 4.5, 4.1],
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        borderRadius: 4,
      },
    ],
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('dashboard')}</h1>
            <p className="text-muted-foreground">
              {t('dashboardWelcome', { date: new Date().toLocaleDateString() })}
            </p>
          </div>
          <FeatureToggle featureId="notifications">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              {t('notifications')}
            </Button>
          </FeatureToggle>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 md:grid-cols-5 gap-2 h-auto bg-muted/50 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2">
              <LayoutGrid className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">{t('overview')}</span>
            </TabsTrigger>
            <TabsTrigger value="stock" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2">
              <Package className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">{t('stock')}</span>
            </TabsTrigger>
            <TabsTrigger value="sales" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2">
              <ShoppingBag className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">{t('sales')}</span>
            </TabsTrigger>
            <TabsTrigger value="customers" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2">
              <Users className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">{t('customers')}</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2">
              <BarChart3 className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">{t('analytics')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            >
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">{t('totalProducts')}</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalProducts?.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">+5% {t('fromLastMonth')}</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">{t('totalRevenue')}</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${(stats.totalRevenue / 1000).toFixed(1)}K</div>
                    <div className="flex items-center text-xs text-green-500">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      {stats.revenueGrowth}% {t('fromLastMonth')}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">{t('totalOrders')}</CardTitle>
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalOrders?.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">+12% {t('fromLastMonth')}</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">{t('lowStockItems')}</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.lowStockItems}</div>
                    <p className="text-xs text-muted-foreground">{t('itemsRequiringAttention')}</p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>{t('revenueOverview')}</CardTitle>
                    <CardDescription>{t('monthlyRevenueBreakdown')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <AreaChart data={revenueData} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>{t('stockTurnoverRate')}</CardTitle>
                    <CardDescription>{t('quarterlyStockTurnover')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <BarChart data={stockTurnoverData} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 mt-4">
              <FeatureToggle featureId="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('notifications')}</CardTitle>
                    <CardDescription>{t('recentAlerts')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Bell className="h-10 w-10 mb-3 opacity-20" />
                      <p>{t('noNotificationsYet')}</p>
                    </div>
                  </CardContent>
                </Card>
              </FeatureToggle>

              <FeatureToggle featureId="sharing">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('sharing')}</CardTitle>
                    <CardDescription>{t('shareBusinessData')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Share2 className="h-10 w-10 mb-3 opacity-20" />
                      <p>{t('noSharedItemsYet')}</p>
                    </div>
                  </CardContent>
                </Card>
              </FeatureToggle>

              <FeatureToggle featureId="billing">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('subscription')}</CardTitle>
                    <CardDescription>{t('yourCurrentPlan')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <CreditCard className="h-10 w-10 mb-3 opacity-20" />
                      <p className="font-medium">Pro Plan</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('renewsOn', { date: '2024-07-15' })}
                      </p>
                      <Button variant="outline" size="sm" className="mt-4" asChild>
                        <a href="/dashboard/billing">{t('manageBilling')}</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </FeatureToggle>
            </div>
          </TabsContent>

          {/* Other tab contents would be implemented here */}
        </Tabs>
      </div>
    </MainLayout>
  );
}