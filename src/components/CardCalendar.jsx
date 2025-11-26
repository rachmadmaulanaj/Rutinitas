import { Card } from "flowbite-react"
import { Datepicker } from "flowbite-react"

const cardTheme = {
    root: {
        base: "w-full rounded-xl border-none",
        children: "px-2 py-0",
    }
};
const datePickerTheme = {
    root: {
        base: "relative w-full text-center",
    },
    popup: {
        root: {
            inline: "w-full",
            inner: "w-full border-none shadow-none dark:bg-gray-800",
        },
        footer: {
            base: "hidden",
        }
    },
    views: {
        days: {
            items: {
                base: "w-full",
                item: {
                    selected: "bg-primary text-white hover:bg-primary-dark",
                }
            }
        },
        months: {
            items: {
                base: "w-full",
            }
        },
        years: {
            items: {
                base: "w-full",
            }
        },
        decades: {
            items: {
                base: "w-full",
            }
        }
    }
};

export default function CardCalendar({ selectedDate, setSelectedDate, fullCalendarApi }) {
    const key = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}`;

    return (
        <Card theme={cardTheme}>
            <Datepicker
                inline
                key={key}
                theme={datePickerTheme}
                weekStart={1}
                language="id"
                value={selectedDate}
                dayClassName={(date) => {
                    const today = moment();
                    const mDate = moment(date);

                    const isToday = mDate.isSame(today, "day");
                    if (isToday) {
                        return "bg-blue-100 text-blue-700 font-semibold rounded-full";
                    }

                    return "";
                }}
                onChange={(date) => {
                    setSelectedDate(date);
                    if (fullCalendarApi) {
                        fullCalendarApi.gotoDate(date);
                    }
                }}
            />
        </Card>
    )
}