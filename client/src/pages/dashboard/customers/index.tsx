
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter,
  FileText,
  Mail,
  ArrowUpRight,
  ShoppingCart
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
import { Badge } from "../../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "../../../components/ui/pagination";
import { FeatureToggle } from "../../../components/saas/FeatureToggle";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  status: "active" | "inactive";
  tags: string[];
}

export default function Customers() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["customers", page, search, filterStatus],
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
        
        const response = await apiRequest("GET", "/api/customers", undefined, { params });
        return response.data;
      } catch (error) {
        console.error("Failed to fetch customers", error);
        return { customers: [], totalPages: 0 };
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
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <MainLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t("customerManagement")}</h1>
            <p className="text-muted-foreground">{t("manageYourCustomers")}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              {t("addCustomer")}
            </Button>
            
            <FeatureToggle featureId="export">
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                {t("exportCustomers")}
              </Button>
            </FeatureToggle>
            
            <FeatureToggle featureId="email_marketing">
              <Button variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                {t("sendEmail")}
              </Button>
            </FeatureToggle>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{t("totalCustomers")}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : data?.totalCustomers || 0}
              </div>
              <p className="text-xs text-muted-foreground">{t("allTime")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{t("newCustomers")}</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : data?.newCustomers || 0}
              </div>
              <p className="text-xs text-muted-foreground">{t("lastThirtyDays")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{t("averageOrderValue")}</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : formatCurrency(data?.avgOrderValue || 0)}
              </div>
              <p className="text-xs text-muted-foreground">{t("perCustomer")}</p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{t("customers")}</CardTitle>
            <CardDescription>{t("viewAndManageYourCustomers")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("searchCustomers")}
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
                  <SelectItem value="all">{t("allCustomers")}</SelectItem>
                  <SelectItem value="active">{t("active")}</SelectItem>
                  <SelectItem value="inactive">{t("inactive")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("name")}</TableHead>
                    <TableHead>{t("email")}</TableHead>
                    <TableHead>{t("phone")}</TableHead>
                    <TableHead>{t("orders")}</TableHead>
                    <TableHead>{t("totalSpent")}</TableHead>
                    <TableHead>{t("lastOrder")}</TableHead>
                    <TableHead>{t("status")}</TableHead>
                    <TableHead>{t("tags")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        {t("loading")}...
                      </TableCell>
                    </TableRow>
                  ) : data?.customers?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        {t("noCustomersFound")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.customers?.map((customer: Customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.phone}</TableCell>
                        <TableCell>{customer.totalOrders}</TableCell>
                        <TableCell>{formatCurrency(customer.totalSpent)}</TableCell>
                        <TableCell>{formatDate(customer.lastOrderDate)}</TableCell>
                        <TableCell>
                          <Badge variant={customer.status === "active" ? "default" : "secondary"}>
                            {t(customer.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {customer.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
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
