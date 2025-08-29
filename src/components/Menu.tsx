import { NavLink, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import { Home, Languages, LayoutDashboard, LogOut, User2 } from "lucide-react";
import { Button } from "./ui/button"
import { useAuth } from "../contexts/dataplatform/AuthContext";
import Logo from '../assets/logo.png'
import { Tooltip as ShadcnTooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "../../node_modules/react-i18next";

const Menu = () => {
    const { t, i18n } = useTranslation();
    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang)
    };

    const { clearSession, session } = useAuth();
    const [isDashboardOpen, setIsDashboardOpen] = useState(false);
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);
    const dropdownRef = useRef(null);
    const languagesRef = useRef(null);
    const location = useLocation();
    const isOnDashboardPath = location.pathname.startsWith('/dashboard');

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (dropdownRef.current && !(dropdownRef.current as any).contains(event.target)) {
                setIsDashboardOpen(false);
            }
            if (languagesRef.current && !(languagesRef.current as any).contains(event.target)) {
                setIsLanguageOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <nav id="menu" className="flex items-center justify-between p-1 lg:p-4 bg-gray-100 rounded-xl shadow-md">
            <div className="flex items-center gap-2 lg:gap-6">
                <img id="menu-logo" src={Logo} alt="Logo" className="w-7 lg:w-10" title="OVHCloud Dataplatform" />
                <div className="flex gap2 lg:gap-4">
                    <NavLink id="menu-item-home" to="/" className={({ isActive }) => cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                        isActive ? "bg-primary text-white" : "hover:bg-gray-200"
                    )}>
                        <Home className="w-5 h-5" />
                        {t('menu.home')}
                    </NavLink>

                    <NavLink id="menu-item-dashboard-one" to="/dashboard/one"
                        className={({ isActive }) => cn(
                            "items-center gap-2 px-4 py-2 rounded-lg transition-colors hidden md:flex",
                            isActive ? "bg-primary text-white" : "hover:bg-gray-200"
                        )}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard One
                    </NavLink>

                    <NavLink id="menu-item-dashboard-two" to="/dashboard/two"
                        className={({ isActive }) => cn(
                            "items-center gap-2 px-4 py-2 rounded-lg transition-colors hidden md:flex",
                            isActive ? "bg-primary text-white" : "hover:bg-gray-200"
                        )}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard Two
                    </NavLink>

                    <div className="relative md:hidden" ref={dropdownRef}>
                        <button
                            id="menu-dashboards-btn"
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-gray-200 w-full lg:w-auto ${isOnDashboardPath ? 'bg-black text-white' : ''}`}
                            onClick={() => setIsDashboardOpen(!isDashboardOpen)}
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            Dashboards
                        </button>
                        <div
                            id="menu-dashboards-submenu"
                            className={`z-100 absolute left-0 w-full mt-2 bg-white shadow-md rounded-lg ${isDashboardOpen ? 'block' : 'hidden'}`}
                        >
                            <NavLink
                                id="menu-dashboards-one"
                                onClick={() => setIsDashboardOpen(false)}
                                to="/dashboard/one"
                                className={({ isActive }) => cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                                    isActive ? "bg-primary text-white" : "hover:bg-gray-200"
                                )}
                            >
                                Dashboard One
                            </NavLink>
                            <NavLink
                                id="menu-dashboards-two"
                                onClick={() => setIsDashboardOpen(false)}
                                to="/dashboard/two"
                                className={({ isActive }) => cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                                    isActive ? "bg-primary text-white" : "hover:bg-gray-200"
                                )}
                            >
                                Dashboard Two
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <ShadcnTooltip>
                    <TooltipTrigger className="mr-2 hidden md:inline" id="menu-userinfo-btn">
                        <User2 />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[50vw] text-xs whitespace-pre-wrap text-center">
                        {session?.login}
                    </TooltipContent>
                </ShadcnTooltip>

                <div className="relative inline-block" ref={languagesRef}>
                    <button
                        id="menu-i18n-btn"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-gray-200 w-full lg:w-auto"
                        onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                    >
                        <Languages />
                    </button>
                    <div
                        id="menu-i18n-submenu"
                        className={`z-100 absolute p-0 left-0 w-full mt-2 bg-white shadow-md rounded-lg ${isLanguageOpen ? 'block' : 'hidden'}`}
                    >
                        <button id="menu-i18n-submenu-en" type="button" className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${i18n.resolvedLanguage == 'en' ? 'bg-primary text-white' : "hover:bg-gray-200"}`} onClick={() => changeLanguage('en')}>En</button>
                        <button id="menu-i18n-submenu-fr" type="button" className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${i18n.resolvedLanguage == 'fr' ? 'bg-primary text-white' : "hover:bg-gray-200"}`} onClick={() => changeLanguage('fr')}>Fr</button>
                    </div>
                </div>

                <Button id="menu-logout-btn" variant="destructive" className="flex items-center gap-2 cursor-pointer" onClick={() => clearSession()}>
                    <LogOut className="w-5 h-5" />

                    <span className="hidden md:inline">
                        {t('menu.logout')}
                    </span>
                </Button>
            </div>
        </nav>

    );
};

export default Menu;
