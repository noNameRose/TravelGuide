import type { Diary } from "../../utils/getDiaries";

type DiaryComponentType = {
    diary: Diary
}

const DiaryComponent = ({diary}: DiaryComponentType) => {
    return (
        <div>
            <p>{diary.name}</p>
        </div>
    );
};

export default DiaryComponent;