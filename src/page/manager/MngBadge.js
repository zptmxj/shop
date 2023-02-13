import './MngBadge.scss';
import react,{ useEffect, useState, useRef } from 'react';
import {ListGroup,Dropdown,FormControl,Table,Button,Modal,InputGroup,SplitButton,Alert} from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import {serverPath} from '../../IP_PORT';

function MngBadge(props)
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
    const [history, setHistory] = useState('원숭이');
    const [variance, setVariance] = useState(0);
    const [isAlert, setIsAlert] = useState(false);
    const [alertText, setAlertText] = useState("");
    const [alertColor,setAlertColor] = useState("primary");

    let listKey = 0;
    
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
          console.log('MngBadge',"멤버정보 불러오기");
    
          fetch(serverPath()+"/out_member",{
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

    let setAlert= (str,sel) =>{
        let alertColor = ["danger","primary"];
        console.log("setAlert",str,alertColor[sel]);
        setAlertColor(alertColor[sel]);
        setAlertText(str);
        setIsAlert(true);
        let timer = setTimeout(() => {
            setIsAlert(false);
        }, 1500);

        return ()=>{ clearTimeout(timer) };
    }

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
                setResult([]);
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

    // let onDropdownonClick = (e)=>{
    //     console.log('onDropdownonClick',e,results);
    //     setUseName(results[e].name);
    //     onSearch(results[e].name);
    //     document.getElementById('nameinput').focus();
    // }

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
    let onVarianceChange = (e)=>{
        setVariance(e.target.value);
    }
    let onHistoryChange = (e)=>{
        setHistory(e.target.value);
    }
    

    let sendQuery = ()=>{
        if(isAlert) return;

        let data = inName.map((e)=>{
        return {uid:e.uid,name:e.name,badgeidx:variance};
        })
        console.log('sendQuery',data);

        fetch(serverPath()+"/in_badgelog", {
            method : "post", // 통신방법
            headers : {
              "content-type" : "application/json",
            },
            body : JSON.stringify(data),
          })
          .then((res)=>res.json(res))
          .then((pjson)=>{
              try {
                    console.log(pjson);
                    if(pjson.succes=="succes") 
                        setAlert("기록 완료했습니다",1);
                    else if(pjson.succes=="err")
                        setAlert("서버 에러",0);
              }catch (e) {
                  setAlert("서버에서 처리를 실패 했습니다",0);
                  console.log("서버에서 처리를 실패 했습니다",e);
              }
          })
    }

    let onSelect = (e)=>{
        console.log('onSelect',e,e.target.value);
        setHistory(e.target.value);
    } 

    return(
        <div>
            <div className="title">
                <h3> Manager Badge </h3>
            </div>           
        {
            <div>
                <div className='Manager'>
                    <ListGroup>
                        <ListGroup.Item>
                            Name :
                        </ListGroup.Item>
                    </ListGroup>
                        
                    <div>
                        <FormControl id='nameinput' className='MngBadge-input-name' value={useName} onChange={onNameChange} onClick={onInputClick} onKeyDown={onInputKeyPress} ></FormControl>
                        <div className='MngBadge-dropdown-name' >
                        {
                            (results.length!==0)?(
                                <Dropdown onSelect={onDropdownonClick}>
                                    {
                                        results.map((e,i)=>{
                                            console.log('results.map'+i);
                                            return(
                                                <Dropdown.Item key={i} eventKey={i} id={'id'+i} onKeyDown={onDropKeyPress} >{e.name}</Dropdown.Item>
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
                    <div className='MngBadge-inputList'>

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
                    <InputGroup className='MngBadge-input'>
                        <SplitButton
                        variant="outline-secondary"
                        title="History :"
                        id="segmented-button-dropdown-1"
                        >
                            <Dropdown.Item onClick={()=>{setHistory("원숭이"); setVariance("0")}}>원숭이</Dropdown.Item>
                            <Dropdown.Item onClick={()=>{setHistory("나뭇잎"); setVariance("1")}}>나뭇잎</Dropdown.Item>
                            <Dropdown.Item onClick={()=>{setHistory("한탕주의"); setVariance("2")}}>한탕주의</Dropdown.Item>
                            <Dropdown.Item onClick={()=>{setHistory("코인러"); setVariance("3")}}>코인러</Dropdown.Item>
                            <Dropdown.Item onClick={()=>{setHistory("대주주"); setVariance("4")}}>대주주</Dropdown.Item>
                            <Dropdown.Item onClick={()=>{setHistory("이벤트"); setVariance("5")}}>이벤트</Dropdown.Item>
                            <Dropdown.Item onClick={()=>{setHistory("애완동물"); setVariance("6")}}>애완동물</Dropdown.Item>
                            <Dropdown.Item onClick={()=>{setHistory("광부"); setVariance("7")}}>광부</Dropdown.Item>
                            <Dropdown.Item onClick={()=>{setHistory("프로참석러"); setVariance("8")}}>프로참석러</Dropdown.Item>
                            <Dropdown.Item onClick={()=>{setHistory("임원"); setVariance("9")}}>임원</Dropdown.Item>
                            <Dropdown.Item onClick={()=>{setHistory("표창장"); setVariance("10")}}>표창장</Dropdown.Item>
                            <Dropdown.Item onClick={()=>{setHistory("인싸"); setVariance("11")}}>인싸</Dropdown.Item>
                            <Dropdown.Item onClick={()=>{setHistory("아싸"); setVariance("12")}}>아싸</Dropdown.Item>
                            <Dropdown.Item onClick={()=>{setHistory("인기인"); setVariance("13")}}>인기인</Dropdown.Item>
                            <Dropdown.Item onClick={()=>{setHistory("2020"); setVariance("14")}}>2020</Dropdown.Item>
                            <Dropdown.Item onClick={()=>{setHistory("2021"); setVariance("15")}}>2021</Dropdown.Item>
                            <Dropdown.Item onClick={()=>{setHistory("2022"); setVariance("16")}}>2022</Dropdown.Item>
                            {/* <Dropdown.Item onClick={()=>{setHistory("2023"); setVariance("17")}}>2023</Dropdown.Item> */}
                            <Dropdown.Item onClick={()=>{setHistory("할로윈"); setVariance("18")}}>할로윈</Dropdown.Item>
                            <Dropdown.Item onClick={()=>{setHistory("신분증"); setVariance("19")}}>신분증</Dropdown.Item>
                            <Dropdown.Item onClick={()=>{setHistory("패셔니스타"); setVariance("20")}}>패셔니스타</Dropdown.Item>
                            <Dropdown.Item onClick={()=>{setHistory("애호가"); setVariance("21")}}>애호가</Dropdown.Item>
                            <Dropdown.Item onClick={()=>{setHistory("후원자"); setVariance("22")}}>후원자</Dropdown.Item>
                            <Dropdown.Item onClick={()=>{setHistory("악플러"); setVariance("23")}}>악플러</Dropdown.Item>
                            <Dropdown.Item onClick={()=>{setHistory("균형의수호자"); setVariance("24")}}>균형의수호자</Dropdown.Item>
                        </SplitButton>
                        <FormControl value={history} onChange={onHistoryChange}/>
                    </InputGroup>
                        {/* <Form.Group className='deposit-input' onChange={onSelect}>
                            <Form.Select>
                                <option>Check-In</option>
                                <option>Deposit</option>
                            </Form.Select>
                        </Form.Group> */}
                </div>

                <div className='Manager'>
                    <InputGroup className='MngBadge-input'>
                        <SplitButton
                        variant="outline-secondary"
                        title="Cash :"
                        id="segmented-button-dropdown-1"
                        >
                            <Dropdown.Item onClick={()=>{setVariance("20000")}}>20000</Dropdown.Item>
                            <Dropdown.Item onClick={()=>{setVariance("12000")}}>12000</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={()=>{setVariance("-5000")}}>-5000</Dropdown.Item>
                            <Dropdown.Item onClick={()=>{setVariance("-6000")}}>-6000</Dropdown.Item>
                        </SplitButton>
                        <FormControl value={variance} onChange={onVarianceChange}/>
                    </InputGroup>
                    {/* <ListGroup>
                        <ListGroup.Item>
                            Cash :
                        </ListGroup.Item>
                    </ListGroup>
                    <div>
                        <FormControl id='cashinput' className='deposit-input' value={variance} onChange={onVarianceChange} ></FormControl>
                    </div> */}
                </div>

                <div className="MngBadge-alert">
                    {
                    isAlert?(
                    <Alert variant={alertColor}>
                            {alertText}
                    </Alert >):null
                    }
                </div>

                <Button variant="secondary my-5" onClick={sendQuery}>전송</Button>

            </div>
        }
        </div> 
    )
}

export default MngBadge;