import { NavLink } from "react-router-dom";
import {
  Home,
  Users,
  CreditCard,
  Receipt,
  Clock,
  Heart,
  FileCheck,
  FileText,
  BarChart3,
  GraduationCap,
  UserPlus,
  TrendingUp,
  Percent,
  Headphones,
} from "lucide-react";

const Sidebar = ({ showSidebar }) => {
  const navItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Employee", icon: Users, path: "/employee" },
    { name: "Pay", icon: CreditCard, path: "/pay" },
    { name: "Expenses", icon: Receipt, path: "/expenses" },
    { name: "Time & attendance", icon: Clock, path: "/attendance" },
    { name: "Benefits", icon: Heart, path: "/benefits" },
    { name: "Taxes & compliance", icon: FileCheck, path: "/taxes" },
    { name: "Documents", icon: FileText, path: "/documents" },
    { name: "Reports", icon: BarChart3, path: "/reports" },
    { name: "Learning", icon: GraduationCap, path: "/learning" },
    { name: "Recruiting", icon: UserPlus, path: "/recruiting" },
    { name: "Performance", icon: TrendingUp, path: "/performance" },
    { name: "Tax incentives", icon: Percent, path: "/tax-incentives" },
    { name: "HR resources", icon: Headphones, path: "/hr-resources" },
  ];

  return (
    <aside
      className={`
        fixed top-0 bottom-0 left-0 z-30 h-full transition-all duration-300
        ${showSidebar ? "translate-x-0 w-60" : "-translate-x-full w-60"}
        md:translate-x-0 md:relative md:z-auto
        ${showSidebar ? "md:w-60" : "md:w-16"}
        flex flex-col shrink-0 bg-[#F4F5F7] border-r border-gray-200/60 select-none
      `}
    >
      {/* Top Logo Section */}
      <div className="h-14 flex items-center justify-center px-4">
        {showSidebar ? (
          <span className="text-2xl font-extrabold text-[#E05638] tracking-tight w-full">
            simplyhr
          </span>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-[#E05638] text-white flex items-center justify-center font-black text-lg">
            s
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-2 py-1 space-y-1">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              title={!showSidebar ? item.name : undefined}
              className={({ isActive }) =>
                `flex items-center transition-all py-2.5 rounded-lg text-sm ${
                  showSidebar ? "gap-3 px-3 justify-start" : "justify-center px-0"
                } ${
                  isActive
                    ? "text-[#0E8388] font-semibold bg-emerald-50/70"
                    : "text-gray-600 hover:bg-gray-200/50 hover:text-gray-900 font-normal"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <IconComponent
                    className={`transition-all ${
                      showSidebar ? "w-4 h-4" : "w-5 h-5"
                    } ${isActive ? "text-[#0E8388]" : "text-gray-500"}`}
                  />
                  {showSidebar && <span>{item.name}</span>}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;