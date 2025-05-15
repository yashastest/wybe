
import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, PieChart, BarChart, MessageCircle, DollarSign, Globe } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const LaunchPackage = () => {
  const handleGetStarted = () => {
    toast.success("Thanks for your interest! A team member will contact you shortly.");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              Full-Service Token Launch Package
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Everything you need to successfully launch your token - from development to marketing and ongoing support.
            </p>
            <div className="bg-wybe-primary/10 border border-wybe-primary/30 rounded-lg p-4 inline-flex items-center mb-8">
              <DollarSign className="text-wybe-primary mr-2" size={24} />
              <span className="text-xl font-semibold">All-inclusive package: $500</span>
            </div>
            <Button 
              size="lg" 
              className="btn-primary animate-pulse-glow text-lg px-8 py-6"
              onClick={handleGetStarted}
            >
              Get Started Now
              <ArrowRight className="ml-2" />
            </Button>
          </motion.div>
          
          {/* Package Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="glass-card border-wybe-primary/20 hover:border-wybe-primary/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="mr-2 text-wybe-secondary" size={20} />
                  Token Development
                </CardTitle>
                <CardDescription>Expert token creation and deployment</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Custom token design and implementation",
                    "Optimized bonding curve implementation",
                    "Security audit and testing",
                    "Smart contract deployment",
                    "Whitepaper creation"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="mr-2 text-green-500 mt-0.5 flex-shrink-0" size={16} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-wybe-primary/20 hover:border-wybe-primary/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="mr-2 text-wybe-secondary" size={20} />
                  Marketing & Community
                </CardTitle>
                <CardDescription>Build and engage your audience</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Social media setup and management",
                    "Community building strategies",
                    "Influencer partnerships",
                    "Telegram/Discord channel setup",
                    "Launch campaign planning and execution"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="mr-2 text-green-500 mt-0.5 flex-shrink-0" size={16} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-wybe-primary/20 hover:border-wybe-primary/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="mr-2 text-wybe-secondary" size={20} />
                  Ongoing Support
                </CardTitle>
                <CardDescription>Long-term assistance and guidance</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "30 days of dedicated technical support",
                    "Market analysis and trading strategy",
                    "Liquidity management advice",
                    "Post-launch marketing assistance",
                    "Monthly performance reports"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="mr-2 text-green-500 mt-0.5 flex-shrink-0" size={16} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          
          {/* Process Steps */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  step: "1",
                  title: "Consultation",
                  description: "We'll discuss your vision, goals, and target audience for your token."
                },
                {
                  step: "2",
                  title: "Development",
                  description: "Our team develops your custom token with optimized bonding curve and security features."
                },
                {
                  step: "3",
                  title: "Launch",
                  description: "We handle the technical deployment and marketing push for your token launch."
                },
                {
                  step: "4",
                  title: "Support",
                  description: "Ongoing support to help your token grow and succeed in the market."
                }
              ].map((item, i) => (
                <div key={i} className="relative glass-card border border-wybe-primary/20 p-6 rounded-lg">
                  <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-wybe-primary flex items-center justify-center text-black font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 mt-2">{item.title}</h3>
                  <p className="text-gray-300">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  question: "How long does it take to launch my token?",
                  answer: "The typical timeline is 2-3 weeks from initial consultation to launch, depending on the complexity of your requirements."
                },
                {
                  question: "What blockchain networks do you support?",
                  answer: "We primarily focus on Solana, but can also support Ethereum, Binance Smart Chain, and other EVM-compatible networks."
                },
                {
                  question: "Do I need technical knowledge to work with you?",
                  answer: "No, our team handles all the technical aspects. We'll guide you through the process in simple terms."
                },
                {
                  question: "What happens after the 30-day support period?",
                  answer: "We offer extended support packages that can be purchased separately after the initial period."
                },
              ].map((item, i) => (
                <Card key={i} className="bg-black/40 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg">{item.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{item.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-wybe-primary/20 to-wybe-secondary/20 rounded-2xl p-8 md:p-12 border border-wybe-primary/30">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Launch Your Token?</h2>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Get started today with our all-inclusive package and join the next generation of successful token launches.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="btn-primary animate-pulse-glow text-lg px-8"
                onClick={handleGetStarted}
              >
                Get Started Now
              </Button>
              <Link to="/contact">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg border-white/20 hover:bg-white/5"
                >
                  Contact Sales Team
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LaunchPackage;
