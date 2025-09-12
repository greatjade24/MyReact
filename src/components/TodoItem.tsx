import './TodoItem.css'

function TodoItem() {
  return (
    <div className="todo-item">
      <input type="checkbox" className="todo-item-checkbox" />
      <p className="todo-item-text">할 일</p>
      <button className="todo-item-button">수정</button>
      <button className="todo-item-button">삭제</button>
    </div>
  )
}

export default TodoItem
