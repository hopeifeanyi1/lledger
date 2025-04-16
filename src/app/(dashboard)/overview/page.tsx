//src/app/(dashboard)/overview/page.tsx
'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Info } from 'lucide-react';

// Define types for our data
interface Decision {
  id: number;
  title: string;
  category: string;
  date: string;
  outcome: 'Good' | 'Bad' | 'Pending';
}

interface CategoryStats {
  name: string;
  percentage: number;
}

interface Stats {
  totalDecisions: number;
  pendingReflections: number;
  goodOutcomePercentage: number;
  categories: CategoryStats[];
}

// Mock data - replace with actual data from your database
const mockDecisions: Decision[] = [
  { id: 1, title: "Accept job offer", category: "Career", date: "2025-04-10", outcome: "Good" },
  { id: 2, title: "Investment in stocks", category: "Finance", date: "2025-04-08", outcome: "Bad" },
  { id: 3, title: "Daily workout routine", category: "Health", date: "2025-04-05", outcome: "Good" },
  { id: 4, title: "Purchase new laptop", category: "Finance", date: "2025-04-01", outcome: "Good" },
  { id: 5, title: "Take online course", category: "Career", date: "2025-03-28", outcome: "Good" },
  { id: 6, title: "Diet change", category: "Health", date: "2025-03-25", outcome: "Bad" },
  { id: 7, title: "Freelance project", category: "Career", date: "2025-03-20", outcome: "Good" },
  { id: 8, title: "Property investment", category: "Finance", date: "2025-03-15", outcome: "Good" },
  { id: 9, title: "Mental health day", category: "Health", date: "2025-03-10", outcome: "Good" },
  { id: 10, title: "Career pivot strategy", category: "Career", date: "2025-03-05", outcome: "Pending" },
];

const mockStats: Stats = {
  totalDecisions: 28,
  pendingReflections: 5,
  goodOutcomePercentage: 75, // Out of 100
  categories: [
    { name: "Career", percentage: 45 },
    { name: "Finance", percentage: 30 },
    { name: "Health", percentage: 25 },
  ]
};

interface DecisionCardProps {
  decision: Decision;
}

const DecisionCard: React.FC<DecisionCardProps> = ({ decision }) => (
  <Card className="h-44 w-[145px]  ">
    <CardHeader className="h-full w-full px-2 flex justify-center">
      <CardTitle className="text-sm m-auto ">{decision.title}</CardTitle>
    </CardHeader>
  </Card>
);

const OverviewPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        router.push('/login');
        return;
      }

      setUser(data.session.user);
      setLoading(false);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/login');
      } else if (session && event === 'SIGNED_IN') {
        setUser(session.user);
        setLoading(false);
      }
    });

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [router]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  
  // Determine outcome color based on percentage
  const getOutcomeColor = (percentage: number) => {
    return percentage >= 50 ? 'text-[#319F43] dark:text-[#319F43]' : 'text-red-600 dark:text-red-400';
  };

  // Determine progress bar bg color
  const getProgressBarColor = (percentage: number) => {
    return percentage >= 50 ? 'bg-green-600 dark:bg-[#319F43]' : 'bg-red-600 dark:bg-[#319F43]';
  };

  return (
    <div className='pt-6 md:pt-12 px-4 md:px-10'>
      <div className='grid grid-cols-1 md:grid-cols-5'>
        <div className='col-span-1 md:col-span-3'>
            <div className=''>
                <p className='font-medium text-xl md:text-2xl'>Hello <span className='text-[#D1376A]'>{userName}!</span></p>
                <p className='text-3xl md:text-5xl font-bold w-full lg:w-[500px] mt-5 md:mt-10 leading-tight lg:leading-[50px]'>Here&apos;s your current decision landscape!</p>
                <hr className='border-t-[1px] border-black/40 dark:border-white/40 mt-10 md:mt-20 w-full md:w-[450px]'/>
            </div>
            <div className="mt-6 md:mt-10">
                <Tabs defaultValue="quick-stats" className="w-full">
                <TabsList className="ml-0 md:ml-1 bg-transparent gap-x-2 md:gap-x-6 text-black dark:text-white overflow-x-auto">
                    <TabsTrigger value="quick-stats" className='text-black/55 dark:text-white/55 data-[state=active]:bg-[#D1376A]/20 data-[state=active]:text-[#D1376A] dark:data-[state=active]:bg-[#D1376A]/20 dark:data-[state=active]:text-[#D1376A]'>Quick Stats Cards</TabsTrigger>
                    <TabsTrigger value="recent-decisions" className='text-black/55 dark:text-white/55 data-[state=active]:bg-[#D1376A]/20 data-[state=active]:text-[#D1376A] dark:data-[state=active]:bg-[#D1376A]/20 dark:data-[state=active]:text-[#D1376A]'>Recent Decisions Timeline</TabsTrigger>
                    <TabsTrigger value="top-categories" className='text-black/55 dark:text-white/55 data-[state=active]:bg-[#D1376A]/20 data-[state=active]:text-[#D1376A] dark:data-[state=active]:bg-[#D1376A]/20 dark:data-[state=active]:text-[#D1376A]'>Top Categories</TabsTrigger>
                </TabsList>
                
                <TabsContent value="quick-stats" className=''>
                    <Card className='border-0 shadow-none gap-6 bg-transparent w-full md:w-[68%]'>
                        <CardHeader>
                        <CardTitle></CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-0 mb-8 md:mb-12">
                            <div>
                                <p className="text-sm md:text-[15px] font-medium">Total Decisions <Info className='text-black/30 dark:text-white/30 w-[11px] h-[11px] inline ml-1 md:ml-3'/> </p>
                                <p className="text-3xl md:text-5xl font-medium text-[#D1376A] mt-2 md:mt-5">{mockStats.totalDecisions}</p>
                            </div>
                            <div className="mt-2 md:mt-0">
                                <p className="text-sm md:text-[15px] font-medium">Pending Reflections <Info className='text-black/30 dark:text-white/30 w-[11px] h-[11px] inline ml-1 md:ml-3'/></p>
                                <p className="text-3xl md:text-5xl font-medium text-[#D1376A] mt-2 md:mt-5">{mockStats.pendingReflections}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-6 md:space-y-12">
                              <p className="text-xs md:text-sm font-medium">Regret Analysis (% good Outcomes) <Info className='text-black/30 dark:text-white/30 w-[11px] h-[11px] inline ml-1 md:ml-3'/></p>
                              <span className={`text-xs md:text-sm font-medium ${getOutcomeColor(mockStats.goodOutcomePercentage)}`}>
                                {mockStats.goodOutcomePercentage}% Good Outcome
                              </span>
                              <Progress 
                                value={mockStats.goodOutcomePercentage} 
                                className="mt-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5"
                                indicatorClassName={getProgressBarColor(mockStats.goodOutcomePercentage)}
                              />
                          </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="recent-decisions">
                    <Card className="shadow-none border-0 bg-transparent mt-16">
                    <CardContent>
                        <Carousel className="w-full md:w-[70%]">
                        <CarouselContent>
                            {mockDecisions.map((decision) => (
                            <CarouselItem key={decision.id} className="basis-full sm:basis-1/2 md:basis-1/3 pl-4">
                                <DecisionCard decision={decision} />
                            </CarouselItem>
                            ))}
                        </CarouselContent>
                        <div className="flex justify-center mt-4">
                            <CarouselPrevious className="mr-1" />
                            <CarouselNext />
                        </div>
                        </Carousel>
                    </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="top-categories">
                    <Card className="border-0 bg-transparent shadow-none w-[70%] mt-12">
                    <CardContent>
                        <div className="space-y-4 md:space-y-11">
                        {mockStats.categories.map((category, index) => (
                            <div key={index} className="space-y-1 md:space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm md:text-base font-medium">{category.name}</span>
                                <span className="text-sm md:text-base">{category.percentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden mt-3">
                                <div 
                                className="bg-[#D1376A] h-full rounded-full" 
                                style={{ width: `${category.percentage}%` }}
                                />
                            </div>
                            </div>
                        ))}
                        </div>
                    </CardContent>
                    </Card>
                </TabsContent>
                </Tabs>
            </div>
        </div>
        <div className='hidden md:block md:col-span-2'>
        {/* Right column content */}
        </div>
      </div>
    </div>
  )
}
                       
export default OverviewPage;