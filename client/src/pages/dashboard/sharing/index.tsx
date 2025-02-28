
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  Share2,
  Copy,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  FileText,
  Download,
  Clock,
  Shield,
  ChevronDown,
  Plus,
  Trash2,
  Link as LinkIcon
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FeatureToggle } from '@/components/saas/FeatureToggle';
import { useApi } from '@/utils/api';

export default function SharingPage() {
  const { t } = useTranslation();
  const api = useApi();
  const [loading, setLoading] = useState(true);
  const [activeLinks, setActiveLinks] = useState([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [sharedDocuments, setSharedDocuments] = useState([
    {
      id: '1',
      name: 'Monthly Sales Report',
      type: 'report',
      createdAt: '2023-05-15T10:30:00Z',
      expiresAt: '2023-06-15T10:30:00Z',
      accessCount: 5,
      accessLimit: 10,
      password: true,
      active: true,
      url: 'https://example.com/s/abcd1234'
    },
    {
      id: '2',
      name: 'Product Catalog Q2',
      type: 'catalog',
      createdAt: '2023-04-20T14:45:00Z',
      expiresAt: '2023-07-20T14:45:00Z',
      accessCount: 12,
      accessLimit: 50,
      password: false,
      active: true,
      url: 'https://example.com/s/efgh5678'
    },
    {
      id: '3',
      name: 'Customer Invoice #INV-12345',
      type: 'invoice',
      createdAt: '2023-05-05T09:15:00Z',
      expiresAt: '2023-05-19T09:15:00Z',
      accessCount: 2,
      accessLimit: 5,
      password: true,
      active: false,
      url: 'https://example.com/s/ijkl9012'
    }
  ]);
  
  const [newShare, setNewShare] = useState({
    documentType: '',
    documentId: '',
    expiryDays: '7',
    accessLimit: '10',
    requirePassword: false,
    password: '',
    allowDownload: true
  });

  const fetchActiveLinks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/sharing');
      if (response.data?.links) {
        setActiveLinks(response.data.links);
      }
    } catch (error) {
      console.error('Failed to fetch shared links:', error);
      toast.error(t('errorFetchingSharedLinks'));
    } finally {
      setLoading(false);
    }
  };

  const createShareLink = async () => {
    try {
      setLoading(true);
      await api.post('/api/sharing', newShare);
      toast.success(t('shareLinkCreatedSuccessfully'));
      setShowCreateDialog(false);
      fetchActiveLinks();
    } catch (error) {
      console.error('Failed to create share link:', error);
      toast.error(t('errorCreatingShareLink'));
    } finally {
      setLoading(false);
    }
  };

  const revokeLink = async (linkId) => {
    try {
      setLoading(true);
      await api.delete(`/api/sharing/${linkId}`);
      setSharedDocuments(sharedDocuments.filter(doc => doc.id !== linkId));
      toast.success(t('shareLinkRevokedSuccessfully'));
    } catch (error) {
      console.error('Failed to revoke share link:', error);
      toast.error(t('errorRevokingShareLink'));
    } finally {
      setLoading(false);
    }
  };

  const copyLinkToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    toast.success(t('linkCopiedToClipboard'));
  };

  const shareToSocialMedia = (platform, url, title) => {
    let shareUrl = '';
    
    switch(platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;
        break;
      default:
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };

  useEffect(() => {
    fetchActiveLinks();
  }, []);

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('sharing')}</h1>
          <p className="text-muted-foreground">{t('manageSharedDocumentsAndLinks')}</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('createNewShare')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('createNewShareLink')}</DialogTitle>
              <DialogDescription>
                {t('createShareLinkDescription')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="documentType">{t('documentType')}</Label>
                <Select
                  value={newShare.documentType}
                  onValueChange={(value) => setNewShare({...newShare, documentType: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectDocumentType')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="invoice">{t('invoice')}</SelectItem>
                    <SelectItem value="report">{t('report')}</SelectItem>
                    <SelectItem value="catalog">{t('catalog')}</SelectItem>
                    <SelectItem value="quote">{t('quote')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="documentId">{t('document')}</Label>
                <Select
                  value={newShare.documentId}
                  onValueChange={(value) => setNewShare({...newShare, documentId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectDocument')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">{t('document')} 1</SelectItem>
                    <SelectItem value="2">{t('document')} 2</SelectItem>
                    <SelectItem value="3">{t('document')} 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expiryDays">{t('expiryDays')}</Label>
                <Select
                  value={newShare.expiryDays}
                  onValueChange={(value) => setNewShare({...newShare, expiryDays: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 {t('day')}</SelectItem>
                    <SelectItem value="7">7 {t('days')}</SelectItem>
                    <SelectItem value="14">14 {t('days')}</SelectItem>
                    <SelectItem value="30">30 {t('days')}</SelectItem>
                    <SelectItem value="90">90 {t('days')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accessLimit">{t('accessLimit')}</Label>
                <Select
                  value={newShare.accessLimit}
                  onValueChange={(value) => setNewShare({...newShare, accessLimit: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 {t('time')}</SelectItem>
                    <SelectItem value="5">5 {t('times')}</SelectItem>
                    <SelectItem value="10">10 {t('times')}</SelectItem>
                    <SelectItem value="25">25 {t('times')}</SelectItem>
                    <SelectItem value="50">50 {t('times')}</SelectItem>
                    <SelectItem value="unlimited">{t('unlimited')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="requirePassword"
                  checked={newShare.requirePassword}
                  onCheckedChange={(value) => setNewShare({...newShare, requirePassword: value})}
                />
                <Label htmlFor="requirePassword">{t('requirePassword')}</Label>
              </div>
              
              {newShare.requirePassword && (
                <div className="space-y-2">
                  <Label htmlFor="password">{t('password')}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newShare.password}
                    onChange={(e) => setNewShare({...newShare, password: e.target.value})}
                  />
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="allowDownload"
                  checked={newShare.allowDownload}
                  onCheckedChange={(value) => setNewShare({...newShare, allowDownload: value})}
                />
                <Label htmlFor="allowDownload">{t('allowDownload')}</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                {t('cancel')}
              </Button>
              <Button onClick={createShareLink} disabled={!newShare.documentType || !newShare.documentId}>
                {t('createShareLink')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="active">
        <TabsList className="mb-4">
          <TabsTrigger value="active">{t('activeShares')}</TabsTrigger>
          <TabsTrigger value="expired">{t('expiredShares')}</TabsTrigger>
          <TabsTrigger value="stats">{t('sharingStats')}</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="space-y-4">
            {sharedDocuments.filter(doc => doc.active).map((document) => (
              <Card key={document.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <CardTitle>{document.name}</CardTitle>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => copyLinkToClipboard(document.url)}>
                          <Copy className="mr-2 h-4 w-4" />
                          {t('copyLink')}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => shareToSocialMedia('facebook', document.url, document.name)}>
                          <Facebook className="mr-2 h-4 w-4" />
                          {t('shareToFacebook')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => shareToSocialMedia('twitter', document.url, document.name)}>
                          <Twitter className="mr-2 h-4 w-4" />
                          {t('shareToTwitter')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => shareToSocialMedia('linkedin', document.url, document.name)}>
                          <Linkedin className="mr-2 h-4 w-4" />
                          {t('shareToLinkedIn')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => shareToSocialMedia('email', document.url, document.name)}>
                          <Mail className="mr-2 h-4 w-4" />
                          {t('shareViaEmail')}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => revokeLink(document.id)} className="text-red-500">
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t('revokeAccess')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">{t('type')}</p>
                      <p className="font-medium capitalize">{document.type}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t('created')}</p>
                      <p className="font-medium">
                        {new Date(document.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t('expires')}</p>
                      <p className="font-medium">
                        {new Date(document.expiresAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t('security')}</p>
                      <p className="font-medium flex items-center">
                        <Shield className="mr-1 h-3 w-3 text-green-500" />
                        {document.password ? t('passwordProtected') : t('public')}
                      </p>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm">
                      <LinkIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground truncate max-w-[200px] md:max-w-md">
                        {document.url}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">
                        {document.accessCount}/{document.accessLimit} {t('accesses')}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyLinkToClipboard(document.url)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {sharedDocuments.filter(doc => doc.active).length === 0 && (
              <div className="text-center py-8">
                <Share2 className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-medium">{t('noActiveShares')}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t('noActiveSharesDescription')}
                </p>
                <Button className="mt-4" onClick={() => setShowCreateDialog(true)}>
                  {t('createShareLink')}
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="expired">
          <div className="space-y-4">
            {sharedDocuments.filter(doc => !doc.active).map((document) => (
              <Card key={document.id} className="opacity-70">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <CardTitle>{document.name}</CardTitle>
                    </div>
                    <Button variant="outline" size="sm">
                      {t('reactivate')}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">{t('type')}</p>
                      <p className="font-medium capitalize">{document.type}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t('created')}</p>
                      <p className="font-medium">
                        {new Date(document.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t('expired')}</p>
                      <p className="font-medium">
                        {new Date(document.expiresAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t('security')}</p>
                      <p className="font-medium flex items-center">
                        <Shield className="mr-1 h-3 w-3 text-muted-foreground" />
                        {document.password ? t('passwordProtected') : t('public')}
                      </p>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm">
                      <LinkIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground truncate max-w-[200px] md:max-w-md">
                        {document.url}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">
                        {document.accessCount}/{document.accessLimit} {t('accesses')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {sharedDocuments.filter(doc => !doc.active).length === 0 && (
              <div className="text-center py-8">
                <Clock className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-medium">{t('noExpiredShares')}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t('noExpiredSharesDescription')}
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>{t('sharingStatistics')}</CardTitle>
              <CardDescription>{t('sharingStatisticsDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">{t('activeLinks')}</h3>
                  <p className="text-3xl font-bold">{sharedDocuments.filter(doc => doc.active).length}</p>
                  <p className="text-sm text-muted-foreground">{t('currentlyActiveLinks')}</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">{t('totalViews')}</h3>
                  <p className="text-3xl font-bold">
                    {sharedDocuments.reduce((total, doc) => total + doc.accessCount, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">{t('allTimeDocumentViews')}</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">{t('mostSharedType')}</h3>
                  <p className="text-3xl font-bold capitalize">Invoice</p>
                  <p className="text-sm text-muted-foreground">{t('mostFrequentlySharedDocumentType')}</p>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div>
                <h3 className="text-lg font-medium mb-4">{t('mostViewedDocuments')}</h3>
                <div className="space-y-4">
                  {sharedDocuments
                    .sort((a, b) => b.accessCount - a.accessCount)
                    .slice(0, 3)
                    .map((doc) => (
                      <div key={doc.id} className="flex justify-between items-center p-2 border rounded-md">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">{doc.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{doc.accessCount}</p>
                          <p className="text-xs text-muted-foreground">{t('views')}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
