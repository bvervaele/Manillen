import React, { useContext, useState } from 'react'
import { GlobleContext } from '../../context/Context'
import { Button } from 'react-bootstrap';

const GameRoom: React.FC = () => {
  const { userState: { username }, signalRState: { signalRService, onlineUsers } } = useContext(GlobleContext);
  const [isRoomCreated, setIsRoomCreated] = useState(false);
  
  const handlePartyUsers = () => {
    return onlineUsers.filter(user => user.key !== username);
  };

  const handleCreateRoom = async () => {
    signalRService?.createPrivateRoomRequest({
      from: username, to: '', content: 'Create Private Room Request'
    });
    setIsRoomCreated(true);
  };

  if (!isRoomCreated) {
    return (
      <Button onClick={() => handleCreateRoom()}>Create Room</Button>
    )
  }
  return (
    <div>
      <h2>Room Code: 123abc</h2>
      <h3>Players:</h3>
      <ul>
        {handlePartyUsers().map((user, index) => (
          <li key={index}>{user.value}</li>
        ))}
      </ul>
    </div>
  )
}

export default GameRoom;