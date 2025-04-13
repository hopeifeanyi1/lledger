//src/components/store/DashboardSide.tsx
'use client'
import React, { useState } from 'react'
import { SIDENAV_ITEMS } from '@/constants'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { Bars } from './Icon';
import { Sheet, SheetContent, SheetClose, SheetTrigger, SheetHeader, SheetTitle } from "../ui/sheet";
import { SideNavItem } from '@/types';

const DashboardSide = () => {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  const regularLinks = SIDENAV_ITEMS.filter(item => item.id < 6);
  const bottomLinks = SIDENAV_ITEMS.filter(item => item.id >= 6);

  const isPathActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleLinkClick = (item: SideNavItem) => {
    setIsSheetOpen(false);
  };

  const renderLink = (item: SideNavItem, inMobileView: boolean = false) => {
    const linkContent = (
      <div className={`flex items-center font-medium hover:bg-secondary/70 px-3 py-2 rounded-md transition-colors  ${
        item.path === pathname ? 'text-[#D1376A]' : 'text-foreground'
      }`}>
        <span className="mr-3">{item.icon}</span>
        <span className="font-normal">{item.title}</span>
      </div>
    );

    if (item.id === 8) {
      return inMobileView ? (
        <SheetClose key={item.id} asChild>
          <div onClick={() => handleLinkClick(item)}>
            {linkContent}
          </div>
        </SheetClose>
      ) : (
        <div key={item.id} onClick={() => handleLinkClick(item)}>
          {linkContent}
        </div>
      );
    }

    // Regular navigation link
    return inMobileView ? (
      <SheetClose key={item.id} asChild>
        <Link 
          href={item.path} 
          className={`flex items-center font-medium hover:bg-secondary/70 px-3 py-2 rounded-md transition-colors ${
            isPathActive(item.path) ? 'bg-secondary text-[#D1376A]' : 'text-foreground'
          }`} 
          onClick={() => handleLinkClick(item)}
        >
          <span className="mr-3">{item.icon}</span>
          <span className="font-normal">{item.title}</span>
        </Link>
      </SheetClose>
    ) : (
      <div key={item.id}>
        <Link
          href={item.path}
          className={`flex items-center font-medium hover:bg-secondary/70 px-3 py-2 rounded-md transition-colors ${
            item.path === pathname ? 'bg-secondary text-[#D1376A]' : 'text-foreground'
          }`}
        >
          <span className="mr-3">{item.icon}</span>
          <span className="font-normal">{item.title}</span>
        </Link>
      </div>
    );
  };

  return (
    <div>
      {/*Desktop view*/}
      <div className='w-[220px] h-[calc(100vh-50px)] flex-col justify-between hidden lg:flex '>
        <div>
          <div className="mt-5">
            <h1 className="text-2xl font-semibold text-[#D1376A] mb-[100px]">Life<span className="text-foreground">Ledger</span></h1>
            <nav className="flex-1 flex flex-col justify-between">
              <div className="flex flex-col space-y-6">
                {regularLinks.map((item) => renderLink(item))}
              </div>
            </nav>
          </div>
        </div>
        
        <div className="mt-auto">
          <div className="pt-6 mt-6 border-t border-border">
            <nav className="flex flex-col space-y-4">
              {bottomLinks.map((item) => renderLink(item))}
            </nav>
          </div>
        </div>
      </div>
      {/*mobile view*/}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger className="lg:hidden block">
            <Bars className="w-7 h-7" />
          </SheetTrigger>
          <SheetContent side="left" className="w-64 sm:w-80 transition-transform duration-300">
            <SheetHeader>
              <SheetTitle></SheetTitle>
            </SheetHeader>
            
            <div className="">
              <h1 className="text-2xl font-semibold text-[#D1376A] mb-16">Life<span className="text-foreground">Ledger</span></h1>
              <nav className="flex-1 flex flex-col justify-between">
                <div className="flex flex-col space-y-8">
                  {regularLinks.map((item) => renderLink(item, true))}
                </div>
              </nav>
            </div>
            <div className="mt-auto">
              <div className="pt-9 mt-7 border-t border-border">
                <nav className="flex-1 flex flex-col justify-between">
                  <div className="flex flex-col space-y-6">
                    {bottomLinks.map((item) => renderLink(item, true))}
                  </div>
                </nav>
              </div>
            </div>
          </SheetContent>
        </Sheet>
    </div>
  )
}

export default DashboardSide