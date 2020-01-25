import React, { useState, useEffect} from 'react';
import axios from 'axios';
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

  return (
    <div className="App">
      <header className="App-header">
        <h1>Acme Vacation Planner for {user.fullName}</h1>
        <button onClick={(ev) => console.log("Button click")}>Get User</button>
      </header>
    </div>
  );
}

export default App;
