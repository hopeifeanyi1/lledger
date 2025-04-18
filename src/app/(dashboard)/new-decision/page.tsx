//src/app/(dashboard)/new-decision/page.tsx
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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

  return (
    <div className="py-8 px-8 lg:px-12 max-w-3xl h-full flex flex-col lg:mt-1 mt-5">
      <div className="mb-8 lg:mb-14">
        <h1 className="lg:text-4xl text-3xl font-semibold mb-1">
          Log a New <span className="text-[#D1376A]">Decision</span>
        </h1>
      </div>

      <div className="space-y-10 flex-grow">
        {/* Decision Text Input */}
        <div className="">
          <label htmlFor="decision" className="text-[16px] font-medium text-foreground/85">
            What decision are you trying to make?
          </label>
          <textarea
            id="decision"
            className="w-full min-h-32 p-4 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-[#D1376A]/30 transition mt-2.5"
            placeholder="Describe the decision here..."
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
          />
        </div>

        {/* Category Selector */}
        <div className="">
          <label htmlFor="category" className="text-[16px] font-medium text-foreground/85">
            Decision Category <span className="text-muted-foreground">(Optional)</span>
          </label>
          <div className="relative">
            <input
              id="category"
              type="text"
              className="w-full p-4 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-[#D1376A]/30 transition mt-2.5"
              placeholder="Select or type a category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              onFocus={() => setShowCategories(true)}
            />
            <button 
              className="absolute right-0 top-[10px] h-[58px] my-auto px-4 text-muted-foreground bg-[#D1376A] rounded-r-md border-l border-border"
              onClick={() => setShowCategories(!showCategories)}
            >
              <ArrowDown className={`transition ${showCategories ? '' : 'rotate-180'}`}/>
            </button>
            
            {showCategories && (
              <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                {categories.map((cat) => (
                  <div 
                    key={cat} 
                    className="p-3 hover:bg-secondary cursor-pointer transition"
                    onClick={() => {
                      setCategory(cat);
                      setShowCategories(false);
                    }}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Urgency Level */}
        <div className="space-y-4 mt-8 ">
          <label className="text-[16px] font-medium text-foreground/85 ">
            Urgency Level
          </label>
          <div className="flex space-x-4 mt-4">
            <button 
              className={`px-3 py-2 rounded-xl border ${
                urgency === 'Now' 
                  ? 'border-[#D1376A] text-[#D1376A] bg-[#D1376A]/10' 
                  : 'border-border hover:bg-secondary/80'
              } transition`}
              onClick={() => setUrgency('Now')}
            >
              Now
            </button>
            <button 
              className={`px-3 py-2 rounded-xl border ${
                urgency === 'Soon'
                  ? 'border-[#D1376A] text-[#D1376A] bg-[#D1376A]/10' 
                  : 'border-border hover:bg-secondary/80'
              } transition`}
              onClick={() => setUrgency('Soon')}
            >
              Soon
            </button>
            <button 
              className={`px-3 py-2 rounded-xl border ${
                urgency === 'Later'
                  ? 'border-[#D1376A] text-[#D1376A] bg-[#D1376A]/10' 
                  : 'border-border hover:bg-secondary/80'
              } transition`}
              onClick={() => setUrgency('Later')}
            >
              Later
            </button>
          </div>
        </div>
      </div>

      {/* Next Button */}
      <div className="">
        <button 
          className="bg-[#D1376A] border border-[#D1376A] text-white px-20 py-4 rounded-xl shadow-4xl text-lg font-medium hover:bg-[#C02659] transition ml-auto block"
          onClick={handleNext}
        >
          NEXT
        </button>
      </div>
    </div>
  );
};

export default NewDecisionPage;