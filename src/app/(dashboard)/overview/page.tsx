//src/app/(dashboard)/overview/page.tsx
'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

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
  <Card className="h-40">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg">{decision.title}</CardTitle>
      <CardDescription>{decision.category} • {decision.date}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className={`px-2 py-1 rounded-full inline-block text-sm ${
        decision.outcome === "Good" ? "bg-green-100 text-green-800" : 
        decision.outcome === "Bad" ? "bg-red-100 text-red-800" : 
        "bg-yellow-100 text-yellow-800"
      }`}>
        {decision.outcome} outcome
      </div>
    </CardContent>
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

  return (
    <div className='pt-12 px-10'>
      <div className='grid grid-cols-5'>
        <div className='col-span-3'>
            <div className=''>
                <p className='font-medium text-2xl'>Hello <span className='text-[#D1376A]'>{userName}!</span></p>
                <p className='text-5xl font-bold w-[500px] mt-10 leading-[50px]'>Here&apos;s your current decision landscape!</p>
                <hr className='border-t-[1px] border-black/40 mt-20 w-[450px]'/>
            </div>
            <div className="mt-10">
                <Tabs defaultValue="quick-stats" className="w-full">
                <TabsList className="mb-6 bg-transparent">
                    <TabsTrigger value="quick-stats" className='bg-[#D1376A]'>Quick Stats Cards</TabsTrigger>
                    <TabsTrigger value="recent-decisions">Recent Decisions</TabsTrigger>
                    <TabsTrigger value="top-categories">Top Categories</TabsTrigger>
                </TabsList>
                
                <TabsContent value="quick-stats">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className=''>
                        <CardHeader>
                        <CardTitle>Decision Statistics</CardTitle>
                        </CardHeader>
                        <CardContent>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                            <p className="text-sm text-gray-500">Total Decisions</p>
                            <p className="text-3xl font-bold">{mockStats.totalDecisions}</p>
                            </div>
                            <div>
                            <p className="text-sm text-gray-500">Pending Reflections</p>
                            <p className="text-3xl font-bold">{mockStats.pendingReflections}</p>
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <div className="flex justify-between">
                            <span className="text-sm font-medium">Regret Analysis (Good Outcomes)</span>
                            <span className="text-sm font-medium">{mockStats.goodOutcomePercentage}%</span>
                            </div>
                            <Progress 
                            value={mockStats.goodOutcomePercentage} 
                            className={`h-2 ${mockStats.goodOutcomePercentage > 50 ? "bg-gray-200" : "bg-gray-200"}`}
                            >
                            <div 
                                className={`h-full ${mockStats.goodOutcomePercentage > 50 ? "bg-green-500" : "bg-red-500"}`} 
                                style={{ width: `${mockStats.goodOutcomePercentage}%` }}
                            />
                            </Progress>
                        </div>
                        </CardContent>
                    </Card>
                    </div>
                </TabsContent>
                
                <TabsContent value="recent-decisions">
                    <Card>
                    <CardHeader>
                        <CardTitle>Recent Decisions</CardTitle>
                        <CardDescription>Your last 10 recorded decisions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Carousel className="w-full">
                        <CarouselContent>
                            {mockDecisions.map((decision) => (
                            <CarouselItem key={decision.id} className="md:basis-1/3 pl-4">
                                <DecisionCard decision={decision} />
                            </CarouselItem>
                            ))}
                        </CarouselContent>
                        <div className="flex justify-center mt-4">
                            <CarouselPrevious className="mr-2" />
                            <CarouselNext />
                        </div>
                        </Carousel>
                    </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="top-categories">
                    <Card>
                    <CardHeader>
                        <CardTitle>Top Categories</CardTitle>
                        <CardDescription>Distribution of your decisions by category</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                        {mockStats.categories.map((category, index) => (
                            <div key={index} className="space-y-2">
                            <div className="flex justify-between">
                                <span className="font-medium">{category.name}</span>
                                <span>{category.percentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
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
        <div className='col-span-2'>
        
        </div>
      </div>

      
    </div>
  )
}

export default OverviewPage;