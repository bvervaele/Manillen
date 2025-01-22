import React, { useContext, useState } from 'react'
import { GlobleContext } from '../../context/Context'
import { Button } from 'react-bootstrap';
import './GameRoom.css';

const GameRoom: React.FC = () => {
  const { userState: { username }, signalRState: { signalRService, privateRoomCode, privateRoomUsers } } = useContext(GlobleContext);
  
  const handleCreateRoom = async () => {
    signalRService?.createPrivateRoomRequest({
      from: username, to: '', content: 'Create Private Room Request'
    });
  };

  const handleJoinRoom = async () => {
    signalRService?.joinPrivateRoomRequest({
      from: username, to: '', content: roomCodeInput
    });
  };

  const handleStartGame = async () => {
    signalRService?.startGameRequest({
      from: username, to: '', content: roomCodeInput
    });
  };

  const [roomCodeInput, setRoomCodeInput] = useState('');
  
  const inPrivateRoom = () => {
    return privateRoomCode !== "";
  }

  if (!inPrivateRoom()) {
    return (
      <div className="d-flex justify-content-end align-items-center mt-3">
        <div className="d-flex align-items-center me-3">
          <input
            type="text"
            value={roomCodeInput}
            onChange={(e) => setRoomCodeInput(e.target.value)}
            className="form-control me-2"
          />
          <Button className="wide-button" onClick={() => handleJoinRoom()}>Join Game</Button>
        </div>
        <Button onClick={() => handleCreateRoom()}>Create Room</Button>
      </div>

    )
  }
  return (
    <div>
      <h2>My game</h2>
      <div className="d-flex justify-content-between align-items-center">
        <h3>Players:</h3>
        <h3>Room Code: {privateRoomCode}</h3>
      </div>
      <ul className='list-group list-group-numbered'>
        {privateRoomUsers.map((user, index) => (
          <li className='list-group-item d-flex justify-content-between align-items-start' key={index}>
            <div className='ms-2 me-auto'>
              <div className='fw-bold'>{user}</div>
            </div>
          </li>
        ))}
      </ul>
      {
          <>
            <Button disabled={privateRoomUsers.length !== 4} onClick={() => handleStartGame()} className="btn btn-primary float-end mt-2">Start Game</Button>
            <div className="clearfix"></div>
          </>
      }
    </div>
  )
}

export default GameRoom;