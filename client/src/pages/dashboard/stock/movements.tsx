
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";
import { ArrowRightLeft, FileBarChart } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export default function StockMovements() {
  const { t } = useLanguage();
  const [productFilter, setProductFilter] = useState<string | null>(null);

  // Fetch stock movements
  const { data: movements, isLoading } = useQuery({
    queryKey: ['stockMovements', productFilter],
    queryFn: async () => {
      const url = productFilter 
        ? `/api/stock-movements?productId=${productFilter}` 
        : '/api/stock-movements';
      const response = await apiRequest(url);
      return response;
    }
  });

  // Fetch products for filter dropdown
  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await apiRequest('/api/products');
      return response;
    }
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{t('stockMovements')}</h1>
        
        <div className="flex items-center gap-2">
          {products?.length > 0 && (
            <Select
              value={productFilter || ""}
              onValueChange={(value) => setProductFilter(value || null)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('filterByProduct')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('allProducts')}</SelectItem>
                {products.map((product) => (
                  <SelectItem key={product._id} value={product._id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          <Button variant="outline" size="sm">
            <FileBarChart className="h-4 w-4 mr-2" />
            {t('export')}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('stockMovementHistory')}</CardTitle>
          <CardDescription>
            {t('viewAllStockMovementsAcrossLocations')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : movements?.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('date')}</TableHead>
                  <TableHead>{t('product')}</TableHead>
                  <TableHead>{t('type')}</TableHead>
                  <TableHead>{t('from')}</TableHead>
                  <TableHead>{t('to')}</TableHead>
                  <TableHead>{t('quantity')}</TableHead>
                  <TableHead>{t('reference')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movements.map((movement) => (
                  <TableRow key={movement._id}>
                    <TableCell>
                      {format(new Date(movement.createdAt), 'PPP')}
                    </TableCell>
                    <TableCell>{movement.product?.name || 'Unknown'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <ArrowRightLeft className="h-4 w-4" />
                        {movement.type === 'transfer' ? t('transfer') : t('adjustment')}
                      </div>
                    </TableCell>
                    <TableCell>{movement.fromLocation?.name || 'Unknown'}</TableCell>
                    <TableCell>
                      {movement.type === 'transfer' 
                        ? movement.toLocation?.name || 'Unknown'  
                        : '-'}
                    </TableCell>
                    <TableCell>{movement.quantity}</TableCell>
                    <TableCell>{movement.reference || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <ArrowRightLeft className="h-10 w-10 mb-3 opacity-20" />
              <p>{t('noStockMovementsFound')}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {t('stockMovementsWillAppearHere')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
