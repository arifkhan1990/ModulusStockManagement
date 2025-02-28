
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileDown, BarChart, PieChart, TrendingUp } from "lucide-react";

export default function ReportsPage() {
  const [selectedTab, setSelectedTab] = useState("inventory");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Analyze inventory data and track performance
          </p>
        </div>
        <Button variant="outline">
          <FileDown className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      <Tabs
        defaultValue="inventory"
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="movement">Stock Movement</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Value by Location</CardTitle>
              <CardDescription>
                Total inventory value across all warehouses and stores
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <div className="h-full flex items-center justify-center border rounded-md">
                <div className="text-center p-6">
                  <PieChart className="h-10 w-10 mx-auto mb-3 opacity-20" />
                  <p className="text-muted-foreground">
                    Inventory value chart will be displayed here
                  </p>
                  <p className="text-sm mt-1 text-muted-foreground">
                    Integration coming soon
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Low Stock Items</CardTitle>
                <CardDescription>
                  Products below minimum stock threshold
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="h-full flex items-center justify-center border rounded-md">
                  <div className="text-center p-6">
                    <BarChart className="h-10 w-10 mx-auto mb-3 opacity-20" />
                    <p className="text-muted-foreground">
                      Low stock items chart will be displayed here
                    </p>
                    <p className="text-sm mt-1 text-muted-foreground">
                      Integration coming soon
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Stock Turnover Rate</CardTitle>
                <CardDescription>
                  How quickly products are sold and replaced
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="h-full flex items-center justify-center border rounded-md">
                  <div className="text-center p-6">
                    <TrendingUp className="h-10 w-10 mx-auto mb-3 opacity-20" />
                    <p className="text-muted-foreground">
                      Turnover rate chart will be displayed here
                    </p>
                    <p className="text-sm mt-1 text-muted-foreground">
                      Integration coming soon
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="movement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock Movements Over Time</CardTitle>
              <CardDescription>
                Track stock transfers and adjustments by period
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <div className="h-full flex items-center justify-center border rounded-md">
                <div className="text-center p-6">
                  <BarChart className="h-10 w-10 mx-auto mb-3 opacity-20" />
                  <p className="text-muted-foreground">
                    Stock movement chart will be displayed here
                  </p>
                  <p className="text-sm mt-1 text-muted-foreground">
                    Integration coming soon
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Performance</CardTitle>
              <CardDescription>
                Track sales metrics and performance
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <div className="h-full flex items-center justify-center border rounded-md">
                <div className="text-center p-6">
                  <TrendingUp className="h-10 w-10 mx-auto mb-3 opacity-20" />
                  <p className="text-muted-foreground">
                    Sales performance chart will be displayed here
                  </p>
                  <p className="text-sm mt-1 text-muted-foreground">
                    Integration coming soon
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Performance</CardTitle>
              <CardDescription>
                Monitor system performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <div className="h-full flex items-center justify-center border rounded-md">
                <div className="text-center p-6">
                  <BarChart className="h-10 w-10 mx-auto mb-3 opacity-20" />
                  <p className="text-muted-foreground">
                    Performance metrics will be displayed here
                  </p>
                  <p className="text-sm mt-1 text-muted-foreground">
                    Integration coming soon
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
