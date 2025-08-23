const List = () => {
  const items = ["Date palm", "Apple", "Banana", "Cherry"]

  return (
    <ul>
      {items.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  )
}

export const FilteredList = () => {
  const items = [
    {
      id: 1,
      text: "learn react",
      completed: true,
    },
    {
      id: 2,
      text: "build ui",
      completed: false,
    },
    {
      id: 3,
      text: "fetch API",
      completed: true,
    },
  ]

  return (
    <ul>
      {items
        .filter((i) => i.completed === false)
        .map((i) => (
          <li key={i.id}>{i.text}</li>
        ))}
    </ul>
  )
}

export default List
