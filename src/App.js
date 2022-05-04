import logo from './logo.png';
import show01 from './show01.jpg';
import show02 from './show02.jpg';
import show03 from './show03.jpg';
import shoes1 from './shoes1.jpg';
import shoes2 from './shoes2.jpg';
import shoes3 from './shoes3.jpg';
import background from './background.jpg';

import {Navbar, Container, NavDropdown, Nav, Carousel,Button,Form} from 'react-bootstrap';
import './App.scss';
import { useEffect, useState } from 'react';
import { Link, Route } from 'react-router-dom';
import Detail from './Detail';
import MemberList from './page/MemberList';
import CheckIn from './page/CheckIn';
import ManagerWindow from './page/ManagerWindow';
import serverIP from './IP_PORT';

function App() {

  //const serverIP = 'http://168.126.179.44:3001';
  //const serverIP = 'http://localhost:3001';

  let [logId,setlogId] = useState('');
  let [logPw,setlogPw] = useState('');
  let [userId,setUserId] = useState(sessionStorage.getItem('user_uid'));
  let [userName,setUserName] = useState(sessionStorage.getItem('user_name'));
  let [userPrivilege,setUserPrivilege] = useState(sessionStorage.getItem('privilege'));

  let [isInit,setIsInit] = useState(false);
  let [inData,indataUpdate] = useState(['']);
  let [member,setMember] = useState([{
    activity:[0],
    adddate:'',
    age:0,
    deldate:'',
    fingerkey:'',
    idx:0,
    name:'',
    name:'',
    privilege:0,
    pw:'',
    sex:[0],
    uid:'',
},{}]);
  let listKey = 0;



  useEffect(()=>{
    console.log("app_useEffect");
    console.log('userId',userId , userName ,userPrivilege);

    if(member[0].activity[0]!==1)
    {
      listKey = 0;
      console.log('App',"멤버정보 불러오기");

      fetch(serverIP+"/out_member",{
        method:"post",
        headers : {
          "content-type" : "application/json",
        },
        body : JSON.stringify(),
      })
      .then((res)=>res.json())
      .then((json)=>{
        let arr = json.map((e)=>{return e});
        setMember(arr);
        console.log('member',member);
      })
    }
  },[])

  let [ItemName,setItemName] = useState(['name1','name2','name3']);
  let [ItemImg,setItemImg] = useState([shoes1,shoes2,shoes3]);
  let [ItemPrice,setItemPrice] = useState(['100','120','210']);

  const login = ()=>{
    console.log(logId);
    let user = [logId,logPw];
    fetch(serverIP+"/out_login",{
      method:"post",
      headers : {
        "content-type" : "application/json",
      },
      body : JSON.stringify(user),
    })
    .then((res)=>res.json())
    .then((json)=>{
      console.log(json);
      if(json.length == 1)
      {
        sessionStorage.setItem('user_uid',json[0].uid);
        sessionStorage.setItem('user_name',json[0].name);
        sessionStorage.setItem('privilege',json[0].privilege);
        window.location.replace("/");
      }
    })

    //sessionStorage.setItem('user_uid','0773');
  }

  const logout = ()=>{
    sessionStorage.removeItem('user_uid');
    sessionStorage.removeItem('privilege');
  }

  const logIdChange = (e)=>{
    setlogId(e.target.value);
  }

  const logPwChange = (e)=>{
    setlogPw(e.target.value);
  }




  return (
    <div className="App">
      <Route path="/">
        {
          userId===null?(
          <div className="App-login">
              <img className="App-logi-bg" src={background}  alt='Logo.png'/>
              <Form className='App-logi-form'>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>User ID</Form.Label>
                  <Form.Control onChange={logIdChange} value={logId} placeholder="User ID" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control onChange={logPwChange} value={logPw} type="password" placeholder="Password" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                </Form.Group>
                <Button onClick={login} variant="primary" >
                  Login
                </Button>
              </Form>
          </div>
          ):(
          <Navbar className="App-header" bg="light" expand="lg">
            <Container >
              <img className="App-logo" src={logo}  alt='Logo.png'/>
              <Navbar.Brand href="/">Talk And Play</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                <Nav.Link as={Link} className="App-nav" to="/">◆ Home </Nav.Link>
                <Nav.Link as={Link} className="App-nav" to="/Member">◆ Member </Nav.Link>
                <Nav.Link as={Link} className="App-nav" to="/CheckIn">◆ Check-In </Nav.Link>
                {
                  userPrivilege==4?(
                    <Nav.Link as={Link} className="App-nav" to="/Manager">◇ Manager </Nav.Link>
                  ):null
                }
                <NavDropdown title="◆ MyPage" id="basic-nav-dropdown">
                  <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                </NavDropdown>
                </Nav>
              </Navbar.Collapse>
              <Navbar.Text>
                Signed in as {userName}: <a onClick={logout} href="/">Logout</a>
              </Navbar.Text>
            </Container>
          </Navbar>
          )
        }
      </Route>

      <div>
        {
          userId!==null?(
            <div>
            <Route exact path="/">
              <Carousel>
                <Carousel.Item interval={8000}>
                  <div className="App-slide">
                    <img
                        className="App-slide-img"
                      src={show01}
                      alt="First slide"
                    />
                  </div>
                  <Carousel.Caption>
                    <h3>First step means meeting.</h3>
                    <p >Every meeting has a meaning.</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item interval={8000}>
                  <div className="App-slide">
                    <img
                      className="App-slide-img"
                      src={show02}
                      alt="Second slide"
                    />
                  </div>
                  <Carousel.Caption>
                    <h3 className="App-slide-font">Two steps means pleasure.</h3>
                    <p className="App-slide-font"> It's a great time to start with a little fun.</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item interval={8000}>
                  <div className="App-slide">
                    <img
                        className="App-slide-img"
                      src={show03}
                      alt="Third slide"
                    />
                  </div>

                  <Carousel.Caption>
                    <h3>Third stage means memory.</h3>
                    <p>If it's good, it's a memory if it's bad, it's an experience.</p>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>

              {/* <div className='container'>
                <div className='row'>
                  {
                    ItemName.map((e,i)=>{
                      return(
                        <SubItem key={i} name={e} img={ItemImg[i]} price={ItemPrice[i]}/>
                      )
                    })
                  }
                </div>
              </div> */}
            </Route>

            <Route path="/Member">
              {/* <MemberList member={inData} isInit={isInit}/> */}
              <MemberList/>
            </Route>

            <Route path="/CheckIn">
              <CheckIn />
            </Route>
            {
              userPrivilege==4?(
              <Route path="/Manager">
                <ManagerWindow />
              </Route>
              ):null
            }
            <Route path="/detail">
              <Detail name = {ItemName} />
            </Route>
          </div>
          ):null
        }
      </div>
    </div>
  );
}

function SubItem(props){
  return(
    <div className='col-md-4'>
      <img src={props.img} width='100%'/>
      <h4> {props.name} </h4>
      <p> {'가격 $'+ props.price} </p>
    </div>
  )
}



export default App;
