import logo from './logo.png';
import TAPs from './TAPs.svg';

import shoes1 from './shoes1.jpg';
import shoes2 from './shoes2.jpg';
import shoes3 from './shoes3.jpg';
import background from './background.jpg';

import {Navbar, Container, NavDropdown, Nav, NavLink, Button,Form} from 'react-bootstrap';
import './App.scss';
import { useEffect, useState } from 'react';
import { Link, Route } from 'react-router-dom';
import Detail from './Detail';
import MainSlider from './page/MainSlider';
import MainAtt from './page/MainAtt';
import MemberList from './page/MemberList';
import CheckIn from './page/CheckIn';
import Attend from './page/Attend';
import BoardGame from './page/BoardGame';
import Avatar from './page/Avatar';
import Betting from './page/Betting';
import Border from './page/Border';
import MyCash from './page/mypage/MyCash';
import MyPoint from './page/mypage/MyPoint';
import MyPassword from './page/mypage/MyPassword';
import TestPage from './page/TestPage';
import MngCheckIn from './page/manager/MngCheckIn';
import MngDeposit from './page/manager/MngDeposit';
import MngPoint from './page/manager/MngPoint';
import MngGameAdd from './page/manager/MngGameAdd';
import MngMemberAdd from './page/manager/MngMemberAdd';
import MngMemberMod from './page/manager/MngMemberMod';
import MngAvatarAdd from './page/manager/MngAvatarAdd';
import {serverPath,imagePath} from './IP_PORT';


import {setStoreMember, setStorePlate, setStoreUserData} from './store'
import {useDispatch, useSelector} from 'react-redux'


function App() {

  const getUserUid = ()=>{
    let str;
    str = localStorage.getItem('user_uid');
    if(str==null)
      str = sessionStorage.getItem('user_uid');
    return str;
  }
  const getUserName = ()=>{
    let str;
    str = localStorage.getItem('user_name');
    if(str==null)
      str = sessionStorage.getItem('user_name');
    return str;
  }
  const getPrivilege = ()=>{
    let str;
    str = localStorage.getItem('privilege');
    if(str==null)
      str = sessionStorage.getItem('privilege');
    return str;
  }

  const dispatch = useDispatch();
  let isfirst = sessionStorage.getItem('firstPage');
  const [isAutoLogin,setAutoLogin] = useState(localStorage.getItem('autologin'));
  
  const [logId,setlogId] = useState('');
  const [logPw,setlogPw] = useState('');
  const [userId,setUserId] = useState(getUserUid());
  const [userName,setUserName] = useState(getUserName());
  const [userPrivilege,setUserPrivilege] = useState(getPrivilege());
  const [mycash,setMycash] = useState(0);
  const [avatars,setAvatars] = useState([]);
  const [member,setMember] = useState([]);

  const Mnglink = ["/TestPage","/MngCheckIn","/MngDeposit","/MngPoint","/MngGameAdd","/MngMemberAdd","/MngMemberMod","/MngAvatarAdd"];
  const Mngtext = ["TestPage","CheckIn","Deposit","Point","GameAdd","MemberAdd","MemberMod","AvatarAdd"];
  

  useEffect(()=>{
    console.log("app_useEffect");
    console.log('userId',userId , userName ,userPrivilege);
    let login = sessionStorage.getItem('login');
    let first = sessionStorage.getItem('firstPage');
    let localuid = localStorage.getItem('user_uid');
    console.log("first:"+first+"/userId:"+userId);

    if(first==null&&login==null&&localuid!=null)
    {
      console.log("자동로그인 로그");
      let uidData = {uid:userId,name:userName}
      fetch(serverPath()+"/in_login",{
        method:"post",
        headers : {
            "content-type" : "application/json",
        },
        body : JSON.stringify(uidData),
      })
    }
    if(avatars.length == 0)
    {
        fetch(serverPath()+"/out_allavatar",{
            method:"post",
            headers : {
                "content-type" : "application/json",
            },
            body : JSON.stringify(),
        })
        .then((res)=>res.json())
        .then((avat)=>{
            console.log('out_avatar', avat);
            setAvatars(avat);

            console.log('App',"멤버정보 불러오기");
            let data={uid:"all",order:"SELECT * FROM member JOIN asset USING(uid) order by total_point DESC"};

            fetch(serverPath()+"/out_custom",{
              method:"post",
              headers : {
              "content-type" : "application/json",
              },
              body : JSON.stringify(data),
            })
            .then((res)=>res.json())
            .then((json)=>{
              let myavatar="";
              setMember(json);

              let asset = json.map((mem,i)=>{
                  if(mem.uid == userId)
                    setMycash(mem.cash);

                  let avatar = avat.filter(e=>e.idx==mem.avatar);
                  let path = "m/m000.png";
                  if(avatar.length == 0 )
                  {
                      if(mem.sex==1) path = "w/w000.png";
                      else path = "m/m000.png";
                  }
                  else{
                      path = avatar[0].path;
                      if(mem.uid == userId)
                        myavatar = avatar[0].path;
                  }
                  mem.path = path;
                  return mem;
              })

              dispatch(setStoreMember(asset));
              console.log('member',asset);

              console.log("isAutoLogin",isAutoLogin,"userId",userId,"isfirst",isfirst);

              if(userId != null)
              {
                  let userData = {uid:userId , name:userName , privilege:userPrivilege, avatar:myavatar}
                  dispatch(setStoreUserData(userData));
              }
              
              if(isAutoLogin == "true" && userId!=null && isfirst==null) 
              {
                sessionStorage.setItem('firstPage',true);
                //window.location.replace("/Attend");
              }
            })
        })
    }

  },[])

  let [ItemName,setItemName] = useState(['name1','name2','name3']);
  let [ItemImg,setItemImg] = useState([shoes1,shoes2,shoes3]);
  let [ItemPrice,setItemPrice] = useState(['100','120','210']);

  // const login = ()=>{
  //   console.log(logId);
  //   let user = [logId,logPw];
  //   fetch(serverPath()+"/out_login",{
  //     method:"post",
  //     headers : {
  //       "content-type" : "application/json",
  //     },
  //     body : JSON.stringify(user),
  //   })
  //   .then((res)=>res.json())
  //   .then((json)=>{
  //     console.log(json);
  //     if(json.length == 1)
  //     {
  //       sessionStorage.setItem('user_uid',json[0].uid);
  //       sessionStorage.setItem('user_name',json[0].name);
  //       sessionStorage.setItem('privilege',json[0].privilege);
  //       window.location.replace("/");
  //     }
  //   })
  // }


  
  const logout = ()=>{
    sessionStorage.removeItem('user_uid');
    sessionStorage.removeItem('user_name');
    sessionStorage.removeItem('privilege');
    localStorage.removeItem('user_uid');
    localStorage.removeItem('user_name');
    localStorage.removeItem('privilege');
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
          // userId===null?(
          // <div className="App-login">
          //     <img className="App-logi-bg" src={background}  alt='Logo.png'/>
          //     <Form className='App-logi-form'>
          //       <Form.Group className="mb-3" controlId="formBasicEmail">
          //         <Form.Label>User ID</Form.Label>
          //         <Form.Control onChange={logIdChange} value={logId} placeholder="User ID" />
          //       </Form.Group>

          //       <Form.Group className="mb-3" controlId="formBasicPassword">
          //         <Form.Label>Password</Form.Label>
          //         <Form.Control onChange={logPwChange} value={logPw} type="password" placeholder="Password" />
          //       </Form.Group>
          //       <Form.Group className="mb-3" controlId="formBasicCheckbox">
          //       </Form.Group>
          //       <Button onClick={login} variant="primary" >
          //         Login
          //       </Button>
          //     </Form>
          // </div>
          // ):(
          <Navbar className="App-header" bg="light" expand="lg">
            <Container >
              <a href="/"><img className="App-logo" src={logo} alt='Logo.png'/></a >
              <Navbar.Brand className="App-title" href="/">
                <img className="App-TAPs" src={TAPs} alt='TAPs.png'/>
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav " />
              <>
                {
                    userId!=null?( 
                      <>
                      <Navbar.Collapse id="basic-navbar-nav">
                      <Nav className="me-auto">
                        {/* <Nav.Link as={Link} className="App-nav" to="/">◆ Home </Nav.Link> */}
                        <NavDropdown className="App-nav" title="◆ info" id="basic-nav-dropdown">
                          <NavDropdown.Item as={Link} to="/Member"> Member </NavDropdown.Item>
                          <NavDropdown.Item as={Link} to="/CheckIn"> Check-In </NavDropdown.Item>
                          <NavDropdown.Item as={Link} to="/Games"> Games </NavDropdown.Item>
                        </NavDropdown>
                        
                        <Nav.Link as={Link} className="App-nav" to="/Attend">◆ Attend </Nav.Link>
                        <NavDropdown className="App-nav" title="◆ Point" id="basic-nav-dropdown">
                          <NavDropdown.Item as={Link} to="/Avatar"> Avatar </NavDropdown.Item>
                          <NavDropdown.Item as={Link} to="/Betting"> Betting </NavDropdown.Item>
                          {/* <NavDropdown.Item as={Link} to="/Border"> Border </NavDropdown.Item> */}
                        </NavDropdown>
                        {
                          userPrivilege>2?(
                          <NavDropdown className="App-nav" title="◇ Manager" id="basic-nav-dropdown">
                          {
                            Mngtext.map((e,i)=>{return <Manager key={i} idx={i} link={Mnglink[i]} text={e} Privilege={userPrivilege}/>})
                          }
                          </NavDropdown>):null
                        }
                        <NavDropdown className="App-nav" title="◆ MyPage" id="basic-nav-dropdown">
                          <NavDropdown.Item as={Link} to="/MyCash">Cash</NavDropdown.Item>
                          <NavDropdown.Item as={Link} to="/MyPoint">Point</NavDropdown.Item>
                          <NavDropdown.Item href="#action/3.3">----</NavDropdown.Item>
                          <NavDropdown.Divider />
                          <NavDropdown.Item as={Link} to="/MyPassword">Password</NavDropdown.Item>
                        </NavDropdown>
                      </Nav>
                    </Navbar.Collapse>
                    <Navbar.Text>
                      Signed in as {userName}: <a onClick={logout} href="/">Logout</a>
                      <Nav.Link as={Link} to="/MyCash">
                          {
                            mycash<=0?<>잔액: <string className='App-font-rad' >{mycash}</string></>:<>잔액: <string className='App-font-blue' >{mycash}</string></>
                          }
                      </Nav.Link>
                    </Navbar.Text>
                    </>
                    ):(<Navbar.Collapse id="basic-navbar-nav"/>)
                }
            </>
            </Container>
          </Navbar>
          // )
        }
      </Route>

      <div className="App-middle">
        {
          userId!==null?(
            <div>
            <Route exact path="/">
              <MainSlider/>
            </Route>
            
            <Route path="/Member">
              <MemberList/>
            </Route>
            <Route path="/CheckIn">
              <CheckIn />
            </Route>
            <Route path="/Attend">
              <Attend />
            </Route>
            <Route path="/Games">
              <BoardGame/>
            </Route>
            <Route path="/Avatar">
              <Avatar/>
            </Route>
            <Route path="/Betting">
              <Betting/>
            </Route>
            <Route path="/Border">
              <Border/>
            </Route>
            <Route path="/MyCash">
              <MyCash />
            </Route>
            <Route path="/MyPoint">
              <MyPoint />
            </Route>
            <Route path="/MyPassword">
              <MyPassword />
            </Route>            
            
            {
              userPrivilege>3?(
              <div>
                <Route path="/TestPage">
                  <TestPage />
                </Route>
                <Route path="/MngCheckIn">
                  <MngCheckIn />
                </Route>
                <Route path="/MngDeposit">
                  <MngDeposit />
                </Route>
                <Route path="/MngPoint">
                  <MngPoint />
                </Route>
                <Route path="/MngGameAdd">
                  <MngGameAdd />
                </Route>
                <Route path="/MngAvatarAdd">
                  <MngAvatarAdd />
                </Route>
                
              </div>
              ):null
            }
            {
              userPrivilege>2?(
              <>
              <Route path="/MngMemberAdd">
                <MngMemberAdd />
              </Route>
              <Route path="/MngMemberMod">
                <MngMemberMod />
              </Route>
              </>
              ):null
            }
            <Route path="/detail">
              <Detail name = {ItemName} />
            </Route>
          </div>
          ):(
            <Route exact path="/">
              <MainAtt/>
            </Route>
            )
        }
      </div>
      <div className="App-bottom">
        <p className="pt-5">Talk And Play</p>
        <div className="App-bottom-font">icon creator <a className="App-link" href="https://www.freepik.com" title="Freepik">Freepik</a> from <a className="App-link" href="https://www.flaticon.com/kr/" title="Flaticon">www.flaticon.com</a></div>
      </div> 
    </div>
  );
}


function Manager(props){
   
    let privilege = props.Privilege;
    let link = props.link;
    let text = props.text;
    let idx = props.idx;
    if(idx < 5 && privilege < 4) return;

  return(
    <NavDropdown.Item as={Link} to={link}>{text}</NavDropdown.Item>
  )
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
