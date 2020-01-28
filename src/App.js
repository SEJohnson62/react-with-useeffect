import React, { useState, useEffect} from 'react';
import axios from 'axios';
import moment from 'moment';
import './App.css';

const API = 'https://acme-users-api-rev.herokuapp.com/api';

const fetchUser = async ()=> {
  //given code
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

const Vacations = ({ vacations })=> {
  return(
    <ul>
      {
        vacations.map((vacation, idx) => {
          return(
            <li key={idx}>{vacation.startDate} to {vacation.endDate}</li>
          )
        })
      }
    </ul>
  )
}

function App() {
  const [user, setUser ] = useState('');
  const [startText, setStartText ] = useState('');
  const [endText, setEndText ] = useState('');
  const [vacations, setVacations ] = useState([]);

  async function getUserVacations(user){
    const vacationsAPI = `${API}/users/${user.id}/vacations`;
    const vacations = (await axios.get(`${vacationsAPI}`)).data
    return vacations;
  }

  useEffect(()=> {
    fetchUser()
    .then( user => setUser(user));
  }, []);

  useEffect(()=> {
    if( user.id ){
      getUserVacations(user)
      .then(vacations => setVacations(vacations));
      return;
    }
  }, [user, vacations]);

  function createUserVacation (ev) {
    ev.preventDefault();
    const vacation = {
      startDate: {startText},
      endDate: {endText},
    }
    console.log("Start: ", startText);
    console.log("End: ", endText);

    axios.post(`${API}/users/${user.id}/vacations`, vacation)
    .then( response => setUser([...vacations, response.data]))
    .error()
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Acme Vacation Planner for {user.fullName}</h1>
        <input value={startText} onChange={(ev)=>setStartText(ev.target.value)}/>
        <input value={endText} onChange={(ev)=>setEndText(ev.target.value)}/>
        <button onClick={ createUserVacation }>Add Vacation</button>
      </header>
      <Vacations vacations={vacations}/>
    </div>
  );
}

export default App;
