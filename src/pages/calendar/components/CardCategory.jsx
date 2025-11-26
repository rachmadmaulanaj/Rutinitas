import { durationFormat } from "@/utils/helpers"

import { Card, ListGroup, ListGroupItem } from "flowbite-react"
import { FaLaptopCode, FaHeart, FaUsers, FaMotorcycle, FaMusic, FaBroom, FaBed } from "react-icons/fa"

const cardTheme = {
    root: {
        base: "w-full rounded-xl border-none",
        children: "p-4",
    }
};
const listGroupTheme = {
    base: "text-md border-none shadow-none dark:bg-gray-800",
};

const iconMap = { FaLaptopCode, FaHeart, FaUsers, FaMotorcycle, FaMusic, FaBroom, FaBed };

export default function CardCategory({ categoryDuration }) {
    return (
        <Card theme={cardTheme}>
            <h4 className='text-xl font-bold text-black dark:text-white'>Kategori</h4>
            <ListGroup theme={listGroupTheme}>
                {
                    categoryDuration.map((item) => {
                        const IconComponent = iconMap[item.categoryIcon];
                        return (<ListGroupItem key={item.categoryId} icon={() => <IconComponent className={`text-2xl text-${item.categoryColor}`} />}>
                            <div className="ml-3 flex justify-between w-full text-sm">
                                <span>{item.categoryName}</span>
                                <span>{durationFormat(item.totalDuration)}</span>
                            </div>
                        </ListGroupItem>)
                    })
                }
            </ListGroup>
        </Card>
    )
}