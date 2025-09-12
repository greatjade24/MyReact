const Item = ({ isDone }: { isDone: boolean }) => {
    return <div>{isDone ? "Done" : 'Todo'}</div>
}

export default Item