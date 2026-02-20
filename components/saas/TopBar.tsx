"use client";

import { Input } from "@nextui-org/input";
import { User } from "@nextui-org/user";
import {
    SearchIcon,
    BellIcon,
    MoonIcon,
    SunIcon
} from "lucide-react";

export const TopBar = () => {
    return (
        <header className="h-16 flex items-center justify-between px-6 border-b border-default-200 bg-background/60 backdrop-blur-md sticky top-0 z-30">
            <div className="flex items-center gap-4 w-1/3">
                <Input
                    classNames={{
                        base: "max-w-full sm:max-w-[15rem] h-10",
                        mainWrapper: "h-full",
                        input: "text-small",
                        inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
                    }}
                    placeholder="Type to search..."
                    size="sm"
                    startContent={<SearchIcon size={18} />}
                    type="search"
                />
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 rounded-full hover:bg-default-100 transition-colors relative">
                    <BellIcon size={20} className="text-white" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
                </button>

                <div className="w-px h-6 bg-default-300 mx-2"></div>

                <User
                    name="Tony Reichert"
                    description="Product Designer"
                    avatarProps={{
                        src: "https://i.pravatar.cc/150?u=a042581f4e29026024d"
                    }}
                    className="cursor-pointer transition-transform hover:scale-105"
                />
            </div>
        </header>
    );
};
