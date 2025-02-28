
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FileBarChart, Download, Filter } from "lucide-react";

export default function Reports() {
  const [selectedReportType, setSelectedReportType] = useState("inventory");

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate and view analytical reports for your business
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="inventory"
        value={selectedReportType}
        onValueChange={setSelectedReportType}
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="movements">Stock Movements</TabsTrigger>
          <TabsTrigger value="valuation">Valuation</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Status Report</CardTitle>
              <CardDescription>
                Overview of current inventory levels across all locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-md bg-muted/10">
                <div className="text-center p-6 text-muted-foreground">
                  <FileBarChart className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium">Inventory Status Report</p>
                  <p className="mt-2">
                    This report will show current stock levels, low stock items, and inventory distribution.
                  </p>
                  <Button className="mt-4">Generate Report</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock Movement Report</CardTitle>
              <CardDescription>
                Analysis of stock transfers and adjustments over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-md bg-muted/10">
                <div className="text-center p-6 text-muted-foreground">
                  <FileBarChart className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium">Stock Movement Report</p>
                  <p className="mt-2">
                    This report will analyze stock transfers between locations and stock adjustments.
                  </p>
                  <Button className="mt-4">Generate Report</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="valuation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Valuation Report</CardTitle>
              <CardDescription>
                Current value of inventory assets by location and category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-md bg-muted/10">
                <div className="text-center p-6 text-muted-foreground">
                  <FileBarChart className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium">Inventory Valuation Report</p>
                  <p className="mt-2">
                    This report will calculate the value of current inventory assets and track changes over time.
                  </p>
                  <Button className="mt-4">Generate Report</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Demand Forecasting Report</CardTitle>
              <CardDescription>
                AI-powered predictions for future inventory needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-md bg-muted/10">
                <div className="text-center p-6 text-muted-foreground">
                  <FileBarChart className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium">Demand Forecasting Report</p>
                  <p className="mt-2">
                    AI-powered analysis to predict future inventory needs based on historical data.
                  </p>
                  <Button className="mt-4">Generate Report</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
