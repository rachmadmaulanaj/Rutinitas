import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react"
import { DarkThemeToggle } from "flowbite-react"
import { FaCalendarAlt, FaChartArea } from "react-icons/fa"

export default function Header({ page, setPage }) {
    return (
        <Navbar className='w-full'>
            <NavbarBrand href="#">
                <img src="/logo.png" className="mr-3 h-6 sm:h-9" alt="Rutinitas Logo" />
                <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Rutinitas</span>
            </NavbarBrand>
            <div className="flex md:order-2">
                <DarkThemeToggle />
                <NavbarToggle />
            </div>
            <NavbarCollapse>
                <NavbarLink
                    href="#"
                    className="flex flex-row items-center"
                    active={page == 'calendar'}
                    onClick={() => setPage('calendar')}
                >
                    <FaCalendarAlt />
                    <span className="text-xl font-bold ml-3">Kalender</span>
                </NavbarLink>
                <NavbarLink
                    href="#"
                    className="flex flex-row items-center"
                    active={page == 'chart'}
                    onClick={() => setPage('chart')}
                >
                    <FaChartArea />
                    <span className="text-xl font-bold ml-3"> Grafik</span>
                </NavbarLink>
            </NavbarCollapse>
        </Navbar>
    )
}