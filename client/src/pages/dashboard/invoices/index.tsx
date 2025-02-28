
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
  Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
  Tabs, TabsContent, TabsList, TabsTrigger,
  Badge
} from '../../../components/ui';
import { 
  FileText, Download, Printer, Plus, Search, Filter, ChevronDown, Edit, Trash2, Eye, Send
} from 'lucide-react';
import { apiRequest } from '../../../utils/api';
import FeatureToggle from '../../../components/saas/FeatureToggle';

const statuses = [
  { value: 'all', label: 'All Invoices' },
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'paid', label: 'Paid' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'cancelled', label: 'Cancelled' },
];

type Invoice = {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  clientName: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
};

export default function InvoicesPage() {
  const { t } = useTranslation();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [status, setStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const response = await apiRequest('GET', '/api/invoices');
        if (response.data) {
          setInvoices(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch invoices:', error);
        // Use sample data when API fails
        setInvoices([
          {
            id: '1',
            invoiceNumber: 'INV-0001',
            date: '2023-06-15',
            dueDate: '2023-07-15',
            clientName: 'Acme Corporation',
            amount: 1299.99,
            status: 'paid'
          },
          {
            id: '2',
            invoiceNumber: 'INV-0002',
            date: '2023-06-20',
            dueDate: '2023-07-20',
            clientName: 'TechNova Solutions',
            amount: 849.50,
            status: 'sent'
          },
          {
            id: '3',
            invoiceNumber: 'INV-0003',
            date: '2023-06-25',
            dueDate: '2023-07-25',
            clientName: 'Global Traders Inc.',
            amount: 3450.00,
            status: 'overdue'
          },
          {
            id: '4',
            invoiceNumber: 'INV-0004',
            date: '2023-06-30',
            dueDate: '2023-07-30',
            clientName: 'Luxe Boutique',
            amount: 750.25,
            status: 'draft'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const filteredInvoices = invoices.filter(invoice => {
    const matchesStatus = status === 'all' || invoice.status === status;
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'draft':
        return <Badge variant="outline">{t('draft')}</Badge>;
      case 'sent':
        return <Badge variant="secondary">{t('sent')}</Badge>;
      case 'paid':
        return <Badge variant="success">{t('paid')}</Badge>;
      case 'overdue':
        return <Badge variant="destructive">{t('overdue')}</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-gray-100">{t('cancelled')}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t('invoices')}</h1>
        <FeatureToggle featureId="invoice_management">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> {t('newInvoice')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{t('createNewInvoice')}</DialogTitle>
                <DialogDescription>
                  {t('createInvoiceDescription')}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="client">{t('client')}</label>
                    <Select>
                      <SelectTrigger id="client">
                        <SelectValue placeholder={t('selectClient')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client1">Acme Corporation</SelectItem>
                        <SelectItem value="client2">TechNova Solutions</SelectItem>
                        <SelectItem value="client3">Global Traders Inc.</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="dueDate">{t('dueDate')}</label>
                    <Input id="dueDate" type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label>{t('items')}</label>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('item')}</TableHead>
                        <TableHead>{t('quantity')}</TableHead>
                        <TableHead>{t('price')}</TableHead>
                        <TableHead>{t('total')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Input placeholder={t('itemName')} />
                        </TableCell>
                        <TableCell>
                          <Input type="number" defaultValue="1" min="1" />
                        </TableCell>
                        <TableCell>
                          <Input type="number" defaultValue="0.00" min="0" step="0.01" />
                        </TableCell>
                        <TableCell>$0.00</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" /> {t('addItem')}
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">{t('saveAsDraft')}</Button>
                <Button>{t('createInvoice')}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </FeatureToggle>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex w-full sm:w-auto gap-2">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('selectStatus')} />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            {t('filter')}
          </Button>
        </div>
        <div className="w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('searchInvoices')}
              className="w-full sm:w-[300px] pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('invoicesTitle')}</CardTitle>
          <CardDescription>{t('invoicesDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('invoiceNumber')}</TableHead>
                <TableHead>{t('date')}</TableHead>
                <TableHead>{t('client')}</TableHead>
                <TableHead>{t('amount')}</TableHead>
                <TableHead>{t('status')}</TableHead>
                <TableHead>{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    {t('loading')}...
                  </TableCell>
                </TableRow>
              ) : filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    {t('noInvoicesFound')}
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                    <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                    <TableCell>{invoice.clientName}</TableCell>
                    <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            {t('showing')} {filteredInvoices.length} {t('of')} {invoices.length} {t('invoices')}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" /> {t('export')}
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" /> {t('print')}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
