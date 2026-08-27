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
        <div className="w-[10vw] min-h-screen bg-blue_200">
            {navList.map((nav) => (
                <NavIcon
                    name={nav.name as IconName}
                    path={nav.path}
                    className="w-[4rem]"
                />
            ))}
        </div>
    );
};

export default NavigationBar;