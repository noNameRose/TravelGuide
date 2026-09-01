import type { Diary } from "../../utils/getDiaries";
import diaryImage from "../../assets/mapimage.png";

type DiaryComponentType = {
    diary: Diary
}

const DiaryComponent = ({diary}: DiaryComponentType) => {
    return (
        <div className="flex gap-4">
            <div
                className="rounded-[1em]"
                style={
                    {
                        width: "15rem",
                        height: "10rem",
                        backgroundImage: `url(${diaryImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                        
                    }
                }
            ></div>
            <div>
                <p className="font-bold text-[1.5rem] text-blue_400">{diary.name}</p>
            </div>
        </div>
    );
};

export default DiaryComponent;