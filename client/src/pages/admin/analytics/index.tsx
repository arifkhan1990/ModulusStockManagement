
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle,
  Tabs, TabsContent, TabsList, TabsTrigger,
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '../../../components/ui';
import { BarChart, LineChart, PieChart } from '../../../components/charts';
import { UserPlus, Users, DollarSign, TrendingUp, Globe, Activity } from 'lucide-react';

// Sample data for demonstration
const subscriptionData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Basic',
      data: [150, 180, 210, 250, 270, 290, 310, 330, 350, 380, 400, 430],
      backgroundColor: 'rgba(59, 130, 246, 0.7)',
    },
    {
      label: 'Pro',
      data: [100, 120, 140, 160, 180, 200, 220, 240, 265, 290, 310, 340],
      backgroundColor: 'rgba(16, 185, 129, 0.7)',
    },
    {
      label: 'Enterprise',
      data: [30, 35, 40, 45, 55, 60, 70, 80, 90, 95, 105, 115],
      backgroundColor: 'rgba(249, 115, 22, 0.7)',
    },
  ],
};

const revenueData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Monthly Revenue',
      data: [28000, 32000, 38000, 42000, 48000, 53000, 58000, 63000, 69000, 74000, 79000, 85000],
      borderColor: 'rgb(75, 192, 192)',
      fill: false,
      tension: 0.4
    },
    {
      label: 'Target',
      data: [30000, 35000, 40000, 45000, 50000, 55000, 60000, 65000, 70000, 75000, 80000, 85000],
      borderColor: 'rgba(255, 99, 132, 0.5)',
      borderDash: [5, 5],
      fill: false,
      tension: 0.1
    }
  ],
};

const featureUsageData = {
  labels: [
    'Stock Management', 
    'POS', 
    'Invoicing', 
    'Customer Management', 
    'Analytics', 
    'Notifications',
    'Sharing',
    'Downloads'
  ],
  datasets: [
    {
      data: [85, 72, 68, 64, 56, 48, 32, 28],
      backgroundColor: [
        'rgba(54, 162, 235, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(255, 99, 132, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(199, 199, 199, 0.7)',
        'rgba(83, 102, 255, 0.7)',
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(199, 199, 199, 1)',
        'rgba(83, 102, 255, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const userLocationData = {
  labels: ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'India', 'Others'],
  datasets: [
    {
      data: [35, 15, 12, 8, 7, 6, 5, 12],
      backgroundColor: [
        'rgba(54, 162, 235, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(255, 99, 132, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(199, 199, 199, 0.7)',
        'rgba(83, 102, 255, 0.7)',
      ],
      borderWidth: 1,
    },
  ],
};

export default function AdminAnalyticsPage() {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState('year');
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('analytics')}</h1>
          <p className="text-muted-foreground">
            {t('analyticsDescription')}
          </p>
        </div>
        <div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('selectTimeRange')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">{t('lastWeek')}</SelectItem>
              <SelectItem value="month">{t('lastMonth')}</SelectItem>
              <SelectItem value="quarter">{t('lastQuarter')}</SelectItem>
              <SelectItem value="year">{t('lastYear')}</SelectItem>
              <SelectItem value="all">{t('allTime')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('totalSubscribers')}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">885</div>
            <p className="text-xs text-muted-foreground">
              +12.5% {t('fromLastMonth')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('newSubscribers')}
            </CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              +22.4% {t('fromLastMonth')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('monthlyRevenue')}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$85,420</div>
            <p className="text-xs text-muted-foreground">
              +8.2% {t('fromLastMonth')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('activeUsers')}
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">620</div>
            <p className="text-xs text-muted-foreground">
              +4.9% {t('fromLastMonth')}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <TrendingUp className="mr-2 h-4 w-4" />
            {t('overview')}
          </TabsTrigger>
          <TabsTrigger value="features">
            <Activity className="mr-2 h-4 w-4" />
            {t('featureUsage')}
          </TabsTrigger>
          <TabsTrigger value="demographics">
            <Globe className="mr-2 h-4 w-4" />
            {t('demographics')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('subscriptionGrowth')}</CardTitle>
                <CardDescription>
                  {t('subscriptionGrowthDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <BarChart data={subscriptionData} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('revenueGrowth')}</CardTitle>
                <CardDescription>
                  {t('revenueGrowthDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <LineChart data={revenueData} />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('subscriptionTierDistribution')}</CardTitle>
              <CardDescription>
                {t('subscriptionTierDistributionDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="text-3xl font-bold">430</div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {t('basicSubscribers')}
                  </div>
                  <div className="text-xs text-muted-foreground">48.6%</div>
                </div>
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="text-3xl font-bold">340</div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {t('proSubscribers')}
                  </div>
                  <div className="text-xs text-muted-foreground">38.4%</div>
                </div>
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="text-3xl font-bold">115</div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {t('enterpriseSubscribers')}
                  </div>
                  <div className="text-xs text-muted-foreground">13.0%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="features" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('featurePopularity')}</CardTitle>
                <CardDescription>
                  {t('featurePopularityDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <PieChart data={featureUsageData} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('featureEngagement')}</CardTitle>
                <CardDescription>
                  {t('featureEngagementDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        <span className="text-sm font-medium">Stock Management</span>
                      </div>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm font-medium">POS</span>
                      </div>
                      <span className="text-sm font-medium">72%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                        <span className="text-sm font-medium">Invoicing</span>
                      </div>
                      <span className="text-sm font-medium">68%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                        <span className="text-sm font-medium">Customer Management</span>
                      </div>
                      <span className="text-sm font-medium">64%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: '64%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('featureUsageTrends')}</CardTitle>
              <CardDescription>
                {t('featureUsageTrendsDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <LineChart 
                data={{
                  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                  datasets: [
                    {
                      label: 'Stock Management',
                      data: [65, 68, 70, 72, 75, 78, 80, 82, 83, 84, 85, 85],
                      borderColor: 'rgba(54, 162, 235, 1)',
                      backgroundColor: 'rgba(54, 162, 235, 0.2)',
                      fill: true,
                    },
                    {
                      label: 'POS',
                      data: [50, 52, 55, 58, 60, 63, 65, 67, 69, 70, 71, 72],
                      borderColor: 'rgba(75, 192, 192, 1)',
                      backgroundColor: 'rgba(75, 192, 192, 0.2)',
                      fill: true,
                    },
                    {
                      label: 'Invoicing',
                      data: [40, 42, 45, 48, 52, 55, 58, 60, 62, 64, 66, 68],
                      borderColor: 'rgba(255, 206, 86, 1)',
                      backgroundColor: 'rgba(255, 206, 86, 0.2)',
                      fill: true,
                    }
                  ]
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="demographics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('userLocationDistribution')}</CardTitle>
                <CardDescription>
                  {t('userLocationDistributionDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <PieChart data={userLocationData} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('businessTypeDistribution')}</CardTitle>
                <CardDescription>
                  {t('businessTypeDistributionDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <PieChart 
                  data={{
                    labels: ['Retail', 'Wholesale', 'Manufacturing', 'E-commerce', 'Services', 'Healthcare', 'Others'],
                    datasets: [
                      {
                        data: [30, 25, 15, 12, 10, 5, 3],
                        backgroundColor: [
                          'rgba(54, 162, 235, 0.7)',
                          'rgba(75, 192, 192, 0.7)',
                          'rgba(255, 206, 86, 0.7)',
                          'rgba(255, 99, 132, 0.7)',
                          'rgba(153, 102, 255, 0.7)',
                          'rgba(255, 159, 64, 0.7)',
                          'rgba(199, 199, 199, 0.7)',
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('userGrowthByRegion')}</CardTitle>
              <CardDescription>
                {t('userGrowthByRegionDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <BarChart 
                data={{
                  labels: ['North America', 'Europe', 'Asia Pacific', 'South America', 'Africa', 'Middle East'],
                  datasets: [
                    {
                      label: 'Last Year',
                      data: [250, 180, 120, 80, 40, 30],
                      backgroundColor: 'rgba(153, 102, 255, 0.5)',
                    },
                    {
                      label: 'This Year',
                      data: [320, 230, 170, 95, 50, 40],
                      backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    }
                  ],
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
