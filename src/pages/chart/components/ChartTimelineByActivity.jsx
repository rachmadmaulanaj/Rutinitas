import moment from "moment"
import { useThemeMode } from "flowbite-react"
import { durationFormat } from "@/utils/helpers"

import Chart from "react-apexcharts"
import { Card } from "flowbite-react"

const cardTheme = {
    root: {
        base: "w-full rounded-xl border-none",
        children: "p-2",
    }
};

export default function ChartTimelineByActivity({ selectedDate, dataChartTimelineByActivity }) {
    const currentDate = moment(selectedDate);
    const { mode } = useThemeMode();

    const options = {
        chart: {
            type: "rangeBar",
            height: 380,
            width: "100%",
            foreColor: mode === "dark" ? "#FFFFFF" : "#000000",
            toolbar: { show: false },
            zoom: { enabled: false },
        },
        plotOptions: {
            bar: {
                horizontal: true,
            }
        },
        xaxis: {
            type: "datetime",
            min: moment(`${currentDate.format('YYYY-MM-DD')} 00:00:00`).valueOf(),
            max: moment(`${currentDate.format('YYYY-MM-DD')} 23:59:59`).valueOf(),
            labels: {
                datetimeUTC: false,
                format: "HH:mm",
            },
            title: { text: "Waktu (Jam)" },
        },
        yaxis: {
            title: { text: "Kategori" },
        },
        tooltip: {
            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                const data = w.config.series[seriesIndex].data[dataPointIndex];
                const start = moment(data.y[0]);
                const end = moment(data.y[1]);
                const diff_minutes_formated = durationFormat(end.diff(start, 'minutes'));

                return `<div class="flex flex-col items-center w-full p-3 text-black bg-gray-100 rounded-lg shadow-sm dark:text-white dark:bg-gray-700">
                    <div class="flex flex-row gap-3 items-center">
                        <div>${data.name}</div>
                        <div>${start.format("HH:mm")} - ${end.format("HH:mm")} (${diff_minutes_formated})</div>
                    </div>
                    <div>${data.description}</div>
                </div>`;
            }
        },
    };

    const series = [{ data: dataChartTimelineByActivity }];

    return (
        <Card theme={cardTheme}>
            <div className="flex justify-between p-3 pb-0">
                <h4 className="text-xl font-bold text-black dark:text-white">Grafik Timeline Aktivitas Per Hari</h4>
            </div>
            <Chart
                options={options}
                series={series}
                type="rangeBar"
                height={380}
                width={"100%"}
            />
        </Card>
    )
}