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

export default function ChartDonutLocation({ dataChartDonutLocation }) {
    const { mode } = useThemeMode();

    const options = {
        chart: {
            type: "donut",
            height: 270,
            width: "100%",
            foreColor: mode === "dark" ? "#FFFFFF" : "#000000",
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '60%',
                    labels: {
                        show: true,
                        value: {
                            show: true,
                            formatter: function (val) {
                                return durationFormat(val);
                            }
                        },
                        total: {
                            show: true,
                            formatter: function (w) {
                                const total = w.globals.seriesTotals.reduce((total, num) => total + num, 0);
                                return durationFormat(total);
                            }
                        }
                    },
                }
            },
        },
        labels: dataChartDonutLocation.labels,
        yaxis: { show: true },
        fill: { opacity: 1 },
        stroke: { show: false },
        tooltip: { enabled: false },
        dataLabels: { enabled: true },
        legend: {
            show: true,
            position: "bottom",
            labels: {
                useSeriesColors: true,
            },
        },
    };

    const series = dataChartDonutLocation.series;

    return (
        <Card theme={cardTheme}>
            <div className="flex justify-between p-3 pb-0">
                <h4 className="text-xl font-bold text-black dark:text-white">Grafik Lokasi Per Hari</h4>
            </div>
            <Chart
                options={options}
                series={series}
                type="donut"
                height={270}
                width={"100%"}
            />
        </Card>
    )
}