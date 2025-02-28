
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { 
  BarChart3, 
  TrendingUp, 
  FileText,
  Download,
  Calendar,
  DollarSign
} from "lucide-react";
import { apiRequest } from "../../../utils/api";
import MainLayout from "../../../components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { AreaChart, BarChart } from "../../../components/charts";
import { FeatureToggle } from "../../../components/saas/FeatureToggle";

export default function Reports() {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState("30d");
  const [activeTab, setActiveTab] = useState("sales");

  const { data: salesData, isLoading: salesLoading } = useQuery({
    queryKey: ["reports", "sales", timeRange],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", `/api/reports/sales?timeRange=${timeRange}`);
        return response.data;
      } catch (error) {
        console.error("Failed to fetch sales reports", error);
        return null;
      }
    },
  });

  const { data: inventoryData, isLoading: inventoryLoading } = useQuery({
    queryKey: ["reports", "inventory", timeRange],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", `/api/reports/inventory?timeRange=${timeRange}`);
        return response.data;
      } catch (error) {
        console.error("Failed to fetch inventory reports", error);
        return null;
      }
    },
    enabled: activeTab === "inventory",
  });

  const { data: channelData, isLoading: channelLoading } = useQuery({
    queryKey: ["reports", "channels", timeRange],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", `/api/reports/channels?timeRange=${timeRange}`);
        return response.data;
      } catch (error) {
        console.error("Failed to fetch channel reports", error);
        return null;
      }
    },
    enabled: activeTab === "channels",
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <MainLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t("reports")}</h1>
            <p className="text-muted-foreground">{t("viewYourBusinessPerformance")}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder={t("selectPeriod")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">{t("last7Days")}</SelectItem>
                <SelectItem value="30d">{t("last30Days")}</SelectItem>
                <SelectItem value="90d">{t("last90Days")}</SelectItem>
                <SelectItem value="1y">{t("lastYear")}</SelectItem>
              </SelectContent>
            </Select>
            
            <FeatureToggle featureId="export">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                {t("exportReport")}
              </Button>
            </FeatureToggle>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{t("totalRevenue")}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {salesLoading ? "..." : formatCurrency(salesData?.totalRevenue || 0)}
              </div>
              {salesData?.revenueChange > 0 ? (
                <p className="text-xs flex items-center text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{salesData?.revenueChange}% {t("fromPrevious")}
                </p>
              ) : (
                <p className="text-xs flex items-center text-red-600">
                  <TrendingUp className="h-3 w-3 mr-1 transform rotate-180" />
                  {salesData?.revenueChange}% {t("fromPrevious")}
                </p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{t("totalOrders")}</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {salesLoading ? "..." : salesData?.totalOrders || 0}
              </div>
              {salesData?.ordersChange > 0 ? (
                <p className="text-xs flex items-center text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{salesData?.ordersChange}% {t("fromPrevious")}
                </p>
              ) : (
                <p className="text-xs flex items-center text-red-600">
                  <TrendingUp className="h-3 w-3 mr-1 transform rotate-180" />
                  {salesData?.ordersChange}% {t("fromPrevious")}
                </p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{t("averageOrderValue")}</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {salesLoading ? "..." : formatCurrency(salesData?.averageOrderValue || 0)}
              </div>
              {salesData?.aovChange > 0 ? (
                <p className="text-xs flex items-center text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{salesData?.aovChange}% {t("fromPrevious")}
                </p>
              ) : (
                <p className="text-xs flex items-center text-red-600">
                  <TrendingUp className="h-3 w-3 mr-1 transform rotate-180" />
                  {salesData?.aovChange}% {t("fromPrevious")}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="sales">{t("sales")}</TabsTrigger>
            <TabsTrigger value="inventory">{t("inventory")}</TabsTrigger>
            <TabsTrigger value="channels">{t("channels")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sales" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("salesOverTime")}</CardTitle>
                <CardDescription>{t("viewSalesPerformanceOverTime")}</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {salesLoading ? (
                  <div className="flex items-center justify-center h-full">
                    {t("loading")}...
                  </div>
                ) : (
                  <AreaChart
                    data={salesData?.salesOverTime || []}
                    categories={["revenue"]}
                    index="date"
                    colors={["indigo"]}
                    valueFormatter={(value) => formatCurrency(value)}
                    showLegend={false}
                  />
                )}
              </CardContent>
            </Card>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t("topProducts")}</CardTitle>
                  <CardDescription>{t("bestSellingProductsByRevenue")}</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {salesLoading ? (
                    <div className="flex items-center justify-center h-full">
                      {t("loading")}...
                    </div>
                  ) : (
                    <BarChart
                      data={salesData?.topProducts || []}
                      categories={["revenue"]}
                      index="name"
                      colors={["indigo"]}
                      valueFormatter={(value) => formatCurrency(value)}
                      showLegend={false}
                    />
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t("salesByCategory")}</CardTitle>
                  <CardDescription>{t("revenueByCategoryBreakdown")}</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {salesLoading ? (
                    <div className="flex items-center justify-center h-full">
                      {t("loading")}...
                    </div>
                  ) : (
                    <BarChart
                      data={salesData?.salesByCategory || []}
                      categories={["revenue"]}
                      index="category"
                      colors={["indigo"]}
                      valueFormatter={(value) => formatCurrency(value)}
                      showLegend={false}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="inventory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("inventoryValue")}</CardTitle>
                <CardDescription>{t("trackInventoryValueOverTime")}</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {inventoryLoading ? (
                  <div className="flex items-center justify-center h-full">
                    {t("loading")}...
                  </div>
                ) : (
                  <AreaChart
                    data={inventoryData?.inventoryValueOverTime || []}
                    categories={["value"]}
                    index="date"
                    colors={["blue"]}
                    valueFormatter={(value) => formatCurrency(value)}
                    showLegend={false}
                  />
                )}
              </CardContent>
            </Card>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t("lowStockItems")}</CardTitle>
                  <CardDescription>{t("productsRequiringRestocking")}</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {inventoryLoading ? (
                    <div className="flex items-center justify-center h-full">
                      {t("loading")}...
                    </div>
                  ) : (
                    <BarChart
                      data={inventoryData?.lowStockItems || []}
                      categories={["currentStock"]}
                      index="name"
                      colors={["orange"]}
                      valueFormatter={(value) => value.toString()}
                      showLegend={false}
                    />
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t("topSellingItems")}</CardTitle>
                  <CardDescription>{t("bestSellingProductsByQuantity")}</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {inventoryLoading ? (
                    <div className="flex items-center justify-center h-full">
                      {t("loading")}...
                    </div>
                  ) : (
                    <BarChart
                      data={inventoryData?.topSellingItems || []}
                      categories={["quantitySold"]}
                      index="name"
                      colors={["green"]}
                      valueFormatter={(value) => value.toString()}
                      showLegend={false}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="channels" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("salesByChannel")}</CardTitle>
                <CardDescription>{t("revenueBreakdownByChannel")}</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {channelLoading ? (
                  <div className="flex items-center justify-center h-full">
                    {t("loading")}...
                  </div>
                ) : (
                  <BarChart
                    data={channelData?.salesByChannel || []}
                    categories={["revenue"]}
                    index="channel"
                    colors={["purple"]}
                    valueFormatter={(value) => formatCurrency(value)}
                    showLegend={false}
                  />
                )}
              </CardContent>
            </Card>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t("ordersByChannel")}</CardTitle>
                  <CardDescription>{t("orderVolumeByChannel")}</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {channelLoading ? (
                    <div className="flex items-center justify-center h-full">
                      {t("loading")}...
                    </div>
                  ) : (
                    <BarChart
                      data={channelData?.ordersByChannel || []}
                      categories={["orders"]}
                      index="channel"
                      colors={["cyan"]}
                      valueFormatter={(value) => value.toString()}
                      showLegend={false}
                    />
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t("channelPerformance")}</CardTitle>
                  <CardDescription>{t("averageOrderValueByChannel")}</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {channelLoading ? (
                    <div className="flex items-center justify-center h-full">
                      {t("loading")}...
                    </div>
                  ) : (
                    <BarChart
                      data={channelData?.channelPerformance || []}
                      categories={["averageOrderValue"]}
                      index="channel"
                      colors={["teal"]}
                      valueFormatter={(value) => formatCurrency(value)}
                      showLegend={false}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
