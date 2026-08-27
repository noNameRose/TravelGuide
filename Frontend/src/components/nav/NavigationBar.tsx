import NavIcon, { type IconName } from "./NavIcon";

const navList = [
    {
        name: "profile",
        path: "/profile"
    },
    {
        name: "explore",
        path: "/explore"
    },
    {
        name: "diary",
        path: "/diary"
    }
];

const NavigationBar = () => {
    return (
        <div className="w-[8vw] min-h-screen bg-blue_200 flex flex-col items-center">
            <div className="flex flex-col gap-[2rem] py-[2em]">
                {navList.map((nav) => (
                    <NavIcon
                        name={nav.name as IconName}
                        path={nav.path}
                        className="w-[3rem] cursor-pointer"
                    />
                ))}
            </div>
        </div>
    );
};

export default NavigationBar;