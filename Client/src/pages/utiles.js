import clsx from "clsx";
import { twMerge } from "tailwind-merge";


export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const colors = [
    "bg-red-500 text-red-100 border-red-500 border-[1px]",
    "bg-blue-500 text-blue-500 border-blue-500 border-[1px]",
    "bg-green-500 text-green-500 border-green-500 border-[1px]",
    "bg-yellow-500 text-yellow-500 border-yellow-500 border-[1px]",
    "bg-purple-500 text-purple-500 border-purple-500 border-[1px]",
    "bg-pink-500 text-pink-500 border-pink-500 border-[1px]",
]


const getColors = (color) => {
   if (color >= 0 && color < colors.length) {
    return colors[color];
   }
    return colors[0];
}
export default getColors;

