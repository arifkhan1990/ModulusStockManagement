
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

export default function StockPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  // Mock data - would be replaced with actual API calls
  const { data: stockData = { products: [], pagination: { total: 0, pages: 1 } }, isLoading } = useQuery({
    queryKey: ['products', currentPage, searchQuery, selectedCategory],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', 
          `/api/products?page=${currentPage}&search=${searchQuery}${selectedCategory !== 'all' ? `&category=${selectedCategory}` : ''}`
        );
        return response.data || { products: [], pagination: { total: 0, pages: 1 } };
      } catch (error) {
        console.error('Failed to fetch products', error);
        return { products: [], pagination: { total: 0, pages: 1 } };
      }
    },
    placeholderData: {
      products: Array(10).fill(0).map((_, i) => ({
        _id: `product-${i}`,
        name: `Product ${i + 1}`,
        sku: `SKU-${1000 + i}`,
        price: (Math.random() * 100 + 10).toFixed(2),
        category: i % 3 === 0 ? 'Electronics' : i % 3 === 1 ? 'Clothing' : 'Food',
        stock: Math.floor(Math.random() * 100),
        lowStockThreshold: 10,
      })),
      pagination: { total: 87, pages: 9, page: 1, limit: 10 }
    }
  });

  // Mock data for categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/categories');
        return response.data || [];
      } catch (error) {
        console.error('Failed to fetch categories', error);
        return [];
      }
    },
    placeholderData: ['Electronics', 'Clothing', 'Food', 'Office Supplies', 'Furniture']
  });

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
                        {categories.map((category: string) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="price" className="text-right">
                      {t('price')}
                    </label>
                    <Input id="price" type="number" step="0.01" className="col-span-3" />
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
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="w-full md:w-64">
                  <Input
                    placeholder={t('searchProducts')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div className="flex flex-col md:flex-row gap-2 md:ml-auto">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={t('filterByCategory')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('allCategories')}</SelectItem>
                      {categories.map((category: string) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('name')}</TableHead>
                        <TableHead>{t('sku')}</TableHead>
                        <TableHead>{t('category')}</TableHead>
                        <TableHead className="text-right">{t('price')}</TableHead>
                        <TableHead className="text-right">{t('stockLevel')}</TableHead>
                        <TableHead className="text-right">{t('status')}</TableHead>
                        <TableHead className="text-right">{t('actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        Array(5).fill(0).map((_, i) => (
                          <TableRow key={i} className="animate-pulse">
                            <TableCell className="h-12 bg-gray-100 rounded"></TableCell>
                            <TableCell className="h-12 bg-gray-100 rounded"></TableCell>
                            <TableCell className="h-12 bg-gray-100 rounded"></TableCell>
                            <TableCell className="h-12 bg-gray-100 rounded"></TableCell>
                            <TableCell className="h-12 bg-gray-100 rounded"></TableCell>
                            <TableCell className="h-12 bg-gray-100 rounded"></TableCell>
                            <TableCell className="h-12 bg-gray-100 rounded"></TableCell>
                          </TableRow>
                        ))
                      ) : stockData.products.map((product: any) => (
                        <TableRow key={product._id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.sku}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell className="text-right">${parseFloat(product.price).toFixed(2)}</TableCell>
                          <TableCell className="text-right">{product.stock}</TableCell>
                          <TableCell className="text-right">
                            {product.stock <= product.lowStockThreshold ? (
                              <Badge variant="destructive">{t('lowStock')}</Badge>
                            ) : (
                              <Badge variant="outline">{t('inStock')}</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" asChild>
                              <a href={`/dashboard/stock/product/${product._id}`}>{t('view')}</a>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <div className="p-4 border-t">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                      {Array.from({ length: Math.min(5, stockData.pagination.pages) }, (_, i) => {
                        const pageNumber = currentPage <= 3
                          ? i + 1
                          : currentPage >= stockData.pagination.pages - 2
                            ? stockData.pagination.pages - 4 + i
                            : currentPage - 2 + i;
                        
                        if (pageNumber <= 0 || pageNumber > stockData.pagination.pages) {
                          return null;
                        }
                        
                        return (
                          <PaginationItem key={i}>
                            <PaginationLink
                              onClick={() => setCurrentPage(pageNumber)}
                              isActive={currentPage === pageNumber}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(Math.min(stockData.pagination.pages, currentPage + 1))}
                          className={currentPage === stockData.pagination.pages ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="movements">
              <Card>
                <CardHeader>
                  <CardTitle>{t('stockMovementsHistory')}</CardTitle>
                  <CardDescription>{t('trackAllStockMovements')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-80 border rounded-md">
                    <div className="text-center">
                      <Package className="h-10 w-10 mx-auto mb-3 opacity-20" />
                      <p>{t('stockMovementsTableWillBeDisplayed')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="levels">
              <Card>
                <CardHeader>
                  <CardTitle>{t('currentStockLevels')}</CardTitle>
                  <CardDescription>{t('viewCurrentStockLevels')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-80 border rounded-md">
                    <div className="text-center">
                      <AlertTriangle className="h-10 w-10 mx-auto mb-3 opacity-20" />
                      <p>{t('lowStockItemsListWillBeDisplayed')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}
