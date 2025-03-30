import  SidebarComponent  from "../../components/layout/Sidebar";

export default function DashboardPage() {
    return (
      <div className="flex h-screen bg-gray-100">
        <SidebarComponent />
        <h1 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h1>
        <p>This is the main dashboard overview.</p>
      </div>
    );
  }
  