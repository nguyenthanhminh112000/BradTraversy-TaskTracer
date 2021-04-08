import Header from './components/Header';
import Footer from './components/Footer';
import About from './components/About';
import Tasks from './components/Tasks';
import AddTask from './components/AddTask';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { API_URL } from './config';
function App() {
  const [tasks, setTasks] = useState([]);
  const AJAX = async function (url, uploadData = undefined, methodR = 'POST') {
    try {
      const request = function () {
        if (uploadData) {
          if (methodR === 'POST' || methodR === 'PUT') {
            return fetch(url, {
              method: methodR,
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(uploadData),
            });
          } else {
            return fetch(url, {
              method: methodR,
            });
          }
        } else {
          return fetch(url);
        }
      };
      const fetchPro = request();
      const respond = await fetchPro;
      const data = await respond.json();
      if (!respond.ok) {
        throw new Error(`${respond.status} ${data.message}`);
      }
      return data;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    const getData = async function () {
      const data = await AJAX(API_URL);
      setTasks(data);
    };
    getData();
  }, []);

  const [showAddTask, setShowAddTask] = useState(false);
  const deleteTask = async (id) => {
    AJAX(`${API_URL}${id}`, id, 'DELETE');
    setTasks(tasks.filter((task) => task.id !== id));
  };
  const toggleReminder = async (id) => {
    const data = await AJAX(`${API_URL}${id}`);
    const newData = { ...data, reminder: !data.reminder };
    const dataBack = await AJAX(`${API_URL}${id}`, newData, 'PUT');
    setTasks(
      tasks.map((task) =>
        task.id === dataBack.id
          ? { ...task, reminder: dataBack.reminder }
          : task
      )
    );
  };
  const addTask = async (task) => {
    try {
      const id = Math.floor(Math.random() * 10000 + 1);
      const newTask = { id, ...task };
      const data = await AJAX(`${API_URL}`, newTask);
      setTasks([...tasks, data]);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Router>
      <div className='container'>
        <Header
          title='Task Tracer'
          onAdd={() => {
            setShowAddTask(!showAddTask);
          }}
          showAdd={showAddTask}
        />

        <Route
          path='/'
          exact
          render={(props) => (
            <>
              {showAddTask && <AddTask onAdd={addTask} />}
              {tasks.length > 0 ? (
                <Tasks
                  tasks={tasks}
                  onDelete={deleteTask}
                  onToggle={toggleReminder}
                />
              ) : (
                'No tasks'
              )}
            </>
          )}
        />
        <Route path='/about' component={About} />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
