
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  Settings,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  User,
  BarChart3,
  Zap,
  Layers,
  RefreshCw,
  SlidersHorizontal,
  ToggleLeft,
  CheckSquare,
  AlertCircle,
  Info
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useApi } from '@/utils/api';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Form
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// Form schema for feature creation/editing
const featureFormSchema = z.object({
  name: z.string().min(3, { message: 'Feature name is required and must be at least 3 characters' }),
  key: z.string().min(2, { message: 'Feature key is required' })
    .regex(/^[a-z0-9_]+$/, { message: 'Feature key must contain only lowercase letters, numbers, and underscores' }),
  description: z.string().optional(),
  category: z.string().min(1, { message: 'Category is required' }),
  isEnabled: z.boolean().default(true),
  order: z.coerce.number().int().positive(),
  subscriptionTiers: z.array(z.string()).min(1, { message: 'At least one subscription tier is required' }),
  rolloutPercentage: z.coerce.number().min(0).max(100).default(100),
  isMandatory: z.boolean().default(false),
  configuration: z.record(z.any()).optional(),
});

export default function AdminFeaturesPage() {
  const { t } = useTranslation();
  const api = useApi();
  const [loading, setLoading] = useState(true);
  const [features, setFeatures] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingFeatureId, setEditingFeatureId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showRolloutDialog, setShowRolloutDialog] = useState(false);
  const [rolloutFeature, setRolloutFeature] = useState(null);
  const [rolloutPercentage, setRolloutPercentage] = useState(10);
  
  // Create mock data for demonstration
  const mockFeatures = [
    {
      id: '1',
      name: 'Inventory Management',
      key: 'inventory_management',
      description: 'Track and manage inventory across multiple locations',
      category: 'core',
      isEnabled: true,
      order: 10,
      subscriptionTiers: ['basic', 'pro', 'enterprise'],
      rolloutPercentage: 100,
      isMandatory: true,
      usageStats: {
        activeUsers: 850,
        dailyUses: 1240,
        avgTimeSpent: '5m 30s'
      }
    },
    {
      id: '2',
      name: 'POS Integration',
      key: 'pos',
      description: 'Point of sale integration for in-store sales',
      category: 'core',
      isEnabled: true,
      order: 20,
      subscriptionTiers: ['pro', 'enterprise'],
      rolloutPercentage: 100,
      isMandatory: false,
      usageStats: {
        activeUsers: 620,
        dailyUses: 890,
        avgTimeSpent: '8m 15s'
      }
    },
    {
      id: '3',
      name: 'Advanced Analytics',
      key: 'advanced_analytics',
      description: 'Detailed reports and business intelligence',
      category: 'analytics',
      isEnabled: true,
      order: 30,
      subscriptionTiers: ['pro', 'enterprise'],
      rolloutPercentage: 100,
      isMandatory: false,
      usageStats: {
        activeUsers: 420,
        dailyUses: 215,
        avgTimeSpent: '12m 40s'
      }
    },
    {
      id: '4',
      name: 'Multi-Location Support',
      key: 'multi_location',
      description: 'Manage inventory across multiple warehouses and stores',
      category: 'inventory',
      isEnabled: true,
      order: 40,
      subscriptionTiers: ['pro', 'enterprise'],
      rolloutPercentage: 100,
      isMandatory: false,
      usageStats: {
        activeUsers: 380,
        dailyUses: 520,
        avgTimeSpent: '4m 10s'
      }
    },
    {
      id: '5',
      name: 'SMS Notifications',
      key: 'sms_notifications',
      description: 'Send SMS notifications to customers and team members',
      category: 'notifications',
      isEnabled: true,
      order: 50,
      subscriptionTiers: ['enterprise'],
      rolloutPercentage: 100,
      isMandatory: false,
      usageStats: {
        activeUsers: 210,
        dailyUses: 150,
        avgTimeSpent: '1m 45s'
      }
    },
    {
      id: '6',
      name: 'Discord Integration',
      key: 'discord_integration',
      description: 'Send notifications to Discord channels',
      category: 'integrations',
      isEnabled: false,
      order: 60,
      subscriptionTiers: ['pro', 'enterprise'],
      rolloutPercentage: 25,
      isMandatory: false,
      usageStats: {
        activeUsers: 85,
        dailyUses: 120,
        avgTimeSpent: '2m 20s'
      }
    },
    {
      id: '7',
      name: 'AI Product Recommendations',
      key: 'ai_recommendations',
      description: 'AI-powered product recommendations for customers',
      category: 'ai',
      isEnabled: true,
      order: 70,
      subscriptionTiers: ['enterprise'],
      rolloutPercentage: 50,
      isMandatory: false,
      usageStats: {
        activeUsers: 150,
        dailyUses: 320,
        avgTimeSpent: '3m 10s'
      }
    }
  ];

  // Create form with zod validation
  const form = useForm({
    resolver: zodResolver(featureFormSchema),
    defaultValues: {
      name: '',
      key: '',
      description: '',
      category: 'core',
      isEnabled: true,
      order: 100,
      subscriptionTiers: ['pro'],
      rolloutPercentage: 100,
      isMandatory: false,
      configuration: {}
    }
  });

  const fetchFeatures = async () => {
    try {
      setLoading(true);
      // In a real app, you would fetch from the API
      // const response = await api.get('/api/admin/features');
      // setFeatures(response.data.features);
      
      // Using mock data for demonstration
      setFeatures(mockFeatures);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to fetch features:', error);
      toast.error(t('errorFetchingFeatures'));
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      if (editingFeatureId) {
        // Update existing feature
        // await api.put(`/api/admin/features/${editingFeatureId}`, data);
        
        // Update in mock data
        const updatedFeatures = features.map(feature => 
          feature.id === editingFeatureId ? { ...feature, ...data } : feature
        );
        setFeatures(updatedFeatures);
        toast.success(t('featureUpdatedSuccessfully'));
      } else {
        // Create new feature
        // const response = await api.post('/api/admin/features', data);
        
        // Add to mock data
        const newFeature = {
          id: Math.random().toString(36).substring(2, 9),
          ...data,
          usageStats: {
            activeUsers: 0,
            dailyUses: 0,
            avgTimeSpent: '0m 0s'
          }
        };
        setFeatures([...features, newFeature]);
        toast.success(t('featureCreatedSuccessfully'));
      }
      
      resetForm();
    } catch (error) {
      console.error('Failed to save feature:', error);
      toast.error(editingFeatureId ? t('errorUpdatingFeature') : t('errorCreatingFeature'));
    } finally {
      setLoading(false);
      setIsCreating(false);
      setEditingFeatureId(null);
    }
  };

  const deleteFeature = async (featureId) => {
    if (confirm(t('confirmDeleteFeature'))) {
      try {
        setLoading(true);
        // await api.delete(`/api/admin/features/${featureId}`);
        
        // Remove from mock data
        setFeatures(features.filter(feature => feature.id !== featureId));
        toast.success(t('featureDeletedSuccessfully'));
      } catch (error) {
        console.error('Failed to delete feature:', error);
        toast.error(t('errorDeletingFeature'));
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleFeatureStatus = async (featureId, isEnabled) => {
    try {
      // await api.patch(`/api/admin/features/${featureId}/toggle`, { isEnabled });
      
      // Update in mock data
      const updatedFeatures = features.map(feature => 
        feature.id === featureId ? { ...feature, isEnabled } : feature
      );
      setFeatures(updatedFeatures);
      
      toast.success(isEnabled ? t('featureEnabled') : t('featureDisabled'));
    } catch (error) {
      console.error('Failed to toggle feature status:', error);
      toast.error(t('errorTogglingFeatureStatus'));
    }
  };

  const editFeature = (feature) => {
    setEditingFeatureId(feature.id);
    form.reset({
      name: feature.name,
      key: feature.key,
      description: feature.description || '',
      category: feature.category,
      isEnabled: feature.isEnabled,
      order: feature.order,
      subscriptionTiers: feature.subscriptionTiers,
      rolloutPercentage: feature.rolloutPercentage,
      isMandatory: feature.isMandatory,
      configuration: feature.configuration || {}
    });
    setIsCreating(true);
  };

  const resetForm = () => {
    form.reset({
      name: '',
      key: '',
      description: '',
      category: 'core',
      isEnabled: true,
      order: 100,
      subscriptionTiers: ['pro'],
      rolloutPercentage: 100,
      isMandatory: false,
      configuration: {}
    });
    setEditingFeatureId(null);
  };

  const openRolloutDialog = (feature) => {
    setRolloutFeature(feature);
    setRolloutPercentage(feature.rolloutPercentage);
    setShowRolloutDialog(true);
  };

  const handleRolloutUpdate = async () => {
    try {
      // await api.patch(`/api/admin/features/${rolloutFeature.id}/rollout`, { 
      //   rolloutPercentage 
      // });
      
      // Update in mock data
      const updatedFeatures = features.map(feature => 
        feature.id === rolloutFeature.id 
          ? { ...feature, rolloutPercentage } 
          : feature
      );
      setFeatures(updatedFeatures);
      
      toast.success(t('rolloutPercentageUpdated'));
      setShowRolloutDialog(false);
    } catch (error) {
      console.error('Failed to update rollout percentage:', error);
      toast.error(t('errorUpdatingRolloutPercentage'));
    }
  };

  // Filter features
  const filteredFeatures = features.filter(feature => {
    const matchesSearch = 
      feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feature.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (feature.description && feature.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesCategory = categoryFilter === '' || feature.category === categoryFilter;
    
    const matchesTier = tierFilter === '' || 
      feature.subscriptionTiers.includes(tierFilter);
      
    const matchesStatus = statusFilter === '' || 
      (statusFilter === 'enabled' && feature.isEnabled) ||
      (statusFilter === 'disabled' && !feature.isEnabled) ||
      (statusFilter === 'rollout' && feature.rolloutPercentage < 100);
      
    return matchesSearch && matchesCategory && matchesTier && matchesStatus;
  });

  // Get unique categories for filter
  const categories = [...new Set(features.map(feature => feature.category))];

  useEffect(() => {
    fetchFeatures();
  }, []);

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('featureManagement')}</h1>
          <p className="text-muted-foreground">{t('manageGlobalFeatures')}</p>
        </div>
        <Button onClick={() => { resetForm(); setIsCreating(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          {t('addNewFeature')}
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('searchFeatures')}
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-row space-x-4">
              <div className="w-36">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder={t('category')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t('allCategories')}</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {t(category)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-36">
                <Select value={tierFilter} onValueChange={setTierFilter}>
                  <SelectTrigger>
                    <Layers className="mr-2 h-4 w-4" />
                    <SelectValue placeholder={t('tier')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t('allTiers')}</SelectItem>
                    <SelectItem value="basic">{t('basic')}</SelectItem>
                    <SelectItem value="pro">{t('pro')}</SelectItem>
                    <SelectItem value="enterprise">{t('enterprise')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-36">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <ToggleLeft className="mr-2 h-4 w-4" />
                    <SelectValue placeholder={t('status')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t('allStatuses')}</SelectItem>
                    <SelectItem value="enabled">{t('enabled')}</SelectItem>
                    <SelectItem value="disabled">{t('disabled')}</SelectItem>
                    <SelectItem value="rollout">{t('inRollout')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="list">
        <TabsList className="mb-4">
          <TabsTrigger value="list">{t('featureList')}</TabsTrigger>
          <TabsTrigger value="metrics">{t('usageMetrics')}</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">{t('feature')}</TableHead>
                    <TableHead>{t('key')}</TableHead>
                    <TableHead>{t('category')}</TableHead>
                    <TableHead>{t('tiers')}</TableHead>
                    <TableHead>{t('rollout')}</TableHead>
                    <TableHead>{t('status')}</TableHead>
                    <TableHead className="text-right">{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex justify-center">
                          <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredFeatures.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <Settings className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                        <h3 className="mt-4 text-lg font-medium">{t('noFeaturesFound')}</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {t('noFeaturesFoundDescription')}
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredFeatures.map((feature) => (
                      <TableRow key={feature.id}>
                        <TableCell>
                          <div className="font-medium">{feature.name}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-[250px]">
                            {feature.description || t('noDescription')}
                          </div>
                          {feature.isMandatory && (
                            <Badge variant="outline" className="mt-1 bg-blue-50 text-blue-700 border-blue-200">
                              {t('mandatory')}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <code className="bg-muted px-1 py-0.5 rounded text-sm">
                            {feature.key}
                          </code>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {t(feature.category)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {feature.subscriptionTiers.map(tier => (
                              <Badge key={tier} variant="secondary" className="text-xs">
                                {t(tier)}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <div className="w-full bg-muted rounded-full h-2.5 dark:bg-gray-700">
                                  <div 
                                    className="bg-primary h-2.5 rounded-full" 
                                    style={{ width: `${feature.rolloutPercentage}%` }}
                                  ></div>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{feature.rolloutPercentage}% {t('ofSubscribers')}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={feature.isEnabled}
                            onCheckedChange={(checked) => toggleFeatureStatus(feature.id, checked)}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openRolloutDialog(feature)}
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => editFeature(feature)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteFeature(feature.id)}
                              className="text-red-500 hover:text-red-700"
                              disabled={feature.isMandatory}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t('totalFeatures')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{features.length}</div>
                <p className="text-xs text-muted-foreground">
                  {features.filter(f => f.isEnabled).length} {t('active')}, {' '}
                  {features.filter(f => !f.isEnabled).length} {t('disabled')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t('mostUsedFeature')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">
                  {features.sort((a, b) => b.usageStats.dailyUses - a.usageStats.dailyUses)[0]?.name || '-'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {features.sort((a, b) => b.usageStats.dailyUses - a.usageStats.dailyUses)[0]?.usageStats.dailyUses || 0} {t('dailyUses')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t('featuresInRollout')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {features.filter(f => f.rolloutPercentage < 100 && f.rolloutPercentage > 0).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('featuresBeingGraduallyRolledOut')}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{t('featureUsageStatistics')}</CardTitle>
              <CardDescription>{t('featureUsageDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('feature')}</TableHead>
                    <TableHead>{t('activeUsers')}</TableHead>
                    <TableHead>{t('dailyUses')}</TableHead>
                    <TableHead>{t('avgTimeSpent')}</TableHead>
                    <TableHead>{t('tier')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {features
                    .sort((a, b) => b.usageStats.dailyUses - a.usageStats.dailyUses)
                    .slice(0, 5)
                    .map(feature => (
                      <TableRow key={feature.id}>
                        <TableCell>
                          <div className="font-medium">{feature.name}</div>
                          <div className="text-xs text-muted-foreground">
                            <code>{feature.key}</code>
                          </div>
                        </TableCell>
                        <TableCell>{feature.usageStats.activeUsers}</TableCell>
                        <TableCell>{feature.usageStats.dailyUses}</TableCell>
                        <TableCell>{feature.usageStats.avgTimeSpent}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {feature.subscriptionTiers.map(tier => (
                              <Badge key={tier} variant="secondary" className="text-xs">
                                {t(tier)}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Feature creation/editing dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingFeatureId ? t('editFeature') : t('createNewFeature')}
            </DialogTitle>
            <DialogDescription>
              {editingFeatureId 
                ? t('editFeatureDescription') 
                : t('createFeatureDescription')}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('featureName')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('featureNamePlaceholder')} {...field} />
                      </FormControl>
                      <FormDescription>{t('featureNameDescription')}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('featureKey')}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="feature_key" 
                          {...field} 
                          disabled={editingFeatureId !== null}
                        />
                      </FormControl>
                      <FormDescription>{t('featureKeyDescription')}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('description')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('descriptionPlaceholder')} {...field} />
                    </FormControl>
                    <FormDescription>{t('descriptionHelp')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('category')}</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('selectCategory')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="core">{t('core')}</SelectItem>
                          <SelectItem value="inventory">{t('inventory')}</SelectItem>
                          <SelectItem value="analytics">{t('analytics')}</SelectItem>
                          <SelectItem value="notifications">{t('notifications')}</SelectItem>
                          <SelectItem value="integrations">{t('integrations')}</SelectItem>
                          <SelectItem value="ai">{t('ai')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>{t('categoryHelp')}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('displayOrder')}</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" step="1" {...field} />
                      </FormControl>
                      <FormDescription>{t('displayOrderHelp')}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="subscriptionTiers"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>{t('availableIn')}</FormLabel>
                      <FormDescription>{t('availableInHelp')}</FormDescription>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {['basic', 'pro', 'enterprise'].map((tier) => (
                        <FormField
                          key={tier}
                          control={form.control}
                          name="subscriptionTiers"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={tier}
                                className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(tier)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, tier])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== tier
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>
                                    {t(tier)}
                                  </FormLabel>
                                </div>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="rolloutPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('rolloutPercentage')}</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Input 
                            type="number" 
                            min="0" 
                            max="100" 
                            step="5"
                            {...field} 
                          />
                          <span>%</span>
                        </div>
                      </FormControl>
                      <FormDescription>{t('rolloutPercentageHelp')}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            {t('enableFeature')}
                          </FormLabel>
                          <FormDescription>
                            {t('enableFeatureHelp')}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isMandatory"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            {t('mandatoryFeature')}
                          </FormLabel>
                          <FormDescription>
                            {t('mandatoryFeatureHelp')}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="advanced">
                  <AccordionTrigger>
                    <div className="flex items-center text-sm font-medium">
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      {t('advancedConfiguration')}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-4 space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {t('advancedConfigurationHelp')}
                      </p>
                      <div className="bg-muted p-4 rounded-md">
                        <pre className="text-xs">{`{
  "showInMenu": true,
  "limits": {
    "maxItems": 1000,
    "maxStorage": "2GB"
  },
  "defaults": {
    "enabled": true
  }
}`}
                        </pre>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsCreating(false)}>
                  {t('cancel')}
                </Button>
                <Button type="submit" disabled={loading}>
                  {editingFeatureId ? t('updateFeature') : t('createFeature')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Rollout dialog */}
      <Dialog open={showRolloutDialog} onOpenChange={setShowRolloutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('updateRolloutPercentage')}</DialogTitle>
            <DialogDescription>
              {t('updateRolloutPercentageDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {rolloutFeature && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="font-medium">{rolloutFeature.name}</div>
                  <code className="bg-muted px-1 py-0.5 rounded text-sm">
                    {rolloutFeature.key}
                  </code>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="rollout-slider">{t('rolloutPercentage')}</Label>
                    <span className="font-medium">{rolloutPercentage}%</span>
                  </div>
                  <Input
                    id="rollout-slider"
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={rolloutPercentage}
                    onChange={(e) => setRolloutPercentage(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
                
                <div className="rounded-md bg-blue-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Info className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        {t('rolloutInformation')}
                      </h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>
                          {t('rolloutExplanation', { percentage: rolloutPercentage })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRolloutDialog(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleRolloutUpdate}>
              {t('updateRollout')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
