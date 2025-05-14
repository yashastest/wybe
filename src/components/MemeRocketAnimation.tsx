
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const MemeRocketAnimation = () => {
  // Animation states and controls
  const [animationState, setAnimationState] = React.useState(1);
  const [isLooping, setIsLooping] = React.useState(true);
  
  // Handle animation loop
  useEffect(() => {
    if (!isLooping) return;
    
    const timer = setTimeout(() => {
      setAnimationState((prev) => (prev === 5 ? 1 : prev + 1));
    }, animationState === 1 ? 2000 : animationState === 4 ? 2000 : 3000); // 2s, 3s, 3s, 2s timing
    
    return () => clearTimeout(timer);
  }, [animationState, isLooping]);
  
  return (
    <div className="w-full h-[350px] md:h-[400px] relative overflow-hidden rounded-lg bg-black">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-950/30 to-purple-900/20 z-0">
        {animationState >= 3 && (
          <motion.div 
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Space background with stars */}
            <div className="absolute inset-0 bg-black">
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute bg-white rounded-full"
                  style={{
                    width: Math.random() * 3 + 1 + "px",
                    height: Math.random() * 3 + 1 + "px",
                    left: Math.random() * 100 + "%",
                    top: Math.random() * 100 + "%",
                  }}
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Scene 1: Trading Desk */}
      {animationState === 1 && (
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative w-[280px] h-[200px] md:w-[320px] md:h-[240px]">
            {/* Trading desk */}
            <motion.div 
              className="absolute bottom-0 w-full h-[70px] bg-gray-800 rounded-t-lg"
              animate={{ y: [5, 0, 5] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            />
            
            {/* Monitors */}
            <div className="absolute bottom-[70px] left-[10%] w-[120px] h-[80px] bg-gray-900 rounded border-2 border-gray-700">
              <div className="w-full h-full bg-green-900/30 p-2 flex flex-col items-center justify-center">
                <div className="text-green-500 text-xl">+9999%</div>
                <div className="text-green-500 text-2xl">🚀</div>
              </div>
            </div>
            
            <div className="absolute bottom-[60px] right-[10%] w-[100px] h-[70px] bg-gray-900 rounded border-2 border-gray-700 rotate-3">
              <div className="w-full h-full bg-blue-900/30 p-2 flex items-center justify-center">
                <div className="text-blue-500 text-xl">🚀</div>
              </div>
            </div>
            
            {/* Character */}
            <motion.div
              className="absolute bottom-[90px] left-1/2 transform -translate-x-1/2 w-[60px] h-[90px]"
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-[60px] h-[60px] bg-yellow-500 rounded-full relative overflow-hidden">
                {/* Face */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[40px] h-[40px] bg-yellow-400 rounded-full flex items-center justify-center">
                    {/* Sunglasses */}
                    <div className="w-[50px] h-[15px] bg-black absolute top-[15px] rounded-lg"></div>
                    {/* Smile */}
                    <div className="w-[30px] h-[15px] border-b-4 border-black absolute top-[35px] rounded-full"></div>
                  </div>
                </div>
                
                {/* Ears */}
                <motion.div 
                  className="absolute -top-3 -left-1 w-[15px] h-[25px] bg-yellow-500 rounded-full origin-bottom-right"
                  animate={{ rotate: [-10, 10, -10] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div 
                  className="absolute -top-3 -right-1 w-[15px] h-[25px] bg-yellow-500 rounded-full origin-bottom-left"
                  animate={{ rotate: [10, -10, 10] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              
              {/* Body */}
              <div className="w-[50px] h-[40px] bg-white rounded-lg mx-auto"></div>
            </motion.div>
          </div>
        </motion.div>
      )}
      
      {/* Scene 2: The Coin Spin */}
      {animationState === 2 && (
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Character with button */}
          <motion.div 
            className="absolute bottom-[70px] left-[30%]"
            animate={{ 
              x: [0, -10, 0], 
              y: [0, -5, 0] 
            }}
            transition={{ duration: 0.3, times: [0, 0.5, 1], delay: 1 }}
          >
            <div className="w-[60px] h-[60px] bg-yellow-500 rounded-full relative">
              {/* Face */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[40px] h-[40px] bg-yellow-400 rounded-full flex items-center justify-center">
                  {/* Sunglasses */}
                  <div className="w-[50px] h-[15px] bg-black absolute top-[15px] rounded-lg"></div>
                  {/* Excited mouth */}
                  <div className="w-[20px] h-[20px] bg-black absolute top-[35px] rounded-full"></div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Big red button */}
          <motion.div
            className="absolute bottom-[100px] left-[30%] w-[70px] h-[70px] bg-red-600 rounded-full flex items-center justify-center shadow-lg border-4 border-red-800"
            animate={{ 
              scale: [1, 0.9, 1],
            }}
            transition={{ 
              duration: 0.3,
              times: [0, 0.5, 1],
              delay: 1.3
            }}
          >
            <div className="text-white font-bold text-xs">SEND IT!</div>
          </motion.div>
          
          {/* Spinning coin */}
          <motion.div
            className="absolute top-[90px] right-[30%] w-[100px] h-[100px]"
            animate={{ 
              scaleX: [1, 0.1, 1],
              y: [0, 0, -30, -50],
              x: [0, 0, 50, 100],
            }}
            transition={{ 
              duration: 3,
              times: [0, 0.4, 0.7, 1],
              delay: 1.6
            }}
          >
            <motion.div
              className="w-full h-full bg-yellow-500 rounded-full flex items-center justify-center border-4 border-yellow-600"
              animate={{ 
                rotateY: [0, 180, 360],
                boxShadow: [
                  '0 0 15px rgba(255, 215, 0, 0.3)',
                  '0 0 40px rgba(255, 215, 0, 0.7)',
                  '0 0 15px rgba(255, 215, 0, 0.3)'
                ]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <span className="text-yellow-800 font-bold text-3xl">W</span>
            </motion.div>
          </motion.div>
          
          {/* Rocket */}
          <motion.div
            className="absolute bottom-[50px] right-[30%] w-[80px] h-[120px]"
            animate={{ 
              rotate: [0, -5, 5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity
            }}
          >
            <div className="relative w-full h-full">
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[40px] h-[80px] bg-gray-200 rounded-t-full"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[20px] h-[40px] bg-red-500"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-[80px] w-[30px] h-[30px] bg-red-500 rounded-full flex items-center justify-center">
                <div className="w-[20px] h-[20px] bg-blue-500 rounded-full"></div>
              </div>
              <div className="absolute bottom-0 left-0 w-[15px] h-[30px] bg-gray-300 rounded-br-full"></div>
              <div className="absolute bottom-0 right-0 w-[15px] h-[30px] bg-gray-300 rounded-bl-full"></div>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* Scene 3: Rocket Launch */}
      {animationState === 3 && (
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Rocket with coin */}
          <motion.div
            className="w-[100px] h-[150px] relative"
            animate={{
              y: [0, -300],
              scale: [1, 0.7]
            }}
            transition={{
              duration: 3,
              ease: "easeOut"
            }}
          >
            {/* Rocket body */}
            <div className="w-[50px] h-[100px] bg-gray-200 rounded-t-full mx-auto"></div>
            
            {/* Windows */}
            <motion.div 
              className="absolute top-[30px] left-1/2 transform -translate-x-1/2 w-[25px] h-[25px] rounded-full bg-blue-500 flex items-center justify-center"
              animate={{ 
                backgroundColor: ['#3b82f6', '#60a5fa', '#3b82f6'] 
              }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <div className="w-[20px] h-[20px] bg-yellow-500 rounded-full">
                <span className="text-yellow-800 font-bold text-xs flex justify-center">W</span>
              </div>
            </motion.div>
            
            {/* Fins */}
            <div className="absolute bottom-0 left-0 w-[20px] h-[40px] bg-red-500 rounded-br-full transform -rotate-12"></div>
            <div className="absolute bottom-0 right-0 w-[20px] h-[40px] bg-red-500 rounded-bl-full transform rotate-12"></div>
            
            {/* Fire effect */}
            <motion.div
              className="absolute -bottom-[50px] left-1/2 transform -translate-x-1/2"
              animate={{
                height: [40, 70, 40],
                width: [30, 40, 30],
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <div className="w-full h-full bg-gradient-to-t from-yellow-500 via-orange-500 to-red-500 rounded-full blur-sm"></div>
            </motion.div>
          </motion.div>
          
          {/* Meme pile from launch */}
          <div className="absolute bottom-[50px] left-1/2 transform -translate-x-1/2 flex flex-wrap justify-center w-[250px] h-[100px]">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0.2, 1, 1.5], y: [-10, -40] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              className="bg-white bg-opacity-10 backdrop-blur-lg rounded px-2 py-1 m-1"
            >
              <span className="text-xs font-bold text-white">HODL</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0.2, 1, 1.5], y: [-10, -30] }}
              transition={{ duration: 1.7, repeat: Infinity, repeatDelay: 0.8, delay: 0.3 }}
              className="bg-white bg-opacity-10 backdrop-blur-lg rounded px-2 py-1 m-1"
            >
              <span className="text-xs font-bold text-white">When Lambo?</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0.2, 1, 1.5], y: [-10, -35] }}
              transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 0.5, delay: 0.6 }}
              className="bg-white bg-opacity-10 backdrop-blur-lg rounded px-2 py-1 m-1"
            >
              <span className="text-xs font-bold text-white">💎🙌</span>
            </motion.div>
          </div>
          
          {/* Background floating coins */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-[30px] h-[30px] bg-blue-500 rounded-full flex items-center justify-center"
              style={{
                top: Math.random() * 70 + 10 + "%",
                left: Math.random() * 70 + 10 + "%",
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, Math.random() * 20 - 10, 0],
                rotate: [0, 360],
                scale: i % 3 === 0 ? [1, 1.2, 0] : undefined, // Some coins pop
              }}
              transition={{
                duration: Math.random() * 3 + 4,
                repeat: Infinity,
                repeatType: "loop",
              }}
            >
              <span className="text-white text-xs">$</span>
            </motion.div>
          ))}
        </motion.div>
      )}
      
      {/* Scene 4: Moon Party */}
      {animationState === 4 && (
        <motion.div 
          className="absolute inset-0 flex items-end justify-center pb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Moon surface */}
          <div className="absolute bottom-0 w-full h-[120px] bg-gray-300 rounded-t-full"></div>
          
          {/* Moon craters */}
          <div className="absolute bottom-[40px] left-[30%] w-[60px] h-[20px] bg-gray-400 rounded-full"></div>
          <div className="absolute bottom-[70px] right-[25%] w-[40px] h-[15px] bg-gray-400 rounded-full"></div>
          
          {/* Landed rocket */}
          <motion.div
            className="absolute bottom-[120px] left-[20%] w-[60px] h-[80px]"
            animate={{ rotate: [2, -2, 2] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <div className="w-[30px] h-[70px] bg-gray-200 rounded-t-full mx-auto"></div>
            <div className="absolute top-[20px] left-1/2 transform -translate-x-1/2 w-[15px] h-[15px] rounded-full bg-blue-500"></div>
            <div className="absolute bottom-0 left-0 w-[15px] h-[20px] bg-red-500 rounded-br-full"></div>
            <div className="absolute bottom-0 right-0 w-[15px] h-[20px] bg-red-500 rounded-bl-full"></div>
          </motion.div>
          
          {/* Flag */}
          <div className="absolute bottom-[120px] left-[40%] h-[80px] w-[2px] bg-gray-600">
            <motion.div
              className="w-[50px] h-[30px] bg-orange-500 flex items-center justify-center"
              animate={{ skewX: [0, 5, 0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="text-white text-[8px] font-bold">$WYBE</span>
            </motion.div>
          </div>
          
          {/* Party characters */}
          <div className="absolute bottom-[120px] right-[20%] flex space-x-3">
            {/* Doge */}
            <motion.div
              className="w-[30px] h-[30px] bg-yellow-300 rounded-full"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-yellow-800 text-xs">🐶</span>
              </div>
            </motion.div>
            
            {/* Wojak */}
            <motion.div
              className="w-[30px] h-[30px] bg-pink-200 rounded-full"
              animate={{ rotate: [0, 10, 0, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-yellow-800 text-xs">😭</span>
              </div>
            </motion.div>
            
            {/* Chad */}
            <motion.div
              className="w-[30px] h-[30px] bg-blue-300 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-yellow-800 text-xs">💪</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
      
      {/* Scene 5: UFO Loop Reset */}
      {animationState === 5 && (
        <motion.div 
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Stars background */}
          <div className="absolute inset-0">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-white rounded-full"
                style={{
                  width: Math.random() * 3 + 1 + "px",
                  height: Math.random() * 3 + 1 + "px",
                  left: Math.random() * 100 + "%",
                  top: Math.random() * 100 + "%",
                }}
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            ))}
          </div>
          
          {/* UFO with beam */}
          <motion.div
            className="absolute top-[10%] left-[50%] transform -translate-x-1/2 w-[120px]"
            animate={{ 
              y: [0, 10, 0], 
              x: [-30, 30, -30]
            }}
            transition={{ 
              y: { duration: 2, repeat: Infinity, repeatType: "reverse" },
              x: { duration: 4, repeat: Infinity, repeatType: "reverse" }
            }}
          >
            {/* UFO Body */}
            <div className="w-[80px] h-[25px] bg-gray-700 rounded-full mx-auto flex items-center justify-center">
              <div className="w-[50px] h-[15px] bg-gray-600 rounded-full"></div>
            </div>
            <div className="w-[50px] h-[15px] bg-gray-500 rounded-full mx-auto -mt-[5px]"></div>
            
            {/* Beam */}
            <motion.div
              className="w-[40px] mx-auto h-[100px] bg-gradient-to-b from-green-300/70 to-transparent"
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            />
          </motion.div>
          
          {/* Dancing CatZilla */}
          <motion.div
            className="absolute top-[5%] left-[50%] transform -translate-x-1/2 w-[40px] h-[30px]"
            animate={{ 
              rotate: [0, 10, -10, 0],
            }}
            transition={{ 
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <div className="w-full h-full bg-gray-800 rounded-lg relative">
              <div className="absolute top-0 left-[5px] w-[10px] h-[15px] bg-gray-800 rounded-tr-full"></div>
              <div className="absolute top-0 right-[5px] w-[10px] h-[15px] bg-gray-800 rounded-tl-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-xs text-green-500">😺</div>
              </div>
            </div>
          </motion.div>
          
          {/* Coin being beamed up */}
          <motion.div
            className="absolute top-[80%] left-[50%] transform -translate-x-1/2 w-[25px] h-[25px] bg-yellow-500 rounded-full flex items-center justify-center"
            animate={{ 
              y: [0, -100, -150],
              rotate: [0, 720],
              scale: [1, 0.7, 0.4]
            }}
            transition={{ 
              duration: 2,
              ease: "easeInOut"
            }}
          >
            <span className="text-yellow-800 text-xs font-bold">$</span>
          </motion.div>
        </motion.div>
      )}
      
      {/* Animation stage indicator (small dots at bottom) */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {[1, 2, 3, 4, 5].map((step) => (
          <div 
            key={step}
            className={`w-2 h-2 rounded-full ${animationState === step ? 'bg-white' : 'bg-white/30'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default MemeRocketAnimation;
