import React, {useCallback, useMemo, useState} from 'react';
import ReactDOM from 'react-dom';
import './App.css'
import 'bulma/css/bulma.css'

const Header = React.memo(
    ({numTodos}) => (
        <div className='card-header'>
            <h1 className='card-header-title header'>
                You have {numTodos} Todos
            </h1>
        </div>
    )
)

const TodoList = React.memo(
    ({tasks, onDelete}) => (
        <div className='list-wrapper'>
            {tasks.map((todo) => (
                <Todo
                    content={todo.task}
                    key={todo.id}
                    onDelete={() => onDelete(todo.id)}
                />
            ))}
        </div>
    )
)

const Todo = React.memo(
    ({content, onDelete}) => (
        <div className='list-item'>
            {content}
            <button
                className="delete is-pulled-right"
                onClick={onDelete}
            />
        </div>
    )
)

const SubmitForm = React.memo(
    ({onFormSubmit}) => {
        const [term, setTerm] = useState('');

        const onSubmit = useCallback((e) => {
            e.preventDefault();
            if(!term) {
                return;
            }

            onFormSubmit(term)
            setTerm('')
        }, [onFormSubmit, term])

        return (
            <form onSubmit={onSubmit}>
                <input
                    type='text'
                    className='input'
                    placeholder='Enter Item'
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                />
                <button className='button'>Submit</button>
            </form>
        )
    }
)

const Settings = React.memo(
    ({toggleColor}) => (
        <div className='settings-component'>
            <span>Settings:</span>
            <button onClick={toggleColor} className='button'>change background color</button>
        </div>
    )
)

const generateId = () => Math.random().toString(36).substr(2, 7);

const App = () => {
    const [tasks, setTasks] = useState([
        'task 1',
        'task 2',
        'task 3'
    ].map((task, index) => ({
        task,
        id: generateId(),
    })));
    const tasksLength = useMemo(() => tasks.length, [tasks]);

    const addTask = useCallback(task => {
        setTasks([...tasks, {task, id: generateId()}])
    }, [tasks])

    const deleteTaskById = useCallback(taskId => {
        const index = tasks.findIndex(task => task.id === taskId);
        if(index === -1) {
            return;
        }
        const newTasks = [...tasks];
        newTasks.splice(index, 1);
        setTasks(newTasks)
    }, [tasks])

    const [colorState, setColorState] = useState(false);
    const toggleColor = useCallback(() => {
        setColorState(!colorState)
    }, [colorState])

    return (
        <div className={`wrapper ${colorState ? 'dark' : 'white'}`}>
            <Settings toggleColor={toggleColor}/>
            <div className='card frame'>
                <Header numTodos={tasksLength}/>
                <TodoList
                    tasks={tasks}
                    onDelete={deleteTaskById}
                />
                <SubmitForm onFormSubmit={addTask} />
            </div>
        </div>
    )
}

ReactDOM.render(
    <App />,
    document.querySelector('#root')
);
