import { useState } from 'react'
import { FaBars } from 'react-icons/fa6'
import Sidebar from "./Sidebar"
import { Outlet } from 'react-router-dom'

// Student Dashboard
export default function AdminDashboard() {
  const [open, setOpen] = useState(true)


  return (
    <div className='flex w-full max-h-screen min-h-screen bg-slate-50 '
      style={{ scrollbarWidth: "none" }}>
      <div
        className={`max-md:z-50 absolute min-h-full ${open ? "translate-x-0 flex-1  min-w-[270px] z-50" : "max-md:-translate-x-[130%] transition-all  w-[60px] "
          } bg-white md:sticky top-0  border border-zinc-300  border-opacity-30
           max-w-[200px] rounded-xl m-2 shadow-xl 
          py-4 px-2 transition-transform duration-300 ease-in-out`}
      >

        <Sidebar open={open} setOpen={setOpen} />

      </div>

      {/* Dashboard Content */}
      <div className='relative flex-1 mx-2 my-2 overflow-hidden overflow-y-auto bg-slate-50' style={{ scrollbarWidth: "none" }}>

        {/* Topbar */}
        <div className='sticky top-0 z-40 flex items-center justify-between px-4 bg-white border rounded-md shadow-xl h-14 border-zinc-300 border-opacity-30'>


          <div className='flex items-center gap-3'>
            <FaBars
              onClick={() => setOpen((prev) => !prev)}
              className='cursor-pointer  hover:text-slate-500' />
            {/* <h1 className='text-xl font-bold'>{sideTab}</h1> */}
          </div>


        </div>


        {/* Main Area */}
        <div className='w-full min-h-full px-1 mt-6 overflow-x-hidden overflow-y-auto bg-slate-50' >

          <Outlet />

        </div>

        <div>

        </div>

      </div>

    </div>
  )
}