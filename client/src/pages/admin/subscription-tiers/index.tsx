
import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
  Button, Input, Label, Switch, Textarea, Alert, AlertDescription, AlertTitle
} from '@/components/ui';
import { useTranslation } from 'react-i18next';
import { Plus, Trash, Edit, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/utils/api';

interface SubscriptionTier {
  _id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: { name: string; included: boolean }[];
  maxUsers: number;
  maxStorage: number;
  isActive: boolean;
}

export default function SubscriptionTiersPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTier, setCurrentTier] = useState<SubscriptionTier | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    billingCycle: 'monthly' as 'monthly' | 'yearly',
    maxUsers: 1,
    maxStorage: 1,
    isActive: true,
    features: [
      { name: 'inventory_management', included: true },
      { name: 'invoice_management', included: true },
      { name: 'customer_management', included: true },
      { name: 'pos', included: true },
      { name: 'analytics', included: false },
      { name: 'multi_location', included: false },
      { name: 'api_access', included: false },
      { name: 'email_notifications', included: true },
      { name: 'sms_notifications', included: false },
      { name: 'advanced_reporting', included: false },
    ]
  });
  
  useEffect(() => {
    fetchTiers();
  }, []);
  
  const fetchTiers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/subscription-tiers');
      setTiers(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch subscription tiers');
      toast({
        title: 'Error',
        description: 'Failed to fetch subscription tiers',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      billingCycle: 'monthly',
      maxUsers: 1,
      maxStorage: 1,
      isActive: true,
      features: [
        { name: 'inventory_management', included: true },
        { name: 'invoice_management', included: true },
        { name: 'customer_management', included: true },
        { name: 'pos', included: true },
        { name: 'analytics', included: false },
        { name: 'multi_location', included: false },
        { name: 'api_access', included: false },
        { name: 'email_notifications', included: true },
        { name: 'sms_notifications', included: false },
        { name: 'advanced_reporting', included: false },
      ]
    });
    setCurrentTier(null);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseFloat(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };
  
  const handleFeatureChange = (featureName: string, checked: boolean) => {
    setFormData({
      ...formData,
      features: formData.features.map(feature => 
        feature.name === featureName ? { ...feature, included: checked } : feature
      )
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && currentTier) {
        await api.put(`/api/subscription-tiers/${currentTier._id}`, formData);
        toast({
          title: 'Success',
          description: 'Subscription tier updated successfully',
        });
      } else {
        await api.post('/api/subscription-tiers', formData);
        toast({
          title: 'Success',
          description: 'Subscription tier created successfully',
        });
      }
      
      resetForm();
      setIsCreating(false);
      setIsEditing(false);
      fetchTiers();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to save subscription tier',
        variant: 'destructive',
      });
    }
  };
  
  const handleEdit = (tier: SubscriptionTier) => {
    setCurrentTier(tier);
    setFormData({
      name: tier.name,
      description: tier.description,
      price: tier.price,
      billingCycle: tier.billingCycle,
      maxUsers: tier.maxUsers,
      maxStorage: tier.maxStorage,
      isActive: tier.isActive,
      features: tier.features,
    });
    setIsEditing(true);
    setIsCreating(true);
  };
  
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this subscription tier?')) {
      return;
    }
    
    try {
      await api.delete(`/api/subscription-tiers/${id}`);
      toast({
        title: 'Success',
        description: 'Subscription tier deleted successfully',
      });
      fetchTiers();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete subscription tier',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('subscriptionTiers')}</h1>
          <p className="text-muted-foreground">{t('managePlans')}</p>
        </div>
        {!isCreating && (
          <Button onClick={() => { resetForm(); setIsCreating(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            {t('addNewTier')}
          </Button>
        )}
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {isCreating ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{isEditing ? t('editTier') : t('createNewTier')}</CardTitle>
            <CardDescription>{t('tierInformation')}</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('tierName')}</Label>
                  <Input 
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">{t('price')}</Label>
                  <Input 
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">{t('description')}</Label>
                <Textarea 
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="billingCycle">{t('billingCycle')}</Label>
                  <select
                    id="billingCycle"
                    name="billingCycle"
                    className="w-full p-2 border rounded-md"
                    value={formData.billingCycle}
                    onChange={handleInputChange as any}
                  >
                    <option value="monthly">{t('monthly')}</option>
                    <option value="yearly">{t('yearly')}</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxUsers">{t('maxUsers')}</Label>
                  <Input 
                    id="maxUsers"
                    name="maxUsers"
                    type="number"
                    value={formData.maxUsers}
                    onChange={handleInputChange}
                    required
                    min="1"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxStorage">{t('maxStorageGB')}</Label>
                  <Input 
                    id="maxStorage"
                    name="maxStorage"
                    type="number"
                    value={formData.maxStorage}
                    onChange={handleInputChange}
                    required
                    min="1"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                />
                <Label htmlFor="isActive">{t('activeStatus')}</Label>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">{t('includedFeatures')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Switch 
                        id={`feature-${feature.name}`}
                        checked={feature.included}
                        onCheckedChange={(checked) => handleFeatureChange(feature.name, checked)}
                      />
                      <Label htmlFor={`feature-${feature.name}`}>{t(feature.name)}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => { setIsCreating(false); setIsEditing(false); }}>
                {t('cancel')}
              </Button>
              <Button type="submit">{isEditing ? t('update') : t('create')}</Button>
            </CardFooter>
          </form>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="opacity-70">
                <CardHeader className="space-y-1">
                  <div className="h-7 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-2/3"></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : tiers.length > 0 ? (
            tiers.map((tier) => (
              <Card key={tier._id} className={tier.isActive ? '' : 'opacity-70'}>
                <CardHeader className="space-y-1">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">{tier.name}</CardTitle>
                    {!tier.isActive && (
                      <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-full">
                        {t('inactive')}
                      </span>
                    )}
                  </div>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold">
                    ${tier.price}
                    <span className="text-sm font-normal text-muted-foreground">
                      /{tier.billingCycle === 'monthly' ? t('month') : t('year')}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      <span>{t('maxUsers')}: {tier.maxUsers}</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      <span>{t('storage')}: {tier.maxStorage}GB</span>
                    </div>
                    
                    {tier.features
                      .filter(f => f.included)
                      .map((feature, idx) => (
                        <div key={idx} className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          <span>{t(feature.name)}</span>
                        </div>
                      ))
                    }
                    
                    {tier.features
                      .filter(f => !f.included)
                      .slice(0, 3)
                      .map((feature, idx) => (
                        <div key={idx} className="flex items-center text-muted-foreground">
                          <X className="h-4 w-4 mr-2" />
                          <span>{t(feature.name)}</span>
                        </div>
                      ))
                    }
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEdit(tier)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    {t('edit')}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(tier._id)}
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    {t('delete')}
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <AlertTriangle className="h-10 w-10 mx-auto text-yellow-500 mb-2" />
              <h3 className="text-lg font-medium">{t('noTiersFound')}</h3>
              <p className="text-muted-foreground">{t('createTierPrompt')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
