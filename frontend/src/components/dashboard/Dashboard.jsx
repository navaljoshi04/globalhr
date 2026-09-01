import {
  DollarSign,
  ArrowUpRight,
  Users,
  Building2,
  Clock,
  TrendingUp,
  Calendar,
  Briefcase,
  PartyPopperIcon,
} from "lucide-react";

const Dashboard = () => {
  const birthdayData = [
    {
      id: 1,
      name: "Antwon Schaefer",
      role: "Software Developer",
      avatar: "https://i.pravatar.cc/150?img=11",
    },
    {
      id: 2,
      name: "Mr. Amos Hills",
      role: "HR Manager",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    {
      id: 3,
      name: "Prof. Caitlyn Hermiston",
      role: "IT Manager",
      avatar: "https://i.pravatar.cc/150?img=13",
    },
    {
      id: 4,
      name: "Dr. Juana Stehr",
      role: "IT Manager",
      avatar: "https://i.pravatar.cc/150?img=14",
    },
    {
      id: 5,
      name: "Rae McGlynn",
      role: "IT Manager",
      avatar: "https://i.pravatar.cc/150?img=15",
    },
    {
      id: 6,
      name: "Sarah Connor",
      role: "DevOps Engineer",
      avatar: "https://i.pravatar.cc/150?img=16",
    },
    {
      id: 7,
      name: "John Doe",
      role: "Frontend Developer",
      avatar: "https://i.pravatar.cc/150?img=17",
    },
    {
      id: 8,
      name: "Jane Smith",
      role: "UI/UX Designer",
      avatar: "https://i.pravatar.cc/150?img=18",
    },
    {
      id: 9,
      name: "Alex Turner",
      role: "QA Engineer",
      avatar: "https://i.pravatar.cc/150?img=19",
    },
    {
      id: 10,
      name: "Michael Scott",
      role: "Regional Manager",
      avatar: "https://i.pravatar.cc/150?img=20",
    },
  ];
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Good afternoon!
        </h2>
        <p className="text-slate-500 mt-1 text-sm sm:text-base font-medium">
          Overview of company stats, attendance and{" "}
          <span className="font-semibold text-slate-900">Recent activity</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: Payroll */}
        <div className="bg-[#f0fbf7] border border-[#bcebd8] rounded-2xl p-5 flex flex-col justify-between space-y-4 relative">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#cbf3e4] flex items-center justify-center text-[#0d7a5f]">
              <DollarSign className="w-5 h-5 stroke-[2.5]" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-[#0d7a5f]/60" />
          </div>

          <div>
            <p className="text-sm font-semibold text-[#0d7a5f]">
              Payroll This Month
            </p>
            <h3 className="text-3xl font-extrabold text-[#0a4d3c] mt-1">
              $125,000.00
            </h3>
            <p className="text-xs font-medium text-[#0d7a5f] mt-2">
              3 runs completed
            </p>
          </div>
        </div>

        <div className="bg-[#f0f4ff] border border-[#d6e2ff] rounded-2xl p-5 flex flex-col justify-between space-y-4 relative">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#dbe6ff] flex items-center justify-center text-[#2554d7]">
              <Users className="w-5 h-5 stroke-[2.5]" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-[#2554d7]/60" />
          </div>

          <div>
            <p className="text-sm font-semibold text-[#2554d7]">
              Total Employees
            </p>
            <h3 className="text-3xl font-extrabold text-[#142d7a] mt-1">12</h3>
            <div className="flex items-center gap-1 text-xs font-medium text-[#0d7a5f] mt-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>12 this month</span>
            </div>
          </div>
        </div>

        <div className="bg-[#f0fbf7] border border-[#bcebd8] rounded-2xl p-5 flex flex-col justify-between space-y-4 relative">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#cbf3e4] flex items-center justify-center text-[#0d7a5f]">
              <Building2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-[#0d7a5f]/60" />
          </div>

          <div>
            <p className="text-sm font-semibold text-[#0d7a5f]">Branches</p>
            <h3 className="text-3xl font-extrabold text-[#0a4d3c] mt-1">9</h3>
            <p className="text-xs font-medium text-[#0d7a5f] mt-2">
              25 departments
            </p>
          </div>
        </div>

        {/* Card 4: Attendance Rate */}
        <div className="bg-[#f7f5ff] border border-[#e2daff] rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div className="w-10 h-10 rounded-xl bg-[#ece4ff] flex items-center justify-center text-[#6e3aff]">
            <Clock className="w-5 h-5 stroke-[2.5]" />
          </div>

          <div>
            <p className="text-sm font-semibold text-[#6e3aff]">
              Attendance Rate
            </p>
            <h3 className="text-3xl font-extrabold text-[#31117d] mt-1">
              85.5%
            </h3>

            {/* Progress Bar */}
            <div className="w-full bg-[#e8e0ff] rounded-full h-2 mt-4 overflow-hidden">
              <div
                className="bg-[#6e3aff] h-full rounded-full"
                style={{ width: "85.5%" }}
              />
            </div>
          </div>
        </div>

        {/* Card 5: Pending Leaves */}
        <div className="bg-[#fffdf0] border border-[#fceea7] rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#fef5c7] flex items-center justify-center text-[#c27803]">
              <Calendar className="w-5 h-5 stroke-[2.5]" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-[#c27803]/60" />
          </div>

          <div>
            <p className="text-sm font-semibold text-[#c27803]">
              Pending Leaves
            </p>
            <h3 className="text-3xl font-extrabold text-[#7a4900] mt-1">11</h3>
            <p className="text-xs font-medium text-[#c27803] mt-2">
              1 on leave today
            </p>
          </div>
        </div>

        {/* Card 6: Active Jobs */}
        <div className="bg-[#fffaf3] border border-[#ffe1c6] rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#ffebd7] flex items-center justify-center text-[#d96b27]">
              <Briefcase className="w-5 h-5 stroke-[2.5]" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-[#d96b27]/60" />
          </div>

          <div>
            <p className="text-sm font-semibold text-[#d96b27]">Active Jobs</p>
            <h3 className="text-3xl font-extrabold text-[#8a3804] mt-1">13</h3>
            <div className="flex items-center gap-1 text-xs font-medium text-[#0d7a5f] mt-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>15 this month</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="border border-pink-200 bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex justify-between items-center p-5 border-b border-gray-100">
            <div>
              <h2 className="font-bold text-lg text-slate-900">
                Today's Birthdays
              </h2>
              <p className="text-sm text-slate-400 mt-0.5 font-normal">
                Celebrate with your team
              </p>
            </div>

            <div className="w-10 h-10 bg-pink-100/70 rounded-xl flex items-center justify-center text-lg">
              <PartyPopperIcon className="text-pink-400" />
            </div>
          </div>
          <div className="p-5 space-y-4 max-h-[350px] overflow-y-auto custom-scrollbar">
            {birthdayData.map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-11 h-11 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-slate-800 text-sm leading-tight">
                    {user.name}
                  </h4>
                  <p className="text-xs text-slate-400 font-medium">
                    {user.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-yellow-200 bg-white rounded-2xl shadow-sm overflow-hidden ">
          <div className="flex justify-between items-center p-5 border-b border-gray-100 ">
            <div className="flex flex-col ">
              <h2 className="text-md font-semibold ">Today's Leave </h2>
              <h5 className="text-sm font-thin text-gray-400 ">
                Employee on leave today{" "}
              </h5>
            </div>
            <button className="flex w-10 h-10 justify-center items-center bg-yellow-50 ">
              <Calendar className="text-yellow-400" />
            </button>
          </div>
          <div className="p-5 space-y-5 max-h-[350px] overflow-y-auto ">
            {birthdayData.map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-11 h-11 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-slate-800 text-sm leading-tight">
                    {user.name}
                  </h4>
                  <p className="text-xs text-slate-400 font-medium">
                    {user.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
