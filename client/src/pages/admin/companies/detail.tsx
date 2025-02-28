
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, CardContent, CardHeader, CardTitle, CardFooter,
  Button, Input, Label, Switch, Tabs, TabsContent, TabsList, TabsTrigger,
  Alert, AlertDescription, AlertTitle
} from '@/components/ui';
import { useTranslation } from 'react-i18next';
import { 
  AlertTriangle, ArrowLeft, Users, Building, Globe, 
  Mail, Phone, Calendar, Save, Trash, CheckCircle, X
} from 'lucide-react';
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
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  contactInfo: {
    email: string;
    phone?: string;
  };
  logo?: string;
  isActive: boolean;
  createdAt: string;
  userCount: number;
  lastLogin: string;
}

interface SubscriptionTier {
  _id: string;
  name: string;
}

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
  lastLogin?: string;
  isActive: boolean;
}

interface FeatureToggle {
  _id: string;
  feature: string;
  enabled: boolean;
  priority: number;
}

export default function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [company, setCompany] = useState<Company | null>(null);
  const [subscriptionTiers, setSubscriptionTiers] = useState<SubscriptionTier[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [features, setFeatures] = useState<FeatureToggle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (id) {
      fetchCompany();
      fetchSubscriptionTiers();
    }
  }, [id]);
  
  const fetchCompany = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/api/admin/companies/${id}`);
      setCompany(response.data);
      
      // Fetch related data
      fetchUsers(response.data._id);
      fetchFeatures(response.data._id);
      
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch company details');
      toast({
        title: 'Error',
        description: 'Failed to fetch company details',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchSubscriptionTiers = async () => {
    try {
      const response = await api.get('/api/subscription-tiers');
      setSubscriptionTiers(response.data);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch subscription tiers',
        variant: 'destructive',
      });
    }
  };
  
  const fetchUsers = async (companyId: string) => {
    try {
      const response = await api.get(`/api/admin/companies/${companyId}/users`);
      setUsers(response.data);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive',
      });
    }
  };
  
  const fetchFeatures = async (companyId: string) => {
    try {
      const response = await api.get(`/api/admin/companies/${companyId}/features`);
      setFeatures(response.data);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch feature toggles',
        variant: 'destructive',
      });
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setCompany(prev => {
        if (!prev) return prev;
        
        return {
          ...prev,
          [parent]: {
            ...prev[parent as keyof Company],
            [child]: value
          }
        };
      });
    } else {
      setCompany(prev => {
        if (!prev) return prev;
        
        return {
          ...prev,
          [name]: value
        };
      });
    }
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setCompany(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        [name]: checked
      };
    });
  };
  
  const handleFeatureToggle = (featureId: string, enabled: boolean) => {
    setFeatures(prev => 
      prev.map(feature => 
        feature._id === featureId ? { ...feature, enabled } : feature
      )
    );
  };
  
  const handleSave = async () => {
    if (!company) return;
    
    setIsSaving(true);
    try {
      // Update company
      await api.put(`/api/admin/companies/${id}`, company);
      
      // Update features
      await api.put(`/api/admin/companies/${id}/features`, { features });
      
      toast({
        title: 'Success',
        description: 'Company updated successfully',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to update company',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDelete = async () => {
    if (!window.confirm(t('confirmDeleteCompany'))) {
      return;
    }
    
    try {
      await api.delete(`/api/admin/companies/${id}`);
      toast({
        title: 'Success',
        description: 'Company deleted successfully',
      });
      navigate('/admin/companies');
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete company',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || 'Company not found'}</AlertDescription>
        </Alert>
        <Button
          className="mt-4"
          onClick={() => navigate('/admin/companies')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('backToCompanies')}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="mr-2"
            onClick={() => navigate('/admin/companies')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center">
              {company.name}
              {company.isActive ? (
                <span className="ml-2 text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                  {t('active')}
                </span>
              ) : (
                <span className="ml-2 text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">
                  {t('inactive')}
                </span>
              )}
            </h1>
            <p className="text-muted-foreground">
              {t('createdOn')} {format(new Date(company.createdAt), 'PPP')}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="text-red-500 hover:text-red-700"
            onClick={handleDelete}
          >
            <Trash className="mr-2 h-4 w-4" />
            {t('delete')}
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {t('save')}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="details">
        <TabsList className="mb-4">
          <TabsTrigger value="details">{t('details')}</TabsTrigger>
          <TabsTrigger value="features">{t('features')}</TabsTrigger>
          <TabsTrigger value="users">{t('users')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('companyInformation')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('companyName')}</Label>
                  <Input 
                    id="name"
                    name="name"
                    value={company.name}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subdomain">{t('subdomain')}</Label>
                  <div className="flex items-center space-x-2">
                    <Input 
                      id="subdomain"
                      name="subdomain"
                      value={company.subdomain}
                      onChange={handleInputChange}
                    />
                    <span>.domain.com</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subscriptionTier">{t('subscriptionTier')}</Label>
                  <select
                    id="subscriptionTier"
                    name="subscriptionTier"
                    className="w-full p-2 border rounded-md"
                    value={company.subscriptionTier._id}
                    onChange={(e) => {
                      const selectedTier = subscriptionTiers.find(tier => tier._id === e.target.value);
                      if (selectedTier) {
                        setCompany(prev => {
                          if (!prev) return prev;
                          return {
                            ...prev,
                            subscriptionTier: {
                              _id: selectedTier._id,
                              name: selectedTier.name
                            }
                          };
                        });
                      }
                    }}
                  >
                    {subscriptionTiers.map((tier) => (
                      <option key={tier._id} value={tier._id}>{tier.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="isActive"
                    checked={company.isActive}
                    onCheckedChange={(checked) => handleSwitchChange('isActive', checked)}
                  />
                  <Label htmlFor="isActive">{t('activeStatus')}</Label>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('contactInformation')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contactInfo.email">{t('email')}</Label>
                  <Input 
                    id="contactInfo.email"
                    name="contactInfo.email"
                    value={company.contactInfo.email}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactInfo.phone">{t('phone')}</Label>
                  <Input 
                    id="contactInfo.phone"
                    name="contactInfo.phone"
                    value={company.contactInfo.phone || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address.street">{t('street')}</Label>
                  <Input 
                    id="address.street"
                    name="address.street"
                    value={company.address?.street || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address.city">{t('city')}</Label>
                    <Input 
                      id="address.city"
                      name="address.city"
                      value={company.address?.city || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address.state">{t('state')}</Label>
                    <Input 
                      id="address.state"
                      name="address.state"
                      value={company.address?.state || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address.zip">{t('zip')}</Label>
                    <Input 
                      id="address.zip"
                      name="address.zip"
                      value={company.address?.zip || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address.country">{t('country')}</Label>
                    <Input 
                      id="address.country"
                      name="address.country"
                      value={company.address?.country || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('companyStatistics')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/10 rounded">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('totalUsers')}</p>
                    <p className="text-2xl font-bold">{company.userCount}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/10 rounded">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('locations')}</p>
                    <p className="text-2xl font-bold">3</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/10 rounded">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('apiRequests')}</p>
                    <p className="text-2xl font-bold">1,243</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/10 rounded">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('lastLogin')}</p>
                    <p className="text-lg font-medium">
                      {company.lastLogin 
                        ? format(new Date(company.lastLogin), 'dd MMM yyyy') 
                        : t('never')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>{t('featureToggles')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {features.map((feature) => (
                  <div key={feature._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{t(feature.feature)}</h3>
                      <p className="text-sm text-muted-foreground">{t('priority')}: {feature.priority}</p>
                    </div>
                    <Switch 
                      checked={feature.enabled}
                      onCheckedChange={(checked) => handleFeatureToggle(feature._id, checked)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {t('saveChanges')}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t('companyUsers')}</CardTitle>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t('addUser')}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user._id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{user.role}</p>
                        {user.lastLogin && (
                          <p className="text-xs text-muted-foreground">
                            {t('lastLogin')}: {format(new Date(user.lastLogin), 'dd MMM yyyy')}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        {user.isActive ? (
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                            <X className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" className="text-green-500 hover:text-green-700">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {users.length === 0 && (
                  <div className="text-center py-10">
                    <Users className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                    <h3 className="text-lg font-medium">{t('noUsers')}</h3>
                    <p className="text-muted-foreground">{t('addUserPrompt')}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
