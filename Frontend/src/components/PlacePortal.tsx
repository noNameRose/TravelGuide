import { useContext, useEffect, useRef, useState, type SubmitEventHandler } from "react";
import { Spot, type Transportation } from "../features/SpotRender/Spot";
import VehicleOption from "./VehicleOption";
import gsap from "gsap";
import SpotListContext from "../contexts/SpotListContext";
import searchCoordinate, { type GeoCodingResBody } from "../utils/searchCoordinate";
import type { SpotList } from "../features/SpotRender/SpotList";

const VEHICLES: Transportation[] = ["driving", "flight", "walking"];

type PlacePortalType = {
    isShow: boolean,
    handleShow: (show: boolean) => void
};

const PlacePortal = ({isShow, handleShow}: PlacePortalType) => {
    const portalRef = useRef<HTMLDivElement | null>(null);
    const [query, setQuery] = useState<string>("");
    const [vehicle, setVehicle] = useState<Transportation | null>(null);
    const spotListContext = useContext(SpotListContext);

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        const geoCodeBody = (await searchCoordinate(query)) as GeoCodingResBody;
        const lng = geoCodeBody.results[0].geometry.location.lng;
        const lat = geoCodeBody.results[0].geometry.location.lat;
        const newList = spotListContext?.spotList.clone();
        newList?.addSpot(Spot.builder()
                        .name(query)
                        .getHereBy(vehicle)
                        .location({
                            lng: lng,
                            lat: lat
                        }).build()
        );
        spotListContext?.handleSpotListChange(newList as SpotList);
    };

    useEffect(() => {
        if (isShow) {
            gsap.to(portalRef.current, {
                scale: 1,
                ease: "power4"
            });
        }
        else {
             gsap.to(portalRef.current, {
                scale: 0,
                ease: "power4"
            });
        }
    }, [isShow]);
    return (
        <div    className="fixed 
                        top-1/2 
                        left-1/2 
                        -translate-1/2 
                        bg-blue_50 
                        rounded-[1em] 
                        flex 
                        flex-col 
                        scale-0
                        origin-center
                        gap-4 p-[2em]"
                ref={portalRef}
        >
            <button 
                className="self-end cursor-pointer"
                onClick={() => handleShow(false)}
            >
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 640 640"
                    className="w-[3rem]"
                >
                    <path fill="#0c2327" d="M320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM231 231C240.4 221.6 255.6 221.6 264.9 231L319.9 286L374.9 231C384.3 221.6 399.5 221.6 408.8 231C418.1 240.4 418.2 255.6 408.8 264.9L353.8 319.9L408.8 374.9C418.2 384.3 418.2 399.5 408.8 408.8C399.4 418.1 384.2 418.2 374.9 408.8L319.9 353.8L264.9 408.8C255.5 418.2 240.3 418.2 231 408.8C221.7 399.4 221.6 384.2 231 374.9L286 319.9L231 264.9C221.6 255.5 221.6 240.3 231 231z"/>
                </svg>
            </button>
            <form 
                className="flex flex-col gap-4"
                onSubmit={handleSubmit}
            >
                <div className="flex flex-col gap-4">
                    <label className="font-bold text-[1.5rem] flex gap-4 items-center">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 640 640"
                            className="w-[3rem]"
                        >
                            <path fill="#0c2327" d="M352 64C316.7 64 288 92.7 288 128L288 160L240 160L240 88C240 74.7 229.3 64 216 64C202.7 64 192 74.7 192 88L192 160L128 160L128 88C128 74.7 117.3 64 104 64C90.7 64 80 74.7 80 88L80 162C52.4 169.1 32 194.2 32 224L32 512C32 547.3 60.7 576 96 576L544 576C579.3 576 608 547.3 608 512L608 320C608 284.7 579.3 256 544 256L480 256L480 128C480 92.7 451.3 64 416 64L352 64zM416 176L416 208C416 216.8 408.8 224 400 224L368 224C359.2 224 352 216.8 352 208L352 176C352 167.2 359.2 160 368 160L400 160C408.8 160 416 167.2 416 176zM400 256C408.8 256 416 263.2 416 272L416 304C416 312.8 408.8 320 400 320L368 320C359.2 320 352 312.8 352 304L352 272C352 263.2 359.2 256 368 256L400 256zM416 368L416 400C416 408.8 408.8 416 400 416L368 416C359.2 416 352 408.8 352 400L352 368C352 359.2 359.2 352 368 352L400 352C408.8 352 416 359.2 416 368zM528 352C536.8 352 544 359.2 544 368L544 400C544 408.8 536.8 416 528 416L496 416C487.2 416 480 408.8 480 400L480 368C480 359.2 487.2 352 496 352L528 352zM288 368L288 400C288 408.8 280.8 416 272 416L240 416C231.2 416 224 408.8 224 400L224 368C224 359.2 231.2 352 240 352L272 352C280.8 352 288 359.2 288 368zM272 256C280.8 256 288 263.2 288 272L288 304C288 312.8 280.8 320 272 320L240 320C231.2 320 224 312.8 224 304L224 272C224 263.2 231.2 256 240 256L272 256zM160 368L160 400C160 408.8 152.8 416 144 416L112 416C103.2 416 96 408.8 96 400L96 368C96 359.2 103.2 352 112 352L144 352C152.8 352 160 359.2 160 368zM144 256C152.8 256 160 263.2 160 272L160 304C160 312.8 152.8 320 144 320L112 320C103.2 320 96 312.8 96 304L96 272C96 263.2 103.2 256 112 256L144 256z"/>
                        </svg>
                        <p>What is your next destination?</p>
                    </label>
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="bg-blue_950 text-[1rem] p-[0.3em] rounded-[.5em] text-white"
                    />
                </div>
                <div className="flex flex-col gap-4">
                    <label className="flex gap-4 items-center text-[1.5rem] font-bold">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 640 640"
                            className="w-[3rem]"
                        >
                            <path 
                                fill="#0c2327" 
                                d="M199.2 181.4L173.1 256L466.9 256L440.8 181.4C436.3 168.6 424.2 160 410.6 160L229.4 160C215.8 160 203.7 168.6 199.2 181.4zM103.6 260.8L138.8 160.3C152.3 121.8 188.6 96 229.4 96L410.6 96C451.4 96 487.7 121.8 501.2 160.3L536.4 260.8C559.6 270.4 576 293.3 576 320L576 512C576 529.7 561.7 544 544 544L512 544C494.3 544 480 529.7 480 512L480 480L160 480L160 512C160 529.7 145.7 544 128 544L96 544C78.3 544 64 529.7 64 512L64 320C64 293.3 80.4 270.4 103.6 260.8zM192 368C192 350.3 177.7 336 160 336C142.3 336 128 350.3 128 368C128 385.7 142.3 400 160 400C177.7 400 192 385.7 192 368zM480 400C497.7 400 512 385.7 512 368C512 350.3 497.7 336 480 336C462.3 336 448 350.3 448 368C448 385.7 462.3 400 480 400z"/>
                        </svg>
                        <p>How did you get here?</p>
                    </label>
                    <div className="flex gap-4">
                        {VEHICLES.map(trans => (
                            <VehicleOption
                                vehicle={trans}
                                handleVehicleChange={setVehicle}
                            />
                        ))}
                    </div>
                </div>
                <button 
                    className="bg-blue_950 
                                 font-bold 
                                 text-[1rem] 
                                 text-blue_50 
                                 cursor-pointer
                                 p-[0.5em] 
                                 rounded-[.5em]"
                >
                    Save
                </button>
            </form>

        </div>
    );
};

export default PlacePortal;