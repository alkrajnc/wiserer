import { Link } from "@tanstack/react-router";
import React, { type ReactNode } from "react";

interface SidebarProps {
  children?: React.ReactNode;
}

export const Sidebar = ({ children }: SidebarProps) => {
  return (
    <div className="flex flex-col bg-secondary/40 h-full w-80 space-y-12 p-4 py-6 border">
      <div className="flex flex-row gap-3 items-center px-3">
        <img src="/wiserer_light.svg" width={36} height={36} />
        <h1 className="text-4xl font-black">Wiserer</h1>
      </div>
      {children}
    </div>
  );
};

interface SidebarCategoryProps {
  children?: React.ReactNode;
  name?: string;
}
export const SidebarCategory: React.FC<SidebarCategoryProps> = ({
  children,
  name,
}) => {
  return (
    <div className="">
      <p className="px-3 font-semibold text-muted-foreground mb-1">{name}</p>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
};

interface SidebarItemProps {
  children?: ReactNode;
  href?: string;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ children, href }) => {
  if (href) {
    return (
      <Link to={href}>
        <div className="flex flex-row items-center gap-2 px-3 py-1 hover:bg-neutral-700 rounded-lg">
          {children}
        </div>
      </Link>
    );
  }
  return (
    <div className="flex flex-row items-center gap-2 px-3 py-1 hover:bg-neutral-700 rounded-lg">
      {children}
    </div>
  );
};

export default Sidebar;
