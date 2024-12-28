import React, { useContext, useState } from 'react'
import { GlobleContext } from '../../context/Context'
import { Button } from 'react-bootstrap';

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

  const [roomCodeInput, setRoomCodeInput] = useState('');
  
  const inPrivateRoom = () => {
    return privateRoomCode !== "";
  }

  if (!inPrivateRoom()) {
    return (
      <>
        <input type="text" value={roomCodeInput} onChange={(e) => setRoomCodeInput(e.target.value)} />
        <Button onClick={() => handleJoinRoom()}>Join Room</Button>
        <Button onClick={() => handleCreateRoom()}>Create Room</Button>
      </>
    )
  }
  return (
    <div>
      <h2>Room Code: {privateRoomCode}</h2>
      <h3>Players:</h3>
      <ul>
        {privateRoomUsers.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>
    </div>
  )
}

export default GameRoom;