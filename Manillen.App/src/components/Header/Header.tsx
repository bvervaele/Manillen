import { useContext } from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { GlobleContext } from '../../context/Context'

const Header = () => {
  const { userState: { isLogin, username }, userDispatch, signalRState:{signalRService,privateRoomInitiated} ,signalRDispatch} = useContext(GlobleContext);

  const handleLogout = async () => {
    if(privateRoomInitiated.accepted && privateRoomInitiated.requested){
      await signalRService?.closePrivateRoom({
        from:username,
        to:privateRoomInitiated.accepted !== username ? privateRoomInitiated.accepted : privateRoomInitiated.requested,
        content:'UserLogout'
      });
    }else{
      userDispatch({type:'LOGOUT', payload:null});
      await signalRService?.removeUserCnnection();
      signalRDispatch({type:"REMOVE_SIGNALR_CONNECTION", payload: null})
    }
  }

  return (
    <Navbar collapseOnSelect expand="lg" bg='dark' variant='dark'>
      <Container>
        <Navbar.Brand><NavLink to={'/'} className="m-2 p-1 fs-6 text-decoration-none badge">Manillen</NavLink></Navbar.Brand>
        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        <Navbar.Collapse>
          <Nav className='me-auto'/>
          {
            isLogin ? <>
            <Nav><span className="m-2 p-1 fs-6 text-decoration-none badge">{username}</span></Nav>
            <Nav><span className="m-2 p-1 fs-6 text-decoration-none badge" style={{ cursor: 'pointer' }} onClick={handleLogout}>Logout</span></Nav>
            </> :
              <>
                <Nav>
                  <NavLink to={"/login"} className="m-2 p-1 fs-6 text-decoration-none badge">Login</NavLink>
                </Nav>
                <Nav>
                  <NavLink to={"/register"} className="m-2 p-1 fs-6 text-decoration-none badge">Register</NavLink>
                </Nav>
              </>
          }

        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header