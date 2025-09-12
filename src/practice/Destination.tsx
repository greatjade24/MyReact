const Destination = ({ place = '부산', description = '가고싶은 여행지' }: { place: string, description: string }) => {
    return (
        <div>
            <h2>{place}</h2>
            <p>{description}</p>
        </div>
    )
}

export default Destination