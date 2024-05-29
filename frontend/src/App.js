import './App.css';
import HomePage from './components/HomePage';
import "bootstrap/dist/css/bootstrap.min.css"
import "font-awesome/css/font-awesome.css"
import { io } from 'socket.io-client'

const socket = io("http://192.168.1.101:4000")

function App() {
  return (
    <>
      <HomePage socket={socket} />
    </>
  );
}

export default App;