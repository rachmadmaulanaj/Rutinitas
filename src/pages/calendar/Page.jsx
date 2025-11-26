import { useState, useEffect, useMemo } from "react"
import moment from "moment"
import Swal from "sweetalert2"

import CardCalendar from '@/components/CardCalendar'
import CardCategory from '@/pages/calendar/components/CardCategory'
import CardCurrentActivity from '@/pages/calendar/components/CardCurrentActivity'
import CardFullCalendar from '@/pages/calendar/components/CardFullCalendar'
import ModalFormInput from '@/pages/calendar/components/ModalFormInput'

import { addActivity, updateActivity, deleteActivity } from '@/services/activityService'

export default function Page({ selectedDate, activities, categories, fullCalendarApi, setSelectedDate, setFullCalendarApi, loadDataActivity }) {
    /* state */
    const [openModal, setOpenModal] = useState(false);
    const [formData, setFormData] = useState({
        datestart: moment().toDate(),
        dateend: moment().toDate(),
        name: '',
        description: '',
        category: 0,
        location: '',
        primary: false,
        idEdit: 0
    });
    const [formError, setFormError] = useState([]);
    const [filterPrimary, setFilterPrimary] = useState(false);

    /* memo */
    const categoryDuration = useMemo(() => {
        const result = [];
        const activitiesDay = activities.filter(activity => moment(activity.start).format('YYYY-MM-DD') == moment(selectedDate).format('YYYY-MM-DD'));
        [...categories].reverse().forEach(category => {
            const totalDuration = activitiesDay.filter(activity => activity.categoryId == category.id).reduce((acc, curr) => acc + curr.duration, 0);
            result.push({
                categoryId: category.id,
                categoryName: category.name,
                categoryColor: category.color,
                categoryIcon: category.icon,
                totalDuration: totalDuration,
            });
        });
        return result;
    }, [activities, selectedDate, categories]);

    const filterPrimaryActivities = useMemo(() => {
        const filterActivities = filterPrimary ? activities.filter(activity => activity.primary === filterPrimary) : activities;
        return filterActivities;
    }, [activities, filterPrimary]);

    const currentActivity = useMemo(() => {
        if (!activities || activities.length === 0) return null;

        const now = moment();
        const upcomingEvents = activities.filter(activity => moment(activity.end).isSameOrAfter(now));
        upcomingEvents.sort((a, b) => moment(a.end).diff(moment(b.end)));
        return upcomingEvents[0];
    }, [activities]);

    /* function handler */
    const handleSetValueModal = (data = null) => {
        clearFormInput();
        setFormError([]);
        if (data) setFormData(data);
        setOpenModal(true);
    };

    const handleChangeInput = (name, value) => {
        if (name === 'datestart' || name === 'dateend' || name === 'timestart' || name === 'timeend') {
            let date_value = name.includes('start') ? formData.datestart : formData.dateend;
            let hour = 0, minute = 0;
            if (name === 'datestart' || name === 'dateend') {
                [hour, minute] = moment(date_value).format('HH:mm').split(':');
                date_value = value;
            }
            if (name === 'timestart' || name === 'timeend') {
                [hour, minute] = value.split(':');
                name = name.includes('start') ? 'datestart' : 'dateend';
            }
            value = moment(date_value).set({ hour: parseInt(hour), minute: parseInt(minute), second: 0 }).toDate();
        }

        setFormData({ ...formData, [name]: value });
    }

    const handleSubmitForm = () => {
        if (moment(formData.dateend).isBefore(moment(formData.datestart), "minute")) {
            alertForm('date', 'Tanggal akhir harus lebih besar dari tanggal awal');
            return;
        }
        if (!formData.name) {
            alertForm('name', 'Nama harus diisi');
            return;
        }
        if (formData.category === 0) {
            alertForm('category', 'Kategori harus diisi');
            return;
        }
        if (!formData.location) {
            alertForm('location', 'Lokasi harus diisi');
            return;
        }

        setFormError([]);
        handleSave();
    }

    const handleSave = async () => {
        Swal.fire({
            title: 'Proses menyimpan data...',
            text: 'Silakan tunggu',
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => { Swal.showLoading(); }
        });

        const dataInput = {
            datestart: moment(formData.datestart).seconds(0).format('YYYY-MM-DD HH:mm:ss'),
            dateend: moment(formData.dateend).seconds(0).format('YYYY-MM-DD HH:mm:ss'),
            name: formData.name,
            description: formData.description,
            category_id: formData.category,
            location: formData.location,
            primary: formData.primary
        };

        try {
            if (formData.idEdit) {
                const resultEdit = await updateActivity(formData.idEdit, dataInput);
                if (resultEdit.error) throw resultEdit.error;
            } else {
                const resultAdd = await addActivity(dataInput);
                if (resultAdd.error) throw resultAdd.error;
            }

            Swal.fire({
                icon: 'success',
                title: `Berhasil ${formData.idEdit ? 'mengedit' : 'menambah'} data`,
                showConfirmButton: true,
            }).then(() => {
                setOpenModal(false);
                clearFormInput();
                loadDataActivity();
            });
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            Swal.fire({
                icon: 'error',
                title: 'Gagal menyimpan data',
                text: error.message,
                showConfirmButton: true,
            });
            return false;
        }
    }

    /* function helper */
    const alertForm = (input, text) => {
        setFormError([input]);
        return Swal.fire({ icon: 'error', text: text });
    }

    const clearFormInput = () => {
        setFormData({
            datestart: moment().toDate(),
            dateend: moment().toDate(),
            name: '',
            description: '',
            category: 0,
            location: '',
            primary: false,
            idEdit: 0
        });
    }

    return (
        <>
            <div className="w-full h-full grid grid-cols-4 grid-rows-1 gap-4 p-4">
                <div className="col-span-1 flex flex-col gap-4">
                    <CardCalendar
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        fullCalendarApi={fullCalendarApi}
                    />

                    <CardCategory
                        categoryDuration={categoryDuration}
                    />

                    <CardCurrentActivity
                        currentActivity={currentActivity}
                    />
                </div>
                <div className="col-span-3">
                    <CardFullCalendar
                        events={filterPrimaryActivities}
                        setFullCalendarApi={setFullCalendarApi}
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        setOpenModal={setOpenModal}
                        setFilterPrimary={setFilterPrimary}
                        onSetValueModal={handleSetValueModal}
                        loadDataActivity={loadDataActivity}
                    />
                </div>
            </div>

            <ModalFormInput
                openModal={openModal}
                setOpenModal={setOpenModal}
                categories={categories}
                formData={formData}
                formError={formError}
                onChangeInput={handleChangeInput}
                onSubmitForm={handleSubmitForm}
            />
        </>
    )
}