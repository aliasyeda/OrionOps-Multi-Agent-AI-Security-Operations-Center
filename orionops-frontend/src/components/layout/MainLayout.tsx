import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopNavbar } from './TopNavbar'

export function MainLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#060d18]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(37,99,235,0.12),_transparent_50%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(34,211,238,0.08),_transparent_50%)]" />
      <Sidebar />
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <TopNavbar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
