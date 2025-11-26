import moment from "moment"
import 'moment/dist/locale/id'

import { Card } from "flowbite-react"
import { Timeline, TimelineItem, TimelinePoint, TimelineContent, TimelineTime, TimelineTitle } from "flowbite-react"
import { FaLaptopCode, FaHeart, FaUsers, FaMotorcycle, FaMusic, FaBroom, FaBed } from "react-icons/fa"

const cardTheme = {
    root: {
        base: "w-full rounded-xl border-none",
        children: "p-4",
    }
};

const iconMap = { FaLaptopCode, FaHeart, FaUsers, FaMotorcycle, FaMusic, FaBroom, FaBed };

export default function CardCurrentActivity({ currentActivity }) {
    if (!currentActivity) {
        return (
            <Card theme={cardTheme}>
                <h4 className='text-xl font-bold text-black dark:text-white'>Aktivitas Terkini</h4>
                <p className="text-black dark:text-white">Belum ada aktivitas sekarang.</p>
            </Card>
        )
    }

    moment.locale('id');
    const IconComponent = iconMap[currentActivity.categoryIcon];
    const startDate = moment(currentActivity.start).format('D MMMM YYYY');
    const startTime = moment(currentActivity.start).format('HH:mm');
    const endTime = moment(currentActivity.end).format('HH:mm');

    return (
        <Card theme={cardTheme}>
            <h4 className='text-xl font-bold text-black dark:text-white'>Aktivitas Terkini</h4>
            <Timeline>
                <TimelineItem className="mb-0">
                    <TimelinePoint />
                    <TimelineContent>
                        <TimelineTime>{startDate} ({startTime} - {endTime})</TimelineTime>
                        <TimelineTitle>
                            <div className="flex flex-row items-center gap-3">
                                <IconComponent className={`text-2xl text-${currentActivity.categoryColor}`} />
                                <span>{currentActivity.title}</span>
                            </div>
                        </TimelineTitle>
                    </TimelineContent>
                </TimelineItem>
            </Timeline>
        </Card>
    )
}