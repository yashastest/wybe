
import React from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const BondingCurves = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <Link 
            to="/"
            className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors mb-4"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to Home
          </Link>
          
          <h1 className="text-4xl font-poppins font-bold mb-3 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 inline-block text-transparent bg-clip-text">
            Understanding Bonding Curves
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            A kid-friendly guide to how token prices work in crypto
          </p>
        </motion.div>
        
        <div className="space-y-12 max-w-4xl">
          {/* Introduction Section */}
          <section className="bg-indigo-900/20 p-6 rounded-xl border border-indigo-500/20">
            <h2 className="text-2xl font-bold mb-4 text-indigo-300">What is a Bonding Curve? 🤔</h2>
            <p className="text-lg mb-4">
              Imagine you're collecting toy cars. If there are tons of the same car, it's not very special, right? But if there are only a few, it becomes more valuable!
            </p>
            <p className="text-lg">
              A <span className="text-indigo-300 font-bold">bonding curve</span> works the same way for crypto tokens. It's like a magic rule that says: "The more tokens people buy, the more expensive they get!"
            </p>
            
            <div className="mt-6 bg-black/30 p-4 rounded-lg border border-white/10">
              <p className="font-mono text-green-400">Simple Definition:</p>
              <p className="text-white">A bonding curve is a mathematical rule that automatically sets the price of a token based on how many tokens exist.</p>
            </div>
          </section>
          
          {/* Visual Example 1 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-300">The Lemonade Stand Example 🍋</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <p className="mb-2">
                  Think of a lemonade stand on a hot day:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>The first cup costs only $1</li>
                  <li>The second cup costs $1.20</li>
                  <li>The third cup costs $1.44</li>
                  <li>And the price keeps going up as more people buy!</li>
                </ul>
                <p className="mt-4">
                  This happens because:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>More demand means higher prices</li>
                  <li>The lemonade becomes more valuable as it gets scarce</li>
                  <li>The price follows a mathematical curve</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 p-6 rounded-xl border border-yellow-500/20 h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-block p-4 bg-yellow-400 rounded-full mb-4">
                    <span className="text-4xl">🍋</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-black/40 p-2 rounded-lg">
                      <p className="text-yellow-400 font-bold">Cup 1</p>
                      <p>$1.00</p>
                    </div>
                    <div className="bg-black/40 p-2 rounded-lg">
                      <p className="text-yellow-400 font-bold">Cup 2</p>
                      <p>$1.20</p>
                    </div>
                    <div className="bg-black/40 p-2 rounded-lg">
                      <p className="text-yellow-400 font-bold">Cup 3</p>
                      <p>$1.44</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Types of Bonding Curves */}
          <section className="bg-purple-900/20 p-6 rounded-xl border border-purple-500/20">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">Different Types of Bonding Curves 📈</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-black/30 p-4 rounded-lg">
                <h3 className="text-xl font-bold mb-2 text-purple-300">Linear Curve</h3>
                <p className="mb-4">
                  Price goes up by the same amount each time.
                </p>
                <div className="h-[120px] relative bg-gradient-to-r from-purple-900/20 to-purple-500/20 rounded-lg border border-purple-500/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3/4 h-0 border-t-2 border-purple-400 transform rotate-[25deg]"></div>
                  </div>
                  <div className="absolute bottom-2 left-2 text-xs text-purple-300">Few Tokens</div>
                  <div className="absolute bottom-2 right-2 text-xs text-purple-300">Many Tokens</div>
                  <div className="absolute left-2 top-2 text-xs text-purple-300">High Price</div>
                  <div className="absolute left-2 bottom-2 text-xs text-purple-300">Low Price</div>
                </div>
              </div>
              
              <div className="bg-black/30 p-4 rounded-lg">
                <h3 className="text-xl font-bold mb-2 text-indigo-300">Exponential Curve</h3>
                <p className="mb-4">
                  Price increases faster and faster (like our lemonade example).
                </p>
                <div className="h-[120px] relative bg-gradient-to-r from-indigo-900/20 to-indigo-500/20 rounded-lg border border-indigo-500/20">
                  <div className="absolute inset-0 flex items-end">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <path d="M 10,90 Q 30,90 50,70 Q 70,50 90,10" stroke="rgb(129 140 248)" strokeWidth="2" fill="none" />
                    </svg>
                  </div>
                  <div className="absolute bottom-2 left-2 text-xs text-indigo-300">Few Tokens</div>
                  <div className="absolute bottom-2 right-2 text-xs text-indigo-300">Many Tokens</div>
                  <div className="absolute left-2 top-2 text-xs text-indigo-300">High Price</div>
                  <div className="absolute left-2 bottom-2 text-xs text-indigo-300">Low Price</div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black/30 p-4 rounded-lg">
                <h3 className="text-xl font-bold mb-2 text-green-300">Logarithmic Curve</h3>
                <p className="mb-4">
                  Price goes up quickly at first, then slows down.
                </p>
                <div className="h-[120px] relative bg-gradient-to-r from-green-900/20 to-green-500/20 rounded-lg border border-green-500/20">
                  <div className="absolute inset-0 flex items-end">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <path d="M 10,90 Q 20,40 90,20" stroke="rgb(74 222 128)" strokeWidth="2" fill="none" />
                    </svg>
                  </div>
                  <div className="absolute bottom-2 left-2 text-xs text-green-300">Few Tokens</div>
                  <div className="absolute bottom-2 right-2 text-xs text-green-300">Many Tokens</div>
                </div>
              </div>
              
              <div className="bg-black/30 p-4 rounded-lg">
                <h3 className="text-xl font-bold mb-2 text-blue-300">S-Curve</h3>
                <p className="mb-4">
                  Slow at first, then fast in the middle, then slow again.
                </p>
                <div className="h-[120px] relative bg-gradient-to-r from-blue-900/20 to-blue-500/20 rounded-lg border border-blue-500/20">
                  <div className="absolute inset-0 flex items-end">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <path d="M 10,80 Q 25,80 40,70 Q 60,40 75,20 Q 90,20 90,20" stroke="rgb(96 165 250)" strokeWidth="2" fill="none" />
                    </svg>
                  </div>
                  <div className="absolute bottom-2 left-2 text-xs text-blue-300">Few Tokens</div>
                  <div className="absolute bottom-2 right-2 text-xs text-blue-300">Many Tokens</div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Real-World Example */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-yellow-300">Real Example: The Cookie Jar 🍪</h2>
            
            <div className="bg-gradient-to-br from-yellow-900/20 to-orange-600/20 p-6 rounded-xl border border-yellow-500/20">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <div className="bg-black/40 p-4 rounded-lg mb-4">
                    <h3 className="text-lg font-bold mb-2 text-yellow-300">The Cookie Jar Rules</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                      <li>The jar starts with 100 cookies</li>
                      <li>First cookie costs $0.10</li>
                      <li>Each time someone buys a cookie, the price increases</li>
                      <li>The price formula is: Price = (100 - Cookies Left)² ÷ 10000 + 0.10</li>
                    </ul>
                  </div>
                  <div className="text-center">
                    <span className="text-5xl">🍪</span>
                  </div>
                </div>
                
                <div className="lg:col-span-2">
                  <div className="overflow-x-auto">
                    <table className="w-full text-center">
                      <thead className="bg-yellow-900/40">
                        <tr>
                          <th className="p-2 border border-yellow-800/30">Cookies Left</th>
                          <th className="p-2 border border-yellow-800/30">Cookies Sold</th>
                          <th className="p-2 border border-yellow-800/30">Next Cookie Price</th>
                          <th className="p-2 border border-yellow-800/30">Total Value of Jar</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-black/20">
                          <td className="p-2 border border-yellow-800/30">100</td>
                          <td className="p-2 border border-yellow-800/30">0</td>
                          <td className="p-2 border border-yellow-800/30">$0.10</td>
                          <td className="p-2 border border-yellow-800/30">$0.00</td>
                        </tr>
                        <tr className="bg-black/40">
                          <td className="p-2 border border-yellow-800/30">90</td>
                          <td className="p-2 border border-yellow-800/30">10</td>
                          <td className="p-2 border border-yellow-800/30">$0.11</td>
                          <td className="p-2 border border-yellow-800/30">$1.05</td>
                        </tr>
                        <tr className="bg-black/20">
                          <td className="p-2 border border-yellow-800/30">50</td>
                          <td className="p-2 border border-yellow-800/30">50</td>
                          <td className="p-2 border border-yellow-800/30">$0.35</td>
                          <td className="p-2 border border-yellow-800/30">$11.25</td>
                        </tr>
                        <tr className="bg-black/40">
                          <td className="p-2 border border-yellow-800/30">10</td>
                          <td className="p-2 border border-yellow-800/30">90</td>
                          <td className="p-2 border border-yellow-800/30">$0.91</td>
                          <td className="p-2 border border-yellow-800/30">$55.45</td>
                        </tr>
                        <tr className="bg-black/20">
                          <td className="p-2 border border-yellow-800/30">1</td>
                          <td className="p-2 border border-yellow-800/30">99</td>
                          <td className="p-2 border border-yellow-800/30">$1.08</td>
                          <td className="p-2 border border-yellow-800/30">$98.01</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <p className="text-yellow-200 mt-4 text-center">
                    Notice how the price increases as more cookies are sold!
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Why Bonding Curves Matter */}
          <section className="bg-green-900/20 p-6 rounded-xl border border-green-500/20">
            <h2 className="text-2xl font-bold mb-4 text-green-300">Why Are Bonding Curves Important? 🌟</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-black/30 p-4 rounded-lg">
                <div className="text-green-300 font-bold text-xl mb-2 flex items-center">
                  <span className="text-2xl mr-2">⚖️</span>
                  Fair Pricing
                </div>
                <p>
                  Bonding curves set prices automatically without any person deciding what the price should be. This makes it fair for everyone!
                </p>
              </div>
              
              <div className="bg-black/30 p-4 rounded-lg">
                <div className="text-green-300 font-bold text-xl mb-2 flex items-center">
                  <span className="text-2xl mr-2">🔄</span>
                  Always Liquid
                </div>
                <p>
                  You can always buy or sell tokens at a price determined by the curve. No need to find another person to trade with!
                </p>
              </div>
              
              <div className="bg-black/30 p-4 rounded-lg">
                <div className="text-green-300 font-bold text-xl mb-2 flex items-center">
                  <span className="text-2xl mr-2">🚀</span>
                  Early Rewards
                </div>
                <p>
                  People who buy tokens early get them at lower prices. If the project becomes popular, early supporters benefit more!
                </p>
              </div>
            </div>
          </section>
          
          {/* How We Use Bonding Curves */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-indigo-300">How Wybe Uses Bonding Curves 🌊</h2>
            <p className="text-lg mb-6">
              At Wybe, we use bonding curves to make trading meme coins fair and fun:
            </p>
            
            <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 p-6 rounded-xl border border-indigo-500/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black/30 p-4 rounded-lg">
                  <h3 className="text-xl font-bold mb-2 text-indigo-300">When You Buy Tokens</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-300">
                    <li>You pay SOL to get tokens</li>
                    <li>The price goes up a little bit after your purchase</li>
                    <li>The next buyer will pay slightly more</li>
                    <li>Your tokens are now worth more than what you paid</li>
                  </ol>
                </div>
                
                <div className="bg-black/30 p-4 rounded-lg">
                  <h3 className="text-xl font-bold mb-2 text-indigo-300">When You Sell Tokens</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-300">
                    <li>You give back tokens and get SOL in return</li>
                    <li>The price goes down a little bit after your sale</li>
                    <li>The next seller will get slightly less SOL</li>
                    <li>This helps stabilize the token price</li>
                  </ol>
                </div>
              </div>
            </div>
          </section>
          
          {/* Conclusion */}
          <section className="bg-gradient-to-br from-pink-900/20 to-purple-900/20 p-6 rounded-xl border border-pink-500/20">
            <h2 className="text-2xl font-bold mb-4 text-pink-300">Ready to Try It? 🎮</h2>
            <p className="text-lg mb-6">
              Now that you understand bonding curves, you can try trading tokens on Wybe with confidence!
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
              <Link 
                to="/discover"
                className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-poppins font-bold rounded-full hover:from-pink-500 hover:to-purple-500 transition-all shadow-glow-sm hover:shadow-glow-md"
              >
                Discover Tokens
              </Link>
              
              <Link 
                to="/launch"
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-poppins font-bold rounded-full hover:from-indigo-500 hover:to-blue-500 transition-all shadow-glow-sm hover:shadow-glow-md"
              >
                Launch Your Own Token
              </Link>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BondingCurves;
