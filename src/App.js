import React, { useState, useEffect} from 'react';
import axios from 'axios';
import moment from 'moment';
import './App.css';

const API = 'https://acme-users-api-rev.herokuapp.com/api';

const fetchUser = async ()=> {
  const storage = window.localStorage;
  const userId = storage.getItem('userId');
  if(userId){
    try {
      return (await axios.get(`${API}/users/detail/${userId}`)).data;
    }
    catch(ex){
      storage.removeItem('userId');
      return fetchUser();
    }
  }
  const user = (await axios.get(`${API}/users/random`)).data;
  storage.setItem('userId', user.id);
  return  user;
};

function App() {
  const [ count, setCount ] = useState(0);
  const [user, setUser ] = useState('');
  const [startText, setStartText ] = useState('');
  const [endText, setEndText ] = useState('');

  useEffect(()=> {
    console.log("In useEffect");
    fetchUser()
    .then( user => setUser(user));
  }, [user.id]);

  function createUserVacation () {
    ev.preventDefault();
    const vacation = {
      startDate: {startText},
      endDate: {endText},
    }
    console.log("Start: ", startText);
    console.log("End: ", endText);
    axios.post(`${API}/users/${user.id}/vacations`, `${vacation.startDate - vacation.endDate}`)
  }
  return (
    <div className="App">
      <header className="App-header">
        <h1>Acme Vacation Planner for {user.fullName}</h1>
        <input value={startText} onChange={(ev)=>setStartText(ev.target.value)}/>
        <input value={endText} onChange={(ev)=>setEndText(ev.target.value)}/>
        <button onClick={ createUserVacation }>Get User</button>
      </header>
      <ul>
        {
          <li>{user.id}</li>
        }
      </ul>
    </div>
  );
}

export default App;
