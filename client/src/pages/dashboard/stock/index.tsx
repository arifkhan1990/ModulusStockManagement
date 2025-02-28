
import React, { useState } from 'react';
import { 
  Package, 
  ArrowUpRight, 
  AlertTriangle, 
  TrendingDown,
  Filter,
  Plus,
  DownloadCloud,
  UploadCloud
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../components/ui/tabs';
import { Button } from '../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '../../../components/ui/pagination';
import MainLayout from '../../../components/layout/MainLayout';
import { Badge } from '../../../components/ui/badge';
import { StockTransferForm } from '../../../components/stock/stock-transfer-form';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../../../utils/api';
import { FeatureToggle } from '../../../components/saas/FeatureToggle';

export default function StockManagement() {
  const { t } = useTranslation();
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  
  // Fetch stock data
  const { data, isLoading, error } = useQuery({
    queryKey: ['stock-items'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/stock');
      return response.data;
    },
  });

  const stockData = data || { items: [], pagination: { total: 0, page: 1, pageSize: 10, totalPages: 1 } };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('stockManagement')}</h1>
            <p className="text-muted-foreground">
              {t('manageStockInventoryAcrossLocations')}
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  {t('addProduct')}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>{t('addNewProduct')}</DialogTitle>
                  <DialogDescription>
                    {t('enterProductDetailsBelow')}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="name" className="text-right">
                      {t('name')}
                    </label>
                    <Input id="name" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="sku" className="text-right">
                      {t('sku')}
                    </label>
                    <Input id="sku" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="category" className="text-right">
                      {t('category')}
                    </label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder={t('selectCategory')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronics">{t('electronics')}</SelectItem>
                        <SelectItem value="clothing">{t('clothing')}</SelectItem>
                        <SelectItem value="food">{t('food')}</SelectItem>
                        <SelectItem value="other">{t('other')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="stock" className="text-right">
                      {t('initialStock')}
                    </label>
                    <Input id="stock" type="number" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="threshold" className="text-right">
                      {t('lowStockThreshold')}
                    </label>
                    <Input id="threshold" type="number" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">{t('save')}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <TrendingDown className="mr-2 h-4 w-4" />
                  {t('transferStock')}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>{t('stockTransfer')}</DialogTitle>
                  <DialogDescription>
                    {t('transferOrAdjustStockLevels')}
                  </DialogDescription>
                </DialogHeader>
                <StockTransferForm onSuccess={() => {
                  // Refetch stock data after successful transfer
                }} />
              </DialogContent>
            </Dialog>
            
            <FeatureToggle featureId="reports">
              <Button variant="outline">
                <DownloadCloud className="mr-2 h-4 w-4" />
                {t('exportStock')}
              </Button>
            </FeatureToggle>
            
            <FeatureToggle featureId="import">
              <Button variant="outline">
                <UploadCloud className="mr-2 h-4 w-4" />
                {t('importStock')}
              </Button>
            </FeatureToggle>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{t('totalStockValue')}</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$247.89K</div>
              <p className="text-xs text-muted-foreground">+2.5% {t('fromLastMonth')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{t('lowStockItems')}</CardTitle>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">{t('itemsRequiringAttention')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{t('stockTurnover')}</CardTitle>
              <TrendingDown className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.2x</div>
              <p className="text-xs text-muted-foreground">{t('perQuarterAverage')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{t('totalProducts')}</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stockData.pagination.total}</div>
              <p className="text-xs text-muted-foreground">{t('acrossAllLocations')}</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <Tabs defaultValue="products">
            <TabsList>
              <TabsTrigger value="products">{t('products')}</TabsTrigger>
              <TabsTrigger value="movements">{t('movements')}</TabsTrigger>
              <TabsTrigger value="levels">{t('stockLevels')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="products" className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Input 
                    placeholder={t('search')} 
                    className="w-[300px]" 
                  />
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t('allLocations')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('allLocations')}</SelectItem>
                    <SelectItem value="warehouse">{t('warehouse')}</SelectItem>
                    <SelectItem value="store">{t('store')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('productName')}</TableHead>
                      <TableHead>{t('sku')}</TableHead>
                      <TableHead>{t('category')}</TableHead>
                      <TableHead className="text-right">{t('price')}</TableHead>
                      <TableHead className="text-right">{t('stock')}</TableHead>
                      <TableHead>{t('status')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">{t('loading')}</TableCell>
                      </TableRow>
                    ) : error ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-red-500">{t('errorLoading')}</TableCell>
                      </TableRow>
                    ) : stockData.items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">{t('noProductsFound')}</TableCell>
                      </TableRow>
                    ) : (
                      stockData.items.map((item: any) => (
                        <TableRow key={item._id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.sku}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">{item.stock}</TableCell>
                          <TableCell>
                            {item.stock <= item.lowStockThreshold ? (
                              <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                                {t('lowStock')}
                              </Badge>
                            ) : item.stock === 0 ? (
                              <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
                                {t('outOfStock')}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                                {t('inStock')}
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  {Array.from({ length: stockData.pagination.totalPages }, (_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink href="#" isActive={stockData.pagination.page === i + 1}>
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </TabsContent>
            
            <TabsContent value="movements" className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Input 
                    placeholder={t('search')} 
                    className="w-[300px]" 
                  />
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t('allMovementTypes')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('allMovementTypes')}</SelectItem>
                    <SelectItem value="transfer">{t('transfer')}</SelectItem>
                    <SelectItem value="adjustment">{t('adjustment')}</SelectItem>
                    <SelectItem value="sale">{t('sale')}</SelectItem>
                    <SelectItem value="purchase">{t('purchase')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('date')}</TableHead>
                      <TableHead>{t('productName')}</TableHead>
                      <TableHead>{t('type')}</TableHead>
                      <TableHead>{t('fromLocation')}</TableHead>
                      <TableHead>{t('toLocation')}</TableHead>
                      <TableHead className="text-right">{t('quantity')}</TableHead>
                      <TableHead>{t('reference')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">{t('loadingMovements')}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </TabsContent>
            
            <TabsContent value="levels" className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Input 
                    placeholder={t('search')} 
                    className="w-[300px]" 
                  />
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t('allLocations')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('allLocations')}</SelectItem>
                    <SelectItem value="warehouse">{t('warehouse')}</SelectItem>
                    <SelectItem value="store">{t('store')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('location')}</TableHead>
                      <TableHead>{t('productName')}</TableHead>
                      <TableHead>{t('sku')}</TableHead>
                      <TableHead className="text-right">{t('currentStock')}</TableHead>
                      <TableHead className="text-right">{t('minimumLevel')}</TableHead>
                      <TableHead className="text-right">{t('maximumLevel')}</TableHead>
                      <TableHead>{t('status')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">{t('loadingStockLevels')}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}
