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
            className="rounded-2xl w-[15rem] h-[10rem]"
            style={
                {
                    backgroundImage: `url(${placeURL})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }
            }
        ></div>
    );
};

export default SpotComponent;