
import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle, CardFooter,
  Button, Input, Alert, AlertDescription, AlertTitle,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
  Tabs, TabsContent, TabsList, TabsTrigger,
} from '@/components/ui';
import { useTranslation } from 'react-i18next';
import { 
  Search, CheckCircle, Plus, Minus, Trash, 
  ShoppingCart, CreditCard, AlertTriangle, Receipt, 
  Printer, Send, DollarSign, BarcodeIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/utils/api';
import { FeatureToggle } from '@/components/saas/FeatureToggle';

interface Product {
  _id: string;
  name: string;
  price: number;
  sku: string;
  stockQuantity: number;
  imageUrl?: string;
  barcode?: string;
  category?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

export default function POSPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'other'>('cash');
  const [cashReceived, setCashReceived] = useState<number | ''>('');
  const [discount, setDiscount] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [processingPayment, setProcessingPayment] = useState(false);
  
  useEffect(() => {
    fetchProducts();
    fetchCustomers();
  }, []);
  
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/products');
      setProducts(response.data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(response.data
        .map((product: Product) => product.category)
        .filter(Boolean)
      )];
      setCategories(uniqueCategories);
      
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products');
      toast({
        title: 'Error',
        description: 'Failed to fetch products',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchCustomers = async () => {
    try {
      const response = await api.get('/api/customers');
      setCustomers(response.data);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch customers',
        variant: 'destructive',
      });
    }
  };
  
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput) return;
    
    const product = products.find(p => p.barcode === barcodeInput);
    if (product) {
      addToCart(product);
      setBarcodeInput('');
    } else {
      toast({
        title: 'Not Found',
        description: 'No product found with that barcode',
        variant: 'destructive',
      });
    }
  };
  
  const addToCart = (product: Product) => {
    if (product.stockQuantity <= 0) {
      toast({
        title: 'Out of Stock',
        description: `${product.name} is out of stock`,
        variant: 'destructive',
      });
      return;
    }
    
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.product._id === product._id);
      
      if (existingItem) {
        // Check if adding one more would exceed stock
        if (existingItem.quantity >= product.stockQuantity) {
          toast({
            title: 'Stock Limit',
            description: `Cannot add more ${product.name}. Limited stock.`,
            variant: 'destructive',
          });
          return currentCart;
        }
        
        return currentCart.map(item => 
          item.product._id === product._id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...currentCart, { product, quantity: 1 }];
      }
    });
  };
  
  const updateCartItemQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(index);
      return;
    }
    
    const item = cart[index];
    if (newQuantity > item.product.stockQuantity) {
      toast({
        title: 'Stock Limit',
        description: `Cannot add more ${item.product.name}. Limited stock.`,
        variant: 'destructive',
      });
      return;
    }
    
    const newCart = [...cart];
    newCart[index] = { ...item, quantity: newQuantity };
    setCart(newCart);
  };
  
  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };
  
  const clearCart = () => {
    if (cart.length === 0) return;
    
    if (window.confirm(t('confirmClearCart'))) {
      setCart([]);
      setSelectedCustomer(null);
      setDiscount(0);
      setTax(0);
      setCashReceived('');
    }
  };
  
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discountAmount = (subtotal * (discount / 100));
  const taxAmount = ((subtotal - discountAmount) * (tax / 100));
  const total = subtotal - discountAmount + taxAmount;
  
  const handlePaymentProcess = async () => {
    if (cart.length === 0) {
      toast({
        title: 'Empty Cart',
        description: 'Add items to cart before checkout',
        variant: 'destructive',
      });
      return;
    }
    
    if (paymentMethod === 'cash' && (typeof cashReceived !== 'number' || cashReceived < total)) {
      toast({
        title: 'Invalid Amount',
        description: 'Cash received must be equal or greater than total amount',
        variant: 'destructive',
      });
      return;
    }
    
    setProcessingPayment(true);
    
    try {
      // Create the sale/order
      const saleData = {
        customer: selectedCustomer?._id,
        items: cart.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        subtotal,
        discountPercentage: discount,
        taxPercentage: tax,
        total,
        paymentMethod,
        cashReceived: paymentMethod === 'cash' ? cashReceived : undefined,
      };
      
      const response = await api.post('/api/sales', saleData);
      
      toast({
        title: 'Success',
        description: 'Sale completed successfully',
      });
      
      // Print receipt or send email
      if (window.confirm(t('printReceipt'))) {
        // In a real app, this would trigger receipt printing or display a printable view
        window.open(`/dashboard/sales/${response.data._id}/receipt`, '_blank');
      }
      
      // Clear cart and reset state
      setCart([]);
      setSelectedCustomer(null);
      setDiscount(0);
      setTax(0);
      setCashReceived('');
      setPaymentMethod('cash');
      
      // Refresh product data to get updated stock quantities
      fetchProducts();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to process payment',
        variant: 'destructive',
      });
    } finally {
      setProcessingPayment(false);
    }
  };
  
  const filteredProducts = products
    .filter(product => 
      (activeCategory ? product.category === activeCategory : true) &&
      (searchTerm ? 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
        : true
      )
    );

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('pointOfSale')}</h1>
          <p className="text-muted-foreground">{t('processSales')}</p>
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Product Selection */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>{t('products')}</CardTitle>
                <form onSubmit={handleBarcodeSubmit} className="flex space-x-2">
                  <div className="relative">
                    <BarcodeIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder={t('scanBarcode')}
                      className="pl-8 pr-4 py-2 w-full"
                      value={barcodeInput}
                      onChange={(e) => setBarcodeInput(e.target.value)}
                    />
                  </div>
                  <Button type="submit" variant="outline" size="sm">
                    {t('scan')}
                  </Button>
                </form>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={t('searchProducts')}
                    className="pl-8 pr-4 py-2 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all" onClick={() => setActiveCategory(null)}>
                    {t('all')}
                  </TabsTrigger>
                  {categories.map((category) => (
                    <TabsTrigger 
                      key={category} 
                      value={category}
                      onClick={() => setActiveCategory(category)}
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                <TabsContent value="all" className="mt-0">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {isLoading ? (
                      Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className="h-36 bg-gray-200 rounded animate-pulse"></div>
                      ))
                    ) : filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <Card 
                          key={product._id}
                          className={`cursor-pointer hover:bg-gray-50 transition ${product.stockQuantity <= 0 ? 'opacity-50' : ''}`}
                          onClick={() => addToCart(product)}
                        >
                          <CardContent className="p-4 text-center">
                            <div className="h-16 flex items-center justify-center mb-2">
                              {product.imageUrl ? (
                                <img src={product.imageUrl} alt={product.name} className="max-h-full" />
                              ) : (
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                  <ShoppingCart className="h-6 w-6 text-primary" />
                                </div>
                              )}
                            </div>
                            <div className="text-sm font-medium truncate">{product.name}</div>
                            <div className="flex justify-between items-center mt-2">
                              <div className="text-sm text-muted-foreground">
                                {product.stockQuantity} {t('inStock')}
                              </div>
                              <div className="font-bold">${product.price.toFixed(2)}</div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-10">
                        <AlertTriangle className="h-10 w-10 mx-auto text-yellow-500 mb-2" />
                        <h3 className="text-lg font-medium">{t('noProductsFound')}</h3>
                        <p className="text-muted-foreground">{t('tryDifferentSearch')}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                {categories.map((category) => (
                  <TabsContent key={category} value={category} className="mt-0">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {products
                        .filter(product => product.category === category)
                        .map((product) => (
                          <Card 
                            key={product._id}
                            className={`cursor-pointer hover:bg-gray-50 transition ${product.stockQuantity <= 0 ? 'opacity-50' : ''}`}
                            onClick={() => addToCart(product)}
                          >
                            <CardContent className="p-4 text-center">
                              <div className="h-16 flex items-center justify-center mb-2">
                                {product.imageUrl ? (
                                  <img src={product.imageUrl} alt={product.name} className="max-h-full" />
                                ) : (
                                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                    <ShoppingCart className="h-6 w-6 text-primary" />
                                  </div>
                                )}
                              </div>
                              <div className="text-sm font-medium truncate">{product.name}</div>
                              <div className="flex justify-between items-center mt-2">
                                <div className="text-sm text-muted-foreground">
                                  {product.stockQuantity} {t('inStock')}
                                </div>
                                <div className="font-bold">${product.price.toFixed(2)}</div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Cart and Checkout */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>{t('cart')}</CardTitle>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={clearCart}
                  disabled={cart.length === 0}
                >
                  <Trash className="h-4 w-4 mr-1" />
                  {t('clear')}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">{t('cartEmpty')}</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('item')}</TableHead>
                      <TableHead className="text-right">{t('qty')}</TableHead>
                      <TableHead className="text-right">{t('price')}</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cart.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.product.name}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-5 w-5"
                              onClick={() => updateCartItemQuantity(index, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-5 w-5"
                              onClick={() => updateCartItemQuantity(index, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => removeFromCart(index)}
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
            <CardFooter className="flex-col">
              {cart.length > 0 && (
                <>
                  <FeatureToggle featureId="customer_management">
                    <div className="w-full mb-4">
                      <label className="block text-sm font-medium mb-1">{t('customer')}</label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={selectedCustomer?._id || ''}
                        onChange={(e) => {
                          const customerId = e.target.value;
                          const customer = customers.find(c => c._id === customerId) || null;
                          setSelectedCustomer(customer);
                        }}
                      >
                        <option value="">{t('selectCustomer')}</option>
                        {customers.map((customer) => (
                          <option key={customer._id} value={customer._id}>
                            {customer.name} - {customer.email}
                          </option>
                        ))}
                      </select>
                    </div>
                  </FeatureToggle>
                
                  <div className="w-full space-y-3">
                    <div className="flex justify-between">
                      <span>{t('subtotal')}</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="mr-2">{t('discount')}</span>
                        <Input
                          type="number"
                          className="w-16 h-8"
                          value={discount}
                          onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                          min="0"
                          max="100"
                        />
                        <span className="ml-1">%</span>
                      </div>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="mr-2">{t('tax')}</span>
                        <Input
                          type="number"
                          className="w-16 h-8"
                          value={tax}
                          onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                          min="0"
                          max="100"
                        />
                        <span className="ml-1">%</span>
                      </div>
                      <span>${taxAmount.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>{t('total')}</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </>
              )}
            </CardFooter>
          </Card>
          
          {cart.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{t('payment')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex mb-4">
                  <div
                    className={`flex-1 p-3 border rounded-l-md cursor-pointer text-center ${
                      paymentMethod === 'cash' ? 'bg-primary text-white' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setPaymentMethod('cash')}
                  >
                    <DollarSign className="h-5 w-5 mx-auto mb-1" />
                    <span className="text-sm">{t('cash')}</span>
                  </div>
                  <div
                    className={`flex-1 p-3 border-t border-b border-r cursor-pointer text-center ${
                      paymentMethod === 'card' ? 'bg-primary text-white' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <CreditCard className="h-5 w-5 mx-auto mb-1" />
                    <span className="text-sm">{t('card')}</span>
                  </div>
                  <div
                    className={`flex-1 p-3 border-t border-b border-r rounded-r-md cursor-pointer text-center ${
                      paymentMethod === 'other' ? 'bg-primary text-white' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setPaymentMethod('other')}
                  >
                    <img src="/images/mobile-payment.svg" alt="Other" className="h-5 w-5 mx-auto mb-1" />
                    <span className="text-sm">{t('other')}</span>
                  </div>
                </div>
                
                {paymentMethod === 'cash' && (
                  <div className="space-y-4 mb-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">{t('cashReceived')}</label>
                      <Input
                        type="number"
                        value={cashReceived}
                        onChange={(e) => setCashReceived(e.target.value ? parseFloat(e.target.value) : '')}
                        min={total}
                        step="0.01"
                      />
                    </div>
                    
                    {typeof cashReceived === 'number' && cashReceived >= total && (
                      <div className="p-3 bg-gray-100 rounded-md">
                        <div className="flex justify-between">
                          <span>{t('change')}</span>
                          <span className="font-bold">${(cashReceived - total).toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <Button 
                    variant="default"
                    className="flex-1"
                    onClick={handlePaymentProcess}
                    disabled={processingPayment || (paymentMethod === 'cash' && (typeof cashReceived !== 'number' || cashReceived < total))}
                  >
                    {processingPayment ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    ) : (
                      <CheckCircle className="mr-2 h-5 w-5" />
                    )}
                    {t('completePayment')}
                  </Button>
                  
                  <FeatureToggle featureId="invoice_management">
                    <Button variant="outline">
                      <Receipt className="mr-2 h-5 w-5" />
                      {t('generateInvoice')}
                    </Button>
                  </FeatureToggle>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button variant="ghost" size="sm">
                  <Printer className="mr-1 h-4 w-4" />
                  {t('print')}
                </Button>
                <Button variant="ghost" size="sm">
                  <Send className="mr-1 h-4 w-4" />
                  {t('email')}
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
