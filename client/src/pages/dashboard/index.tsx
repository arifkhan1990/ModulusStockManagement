
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
