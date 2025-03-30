import  SidebarComponent  from "../../components/layout/Sidebar";

export default function DashboardPage() {
    return (
      <div className="text-gray-800">
        <SidebarComponent></SidebarComponent>
        <h1 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h1>
        {/* Add your dashboard components here */}
        <p>This is the main dashboard overview.</p>
      </div>
    );
  }
  