//src/app/(dashboard)/new-decision/page.tsx
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    <div className="p-8 max-w-3xl mx-auto h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-4xl font-serif mb-1">
          Log a New <span className="text-[#D1376A]">Decision</span>
        </h1>
      </div>

      <div className="space-y-10 flex-grow">
        {/* Decision Text Input */}
        <div className="space-y-2">
          <label htmlFor="decision" className="text-lg font-medium">
            What decision are you trying to make?
          </label>
          <textarea
            id="decision"
            className="w-full min-h-32 p-4 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-[#D1376A]/30 transition"
            placeholder="Describe the decision you're facing..."
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
          />
        </div>

        {/* Category Selector */}
        <div className="space-y-2">
          <label htmlFor="category" className="text-lg font-medium">
            Decision Category <span className="text-muted-foreground text-sm">(Optional)</span>
          </label>
          <div className="relative">
            <input
              id="category"
              type="text"
              className="w-full p-4 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-[#D1376A]/30 transition"
              placeholder="Select or type a category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              onFocus={() => setShowCategories(true)}
            />
            <button 
              className="absolute right-0 top-0 h-full px-4 text-muted-foreground bg-secondary rounded-r-md border-l border-border"
              onClick={() => setShowCategories(!showCategories)}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className={`transition ${showCategories ? 'rotate-180' : ''}`}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
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
        <div className="space-y-4">
          <label className="text-lg font-medium">
            Urgency Level
          </label>
          <div className="flex space-x-4">
            <button 
              className={`px-6 py-2 rounded-full border ${
                urgency === 'Now' 
                  ? 'border-[#D1376A] text-[#D1376A] bg-[#D1376A]/10' 
                  : 'border-border hover:bg-secondary/80'
              } transition`}
              onClick={() => setUrgency('Now')}
            >
              Now
            </button>
            <button 
              className={`px-6 py-2 rounded-full border ${
                urgency === 'Soon'
                  ? 'border-[#D1376A] text-[#D1376A] bg-[#D1376A]/10' 
                  : 'border-border hover:bg-secondary/80'
              } transition`}
              onClick={() => setUrgency('Soon')}
            >
              Soon
            </button>
            <button 
              className={`px-6 py-2 rounded-full border ${
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
      <div className="mt-auto pt-6">
        <button 
          className="bg-[#D1376A] text-white px-10 py-4 rounded-lg text-lg font-medium hover:bg-[#C02659] transition ml-auto block"
          onClick={handleNext}
        >
          NEXT
        </button>
      </div>
    </div>
  );
};

export default NewDecisionPage;