import { useState, useMemo } from "react"
import { useThemeMode } from "flowbite-react"
import { durationFormat } from "@/utils/helpers"

import Chart from "react-apexcharts"
import { Card } from "flowbite-react"
import { Tooltip } from "flowbite-react"
import { FaLaptopCode, FaHeart, FaUsers, FaMotorcycle, FaMusic, FaBroom, FaBed } from "react-icons/fa"

const cardTheme = {
    root: {
        base: "w-full rounded-xl border-none",
        children: "p-2",
    }
};

const iconMap = { FaLaptopCode, FaHeart, FaUsers, FaMotorcycle, FaMusic, FaBroom, FaBed };

export default function ChartSplineAreaCategory({ dataChartSplineAreaCategory }) {
    const { mode } = useThemeMode();
    const [filterSeries, setFilterSeries] = useState(dataChartSplineAreaCategory.map(item => item.categoryId));

    const options = {
        chart: {
            type: "bar",
            height: 260,
            width: "100%",
            foreColor: mode === "dark" ? "#FFFFFF" : "#000000",
            toolbar: { show: false }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '80%',
                borderRadius: 4,
                borderRadiusApplication: 'end'
            },
        },
        dataLabels: { enabled: false },
        grid: { show: false },
        xaxis: {
            categories: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]
        },
        yaxis: {
            title: { text: "Menit" },
            labels: {
                formatter: function (val) {
                    return durationFormat(val);
                }
            }
        },
        legend: { show: false },
        tooltip: { enabled: false }
    };

    const changeFilterSeries = (id) => {
        if (filterSeries.includes(id)) {
            setFilterSeries(filterSeries.filter(item => item !== id));
        } else {
            setFilterSeries([...filterSeries, id]);
        }
    };

    const filteredSeries = useMemo(() => {
        let result = dataChartSplineAreaCategory;

        if (filterSeries.length > 0) {
            result = dataChartSplineAreaCategory.filter(item => filterSeries.includes(item.categoryId));
        }

        return result;
    }, [filterSeries, dataChartSplineAreaCategory]);

    return (
        <Card theme={cardTheme}>
            <div className="flex justify-between p-3 pb-0">
                <h4 className="text-xl font-bold text-black dark:text-white">Grafik Kategori Per Minggu</h4>
                <div className="flex gap-4">
                    {
                        dataChartSplineAreaCategory.map((item, index) => {
                            const IconComponent = iconMap[item.categoryIcon];
                            return (
                                <Tooltip content={item.name} key={index}>
                                    <IconComponent
                                        className={`cursor-pointer text-xl text-${item.categoryColor} ${filterSeries.includes(item.categoryId) ? '' : 'opacity-40'}`}
                                        onClick={() => changeFilterSeries(item.categoryId)}
                                    />
                                </Tooltip>
                            )
                        })
                    }
                </div>
            </div>
            <Chart
                options={options}
                series={filteredSeries}
                type="bar"
                height={260}
                width={"100%"}
            />
        </Card>
    )
}