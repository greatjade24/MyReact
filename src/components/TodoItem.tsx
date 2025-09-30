import "./TodoItem.css"

function TodoItem({ text, completed }) {
  return (
    <div className="todo-item">
      <input
        type="checkbox"
        className="todo-item-checkbox"
        checked={completed}
      />
      <p className="todo-item-text">{text}</p>
      <button className="todo-item-button">수정</button>
      <button className="todo-item-button">삭제</button>
    </div>
  )
}

export default TodoItem
