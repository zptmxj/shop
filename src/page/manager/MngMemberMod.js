//import Calender from './component/CheckIn/Calender';
import { Form, Button, Alert,FormControl,Col,Row,Table,ToggleButton } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import axios from 'axios';
import serverIP from '../../IP_PORT';
import AutoComplete from '../component/AutoComplete/AutoComplete';
import './MngMemberMod.scss';
import {setStoreMember} from '../../store'
import {useDispatch, useSelector} from 'react-redux'

function MngMemberMod(props)
{
    let member = useSelector((state)=>{return state.member});
    let dispatch = useDispatch();

    const [useinfo, setUseinfo] = useState({name:"---",uid:"----"});
    const [modMember, setModMember] = useState([]);
    const [lastname, setLastname] = useState("");
    const [firstname, setFirstname] = useState("");
    const [birth, setBirth] = useState("");
    const [sex, setSex] = useState("남");
    const [memClass, setMemClass] = useState("");
    const [value, setValue] = useState("");
    const [isView, setView] = useState(false);
    const [isActivity, setActivity] = useState(false);
    const [isAlert, setIsAlert] = useState(false);

    const [alertText, setAlertText] = useState("");
    const [alertColor,setAlertColor] = useState("primary");

    useEffect(()=>{
        if(modMember.length==0)
        {
            let mems = member.filter((e)=>{if(e.privilege<3) return e});
            console.log("mems",mems);
            setModMember(mems);
        }
    })


    const readMember = ()=>
    {
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
            dispatch(setStoreMember(json));
            setModMember([]);
        })
    }

    let setAlert= (str,sel) =>{
        let alertColor = ["danger","primary"];
        console.log("setAlert",str,alertColor[sel]);
        setAlertColor(alertColor[sel]);
        setAlertText(str);
        setIsAlert(true);
        let timer = setTimeout(() => {
            setIsAlert(false);
        }, 5000);

        return ()=>{ clearTimeout(timer) };
    }

    const onChangeView = (e) =>{
        console.log("onChangeView",e.target.checked);
        setView(e.target.checked);

    }

    const onChangeActi = (e) =>{
        setActivity(e.target.checked);
        
    }

    const onEnter = (idx)=>{
        if(isAlert) return;
        let mem = modMember[idx];
        console.log("mems",mem.view,mem.activity);

        setUseinfo(mem);
        setLastname(mem.last);
        setFirstname(mem.name);
        setBirth(mem.age);
        setSex(mem.sex==0?'남':'여');
        let mclass = "신입";
        if(mem.privilege==1) mclass = "일반";
        else if(mem.privilege==1) mclass = "부방";
        setMemClass(mclass);
        setView(mem.view==1);
        setActivity(mem.activity==1);

    }

    const onSend = (idx)=>{
        if(isAlert) return;

        if(useinfo.uid == "----")
        {
            setAlert("지정된 멤버가 없습니다",0);
            return;
        }
        else if(lastname.length == 0)
        {
            setAlert("성이 입력되지 않았습니다",0);
            return;
        }
        else if(firstname.length == 0)
        {
            setAlert("이름이 입력되지 않았습니다",0);
            return;
        }
        else if(birth.length < 4)
        {
            setAlert("년생이 4자리 이하입니다",0);
            return;
        }
  
        let sexinfo = 0;
        if(sex == "여")  sexinfo = 1;

        let mclass = 0;
        if(memClass=="일반") mclass = 1;
        else if(memClass=="부방") mclass = 2;

        let data = {uid:useinfo.uid,last:lastname,name:firstname,sex:sexinfo,age:birth,privilege:mclass,view:isView,activity:isActivity};

        fetch(serverIP+"/mo_member", {
            method : "post", // 통신방법
            headers : {
              "content-type" : "application/json",
            },
            body : JSON.stringify(data),
        })
        .then((res)=>res.json())
        .then((json)=>{
            console.log("fetch",json);
            try {
                if(json.succes) 
                {
                    setAlert("성공적으로 수정 되었습니다",1);
                    readMember();
                }
                else setAlert("서버에서 처리를 실패 했습니다",0);
            }catch (e) {
                setAlert("서버에서 처리를 실패 했습니다",0);
            }
        });

    }


    return(
        <div>
            <div className="title">
                <h3> Member Modify </h3>
            </div>  

            <Form.Group as={Row} controlId="formUser" className="mb-5">
                <Form.Label column xs={3} className="px-0">
                    검색 :
                </Form.Label>
                <Col xs={3} className='px-0'>
                    <AutoComplete list={modMember.map(e=>e.name)} value={value} setValue={setValue} onEnter={onEnter} placeholder="Enter로 등록"/>
                </Col>
                <Col xs={1} className='px-0'>
                </Col>
                <Col xs={4} className='px-0'>
                    <Table bordered >
                        <tr>
                            <td className='px-0'>{useinfo.name}</td>
                            <td className='px-0'>{useinfo.uid}</td>
                        </tr>
                    </Table>
                </Col>
            </Form.Group>

            <div className="MngGame-block">
                <Form.Group as={Row} controlId="form01" className="mb-3">
                    <Col xs={1} className='px-0'/>
                    <Form.Label column xs={2} className="px-0">
                        성 :
                    </Form.Label>
                    <Col xs={3} className='px-0'>
                        <Form.Control type="text" placeholder="성" value={lastname} onChange={(e)=>{setLastname(e.target.value)}} />
                    </Col>
                    <Form.Label column xs={2} className="px-0">
                        이름 :
                    </Form.Label>
                    <Col xs={3} className='px-0'>
                        <Form.Control type="text" placeholder="이름" value={firstname} onChange={(e)=>{setFirstname(e.target.value)}}/>
                    </Col>
                </Form.Group>
            </div>

            <div className="MngGame-block">
                <Form.Group as={Row} controlId="form02" className="mb-3">
                    <Col xs={1} className='px-0'/>
                    <Form.Label column xs={2} className="px-0">
                        년생 :
                    </Form.Label>
                    <Col xs={3} className='px-0'>
                        <Form.Control type="text" placeholder="년생 4자" value={birth} onChange={(e)=>{setBirth(e.target.value)}} />
                    </Col>
                    <Form.Label column xs={2} className="px-0">
                        성별 :
                    </Form.Label>
                    <Col xs={3} className='px-0'>
                        <Form.Select id="sex" value={sex} onChange={(e)=>{setSex(e.target.value)}}>
                            <option>남</option>
                            <option>여</option>
                        </Form.Select>
                    </Col>
                </Form.Group>
            </div>

            <div className="MngGame-block">
                <Form.Group as={Row} controlId="formUser" className="mb-4">
                    <Col xs={1} className='px-0'/>
                    <Form.Label column xs={2} className="px-0">
                        등급 :
                    </Form.Label>
                    <Col xs={3} className='px-0'>
                        <Form.Select id="memClass" value={memClass} onChange={(e)=>{setMemClass(e.target.value)}}>
                            <option>신입</option>
                            <option>일반</option>
                            <option>부방</option>
                        </Form.Select>
                    </Col>
   
                </Form.Group>
            </div>

            <div className="MngGame-block">
                <Form.Group as={Row} controlId="formUser" className="mb-3">
                    <Col xs={3} className='px-0'/>
                    <Col xs={4} className='px-0'>
                        <Form.Check type="checkbox" label=": 목록노출" checked={isView} onChange={onChangeView} />
                    </Col>
                    <Col xs={1} className='px-0'/>
                    <Col xs={3} className='px-0'>
                        <Form.Check type="checkbox" label=": 로그인" checked={isActivity} onChange={onChangeActi}/>
                    </Col>
                </Form.Group>
            </div>

            <div className="MyPw-alert">
                {
                isAlert?(
                <Alert variant={alertColor}>
                        {alertText}
                </Alert >):null
                }
            </div>
            <div className="MyPw-button">
                <Button variant="secondary" onClick={onSend}>전송</Button>
            </div>
            
        </div> 
    )
}

export default MngMemberMod;