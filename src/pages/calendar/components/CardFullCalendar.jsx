import { useState, useEffect, useRef } from "react"

import { Card } from "flowbite-react"
import { Label, Checkbox } from "flowbite-react"
import GlobalTooltip from "@/components/GlobalTooltip"

import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import listPlugin from "@fullcalendar/list"

export default function Calendar({ events, setFullCalendarApi, selectedDate, setSelectedDate, setFilterPrimary, onSetValueModal }) {
    const calendarRef = useRef(null);
    const checkboxRef = useRef(null);

    useEffect(() => {
        if (calendarRef.current) {
            const api = calendarRef.current.getApi();
            setFullCalendarApi(api);

            api.gotoDate(selectedDate);

            const buttonEl = document.querySelector('.fc-filterPrimaryCheckbox-button');
            if (buttonEl && checkboxRef.current && !buttonEl.querySelector('input')) {
                buttonEl.classList.remove('fc-button', 'fc-button-primary');
                buttonEl.innerHTML = '';
                buttonEl.appendChild(checkboxRef.current);
            }
        }
    }, []);

    const handleCheckboxChange = (e) => {
        setFilterPrimary(e.target.checked);
    };

    /* Tooltip */
    const [tooltipData, setTooltipData] = useState({ text: "", pos: null });
    const showTooltip = (text, x, y) => {
        setTooltipData({ text, pos: { x, y } });
    };
    const hideTooltip = () => {
        setTooltipData({ text: "", pos: null });
    };

    return (
        <Card className="w-full h-full rounded-xl border-none">
            <div className="p-4">
                <div ref={checkboxRef}>
                    <Checkbox id="primary" onChange={handleCheckboxChange} className="dark:checked:!bg-gray-700" />
                    <Label htmlFor="primary"> Utama</Label>
                </div>
                <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
                    initialView="timeGridDay"
                    locale="id"
                    customButtons={{
                        prevButton: {
                            text: "Prev",
                            icon: 'chevron-left',
                            click: () => {
                                calendarRef.current.getApi().prev();
                                setSelectedDate(calendarRef.current.getApi().view.currentStart);
                            },
                        },
                        nextButton: {
                            text: "Next",
                            icon: 'chevron-right',
                            click: () => {
                                calendarRef.current.getApi().next();
                                setSelectedDate(calendarRef.current.getApi().view.currentStart);
                            },
                        },
                        newEventButton: {
                            text: 'Agenda Baru',
                            click: () => { onSetValueModal(); }
                        },
                        filterPrimaryCheckbox: {
                            text: '',
                        },
                    }}
                    headerToolbar={{
                        left: "prevButton,nextButton newEventButton filterPrimaryCheckbox",
                        center: "title",
                        right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
                    }}
                    buttonText={{
                        today: 'Hari Ini',
                        month: 'Bulan',
                        week: 'Minggu',
                        day: 'Hari',
                        list: 'Daftar'
                    }}
                    listDayFormat={{ weekday: 'long' }}
                    listDaySideFormat={{ day: 'numeric', month: 'long', year: 'numeric' }}
                    events={events}
                    eventClick={(info) => {
                        const result = {
                            datestart: info.event.start,
                            dateend: info.event.end,
                            name: info.event.title,
                            description: info.event.extendedProps.description,
                            category: info.event.extendedProps.categoryId,
                            location: info.event.extendedProps.location,
                            primary: info.event.extendedProps.primary,
                            idEdit: info.event.id,
                        };
                        onSetValueModal(result);
                    }}
                    eventDidMount={(info) => {
                        const description = info.event.extendedProps.description;
                        if (!description) return;

                        // Mouse enter → show tooltip
                        info.el.addEventListener("mouseenter", (e) => {
                            showTooltip(description, e.clientX, e.clientY);
                        });
                        // Mouse move → continuously update tooltip position
                        info.el.addEventListener("mousemove", (e) => {
                            showTooltip(description, e.clientX, e.clientY);
                        });
                        // Mouse leave → hide tooltip
                        info.el.addEventListener("mouseleave", hideTooltip);
                    }}
                    selectable={true}
                    editable={false}
                    height="calc(100vh - 180px)"
                    slotDuration="00:10:00"
                    slotLabelInterval="01:00:00"
                    slotMinTime="00:00:00"
                    slotMaxTime="24:00:00"
                    firstDay={1}
                    allDaySlot={false}
                    dayMaxEventRows={4}
                    showNonCurrentDates={false}
                    fixedWeekCount={false}
                />
            </div>

            <GlobalTooltip text={tooltipData.text} pos={tooltipData.pos} />
        </Card>
    );
}