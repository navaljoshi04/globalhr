
import { Search, Bell, Gift, ChevronDown, PanelLeft } from "lucide-react";

const Header = ({ onToggleSidebar }) => {
  return (
    <header className="h-14 bg-white border-b border-gusto-border px-3 sm:px-6 flex items-center justify-between sticky top-0 z-10 w-full">

      <div className="flex items-center gap-2 sm:gap-4 flex-1 max-w-md mr-2">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
          className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer shrink-0"
        >
          <PanelLeft className="w-5 h-5 text-gray-600" />
        </button>

 
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-9 pr-3 sm:pr-4 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-gusto-teal focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3 text-gray-500 shrink-0">
        <button
          type="button"
          aria-label="Rewards and Offers"
          className="hidden md:block p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
        >
          <Gift className="w-5 h-5" />
        </button>

        <button
          type="button"
          aria-label="Notifications"
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
        >
          <Bell className="w-5 h-5" />
        </button>


        <button
          type="button"
          className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-gray-200 hover:opacity-80 transition-opacity text-left cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 shrink-0">
            RS
          </div>
          <div className="text-xs hidden md:block">
            <p className="font-bold text-gray-900 leading-none">
              Regina Spektor
            </p>
            <p className="text-gray-400 mt-0.5 truncate max-w-[130px]">
              Neil, Chris, and Randy
            </p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </header>
  );
};

export default Header;