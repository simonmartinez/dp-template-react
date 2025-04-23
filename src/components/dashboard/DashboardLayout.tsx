import { createContext, ReactNode, useContext, useState } from "react";
import { Button } from "../ui/button";
import { Filter, X } from "lucide-react";

type DashboardLayoutContextType = {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
};

const DashboardLayoutContext = createContext<DashboardLayoutContextType | undefined>(undefined);

type DashboardLayoutProps = {
    children: ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

    return (
        <DashboardLayoutContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
            <div id="dashboard-layout" className="flex h-screen">
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black opacity-50 lg:hidden z-1"
                        onClick={toggleSidebar}
                    ></div>
                )}

                {children}
            </div>;
        </DashboardLayoutContext.Provider>
    )
};

type SectionProps = {
    children: ReactNode;
};

const useDashboardLayout = () => {
    const context = useContext(DashboardLayoutContext);
    if (!context) {
        throw new Error("useDashboardLayout must be used within a DashboardLayout");
    }
    return context;
};

DashboardLayout.Left = ({ children }: SectionProps) => {
    const { isSidebarOpen, toggleSidebar } = useDashboardLayout();

    return (
        <div
            id="dashboard-sidebar"
            className={`fixed inset-y-0 left-0 z-50 w-5/6 bg-gray-800 p-4 text-white transition-transform lg:relative md:w-3/5 lg:w-1/3 xl:w-1/4 lg:max-w-none lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
        >
            <Button className='absolute top-4 right-4 text-white lg:hidden'
                onClick={toggleSidebar}
            >
                <X />
            </Button>
            {children}
        </div>
    )
};

DashboardLayout.Right = ({ children }: SectionProps) => {
    const { toggleSidebar } = useDashboardLayout();

    return <div className="flex-1 p-4" id="dashboard-main">
        <Button className="lg:hidden" onClick={toggleSidebar}>
            <Filter />Filtres
        </Button>

        {children}
    </div>;
};

export default DashboardLayout;

