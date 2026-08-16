import Rating from "./Rating";

const RatingList = () => {
    return (
        <div>
            {(new Array(5).fill(null)).map(() => (
                <Rating/>
            ))}
        </div>
    )
};

export default RatingList;