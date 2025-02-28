
import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle,
  Button, Alert, AlertDescription, AlertTitle,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from '@/components/ui';
import { useTranslation } from 'react-i18next';
import { Plus, Trash, Edit, AlertTriangle, Search, CheckCircle, X, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/utils/api';
import { format } from 'date-fns';

interface Company {
  _id: string;
  name: string;
  subdomain: string;
  subscriptionTier: {
    _id: string;
    name: string;
  };
  isActive: boolean;
  createdAt: string;
  userCount: number;
  lastLogin: string;
}

export default function CompaniesPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    fetchCompanies();
  }, []);
  
  const fetchCompanies = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/admin/companies');
      setCompanies(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch companies');
      toast({
        title: 'Error',
        description: 'Failed to fetch companies',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleActivateDeactivate = async (id: string, isActive: boolean) => {
    try {
      await api.put(`/api/admin/companies/${id}/status`, { isActive: !isActive });
      toast({
        title: 'Success',
        description: isActive ? 'Company deactivated successfully' : 'Company activated successfully',
      });
      fetchCompanies();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to update company status',
        variant: 'destructive',
      });
    }
  };
  
  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.subdomain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('companies')}</h1>
          <p className="text-muted-foreground">{t('manageCompanies')}</p>
        </div>
        <Button onClick={() => window.location.href = '/admin/companies/new'}>
          <Plus className="mr-2 h-4 w-4" />
          {t('addNewCompany')}
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-6 mb-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('totalCompanies')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : companies.length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('activeCompanies')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : companies.filter(c => c.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? '' : `${((companies.filter(c => c.isActive).length / companies.length) * 100).toFixed(1)}% ${t('ofTotal')}`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('totalUsers')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : companies.reduce((sum, company) => sum + company.userCount, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('activeToday')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : companies.filter(c => {
                const lastLogin = new Date(c.lastLogin);
                const today = new Date();
                return lastLogin.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
              }).length}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('searchCompanies')}
              className="pl-8 pr-4 py-2 w-full border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('company')}</TableHead>
                <TableHead>{t('subdomain')}</TableHead>
                <TableHead>{t('subscriptionTier')}</TableHead>
                <TableHead>{t('users')}</TableHead>
                <TableHead>{t('created')}</TableHead>
                <TableHead>{t('lastLogin')}</TableHead>
                <TableHead>{t('status')}</TableHead>
                <TableHead>{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: 8 }).map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filteredCompanies.length > 0 ? (
                filteredCompanies.map((company) => (
                  <TableRow key={company._id}>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell>
                      <a href={`https://${company.subdomain}.domain.com`} target="_blank" rel="noopener noreferrer" className="flex items-center hover:underline">
                        {company.subdomain}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </TableCell>
                    <TableCell>{company.subscriptionTier.name}</TableCell>
                    <TableCell>{company.userCount}</TableCell>
                    <TableCell>{format(new Date(company.createdAt), 'dd MMM yyyy')}</TableCell>
                    <TableCell>{company.lastLogin ? format(new Date(company.lastLogin), 'dd MMM yyyy HH:mm') : '-'}</TableCell>
                    <TableCell>
                      {company.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          {t('active')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <X className="mr-1 h-3 w-3" />
                          {t('inactive')}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`/admin/companies/${company._id}`}>
                            <Edit className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleActivateDeactivate(company._id, company.isActive)}
                        >
                          {company.isActive ? (
                            <X className="h-4 w-4 text-red-500" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">
                    <AlertTriangle className="h-10 w-10 mx-auto text-yellow-500 mb-2" />
                    <h3 className="text-lg font-medium">
                      {searchTerm ? t('noCompaniesFound') : t('noCompanies')}
                    </h3>
                    <p className="text-muted-foreground">
                      {searchTerm ? t('tryDifferentSearch') : t('createCompanyPrompt')}
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
