import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react"
import { Label, Datepicker, Textarea, Select, TextInput, Checkbox } from "flowbite-react"
import { FaClock } from "react-icons/fa"
import moment from "moment"

const datePickerTheme = {
    root: {
        base: "relative",
        input: {
            field: {
                input: {
                    base: "!rounded-r-none",
                }
            }
        }
    },
    popup: {
        root: {
            inner: 'ring-2 ring-gray-200 dark:ring-gray-600 '
        },
        footer: {
            base: "hidden",
        }
    },
    views: {
        days: {
            items: {
                item: {
                    selected: "bg-primary text-white hover:bg-primary-dark",
                }
            }
        },
    }
};

export default function ModalFormInput({ openModal, setOpenModal, categories, formData, formError, onChangeInput, onSubmitForm }) {
    return (
        <Modal show={openModal} size="3xl" onClose={() => setOpenModal(false)}>
            <ModalHeader>{formData.idEdit == 0 ? "Tambah Aktivitas" : `Edit Aktivitas ID ${formData.idEdit}`}</ModalHeader>
            <ModalBody className="overflow-visible">
                <form
                    className="flex flex-col gap-3"
                    onSubmit={(e) => { e.preventDefault(); onSubmitForm(); }}
                >
                    <div className="flex flex-row gap-3">
                        <div className="w-full">
                            <div className="mb-2 block">
                                <Label htmlFor="date-start">Tanggal & Waktu Awal</Label>
                            </div>
                            <div className="flex flex-row">
                                <div className="flex-3">
                                    <Datepicker
                                        weekStart={1}
                                        language="id"
                                        theme={datePickerTheme}
                                        value={formData.datestart}
                                        onChange={(date) => onChangeInput('datestart', date)}
                                        color={formError.includes('date') ? "failure" : undefined}
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 end-3 top-0 flex items-center pe-3.5 pointer-events-none">
                                            <FaClock className="text-gray-400" />
                                        </div>
                                        <input
                                            type="time"
                                            className={`rounded-l-none border border-top leading-none  text-sm rounded-lg block p-2.5 ${formError.includes('date') ? "bg-red-50 text-red-900 border-red-500 focus:ring-red-500 dark:bg-red-100 dark:placeholder-red-400 dark:focus:ring-red-500" : "bg-gray-50 text-gray-900 border-gray-300 focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"}`}
                                            value={moment(formData.datestart).format("HH:mm")}
                                            onChange={(e) => onChangeInput('timestart', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full">
                            <div className="mb-2 block">
                                <Label htmlFor="date-end">Tanggal & Waktu Akhir</Label>
                            </div>
                            <div className="flex flex-row">
                                <div className="flex-3">
                                    <Datepicker
                                        weekStart={1}
                                        language="id"
                                        theme={datePickerTheme}
                                        value={formData.dateend}
                                        onChange={(date) => onChangeInput('dateend', date)}
                                        color={formError.includes('date') ? "failure" : undefined}
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 end-3 top-0 flex items-center pe-3.5 pointer-events-none">
                                            <FaClock className="text-gray-400" />
                                        </div>
                                        <input
                                            type="time"
                                            className={`rounded-l-none border border-top leading-none  text-sm rounded-lg block p-2.5 ${formError.includes('date') ? "bg-red-50 text-red-900 border-red-500 focus:ring-red-500 dark:bg-red-100 dark:placeholder-red-400 dark:focus:ring-red-500" : "bg-gray-50 text-gray-900 border-gray-300 focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"}`}
                                            value={moment(formData.dateend).format("HH:mm")}
                                            onChange={(e) => onChangeInput('timeend', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="mb-2 block">
                            <Label htmlFor="name">Nama</Label>
                        </div>
                        <TextInput
                            type="input"
                            placeholder="Nama"
                            value={formData.name}
                            onChange={(e) => onChangeInput('name', e.target.value)}
                            color={formError.includes('name') ? "failure" : undefined}
                        />
                    </div>
                    <div className="w-full">
                        <div className="mb-2 block">
                            <Label htmlFor="description">Deskripsi</Label>
                        </div>
                        <Textarea
                            placeholder="Deskripsi"
                            rows={4}
                            value={formData.description}
                            onChange={(e) => onChangeInput('description', e.target.value)}
                            color={formError.includes('description') ? "failure" : undefined}
                        />
                    </div>
                    <div className="flex flex-row gap-3">
                        <div className="w-full">
                            <div className="mb-2 block">
                                <Label htmlFor="category">Kategori</Label>
                            </div>
                            <Select
                                value={formData.category}
                                onChange={(e) => onChangeInput('category', e.target.value)}
                                color={formError.includes('category') ? "failure" : undefined}
                            >
                                <option value={0}>Pilih Kategori</option>
                                {
                                    [...categories].reverse().map((category) => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))
                                }
                            </Select>
                        </div>
                        <div className="w-full">
                            <div className="mb-2 block">
                                <Label htmlFor="location">Lokasi</Label>
                            </div>
                            <TextInput
                                type="input"
                                placeholder="Lokasi"
                                value={formData.location}
                                onChange={(e) => onChangeInput('location', e.target.value)}
                                color={formError.includes('location') ? "failure" : undefined}
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="primary">Utama</Label>
                            </div>
                            <Checkbox id="primary" checked={formData.primary} onChange={(e) => onChangeInput('primary', e.target.checked)} />
                        </div>
                    </div>
                </form>
            </ModalBody>
            <ModalFooter className="justify-end">
                <Button className="bg-primary hover:bg-primary-dark" onClick={() => onSubmitForm()}>Submit</Button>
                <Button color="alternative" onClick={() => setOpenModal(false)}>
                    Batal
                </Button>
            </ModalFooter>
        </Modal>
    )
}