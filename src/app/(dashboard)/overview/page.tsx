'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Calendar } from "@/components/ui/calendar"
import { Info, Bell, Plus, Calendar as CalendarIcon, BarChart } from 'lucide-react';
import { format } from 'date-fns';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { motion, AnimatePresence, stagger } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: "easeInOut" }
  }
};

const scaleInVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 }
  }
};

interface DecisionCardProps {
  decision: Decision;
  index: number;
}

const DecisionCard: React.FC<DecisionCardProps> = ({ decision, index }) => {
  const getOutcomeStyles = (outcome: string) => {
    switch(outcome) {
      case 'Good':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Bad':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20, 
        delay: index * 0.05 
      }}
      whileHover={{ 
        scale: 1.05, 
        boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)"
      }}
      className='rounded-xl'
    >
      <Card className="h-48 w-full relative overflow-hidden my-2 mx-auto  ">
        <motion.div 
          className={`absolute top-0 right-0 px-2 py-1 text-xs font-medium rounded-bl-md ${getOutcomeStyles(decision.outcome)}`}
          initial={{ x: 50 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 17, delay: 0.2 + index * 0.05 }}
        >
          {decision.outcome}
        </motion.div>
        <CardHeader className="h-full w-full px-2 flex flex-col justify-between">
          <CardTitle className="text-sm m-auto text-center">{decision.title}</CardTitle>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            <span className="block">{decision.category}</span>
            <span className="block">{decision.date}</span>
          </div>
        </CardHeader>
      </Card>
    </motion.div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const UserAvatar: React.FC<{ user: any }> = ({ user }) => {
  const getUserInitials = () => {
    const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
    return name.split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.3 }}
      className="rounded-full overflow-hidden border-4 border-[#D1376A] w-16 h-16 sm:w-24 sm:h-24"
    >
      {user?.user_metadata?.avatar_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img 
          src={user.user_metadata.avatar_url} 
          alt="Profile picture" 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
          <span className="text-lg sm:text-xl font-bold">{getUserInitials()}</span>
        </div>
      )}
    </motion.div>
  );
};

// Quick Action Button Component
interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  index: number;
}

const QuickActionButton: React.FC<QuickActionProps> = ({ icon, label, href, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ 
      type: "spring", 
      stiffness: 300, 
      delay: 0.3 + index * 0.1 
    }}
    whileHover={{ 
      scale: 1.05, 
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
      backgroundColor: "rgba(209, 55, 106, 0.05)"
    }}
    className="rounded-md"
  >
    <Link href={href}>
      <Button 
        variant="outline" 
        className="h-12 sm:h-14 w-full flex items-center justify-start gap-2 border-2 border-[#D1376A]/20 hover:bg-[#D1376A]/10 hover:border-[#D1376A] transition-all px-2"
      >
        <motion.div 
          className="bg-[#D1376A]/20 p-1.5 rounded-full"
          whileHover={{ backgroundColor: "rgba(209, 55, 106, 0.4)" }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.div>
        <span className="text-xs sm:text-sm">{label}</span>
      </Button>
    </Link>
  </motion.div>
);

const OverviewPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [today] = React.useState(new Date())
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedTab, setSelectedTab] = useState("quick-stats");

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
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-lg font-medium text-[#D1376A]"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  
  const getOutcomeColor = (percentage: number) => {
    return percentage >= 50 ? 'text-[#319F43] dark:text-[#319F43]' : 'text-red-600 dark:text-red-400';
  };

  // Determine progress bar bg color
  const getProgressBarColor = (percentage: number) => {
    return percentage >= 50 ? 'bg-green-600 dark:bg-[#319F43]' : 'bg-red-600 dark:bg-[#319F43]';
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='pt-8 md:pt-12 px-3 sm:px-4 md:pl-10 md:pr-16 bg-background dark:bg-background overflow-y-auto h-full'
    >
      <div className='grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-10'>
        <div className='col-span-1 md:col-span-3 mt-2 sm:mt-3'>
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className='pt-4 sm:pt-9'
            >
                <motion.p 
                  variants={itemVariants}
                  className='font-medium text-xl md:text-2xl'
                >
                  Hello <motion.span 
                    className='text-[#D1376A]'
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      delay: 0.5, 
                      duration: 0.5,
                      type: "spring",
                      stiffness: 400
                    }}
                  >
                    {userName}!
                  </motion.span>
                </motion.p>
                <motion.p 
                  variants={itemVariants}
                  className='text-xl sm:text-2xl md:text-4xl font-semibold w-full lg:w-[500px] mt-3 sm:mt-5 md:mt-6 leading-tight lg:leading-[50px]'
                >
                  Ready to think through something today?
                </motion.p>
                
                {/* Quick Actions Section */}
                <motion.div 
                  variants={containerVariants}
                  className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full sm:w-[76%]"
                >
                  <QuickActionButton 
                    icon={<Plus className="h-3 w-3 text-[#D1376A]" />} 
                    label="New Decision" 
                    href="/new-decision"
                    index={0}
                  />
                  <QuickActionButton 
                    icon={<CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#D1376A]" />} 
                    label="View Reflections" 
                    href="/reflections"
                    index={1}
                  />
                  <QuickActionButton 
                    icon={<BarChart className="h-4 w-4 sm:h-5 sm:w-5 text-[#D1376A]" />} 
                    label="See Insights" 
                    href="/insights"
                    index={2}
                  />
                </motion.div>
                
                <motion.hr 
                  variants={itemVariants}
                  className='border-t-[1px] border-black/40 dark:border-white/40 mt-8 sm:mt-10 md:mt-12 w-full md:w-[76%]'
                />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-4 md:mt-10"
            >
                <Tabs 
                  defaultValue="quick-stats" 
                  className="w-full"
                  onValueChange={(value) => setSelectedTab(value)}
                >
                <TabsList className="bg-transparent gap-x-2 md:gap-x-5 text-black dark:text-white overflow-x-auto max-w-full py-7">
                    <motion.div
                      whileHover={{ y: -2 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <TabsTrigger 
                        value="quick-stats" 
                        className='text-xs sm:text-sm text-black/55 dark:text-white/55 data-[state=active]:bg-[#D1376A]/20 data-[state=active]:text-[#D1376A] dark:data-[state=active]:bg-[#D1376A]/20 dark:data-[state=active]:text-[#D1376A] data-[state=active]:rounded-md whitespace-nowrap'
                      >
                        Quick Stats
                      </TabsTrigger>
                    </motion.div>
                    <motion.div
                      whileHover={{ y: -2 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <TabsTrigger 
                        value="recent-decisions" 
                        className='text-xs sm:text-sm text-black/55 dark:text-white/55 data-[state=active]:bg-[#D1376A]/20 data-[state=active]:text-[#D1376A] dark:data-[state=active]:bg-[#D1376A]/20 dark:data-[state=active]:text-[#D1376A] whitespace-nowrap data-[state=active]:rounded-md'
                      >
                        Recent Decisions Timeline
                      </TabsTrigger>
                    </motion.div>
                    <motion.div
                      whileHover={{ y: -2 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <TabsTrigger 
                        value="top-categories" 
                        className='text-xs sm:text-sm text-black/55 dark:text-white/55 data-[state=active]:bg-[#D1376A]/20 data-[state=active]:text-[#D1376A] dark:data-[state=active]:bg-[#D1376A]/20 dark:data-[state=active]:text-[#D1376A] whitespace-nowrap data-[state=active]:rounded-md'
                      >
                        Top Categories
                      </TabsTrigger>
                    </motion.div>
                </TabsList>
                
                <AnimatePresence mode="wait">
                  <TabsContent key="quick-stats" value="quick-stats" className=''>
                    <motion.div
                      key="quick-stats"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className='border-0 shadow-none gap-4 sm:gap-6 bg-transparent w-full md:w-[68%]'>
                          <CardContent className="px-2 sm:px-6 mt-3 md:mt-5">
                            <motion.div 
                              initial="hidden"
                              animate="visible"
                              variants={containerVariants}
                              className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-6 md:gap-0 mb-6 sm:mb-8 md:mb-12"
                            >
                              <motion.div variants={itemVariants}>
                                  <p className="text-sm md:text-[15px] font-medium">Total Decisions <Info className='text-black/30 dark:text-white/30 w-[11px] h-[11px] inline ml-1 md:ml-3'/> </p>
                                  <motion.p 
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
                                    className="text-2xl sm:text-3xl md:text-5xl font-medium text-[#D1376A] mt-1 sm:mt-2 md:mt-2"
                                  >
                                    {mockStats.totalDecisions}
                                  </motion.p>
                              </motion.div>
                              <motion.div variants={itemVariants} className="mt-2 sm:mt-0">
                                  <p className="text-sm md:text-[15px] font-medium">Pending Reflections <Info className='text-black/30 dark:text-white/30 w-[11px] h-[11px] inline ml-1 md:ml-3'/></p>
                                  <motion.p 
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3, type: "spring", stiffness: 400 }}
                                    className="text-2xl sm:text-3xl md:text-5xl font-medium text-[#D1376A] mt-1 sm:mt-2 md:mt-2"
                                  >
                                    {mockStats.pendingReflections}
                                  </motion.p>
                              </motion.div>
                            </motion.div>
                            
                            <motion.div 
                              variants={containerVariants}
                              className="space-y-4 sm:space-y-6 md:space-y-8"
                            >
                                <motion.p variants={itemVariants} className="text-xs md:text-sm font-medium">
                                  Regret Analysis (% good Outcomes) <Info className='text-black/30 dark:text-white/30 w-[11px] h-[11px] inline ml-1 md:ml-3'/>
                                </motion.p>
                                <motion.span 
                                  variants={itemVariants}
                                  className={`text-xs md:text-sm font-medium ${getOutcomeColor(mockStats.goodOutcomePercentage)}`}
                                >
                                  {mockStats.goodOutcomePercentage}% Good Outcome
                                </motion.span>
                                <motion.div
                                  variants={itemVariants}
                                  className="mt-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden"
                                >
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${mockStats.goodOutcomePercentage}%` }}
                                    transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                                    className={`h-full ${getProgressBarColor(mockStats.goodOutcomePercentage)}`}
                                  />
                                </motion.div>
                            </motion.div>
                          </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>
                  
                  <TabsContent key="recent-decisions" value="recent-decisions">
                    <motion.div
                      key="recent-decisions"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="shadow-none border-0 bg-transparent mt-4 sm:mt-6">
                        <CardContent className='px-6'>
                          <Carousel className="w-[91%] md:w-[78%]">
                            <CarouselContent>
                              {mockDecisions.map((decision, index) => (
                                <CarouselItem key={decision.id} className="basis-1/2 md:basis-1/3 mx-0.5 md:mx-0">
                                  <DecisionCard decision={decision} index={index} />
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                            <div className="flex justify-center mt-2 sm:mt-4">
                              <CarouselPrevious className="mr-1" />
                              <CarouselNext />
                            </div>
                          </Carousel>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>
                  
                  <TabsContent key="top-categories" value="top-categories">
                    <motion.div
                      key="top-categories"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="border-0 bg-transparent shadow-none w-full sm:w-[70%] mt-4 sm:mt-8">
                        <CardContent className="px-2 sm:px-6">
                          <motion.div 
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                            className="space-y-3 sm:space-y-4 md:space-y-8"
                          >
                            {mockStats.categories.map((category, index) => (
                              <motion.div 
                                key={category.name}
                                variants={itemVariants}
                                custom={index}
                                className="space-y-1 md:space-y-2"
                              >
                                <div className="flex justify-between">
                                  <span className="text-sm md:text-base font-medium">{category.name}</span>
                                  <span className="text-sm md:text-base">{category.percentage}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden mt-2 sm:mt-3">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${category.percentage}%` }}
                                    transition={{ delay: 0.3 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                                    className="bg-[#D1376A] h-full rounded-full"
                                  />
                                </div>
                              </motion.div>
                            ))}
                          </motion.div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>
                </AnimatePresence>
                </Tabs>
            </motion.div>
        </div>
        {/* right content - for desktop only */}
        <div className='hidden md:block md:col-span-2 lg:mt-10'>
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className='grid grid-cols-1 h-[400px] gap-y-16'
          >
            {/* Profile Card */}
            <motion.div variants={scaleInVariants}>
              <Card className="p-6 relative h-[200px]">
                <div className="absolute top-6 right-6">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 15 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="bg-[#D1376A] rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"
                  >
                    <motion.div
                      animate={{ 
                        y: [0, -2, 0],
                        rotate: [0, 5, 0, -5, 0]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        repeatType: "reverse", 
                        ease: "easeInOut",
                        repeatDelay: 3
                      }}
                    >
                      <Bell className="text-white w-5 h-5" />
                    </motion.div>
                  </motion.div>
                </div>
                
                <div className="flex items-center mt-4">
                  <div className="relative">
                    <UserAvatar user={user} />
                  </div>
                  
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="ml-5"
                  >
                    <div className="flex items-center">
                      <h3 className="text-xl font-bold">{userName}</h3>
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.7, type: "spring", stiffness: 400 }}
                        className="w-1.5 h-1.5 rounded-full bg-[#D1376A] mx-3"
                      ></motion.div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {mockStats.pendingReflections} pending reflections
                    </p>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
            
            {/* Calendar Card */}
            <motion.div variants={scaleInVariants}>
              <Card className="p-6">
                <CardContent className="p-0 w-full">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="mb-4"
                  >
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.3 }}
                      className='flex items-center'
                    >
                      <span className="text-lg font-medium">{format(today, 'MMMM d, yyyy')}</span> 
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.7, type: "spring", stiffness: 400 }}
                        className="w-1.5 h-1.5 rounded-full bg-[#D1376A] ml-3"
                      />
                    </motion.div>
                    <motion.h2 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8, duration: 0.4 }}
                      className="text-2xl font-bold mt-2"
                    >
                      Today
                    </motion.h2>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="w-full border-0 p-0"
                      classNames={{
                        day_selected: "bg-[#D1376A] text-white hover:bg-[#D1376A] hover:text-white focus:bg-[#D1376A] focus:text-white",
                        day_today: "bg-[#D1376A]/20 text-[#D1376A]"
                      }}
                    />
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        {/* Mobile only - Profile Info */}
        <div className="block md:hidden mt-6 mb-8">
          <Card className="p-4 relative">
            <div className="flex items-center">
              <UserAvatar user={user} />
              <div className="ml-4">
                <div className="flex items-center">
                  <h3 className="text-lg font-bold">{userName}</h3>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D1376A] mx-2"></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {mockStats.pendingReflections} pending reflections
                </p>
              </div>
              <div className="ml-auto">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="bg-[#D1376A] rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
                >
                  <Bell className="text-white w-4 h-4" />
                </motion.div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
                       
export default OverviewPage;