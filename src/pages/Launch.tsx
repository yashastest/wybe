import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, AlertTriangle, Check, ChevronRight, Shield, Rocket, Globe, MessageCircle, Link as LinkIcon } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";
import { useWallet } from "@/hooks/useWallet";
import { Link } from "react-router-dom";
import { Shimmer } from "@/components/ui/shimmer";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";

const Launch = () => {
  const { wallet, connect } = useWallet();
  const [loading, setLoading] = useState(true);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [curveStyle, setCurveStyle] = useState("classic");
  const [showDialog, setShowDialog] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState("assisted");
  const [whitelistRequestSent, setWhitelistRequestSent] = useState(false);
  const [whitelistEmail, setWhitelistEmail] = useState("");
  const [whitelistTelegram, setWhitelistTelegram] = useState("");
  const [whitelistDescription, setWhitelistDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [telegramChannel, setTelegramChannel] = useState("");
  const isMobile = useIsMobile();
  
  // Image upload states
  const [tokenLogo, setTokenLogo] = useState<File | null>(null);
  const [tokenLogoPreview, setTokenLogoPreview] = useState<string | null>(null);
  const [tokenBanner, setTokenBanner] = useState<File | null>(null);
  const [tokenBannerPreview, setTokenBannerPreview] = useState<string | null>(null);
  
  useEffect(() => {
    // Simulate loading state
    setTimeout(() => {
      setLoading(false);
    }, 1200);
    
    if (wallet) {
      setIsWalletConnected(true);
    }
  }, [wallet]);
  
  useEffect(() => {
    // Clean up object URLs to avoid memory leaks
    return () => {
      if (tokenLogoPreview) {
        URL.revokeObjectURL(tokenLogoPreview);
      }
      if (tokenBannerPreview) {
        URL.revokeObjectURL(tokenBannerPreview);
      }
    };
  }, [tokenLogoPreview, tokenBannerPreview]);
  
  const handleConnect = async () => {
    try {
      await connect();
      setIsWalletConnected(true);
      toast.success("Wallet connected successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to connect wallet");
    }
  };
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setTokenLogo(file);
      setTokenLogoPreview(URL.createObjectURL(file));
      toast.success("Logo uploaded successfully!");
    }
  };
  
  const handleRemoveLogo = () => {
    if (tokenLogoPreview) {
      URL.revokeObjectURL(tokenLogoPreview);
    }
    setTokenLogo(null);
    setTokenLogoPreview(null);
  };
  
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setTokenBanner(file);
      setTokenBannerPreview(URL.createObjectURL(file));
      toast.success("Banner uploaded successfully!");
    }
  };
  
  const handleRemoveBanner = () => {
    if (tokenBannerPreview) {
      URL.revokeObjectURL(tokenBannerPreview);
    }
    setTokenBanner(null);
    setTokenBannerPreview(null);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === "assisted") {
      // Just submit whitelist request
      setWhitelistRequestSent(true);
      toast.success("Whitelist request submitted successfully!");
      return;
    }
    
    // Direct launch flow
    setIsCreating(true);
    
    // Simulate coin creation
    setTimeout(() => {
      setIsCreating(false);
      setShowDialog(true);
    }, 2000);
  };
  
  const handleCopyAddress = () => {
    navigator.clipboard.writeText("DummyTokenAddress123456789");
    toast.success("Token address copied to clipboard");
  };
  
  const handleStartTrading = () => {
    setShowDialog(false);
    toast.success("Redirecting to trading page...");
    // Redirect to trading page
    window.location.href = "/trade";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col pt-20">
      <Header />
      
      {/* Launch Page Content */}
      <div className="flex-grow flex items-center justify-center py-12 px-4 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-40 right-20 w-96 h-96 bg-wybe-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-wybe-accent/10 rounded-full blur-3xl" />
        
        <AnimatePresence>
          {loading ? (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-card p-6 md:p-8 w-full max-w-md"
            >
              <div className="flex flex-col items-center">
                <Shimmer className="w-16 h-16 rounded-full mb-4" />
                <Shimmer className="h-8 w-48 mb-2" rounded="lg" />
                <Shimmer className="h-4 w-64 mb-6" rounded="lg" />
                
                <div className="w-full mb-6">
                  <Shimmer className="h-16 w-full mb-6" rounded="lg" />
                </div>
                
                <Shimmer className="h-10 w-full" rounded="lg" />
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="w-full max-w-md mx-auto"
              key="content"
            >
              <div className="glass-card p-6 md:p-8">
                <motion.div variants={itemVariants} className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-wybe-primary/20 flex items-center justify-center mx-auto mb-4">
                    <Coins className="text-wybe-primary animate-pulse" size={24} />
                  </div>
                  <h1 className="text-2xl font-bold gradient-text">Launch Your Meme Coin</h1>
                  <p className="text-gray-400 mt-2">Create and deploy your token in seconds</p>
                </motion.div>
                
                {/* Package Banner - Updated with better contrast and theme-matching */}
                <div className="mb-6 p-4 glass-card bg-black/70 border border-orange-500/30 shadow-md">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium enhanced-text-visibility">Need full launch support?</h3>
                      <p className="text-xs text-gray-300">All-in $500 package with marketing and support</p>
                    </div>
                    <Link to="/package">
                      <Button size="sm" variant="orange" className="text-xs flex items-center gap-1">
                        Learn More
                        <ChevronRight size={12} />
                      </Button>
                    </Link>
                  </div>
                </div>
                
                {!isWalletConnected ? (
                  <motion.div variants={itemVariants} className="text-center">
                    <p className="text-gray-300 mb-4">Connect your wallet to launch your coin</p>
                    <Button onClick={handleConnect} className="btn-primary w-full animate-pulse-glow">
                      Connect Wallet
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div variants={itemVariants}>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
                      <TabsList className="grid grid-cols-2 mb-4 w-full">
                        <TabsTrigger value="assisted" className="text-sm">
                          <Shield className="mr-1 h-4 w-4" />
                          Assisted Launch
                        </TabsTrigger>
                        <TabsTrigger value="direct" className="text-sm">
                          <Rocket className="mr-1 h-4 w-4" />
                          Direct Launch
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="assisted">
                        {whitelistRequestSent ? (
                          <div className="p-6 text-center">
                            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                              <Check className="text-green-500" size={24} />
                            </div>
                            <h3 className="text-xl font-medium mb-2">Request Submitted!</h3>
                            <p className="text-gray-300 mb-4">
                              We'll review your request and contact you soon. Once approved, you'll be able to launch your coin.
                            </p>
                            <Button 
                              variant="outline" 
                              className="btn-secondary"
                              onClick={() => setWhitelistRequestSent(false)}
                            >
                              Submit Another Request
                            </Button>
                          </div>
                        ) : (
                          <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                              <Label htmlFor="whitelistEmail">Your Email</Label>
                              <Input 
                                id="whitelistEmail" 
                                value={whitelistEmail} 
                                onChange={(e) => setWhitelistEmail(e.target.value)}
                                placeholder="your@email.com" 
                                className="bg-wybe-background-light border-wybe-primary/20 focus-visible:ring-wybe-primary"
                                required
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="whitelistTelegram">Telegram Username</Label>
                              <Input 
                                id="whitelistTelegram" 
                                value={whitelistTelegram} 
                                onChange={(e) => setWhitelistTelegram(e.target.value)}
                                placeholder="@username" 
                                className="bg-wybe-background-light border-wybe-primary/20 focus-visible:ring-wybe-primary"
                                required
                              />
                            </div>
                            
                            <div>
                              <Label>Token Logo (Optional)</Label>
                              <ImageUpload
                                id="assistedTokenLogo"
                                label="Logo"
                                imagePreview={tokenLogoPreview}
                                onImageUpload={handleLogoUpload}
                                onImageRemove={handleRemoveLogo}
                                className="mb-2"
                                imageClassName="w-24 h-24 rounded-full"
                              />
                            </div>
                            
                            <div>
                              <Label>Token Banner (Optional)</Label>
                              <ImageUpload
                                id="assistedTokenBanner"
                                label="Banner"
                                imagePreview={tokenBannerPreview}
                                onImageUpload={handleBannerUpload}
                                onImageRemove={handleRemoveBanner}
                                aspectRatio={3/1}
                                className="mb-2"
                                imageClassName="w-full h-auto rounded-lg"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="website">Website (Optional)</Label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                  <Globe size={16} className="text-gray-400" />
                                </div>
                                <Input 
                                  id="website" 
                                  value={website} 
                                  onChange={(e) => setWebsite(e.target.value)}
                                  placeholder="https://yourwebsite.com" 
                                  className="bg-wybe-background-light border-wybe-primary/20 focus-visible:ring-wybe-primary pl-10"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <Label htmlFor="telegramChannel">Telegram Channel (Optional)</Label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                  <MessageCircle size={16} className="text-gray-400" />
                                </div>
                                <Input 
                                  id="telegramChannel" 
                                  value={telegramChannel} 
                                  onChange={(e) => setTelegramChannel(e.target.value)}
                                  placeholder="https://t.me/yourchannel" 
                                  className="bg-wybe-background-light border-wybe-primary/20 focus-visible:ring-wybe-primary pl-10"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <Label htmlFor="whitelistDescription">Project Description</Label>
                              <Textarea
                                id="whitelistDescription" 
                                value={whitelistDescription} 
                                onChange={(e) => setWhitelistDescription(e.target.value)}
                                placeholder="Tell us about your meme coin idea" 
                                className="bg-wybe-background-light border-wybe-primary/20 focus-visible:ring-wybe-primary min-h-[80px]"
                                required
                              />
                            </div>
                            
                            <div className="bg-wybe-primary/10 border border-wybe-primary/20 rounded-lg p-3 mt-4">
                              <p className="text-sm flex items-center gap-2">
                                <Shield size={16} className="text-wybe-secondary" />
                                <span>Assisted launch requires whitelist approval</span>
                              </p>
                            </div>
                            
                            <Button type="submit" className="btn-primary w-full animate-pulse-glow">
                              Submit Whitelist Request
                            </Button>
                          </form>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="direct">
                        <form onSubmit={handleSubmit}>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="name">Token Name</Label>
                              <Input 
                                id="name" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Doge Coin" 
                                className="bg-wybe-background-light border-wybe-primary/20 focus-visible:ring-wybe-primary"
                                required
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="symbol">Token Symbol</Label>
                              <Input 
                                id="symbol" 
                                value={symbol} 
                                onChange={(e) => setSymbol(e.target.value)}
                                placeholder="e.g. DOGE" 
                                className="bg-wybe-background-light border-wybe-primary/20 focus-visible:ring-wybe-primary"
                                maxLength={5}
                                required
                              />
                            </div>
                            
                            <div>
                              <Label>Token Logo (Optional)</Label>
                              <ImageUpload
                                id="logo"
                                label="Logo"
                                imagePreview={tokenLogoPreview}
                                onImageUpload={handleLogoUpload}
                                onImageRemove={handleRemoveLogo}
                                className="mb-2"
                                imageClassName="w-24 h-24 rounded-full"
                              />
                            </div>
                            
                            <div>
                              <Label>Token Banner (Optional)</Label>
                              <ImageUpload
                                id="banner"
                                label="Banner"
                                imagePreview={tokenBannerPreview}
                                onImageUpload={handleBannerUpload}
                                onImageRemove={handleRemoveBanner}
                                aspectRatio={3/1}
                                className="mb-2"
                                imageClassName="w-full h-auto rounded-lg"
                              />
                              <p className="text-xs text-gray-400 text-center mt-1">
                                Recommended: 1500×500px banner image
                              </p>
                            </div>
                            
                            <div>
                              <Label htmlFor="curve">Bonding Curve Style</Label>
                              <Select value={curveStyle} onValueChange={setCurveStyle}>
                                <SelectTrigger className="bg-wybe-background-light border-wybe-primary/20 focus:ring-wybe-primary">
                                  <SelectValue placeholder="Select curve style" />
                                </SelectTrigger>
                                <SelectContent className="bg-wybe-background-light border-white/10">
                                  <SelectItem value="classic">Classic (Linear)</SelectItem>
                                  <SelectItem value="exponential">Exponential</SelectItem>
                                  <SelectItem value="sigmoid">Sigmoid</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-3">
                              <Label>Social Links (Optional)</Label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                  <Globe size={16} className="text-gray-400" />
                                </div>
                                <Input 
                                  placeholder="Website URL" 
                                  className="bg-wybe-background-light border-wybe-primary/20 focus-visible:ring-wybe-primary pl-10"
                                />
                              </div>
                              
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                  <MessageCircle size={16} className="text-gray-400" />
                                </div>
                                <Input 
                                  placeholder="Telegram Channel" 
                                  className="bg-wybe-background-light border-wybe-primary/20 focus-visible:ring-wybe-primary pl-10"
                                />
                              </div>
                            </div>
                            
                            <div className="bg-wybe-primary/10 border border-wybe-primary/20 rounded-lg p-3 mt-4">
                              <p className="text-sm flex items-center gap-2">
                                <AlertTriangle size={16} className="text-wybe-secondary" />
                                <span>Creation fee: ~$1 USDT (paid in SOL)</span>
                              </p>
                            </div>
                            
                            <Button type="submit" className="btn-primary w-full animate-pulse-glow" disabled={isCreating}>
                              {isCreating ? (
                                <>
                                  <span className="animate-pulse">Creating...</span>
                                  <div className="ml-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                                </>
                              ) : "Launch Coin"}
                            </Button>
                          </div>
                        </form>
                      </TabsContent>
                    </Tabs>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Success Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-wybe-background-light border-wybe-primary/20 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="text-green-500" size={20} />
              Token Created Successfully!
            </DialogTitle>
            <DialogDescription>
              Your meme coin has been deployed to the Solana blockchain.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-wybe-background/70 rounded-lg p-4 border border-white/10">
              <div className="flex items-center mb-4">
                {tokenLogoPreview ? (
                  <Avatar className="h-12 w-12 mr-4 border border-white/10">
                    <AvatarImage src={tokenLogoPreview} alt={name || "Token"} />
                    <AvatarFallback>{(symbol || "?").charAt(0)}</AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="h-12 w-12 rounded-full bg-wybe-primary/20 flex items-center justify-center mr-4">
                    <Coins className="text-wybe-primary" size={20} />
                  </div>
                )}
                <div>
                  <h3 className="font-bold">{name || "Sample Token"}</h3>
                  <p className="text-sm text-gray-400">{symbol || "STKN"}</p>
                </div>
              </div>
              
              {tokenBannerPreview && (
                <div className="mb-4 rounded-lg overflow-hidden">
                  <img 
                    src={tokenBannerPreview} 
                    alt={`${name || "Token"} Banner`} 
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
              
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Total Supply:</span>
                <span className="font-medium">1,000,000,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Token Address:</span>
                <button 
                  onClick={handleCopyAddress} 
                  className="text-xs bg-wybe-primary/20 hover:bg-wybe-primary/30 text-wybe-primary px-2 py-1 rounded-md transition-colors"
                >
                  DummyToken...789 (Copy)
                </button>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="btn-secondary flex-1">
              View on Solscan
            </Button>
            <Button onClick={handleStartTrading} className="btn-primary flex-1 animate-pulse-glow">
              Start Trading
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Launch;
