import React, { type ReactNode } from "react";

interface SidebarProps {
    children?: React.ReactNode;
}

export const Sidebar = ({ children }: SidebarProps) => {
    return (
        <div className="flex flex-col bg-secondary h-full w-92 space-y-12 p-4">
            {children}
        </div>
    );
};

interface SidebarCategoryProps {
    children?: React.ReactNode;
    name?: string;
}
export const SidebarCategory: React.FC<SidebarCategoryProps> = (
    { children, name },
) => {
    return (
        <div className="">
            <p className="px-3 font-semibold text-muted-foreground">
                {name}
            </p>
            <div className="flex flex-col ">{children}</div>
        </div>
    );
};

interface SidebarItemProps {
    children?: ReactNode;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ children }) => {
    return (
        <div className=" flex flex-row items-center gap-2 px-3 py-2 hover:bg-neutral-700 rounded-lg">
            {children}
        </div>
    );
};

export default Sidebar;
