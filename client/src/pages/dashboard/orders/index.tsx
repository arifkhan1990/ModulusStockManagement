
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { 
  ShoppingCart, 
  Filter, 
  Search, 
  Plus,
  FileText,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Clock
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Badge } from "../../../components/ui/badge";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "../../../components/ui/pagination";
import { FeatureToggle } from "../../../components/saas/FeatureToggle";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  date: string;
  total: number;
  paymentStatus: "paid" | "pending" | "failed";
  fulfillmentStatus: "unfulfilled" | "processing" | "shipped" | "delivered" | "cancelled";
  items: number;
  channel: string;
}

const statusColors = {
  paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  unfulfilled: "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300",
  processing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  delivered: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const statusIcons = {
  paid: <CheckCircle2 className="h-4 w-4 mr-1" />,
  pending: <Clock className="h-4 w-4 mr-1" />,
  failed: <XCircle className="h-4 w-4 mr-1" />,
  unfulfilled: <Package className="h-4 w-4 mr-1" />,
  processing: <Package className="h-4 w-4 mr-1" />,
  shipped: <Truck className="h-4 w-4 mr-1" />,
  delivered: <CheckCircle2 className="h-4 w-4 mr-1" />,
  cancelled: <XCircle className="h-4 w-4 mr-1" />,
};

export default function Orders() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["orders", page, search, filterStatus],
    queryFn: async () => {
      try {
        const params: Record<string, string> = {
          page: page.toString(),
          limit: "10",
        };
        
        if (search) {
          params.search = search;
        }
        
        if (filterStatus !== "all") {
          params.status = filterStatus;
        }
        
        const response = await apiRequest("GET", "/api/orders", undefined, { params });
        return response.data;
      } catch (error) {
        console.error("Failed to fetch orders", error);
        return { orders: [], totalPages: 0 };
      }
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <MainLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t("ordersManagement")}</h1>
            <p className="text-muted-foreground">{t("manageYourOrders")}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <FeatureToggle featureId="order_creation">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t("newOrder")}
              </Button>
            </FeatureToggle>
            
            <FeatureToggle featureId="export">
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                {t("exportOrders")}
              </Button>
            </FeatureToggle>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{t("totalOrders")}</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : data?.totalOrders || 0}
              </div>
              <p className="text-xs text-muted-foreground">{t("lastSevenDays")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{t("pendingOrders")}</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : data?.pendingOrders || 0}
              </div>
              <p className="text-xs text-muted-foreground">{t("needsFulfillment")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{t("totalRevenue")}</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : formatCurrency(data?.totalRevenue || 0)}
              </div>
              <p className="text-xs text-muted-foreground">{t("lastThirtyDays")}</p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{t("orders")}</CardTitle>
            <CardDescription>{t("viewAndManageYourOrders")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("searchOrders")}
                  className="pl-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder={t("filterByStatus")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allOrders")}</SelectItem>
                  <SelectItem value="unfulfilled">{t("unfulfilled")}</SelectItem>
                  <SelectItem value="processing">{t("processing")}</SelectItem>
                  <SelectItem value="shipped">{t("shipped")}</SelectItem>
                  <SelectItem value="delivered">{t("delivered")}</SelectItem>
                  <SelectItem value="cancelled">{t("cancelled")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("orderNumber")}</TableHead>
                    <TableHead>{t("date")}</TableHead>
                    <TableHead>{t("customer")}</TableHead>
                    <TableHead>{t("items")}</TableHead>
                    <TableHead>{t("total")}</TableHead>
                    <TableHead>{t("paymentStatus")}</TableHead>
                    <TableHead>{t("fulfillmentStatus")}</TableHead>
                    <TableHead>{t("channel")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        {t("loading")}...
                      </TableCell>
                    </TableRow>
                  ) : data?.orders?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        {t("noOrdersFound")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.orders?.map((order: Order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          #{order.orderNumber}
                        </TableCell>
                        <TableCell>{formatDate(order.date)}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>{order.items}</TableCell>
                        <TableCell>{formatCurrency(order.total)}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[order.paymentStatus]}>
                            {statusIcons[order.paymentStatus]}
                            {t(order.paymentStatus)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[order.fulfillmentStatus]}>
                            {statusIcons[order.fulfillmentStatus]}
                            {t(order.fulfillmentStatus)}
                          </Badge>
                        </TableCell>
                        <TableCell>{order.channel}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                    />
                  </PaginationItem>
                  
                  {[...Array(data?.totalPages || 0)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        isActive={page === i + 1}
                        onClick={() => setPage(i + 1)}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setPage(prev => prev + 1)}
                      disabled={page >= (data?.totalPages || 1)}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
