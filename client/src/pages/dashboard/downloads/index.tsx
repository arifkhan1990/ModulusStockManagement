
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  Download,
  File,
  FileText,
  FilePdf,
  FileSpreadsheet,
  Package,
  Calendar,
  Check,
  Clock,
  User,
  X,
  Filter,
  Search,
  Share2,
  DownloadCloud
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FeatureToggle } from '@/components/saas/FeatureToggle';
import { useApi } from '@/utils/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

// Helper function to determine file icon based on file type
const getFileIcon = (fileType) => {
  switch (fileType) {
    case 'pdf':
      return <FilePdf className="h-5 w-5 text-red-500" />;
    case 'csv':
    case 'xlsx':
      return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
    case 'zip':
      return <Package className="h-5 w-5 text-purple-500" />;
    default:
      return <FileText className="h-5 w-5 text-blue-500" />;
  }
};

export default function DownloadsPage() {
  const { t } = useTranslation();
  const api = useApi();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDateRange, setFilterDateRange] = useState('');
  const [downloads, setDownloads] = useState([
    {
      id: '1',
      filename: 'Sales_Report_May_2023.pdf',
      fileType: 'pdf',
      fileSize: '2.4 MB',
      createdAt: '2023-05-15T10:30:00Z',
      expiresAt: '2023-06-15T10:30:00Z',
      status: 'active',
      downloadCount: 3,
      downloadLimit: 10,
      createdBy: {
        id: '101',
        name: 'John Doe'
      }
    },
    {
      id: '2',
      filename: 'Inventory_Q2_2023.csv',
      fileType: 'csv',
      fileSize: '1.8 MB',
      createdAt: '2023-04-20T14:45:00Z',
      expiresAt: '2023-07-20T14:45:00Z',
      status: 'active',
      downloadCount: 5,
      downloadLimit: 50,
      createdBy: {
        id: '102',
        name: 'Jane Smith'
      }
    },
    {
      id: '3',
      filename: 'Product_Images_Batch1.zip',
      fileType: 'zip',
      fileSize: '15.6 MB',
      createdAt: '2023-05-05T09:15:00Z',
      expiresAt: '2023-05-19T09:15:00Z',
      status: 'expired',
      downloadCount: 8,
      downloadLimit: 10,
      createdBy: {
        id: '101',
        name: 'John Doe'
      }
    },
    {
      id: '4',
      filename: 'Customer_Database_Backup.xlsx',
      fileType: 'xlsx',
      fileSize: '4.2 MB',
      createdAt: '2023-05-10T16:20:00Z',
      expiresAt: '2023-06-10T16:20:00Z',
      status: 'active',
      downloadCount: 2,
      downloadLimit: 5,
      createdBy: {
        id: '103',
        name: 'Mike Johnson'
      }
    }
  ]);

  const fetchDownloads = async () => {
    try {
      setLoading(true);
      // Mocked data for now, would fetch from API in real implementation
      // const response = await api.get('/api/downloads');
      // if (response.data?.downloads) {
      //   setDownloads(response.data.downloads);
      // }
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to fetch downloads:', error);
      toast.error(t('errorFetchingDownloads'));
      setLoading(false);
    }
  };

  const downloadFile = async (fileId) => {
    try {
      toast.loading(t('preparingDownload'));
      // In real implementation, would make API call to get download URL
      // const response = await api.get(`/api/downloads/${fileId}/download`);
      // window.location.href = response.data.downloadUrl;
      
      setTimeout(() => {
        toast.dismiss();
        toast.success(t('downloadStarted'));
      }, 1500);
      
      // Update download count
      setDownloads(
        downloads.map(download => 
          download.id === fileId 
            ? { ...download, downloadCount: download.downloadCount + 1 } 
            : download
        )
      );
    } catch (error) {
      console.error('Failed to download file:', error);
      toast.error(t('errorDownloadingFile'));
    }
  };

  const deleteDownload = async (fileId) => {
    try {
      // In real implementation, would make API call to delete the download
      // await api.delete(`/api/downloads/${fileId}`);
      
      setDownloads(downloads.filter(download => download.id !== fileId));
      toast.success(t('downloadDeletedSuccessfully'));
    } catch (error) {
      console.error('Failed to delete download:', error);
      toast.error(t('errorDeletingDownload'));
    }
  };

  const shareDownload = (fileId) => {
    const file = downloads.find(download => download.id === fileId);
    if (file) {
      toast.success(t('navigatingToSharingPage'));
      // In real implementation, would navigate to sharing page
      // navigate('/dashboard/sharing', { state: { fileToShare: file } });
    }
  };

  const filteredDownloads = downloads.filter(download => {
    // Filter by search term
    const matchesSearch = download.filename.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by file type
    const matchesType = filterType === '' || download.fileType === filterType;
    
    // Filter by date range
    let matchesDate = true;
    const now = new Date();
    const downloadDate = new Date(download.createdAt);
    
    if (filterDateRange === 'today') {
      matchesDate = 
        downloadDate.getDate() === now.getDate() &&
        downloadDate.getMonth() === now.getMonth() &&
        downloadDate.getFullYear() === now.getFullYear();
    } else if (filterDateRange === 'week') {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      matchesDate = downloadDate >= oneWeekAgo;
    } else if (filterDateRange === 'month') {
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      matchesDate = downloadDate >= oneMonthAgo;
    }
    
    return matchesSearch && matchesType && matchesDate;
  });

  useEffect(() => {
    fetchDownloads();
  }, []);

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('downloads')}</h1>
          <p className="text-muted-foreground">{t('manageFileDownloads')}</p>
        </div>
        <FeatureToggle featureId="file_uploads">
          <Button>
            <DownloadCloud className="mr-2 h-4 w-4" />
            {t('uploadNewFile')}
          </Button>
        </FeatureToggle>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('searchDownloads')}
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-row space-x-4">
              <div className="w-40">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder={t('fileType')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t('allTypes')}</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="xlsx">Excel</SelectItem>
                    <SelectItem value="zip">ZIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-40">
                <Select value={filterDateRange} onValueChange={setFilterDateRange}>
                  <SelectTrigger>
                    <Calendar className="mr-2 h-4 w-4" />
                    <SelectValue placeholder={t('dateRange')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t('allTime')}</SelectItem>
                    <SelectItem value="today">{t('today')}</SelectItem>
                    <SelectItem value="week">{t('pastWeek')}</SelectItem>
                    <SelectItem value="month">{t('pastMonth')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">{t('allFiles')}</TabsTrigger>
          <TabsTrigger value="active">{t('activeFiles')}</TabsTrigger>
          <TabsTrigger value="expired">{t('expiredFiles')}</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('fileName')}</TableHead>
                    <TableHead>{t('size')}</TableHead>
                    <TableHead>{t('created')}</TableHead>
                    <TableHead>{t('status')}</TableHead>
                    <TableHead>{t('downloads')}</TableHead>
                    <TableHead>{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex justify-center">
                          <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredDownloads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <File className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                        <h3 className="mt-4 text-lg font-medium">{t('noDownloads')}</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {t('noDownloadsDescription')}
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDownloads.map((file) => (
                      <TableRow key={file.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getFileIcon(file.fileType)}
                            <span className="font-medium">{file.filename}</span>
                          </div>
                        </TableCell>
                        <TableCell>{file.fileSize}</TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                {new Date(file.createdAt).toLocaleDateString()}
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="text-xs">
                                  <p>{t('createdBy')}: {file.createdBy.name}</p>
                                  <p>{t('expiresOn')}: {new Date(file.expiresAt).toLocaleDateString()}</p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>
                          {file.status === 'active' ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <Check className="mr-1 h-3 w-3" />
                              {t('active')}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                              <Clock className="mr-1 h-3 w-3" />
                              {t('expired')}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {file.downloadCount}/{file.downloadLimit}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => downloadFile(file.id)}
                              disabled={file.status !== 'active'}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => shareDownload(file.id)}
                              disabled={file.status !== 'active'}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteDownload(file.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
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

        <TabsContent value="active">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('fileName')}</TableHead>
                    <TableHead>{t('size')}</TableHead>
                    <TableHead>{t('created')}</TableHead>
                    <TableHead>{t('expires')}</TableHead>
                    <TableHead>{t('downloads')}</TableHead>
                    <TableHead>{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDownloads.filter(file => file.status === 'active').length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <File className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                        <h3 className="mt-4 text-lg font-medium">{t('noActiveDownloads')}</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {t('noActiveDownloadsDescription')}
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDownloads
                      .filter(file => file.status === 'active')
                      .map((file) => (
                        <TableRow key={file.id}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getFileIcon(file.fileType)}
                              <span className="font-medium">{file.filename}</span>
                            </div>
                          </TableCell>
                          <TableCell>{file.fileSize}</TableCell>
                          <TableCell>{new Date(file.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(file.expiresAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {file.downloadCount}/{file.downloadLimit}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => downloadFile(file.id)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => shareDownload(file.id)}
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteDownload(file.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
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

        <TabsContent value="expired">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('fileName')}</TableHead>
                    <TableHead>{t('size')}</TableHead>
                    <TableHead>{t('created')}</TableHead>
                    <TableHead>{t('expired')}</TableHead>
                    <TableHead>{t('downloads')}</TableHead>
                    <TableHead>{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDownloads.filter(file => file.status === 'expired').length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <File className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                        <h3 className="mt-4 text-lg font-medium">{t('noExpiredDownloads')}</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {t('noExpiredDownloadsDescription')}
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDownloads
                      .filter(file => file.status === 'expired')
                      .map((file) => (
                        <TableRow key={file.id} className="opacity-70">
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getFileIcon(file.fileType)}
                              <span className="font-medium">{file.filename}</span>
                            </div>
                          </TableCell>
                          <TableCell>{file.fileSize}</TableCell>
                          <TableCell>{new Date(file.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(file.expiresAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {file.downloadCount}/{file.downloadLimit}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                              >
                                {t('renew')}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteDownload(file.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
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
      </Tabs>
    </div>
  );
}
