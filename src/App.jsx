import { useState, useEffect } from 'react'
import moment from '@/utils/momentConfig'
import supabase from '@/lib/supabaseClient'

import Loader from '@/components/Loader'
import Header from '@/components/Header'
import PageAuth from '@/pages/auth/Page'
import PageCalendar from '@/pages/calendar/Page'
import PageChart from '@/pages/chart/Page'

import { getDataActivityByPeriod } from '@/services/activityService'
import { getDataCategory } from '@/services/categoryService'

function App() {
	const [page, setPage] = useState('');
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

	const checkSessionLocalStorage = async () => {
		const sessionData = localStorage.getItem('session_data');
		const sessionDataFormat = moment(sessionData, "YYYY-MM-DD HH:mm:ss");

		if (!sessionDataFormat.isValid()) {
			localStorage.removeItem('session_data');
			localStorage.removeItem('user_id');
			await supabase.auth.signOut();
			setPage('auth');
			return;
		}

		const now = moment();
		const diffInHours = now.diff(sessionDataFormat, 'hours');

		if (diffInHours >= 24) {
			localStorage.removeItem('session_data');
			localStorage.removeItem('user_id');
			await supabase.auth.signOut();
			setPage('auth');
			return;
		}

		localStorage.setItem('session_data', now.format("YYYY-MM-DD HH:mm:ss"));
		setPage('calendar');
	};

	/* useEffect */
	useEffect(() => {
		checkSessionLocalStorage();
	}, []);

	useEffect(() => {
		if (page !== 'calendar' && page !== 'chart') return;
		loadDataCategory();
	}, [page]);

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

	if (page === '') return <Loader />;
	if (page === 'auth') return <PageAuth setPage={setPage} />;
	if (page === 'calendar' || page === 'chart') {
		return (
			<div className='w-full h-screen flex flex-col bg-gray-100 dark:bg-gray-700'>
				<Header
					page={page}
					setPage={setPage}
				/>

				{page === 'calendar' ? (
					<PageCalendar
						selectedDate={selectedDate}
						activities={activities}
						categories={categories}
						fullCalendarApi={fullCalendarApi}
						setSelectedDate={setSelectedDate}
						setFullCalendarApi={setFullCalendarApi}
						loadDataActivity={loadDataActivity}
					/>
				) : null}
				{page === 'chart' ? (
					<PageChart
						selectedDate={selectedDate}
						activities={activities}
						categories={categories}
						fullCalendarApi={fullCalendarApi}
						setSelectedDate={setSelectedDate}
					/>
				) : null}

			</div>
		)
	}

	return null;
}

export default App