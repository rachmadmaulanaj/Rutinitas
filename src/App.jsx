import { useState, useEffect } from 'react'
import moment from '@/utils/momentConfig'

import Header from '@/components/Header'
import PageCalendar from '@/pages/calendar/Page'
import PageChart from '@/pages/chart/Page'

import { getDataActivityByPeriod } from '@/services/activityService'
import { getDataCategory } from '@/services/categoryService'

function App() {
	const [page, setPage] = useState('calendar');
	const [selectedDate, setSelectedDate] = useState(moment().toDate());
	const [fullCalendarApi, setFullCalendarApi] = useState(null);
	const [period, setPeriod] = useState({ month: moment().format('M'), year: moment().format('YYYY') });
	const [activities, setActivities] = useState([]);
	const [categories, setCategories] = useState([]);

	/* function get data */
	const loadDataCategory = async () => {
		try {
			const dataCategories = await getDataCategory();
			setCategories(dataCategories);
		} catch (error) {
			console.error('Error fetching categories:', error);
		}
	};

	const loadDataActivity = async () => {
		try {
			const dataActivities = await getDataActivityByPeriod(period.month, period.year);
			const categoriesMap = new Map(categories.map(category => [category.id, category]));

			const result = dataActivities.map((activity) => {
				const category = categoriesMap.get(activity.category_id);
				const start = moment(activity.datestart, 'YYYY-MM-DD HH:mm');
				const end = moment(activity.dateend, 'YYYY-MM-DD HH:mm');
				return {
					id: activity.id,
					title: activity.name,
					description: activity.description ?? '',
					location: activity.location ?? '',
					start: start.format('YYYY-MM-DDTHH:mm:ss'),
					end: end.format('YYYY-MM-DDTHH:mm:ss'),
					classNames: [`bg-${category?.color} text-white border-${category?.color}`],
					categoryId: activity.category_id,
					categoryName: category?.name,
					categoryColor: category?.color,
					categoryIcon: category?.icon,
					duration: end.diff(start, 'minutes'),
					primary: activity.primary,
				};
			});
			if (result) setActivities(result);
		} catch (error) {
			console.error('Error fetching activities:', error);
		}
	};

	/* useEffect */
	useEffect(() => {
		loadDataCategory();
	}, []);

	useEffect(() => {
		if (!selectedDate) return;

		const month = moment(selectedDate).format('M');
		const year = moment(selectedDate).format('YYYY');

		if (month === period.month && year === period.year) return;
		setPeriod({ month, year });
	}, [selectedDate]);

	useEffect(() => {
		if (categories.length === 0) return;

		loadDataActivity();
	}, [period, categories]);

	return (
		<div className='w-full h-screen flex flex-col bg-gray-100 dark:bg-gray-700'>
			<Header
				page={page}
				setPage={setPage}
			/>

			{
				page == 'calendar' ? (
					<PageCalendar
						selectedDate={selectedDate}
						activities={activities}
						categories={categories}
						fullCalendarApi={fullCalendarApi}
						setSelectedDate={setSelectedDate}
						setFullCalendarApi={setFullCalendarApi}
						loadDataActivity={loadDataActivity}
					/>) : ''
			}
			{
				page == 'chart' ? (
					<PageChart
						selectedDate={selectedDate}
						activities={activities}
						categories={categories}
						fullCalendarApi={fullCalendarApi}
						setSelectedDate={setSelectedDate}
					/>) : ''
			}

		</div>
	)
}

export default App