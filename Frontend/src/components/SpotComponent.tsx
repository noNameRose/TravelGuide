import { useEffect, useState } from "react";
import getPlacePhotoUri from "../utils/getPlacePhotoUri";

const SpotComponent = ({name}: {name: string}) => {
    const [placeURL, setPlaceURL] = useState<string | null>(null);

    useEffect(() => {
        getPlacePhotoUri(name)
        .then((url) => {
            setPlaceURL(url);
        })
        ;
    }, []);

    return (
        <div
            className="rounded-2xl w-[270px] h-[230px]"
            style={
                {
                    backgroundImage: `URL(${placeURL})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }
            }
        ></div>
    );
};

export default SpotComponent;