import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../../@/components/ui/dropdown-menu';

type Props = {
    filter: string;
    setFilter: (filter: string) => void;
};

export const DropdownFilter: React.FC<Props> = ({
    filter,
    setFilter,
}) => {
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger className="w-[40%]  flex justify-center items-center py-2 px-4 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Filter: {filter}
                </DropdownMenuTrigger>
                <DropdownMenuContent className=" w-40 bg-white z-50">
                    <DropdownMenuLabel className="text-base">
                        Filter
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="h-[0.5px] bg-black z-50" />

                    <DropdownMenuItem
                        className="cursor-pointer z-50"
                        onClick={() => setFilter('ongoing')}
                    >
                        ongoing
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="cursor-pointer z-50"
                        onClick={() => setFilter('completed')}
                    >
                        completed
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};
