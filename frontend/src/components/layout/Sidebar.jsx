
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
    { name: "Home", icon: Home },
    { name: "People", icon: Users },
    { name: "Pay", icon: CreditCard },
    { name: "Expenses", icon: Receipt },
    { name: "Time & attendance", icon: Clock },
    { name: "Benefits", icon: Heart, active: true },
    { name: "Taxes & compliance", icon: FileCheck },
    { name: "Documents", icon: FileText },
    { name: "Reports", icon: BarChart3 },
    { name: "Learning", icon: GraduationCap },
    { name: "Recruiting", icon: UserPlus },
    { name: "Performance", icon: TrendingUp },
    { name: "Tax incentives", icon: Percent },
    { name: "HR resources", icon: Headphones },
  ];

  return (
    <aside
      className={`
        /* Mobile Positioning: Fixed drawer overlay */
        fixed top-0 bottom-0 left-0 z-30 h-full transition-all duration-300
        ${showSidebar ? "translate-x-0 w-60" : "-translate-x-full w-60"}

        /* Desktop Positioning (md and up): Inline layout behavior */
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
            <a
              key={item.name}
              href="#"
              title={!showSidebar ? item.name : undefined}
              className={`flex items-center transition-all py-2.5 rounded-lg text-sm ${
                showSidebar ? "gap-3 px-3 justify-start" : "justify-center px-0"
              } ${
                item.active
                  ? "text-[#0E8388] font-semibold bg-emerald-50/70"
                  : "text-gray-600 hover:bg-gray-200/50 hover:text-gray-900 font-normal"
              }`}
            >
              <IconComponent
                className={`transition-all ${
                  showSidebar ? "w-4 h-4" : "w-5 h-5"
                } ${item.active ? "text-[#0E8388]" : "text-gray-500"}`}
              />
              {showSidebar && <span>{item.name}</span>}
            </a>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;