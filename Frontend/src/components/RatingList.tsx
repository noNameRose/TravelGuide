import Rating from "./Rating";

const RatingList = () => {
    return (
        <div className="flex gap-4">
            {(new Array(5).fill(null)).map(() => (
                <Rating/>
            ))}
        </div>
    )
};

export default RatingList;