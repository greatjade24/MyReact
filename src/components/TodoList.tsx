import TodoItem from './TodoItem'
import './TodoList.css'

function TodoList({ data }) {
    return (
        <div className='todo-list'>
            <div className='todo-header'>
                <input type="checkbox" className='todo-checkbox' />
                <p className='todo-header-text'>할 일</p>
                <button className='todo-header-button'>삭제</button>
            </div>
            <div>
                {data.map((item) => <TodoItem text={item.text} completed={item.completed} />)}
            </div>
        </div>
    )
}

export default TodoList