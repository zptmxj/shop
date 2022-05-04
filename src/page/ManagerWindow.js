import './ManagerWindow.scss';
import react,{ useEffect, useState, useRef } from 'react';
import {ListGroup,Dropdown,FormControl,Table,Button,Modal} from 'react-bootstrap';
import SearchBar from './SearchBar'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import serverIP from '../IP_PORT';

function ManagerWindow(props)
{

    const [showModal, setShowModal] = useState(false);
    const [modelText, setModelText] = useState('');
    const [modelTitle, setModelTitle] = useState('');

    const [useName, setUseName] = useState('');
    const [focusidx, setfocusidx] = useState(-1);
    const [results, setResult] = useState([]);
    const [member,setMember] = useState([{
        activity:[0],
        adddate:'',
        age:0,
        deldate:'',
        fingerkey:'',
        idx:0,
        name:'',
        privilege:0,
        pw:'',
        sex:[0],
        uid:'',
    },{}]);

    const [inName,setInName] = useState([]);

    const [checkin,setCheckin] = useState([{
        idx:0,
        uid:'0000',
        name:'',
        point:10,
        temp:'36.5',
        date:'2021-5-07',
        checkin:'12:00:00',
        checkout:null,
        work:0
    }]);

    const [inDate, setInDate] = useState();

    let listKey = 0;
    
    let inputRef = useRef();
    
    let [test,setTest] = useState(['1']);

    // const updateField = (field, value, update = true) => {
    //     if (update) onSearch(value);
    //     if (field === 'keyword') {
    //         setUseName(value);
    //     }
    //     if (field === 'results') {
    //         setResult(value);
    //     }
    // }

    useEffect(()=>{
        console.log("MemberList_useEffect",member.length);
        if(member.length<3)
        {
          listKey = 0;
          console.log('ManagerWindow',"멤버정보 불러오기");
    
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

    useEffect(()=>{
    })

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const onSearch = (inputName) => {
        var Results = member.filter(item => true === subMatchName(item.name, inputName));
        console.log('onSearch',Results,Results.length);
        setResult( Results );
    };
    
    const subMatchName = (name, keyword) => {
        var keyLen = keyword.length;
        name = name.toLowerCase().substring(0, keyLen);
        if (keyword === "") return false;
        return name === keyword.toString().toLowerCase();
    };

    let onNameChange = (e)=>{
        console.log('onNameChange',e.target.value);
        setUseName(e.target.value);
        onSearch(e.target.value);
    }

    let onInputClick = ()=>{
        console.log('onInputClick');
        setfocusidx(-1);
    }



    let addName = ()=>{
        var Results = member.filter((item) =>{return item.name===useName});
        console.log('addName',Results);

        if(Results.length===1)
        {
            var overlap = inName.filter((item) =>{return item.name===Results[0].name})
            if(overlap.length!=0)
            {
                console.log('addName','err1',Results);
                setModelTitle('에러');
                setModelText('이미 기록되있는 자료입니다');
                handleShow();
            }
            else
            {
                let addName = inName;
                let newName = {'name':Results[0].name, 'uid':Results[0].uid};
                addName.push(newName);
                console.log('setInName',addName);
                setInName(addName);
                setUseName('');
            }
        }
        else if(Results.length===0)
        {
            setModelTitle('에러');
            setModelText('일치하는 자료가 없습니다');
            handleShow();
        }
        else
        {
            setModelTitle('에러');
            setModelText('중복되는 자료가 존재합니다');
            handleShow();
        }
    }

    let delName = ()=>{
        if(inName.length>0)
        {
            setInName(inName.filter((e,i)=>{
                if((inName.length-1)!=i)
                    return e;
                }));
        }
    }

    let onInputKeyPress = (e)=>{
        console.log('onInputKeyPress',e,e.key);
        if(e.type = 'keyup')
        {
            if(e.key =='ArrowDown' && results.length>0)
            {
                console.log('ArrowDown','id'+0);
                document.getElementById('id'+0).focus();
                setfocusidx(0);
            }
            else if(e.key =='Enter' && useName != '')
            {
                addName()
            }
        }
    }

    let onDropdownonClick = (e)=>{
        console.log('onDropdownonClick',e,results);
        setUseName(results[e].name);
        onSearch(results[e].name);
        document.getElementById('nameinput').focus();
    }

    let onDropKeyPress = (e)=>{
        console.log('onDropKeyPress',e.key);
        if(e.type = 'keyup')
        {
            if(e.key =='ArrowDown' && (results.length-1)>focusidx)
            {
                console.log('onDropKeyPress',results.length,focusidx);

                console.log('ArrowDown','id'+(focusidx+1));
                document.getElementById('id'+(focusidx+1)).focus();
                setfocusidx(focusidx+1);
            }
            if(e.key =='ArrowUp')
            {
                if(focusidx==0)
                {
                    document.getElementById('nameinput').focus();
                    setfocusidx(-1);
                }
                else
                {
                    document.getElementById('id'+(focusidx-1)).focus();
                    setfocusidx(focusidx-1);
                }
            }
            else if(e.key =='Enter')
            {
                console.log('onDropKeyPress','Enter',focusidx,results);
                setUseName(results[focusidx].name);
                document.getElementById('nameinput').focus();
                setResult([]);
            }
        }
    }

    let onDateChange = (date) =>{
        console.log('onDateChange',date);
        setInDate(moment(date).format('YYYY-MM-DD'));
    }

    // idx:0,
    // uid:'0000',
    // nickname:'',
    // point:10,
    // temp:'36.5',
    // date:'2021-5-07',
    // checkin:'12:00:00',
    // checkout:null,
    // work:0

    let sendQuery = ()=>{
        let data = inName.map((e)=>{
        return {uid:e.uid,name:e.name,point:10,temp:'36.5',date:inDate,checkin:'12:00:00',work:0};
        })
        console.log('sendQuery',data);

        fetch(serverIP+"/in_checkin", {
            method : "post", // 통신방법
            headers : {
              "content-type" : "application/json",
            },
            body : JSON.stringify(data),
          })
          .then((res)=>{console.log('sendQuery',res)});
    }

    return(
        <div>
            <h3> Manager Window </h3>
        {
            <div>
                <div className='Manager'>
                    <ListGroup>
                        <ListGroup.Item>
                            NickName :
                        </ListGroup.Item>
                    </ListGroup>
                        
                    <div>
                        <FormControl id='nameinput' className='Manager-input-name' value={useName} onChange={onNameChange} onClick={onInputClick} onKeyDown={onInputKeyPress} ></FormControl>
                        <div className='Manager-dropdown' >
                        {
                            (results.length!==0)?(
                                <Dropdown onSelect={onDropdownonClick}>
                                    {
                                        results.map((e,i)=>{
                                            console.log('results.map'+i);
                                            return(
                                                <Dropdown.Item key={i} eventKey={i} id={'id'+i} href={"#/action-"+i}  onKeyDown={onDropKeyPress} >{e.name}</Dropdown.Item>
                                            )
                                        })
                                    }
                                </Dropdown>
                            ):null
                        }
                        </div>
                    </div>

                    <Button variant="secondary" onClick={addName}>추가</Button>
                    <Button variant="danger" onClick={delName}>제거</Button>

                    <Modal show={showModal} onHide={handleClose} animation={false}>
                        <Modal.Header closeButton>
                        <Modal.Title>{modelTitle}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>{modelText}</Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        </Modal.Footer>
                    </Modal>
                </div>

                <div className='Manager'>
                    <div className='Manager-inputList'>
                        <ListGroup.Item>
                            ------
                        </ListGroup.Item>
                    </div>
                </div>
                    
                <div className='Manager'>
                    <div className='Manager-inputList'>

                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                <th>#</th>
                                <th>name</th>
                                <th>uid</th>
                                </tr>
                            </thead>
                        {

                            (inName.length!==0)?(
                                <tbody>
                                {
                                inName.map((e,i)=>{
                                        return(
                                            <tr key ={i}>
                                                <td>{i}</td>
                                                <td>{e.name}</td>
                                                <td>{e.uid}</td>
                                            </tr>
                                        )
                                    })
                                }
                                </tbody>
                            ):null
                        }
                        </Table>

                    </div>
                </div>


                <div className='Manager'>
                    <Calendar onChange={onDateChange} />
                </div>

                <div className='Manager'>
                    <ListGroup.Item>
                            Date :
                    </ListGroup.Item>
                    <FormControl id='nameinput' className='Manager-input-name' value={inDate}></FormControl>
                </div>

                <Button variant="secondary" onClick={sendQuery}>전송</Button>

            </div>
        }
        </div> 
    )
}

export default ManagerWindow;