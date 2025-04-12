import { JSX } from "react";

export interface IconProps {
    className?: string;
  }

export type SideNavItem = {
  id: number,
  title: string;
  path: string;
  icon?: JSX.Element;
  submenu?: boolean;
  subItems?: SideNavItem[];
  }