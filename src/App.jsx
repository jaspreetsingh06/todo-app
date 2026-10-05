import React, { useEffect, useState } from 'react'

const App = () => {
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved? JSON.parse(saved): [];
  });

  const [editingId, setEditingId] = useState(null);
  const[editText, setEditText] = useState('');


  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks]);

  function handleSubmit(e){

    e.preventDefault();

    if(title.trim() === ''){
      return;
    }

    const newTask = {
      id: Date.now(),
      text: title,
      done: false
    }

    setTasks([newTask, ...tasks]);
    setTitle('');
  }

  function handleDelete(id){
    setTasks(tasks.filter((task) => task.id !== id));
  }

  function handleToggle(id){
    setTasks(tasks.map((task) => task.id === id ? {...task, done: !task.done}: task));
  }

  function handleSave(id){
    if(editText.trim() === ''){
    return;
    }
    setTasks(tasks.map((task) => task.id === id ? {...task, text: editText} : task));
    setEditingId(null);
  }

  return (
    <>
     <div className='h-screen relative'>
      <div className='bg-purple-600 h-60'>
      </div>

      <div className="taskContainer absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-3">
        <h1 className='text-5xl text-white font-bold'>TO DO</h1>
        <form onSubmit={handleSubmit} className="taskInput">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className='bg-white pl-5 w-120 h-15 text-2xl rounded outline-none text-gray-500' type="text" placeholder='Type Here' />

        </form>
        <div className="alltasks bg-white w-120 min-h-110 max-h-110 overflow-y-auto rounded shadow-2xl">
          {tasks.length === 0 ? <p className='font-semibold text-xl text-gray-500 text-center mt-5'>No Tasks Yet</p> : null }
          <ul className='divide-y divide-gray-300'>
            {tasks.map((task) => (
              <li key={task.id} className='text-gray-500 font-semibold py-4 pl-5 pr-5 text-lg flex justify-between items-center'>
              {task.id === editingId ? 
              (<input value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => {if(e.key === 'Enter'){
                                    handleSave(task.id)
                                   }
                                   if(e.key === 'Escape'){setEditingId(null)}  }}
                className='border rounded px-2 py-1 outline-none'
                autoFocus type="text" /> ):
                (<span onClick={() => handleToggle(task.id)} className={task.done ? 'line-through text-gray-300' : ''}>{task.text}
              </span>)}
              
              <div className="btns">
                <button onClick={() => {setEditingId(task.id);
                                        setEditText(task.text);}} className='px-5'>✏️</button>
                <button onClick={() => handleDelete(task.id)} className='font-bold text-2xl text-red-400'>✕</button>
              </div>
              </li>
            ))} 
          </ul>
        </div>
        </div>
     </div>
    </>
  )
}

export default App