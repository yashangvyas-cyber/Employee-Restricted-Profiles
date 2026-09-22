/* Outer layout: header / sidebar / content column / right quick-link rail.
   All class strings COPIED from modules/people/dom/employee_listing.html. */
import Header from './Header'
import Sidebar from './Sidebar'
import Breadcrumb from './Breadcrumb'

export default function AppShell({ breadcrumb = [], children, bare = false }) {
  return (
    <div className="main overflow-hidden relative">
      <div className="h-full">
        <div className="w-full">
          <Header />
          <main className="relative flex">
            <Sidebar />
            <div className="w-full bg-gray-100 p-0 overflow-x-auto overflow-y-hidden main-content-area">
              <div className="relative">
                <div className="w-[webkit-fill-available] h-full">
                  <Breadcrumb items={breadcrumb} />
                  {bare ? children : (
                    <div className="2xl:p-4 p-3 w-full bg-gray-100 overflow-x-auto customScrollbar 2xl:h-[calc(100vh-98px)] 2xl-to-xl:h-[calc(100vh-86px)] h-[calc(100vh-86px)]">
                      {children}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* right quick-link rail */}
            <div className="z-50 2xl:w-[65px] 2xl-to-xl:w-[52px] w-[52px] 2xl:flex-[0_0_65px] 2xl-to-xl:flex-[0_0_52px] flex-[0_0_52px] relative">
              <div className="absolute right-0">
                <div className="bg-gray-50 2xl:w-[65px] 2xl-to-xl:w-[52px] w-[52px] duration-300 relative min-h-full border-l border-gray-200 flex-shrink-0 flex flex-col justify-between 2xl:h-[calc(100vh-60px)] 2xl-to-xl:h-[calc(100vh-52px)] h-[calc(100vh-52px)]">
                  <nav className="overflow-y-auto p-2 overflow-x-hidden h-auto">
                    <div className="text-indigo-700 flex items-center gap-x-3 cursor-pointer justify-center border-t pt-2">
                      <span className="icon-plus border bg-indigo-100 2xl:p-4 2xl-to-xl:p-2 p-2 rounded-lg 2xl:text-lg 2xl-to-xl:text-base text-base 2xl:size-10 2xl-to-xl:size-8 size-8 flex justify-center items-center" />
                    </div>
                  </nav>
                  <div className="group flex items-center 2xl:p-[18px] 2xl-to-xl:p-[13px] p-[13px] gap-x-2 2xl:text-sm 2xl-to-xl:text-xs text-xs leading-6 font-semibold whitespace-nowrap bg-gray-100 text-indigo-200 cursor-pointer justify-center">
                    <span className="2xl:text-2xl 2xl-to-xl:text-xl text-xl block text-gray-500 icon-chevron-left-double" />
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
