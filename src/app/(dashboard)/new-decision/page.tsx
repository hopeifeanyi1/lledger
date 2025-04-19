//src/app/(dashboard)/new-decision/page.tsx
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown } from '@/components/store/Icon';

const NewDecisionPage = () => {
  const router = useRouter();
  const [decision, setDecision] = useState('');
  const [category, setCategory] = useState('');
  const [urgency, setUrgency] = useState('');
  const [showCategories, setShowCategories] = useState(false);

  const categories = [
    'Career', 'Finance', 'Health', 'Relationships', 
    'Personal Growth', 'Education', 'Family', 'Lifestyle'
  ];

  const handleNext = () => {
    if (!decision.trim()) {
      // You might want to add validation here
      return;
    }
    
    // In a real implementation, you would save this data to state or API
    // before navigating to the AI Thought Partner page
    router.push('/chat');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      }
    }
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5 
      }
    }
  };

  const categoryVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 30 
      }
    }
  };

  return (
    <motion.div 
      className="py-8 px-8 lg:px-12 max-w-3xl h-full flex flex-col lg:mt-1 mt-5"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="mb-8 lg:mb-14"
        variants={itemVariants}
      >
        <motion.h1 
          className="lg:text-4xl text-3xl font-semibold mb-1"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        >
          Log a New <motion.span 
            className="text-[#D1376A]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >Decision</motion.span>
        </motion.h1>
      </motion.div>

      <div className="space-y-10 flex-grow">
        {/* Decision Text Input */}
        <motion.div variants={itemVariants}>
          <label htmlFor="decision" className="text-[16px] font-medium text-foreground/85">
            What decision are you trying to make?
          </label>
          <motion.textarea
            id="decision"
            className="w-full min-h-32 p-4 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-[#D1376A]/30 transition mt-2.5"
            placeholder="Describe the decision here..."
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            whileFocus={{ boxShadow: "0 0 0 2px rgba(209, 55, 106, 0.3)" }}
          />
        </motion.div>

        {/* Category Selector */}
        <motion.div variants={itemVariants}>
          <label htmlFor="category" className="text-[16px] font-medium text-foreground/85">
            Decision Category <span className="text-muted-foreground">(Optional)</span>
          </label>
          <div className="relative">
            <motion.input
              id="category"
              type="text"
              className="w-full p-4 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-[#D1376A]/30 transition mt-2.5"
              placeholder="Select or type a category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              onFocus={() => setShowCategories(true)}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              whileFocus={{ boxShadow: "0 0 0 2px rgba(209, 55, 106, 0.3)" }}
            />
            <motion.button 
              className="absolute right-0 top-[10px] h-[58px] my-auto px-4 text-muted-foreground bg-[#D1376A] rounded-r-md border-l border-border"
              onClick={() => setShowCategories(!showCategories)}
              whileHover={{ backgroundColor: "#C02659" }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                animate={{ rotate: showCategories ? 0 : 180 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <ArrowDown className="transition" />
              </motion.div>
            </motion.button>
            
            <AnimatePresence>
              {showCategories && (
                <motion.div 
                  className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={categoryVariants}
                >
                  {categories.map((cat, index) => (
                    <motion.div 
                      key={cat} 
                      className="p-3 hover:bg-secondary cursor-pointer transition"
                      onClick={() => {
                        setCategory(cat);
                        setShowCategories(false);
                      }}
                      variants={fadeInVariants}
                      custom={index}
                      whileHover={{ backgroundColor: "rgba(209, 55, 106, 0.1)" }}
                      transition={{ duration: 0.2 }}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        transition: { delay: index * 0.05, duration: 0.25 } 
                      }}
                    >
                      {cat}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Urgency Level */}
        <motion.div 
          className="space-y-4 mt-8"
          variants={itemVariants}
        >
          <label className="text-[16px] font-medium text-foreground/85">
            Urgency Level
          </label>
          <motion.div 
            className="flex space-x-4 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {['Now', 'Soon', 'Later'].map((level, index) => (
              <motion.button 
                key={level}
                className={`px-3 py-2 rounded-xl border ${
                  urgency === level 
                    ? 'border-[#D1376A] text-[#D1376A] bg-[#D1376A]/10' 
                    : 'border-border hover:bg-secondary/80'
                } transition`}
                onClick={() => setUrgency(level)}
                whileHover={{ 
                  scale: 1.05, 
                  backgroundColor: urgency === level ? "rgba(209, 55, 106, 0.15)" : "rgba(0, 0, 0, 0.05)" 
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  transition: { delay: 0.6 + (index * 0.1), duration: 0.3 } 
                }}
              >
                {level}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Next Button */}
      <motion.div
        variants={itemVariants}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 200, damping: 20 }}
      >
        <motion.button 
          className="bg-[#D1376A] border border-[#D1376A] text-white px-20 py-4 rounded-xl shadow-4xl text-lg font-medium hover:bg-[#C02659] transition ml-auto block"
          onClick={handleNext}
          whileHover={{ scale: 1.03, backgroundColor: "#C02659" }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, type: "spring" }}
        >
          NEXT
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default NewDecisionPage;