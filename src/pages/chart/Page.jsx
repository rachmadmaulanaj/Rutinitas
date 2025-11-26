import { useMemo } from "react"
import moment from '@/utils/momentConfig'
import { convertColorHexaCategory } from "@/utils/helpers"

import CardCalendar from '@/components/CardCalendar'
import ChartSplineAreaCategory from '@/pages/chart/components/ChartSplineAreaCategory'
import ChartDonutLocation from '@/pages/chart/components/ChartDonutLocation'
import ChartTimelineByActivity from '@/pages/chart/components/ChartTimelineByActivity'

export default function Page({ selectedDate, activities, categories, fullCalendarApi, setSelectedDate }) {
    /* memo */
    const dataChartSplineAreaCategory = useMemo(() => {
        const m = moment.tz(selectedDate, 'Asia/Jakarta');
        const startMonday = m.clone().startOf('isoWeek');
        const endSunday = m.clone().endOf('isoWeek');

        const result = [];
        [...categories].reverse().forEach(category => {
            const current = startMonday.clone();
            const data_total_duration = [];
            while (current.isSameOrBefore(endSunday, 'day')) {
                const activitiesDay = activities.filter(activity => moment(activity.start).format('YYYY-MM-DD') == current.format('YYYY-MM-DD'));
                const totalDuration = activitiesDay.filter(activity => activity.categoryId == category.id).reduce((acc, curr) => acc + curr.duration, 0);
                data_total_duration.push(totalDuration);
                current.add(1, 'day');
            }
            result.push({
                name: category.name,
                data: data_total_duration,
                color: convertColorHexaCategory(category.color),
                categoryId: category.id,
                categoryColor: category.color,
                categoryIcon: category.icon,
            });
        });

        return result;
    }, [activities, selectedDate]);

    const dataChartDonutLocation = useMemo(() => {
        const activitiesDay = activities.filter(activity => moment(activity.start).format('YYYY-MM-DD') == moment(selectedDate).format('YYYY-MM-DD'));
        return [...new Set(activitiesDay.map(activity => activity.location))].reduce((acc, location) => {
            const totalDuration = activitiesDay.filter(activity => activity.location == location).reduce((acc, curr) => acc + curr.duration, 0);
            acc.labels.push(location);
            acc.series.push(totalDuration);

            return acc;
        }, { labels: [], series: [] });
    }, [activities, selectedDate]);

    const dataChartTimelineByActivity = useMemo(() => {
        const activitiesDay = activities.filter(activity => moment(activity.start).format('YYYY-MM-DD') == moment(selectedDate).format('YYYY-MM-DD') || moment(activity.end).format('YYYY-MM-DD') == moment(selectedDate).format('YYYY-MM-DD'));

        const result = activitiesDay.length > 0 ? activitiesDay.map(activity => {
            return {
                id: activity.categoryId,
                name: activity.title,
                description: activity.description,
                x: activity.categoryName,
                y: [
                    moment(activity.start).valueOf(),
                    moment(activity.end).valueOf(),
                ],
                fillColor: convertColorHexaCategory(activity.categoryColor)
            };
        }) : categories.map(category => {
            return {
                id: category.id,
                name: '',
                description: '',
                x: category.name,
                y: [
                    moment(selectedDate).valueOf(),
                    moment(selectedDate).valueOf(),
                ],
                fillColor: convertColorHexaCategory(category.color)
            };
        });

        return [...result].sort((a, b) => a.id - b.id);
    }, [activities, selectedDate]);

    return (
        <div className="w-full h-full grid p-4">
            <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1">
                    <CardCalendar
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        fullCalendarApi={fullCalendarApi}
                    />
                </div>
                <div className="col-span-2">
                    <ChartSplineAreaCategory
                        dataChartSplineAreaCategory={dataChartSplineAreaCategory}
                    />
                </div>
                <div className="col-span-1">
                    <ChartDonutLocation
                        dataChartDonutLocation={dataChartDonutLocation}
                    />
                </div>
            </div>
            <div>
                <ChartTimelineByActivity
                    selectedDate={selectedDate}
                    dataChartTimelineByActivity={dataChartTimelineByActivity}
                />
            </div>
        </div>
    )
}