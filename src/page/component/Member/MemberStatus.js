import './MemberStatus.scss';
import { Button,Modal,Form,Row,OverlayTrigger,Tooltip,Toast,ToastContainer } from 'react-bootstrap';
import img_male from './male.png';
import img_female from './female.png';
import up_mg from './up.png';
import down_mg from './down.png';
import {serverPath,imagePath} from '../../../IP_PORT';
import { useEffect, useState } from 'react';
import ReactApexChart from "react-apexcharts"; 
import {useDispatch, useSelector} from 'react-redux'
import img_rea from './status_rea.png';
import img_role from './status_role.png';
import img_stra from './status_stra.png';
import img_oper from './status_oper.png';
import img_agil from './status_agil.png';
import img_gamb from './status_gamb.png';

function MemberStatus(props){

    const [miniShow, setMiniShow] = useState(false);
    const [miniText, setMiniText] = useState("");
    const [inputShow, setInputShow] = useState(false);
    const [inputText, setInputText] = useState("");
    const [favorValue, setFavorValue] = useState(0);
    const [alertText, setAlertText] = useState("");

    const [alertColor,setAlertColor] = useState("primary");
    const [stasel, setStasel] = useState([false,false,false,false,false,false]);
    const [refresh, setRefresh] = useState(false);
    
    const userData = useSelector((state)=>{return state.data});
    const member = useSelector((state)=>{return state.member});
    const [userId,setUserId] = useState(userData.uid);
    const [userName,setUserName] = useState(userData.name);
    const [isFavor, setIsFavor] = useState(false);
    const [favordata, setFavordata] = useState([]);
    const [favorUp, setFavorUp] = useState(0);
    const [favorDown, setFavorDown] = useState(0);


    const data = props.data;
    const isButton = props.isButton;
    const series = props.status.series[0];
    const Year = new Date().getFullYear();
    const img = imagePath()+ "/avatars/" + data.path;
    const myavatar = imagePath()+ "/avatars/" + userData.avatar;

    useEffect(()=>{
        console.log("MemberStatus_useEffect");
        if(!isFavor)
        {
            let uid = {uid:data.uid}
            fetch(serverPath()+"/out_favor",{
                method:"post",
                headers : {
                    "content-type" : "application/json",
                },
                body : JSON.stringify(uid),
            })
            .then((res)=>res.json())
            .then((all)=>{
                setFavordata(all);
                setIsFavor(true);
            });
        }
    })

    let text = "??????"
    let classN = "list-td-button-off"
    if(isButton)
    {
        classN= "list-td-button mr-1";
        text="??????";
    } 

    function timeForToday(value) {
        const today = new Date();
        const timeValue = new Date(value);

        const betweenTime = Math.floor((today.getTime() - timeValue.getTime()) / 1000 / 60);
        if (betweenTime < 1) return '?????????';
        if (betweenTime < 60) {
            return `${betweenTime}??????`;
        }

        const betweenTimeHour = Math.floor(betweenTime / 60);
        if (betweenTimeHour < 24) {
            return `${betweenTimeHour}?????????`;
        }

        const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
        if (betweenTimeDay < 365) {
            return `${betweenTimeDay}??????`;
        }

        return `${Math.floor(betweenTimeDay / 365)}??????`;
    }

    const onMini = (str,n)=>{
        let colorlist = ["danger","primary"];
        setAlertColor(colorlist[n]);
        setMiniText(str);
        setMiniShow(true);
    } 

    const onMiniOk = ()=>{
        setMiniShow(false);
        props.onSend();
    }

    const onFavorOk = ()=>{
        if(favorValue==0) setAlertText("????????? 0?????? ?????? ?????? ????????????.")
        else {
            let pay = {uid:userId , pay:Math.abs(favorValue)};

            fetch(serverPath()+"/check_point",{
                method:"post",
                headers : {
                    "content-type" : "application/json",
                },
                body : JSON.stringify(pay),
            })
            .then((res)=>res.json(res))
            .then((json)=>{
                try {
                    let favorjson = {uid:userId,name:userName,targetuid:data.uid,favor:favorValue,text:inputText};
                    if(json.succes=="succes") 
                    {
                        fetch(serverPath()+"/in_favor",{
                            method:"post",
                            headers : {
                                "content-type" : "application/json",
                            },
                            body : JSON.stringify(favorjson),
                        })
                        .then((res)=>res.json(res))
                        .then((json)=>{
                            console.log(json);
                            try {
                                if(json.succes=="succes") 
                                {
                                    setInputShow(false);
                                    setIsFavor(true);
                                }
                                else
                                    setAlertText("?????? ??????");
                            }catch (e) {
                                setAlertText("???????????? ????????? ?????? ????????????");
                            }
                        })
                    }
                    else 
                    {
                        if(json.err=="lack") 
                            setAlertText("???????????? ???????????????");
                        else
                            setAlertText("?????? ??????");
                    }
                }catch (e) {
                    setAlertText("???????????? ????????? ?????? ????????????");
                    console.log("???????????? ????????? ?????? ????????????",e);
                }
            })

            if(onFavorSend())
            {
                setInputShow(false);
            }
        }
    }

    const onFavorSend = ()=>{
        
    }

    const onSend = ()=>{
        if(!isButton) {
            onMini("????????? ?????? ????????? ???????????????.\n* ?????? 3?????? ?????? ???????????????\n* ????????? ????????? ???????????? ????????????.",1)   
        }
        else{
            let param = {uid:userId , targetuid:data.uid, point:10, rea:0,role:0,stra:0,oper:0,agil:0,gamb:0};
            if(stasel[0]) param.rea=1;
            if(stasel[1]) param.role=1;
            if(stasel[2]) param.stra=1;
            if(stasel[3]) param.oper=1;
            if(stasel[4]) param.agil=1;
            if(stasel[5]) param.gamb=1;


            fetch(serverPath()+"/buy_status",{
                method:"post",
                headers : {
                    "content-type" : "application/json",
                },
                body : JSON.stringify(param),
            })
            .then((res)=>res.json(res))
            .then((json)=>{
                console.log('buy_status', json);
                try {
                    if(json.succes=="succes") 
                    {
                        onMini("????????? ??????????????????",1);
                    }
                    else 
                    {
                        if(json.err=="lack") 
                            onMini("???????????? ???????????????",0);
                        if(json.err=="avatar") 
                            onMini("?????? ?????? : avatar",0);
                        if(json.err=="asset") 
                            onMini("?????? ?????? : asset",0);
                    }
                }catch (e) {
                    onMini("???????????? ????????? ?????? ????????????",0);
                }
            })
        }
    }
    const onCancel = ()=>{
        setStasel([false,false,false,false,false,false]);
        props.onCancel();
    }
    

    const onCheck = (i)=>{
        console.log('onCheck',i);
        let sels = stasel;
        let limit = 0;
        for(let i=0;i<sels.length;i++) if(sels[i])limit++;

        if(limit>2 && sels[i]==false) return;
        
        sels[i] = !sels[i];
        setStasel(sels);
        setRefresh(!refresh);
    }
    return(
        <div>
            <table className="list-Table" >
                <tbody>
                    <tr>
                        <th className="list-th"></th>
                        <th className="list-th"></th>
                        <th className="list-th"></th>
                        <th className="list-th"></th>
                        <th className="list-th"></th>
                        <th className="list-th"></th>
                    </tr>
                    <tr>
                        <td className="list-td" rowSpan={2} colSpan={2}>
                            <img src={img} width='90px' height='90px'/>
                        </td>
                        <td className="list-td" colSpan={2} onClick={()=>{props.setMemberSel(data.idx)}}>{ data.name }</td>
                        <td className="list-td">{((Year+1)-data.age)}</td>
                        <td className="list-td">{data.sex?
                            <img src={img_female} width='30px' height='30px'/>:
                            <img src={img_male} width='30px' height='30px'/>
                        }</td>
                    </tr>
                    <tr>
                        <td className="list-td" colSpan={2}>{"--"}</td>
                        <td className="list-td" colSpan={2}>{data.total_point+" TP"}</td>
                    </tr>
                    <tr>
                        <td className="list-td" rowSpan={4} colSpan={4}>
                                <ReactApexChart options={props.status.options} series={props.status.series} type="radar" height={180}/>
                        </td>
                        <td className="list-td" colSpan={1}>
                            <img src={img_rea} className="memlist-status-sel mr-1" width='20px' height='20px'/>
                            {isButton?
                            <OverlayTrigger key="top" placement="top" overlay={<Tooltip id={'rea'}>??????</Tooltip>}>
                            <input type='checkbox' id='rd1' onChange={()=>onCheck(0)} checked={stasel[0]}/>
                            </OverlayTrigger>:<>{series.data[0]}</>
                            }
                        </td>
                        <td className="list-td" colSpan={1}>
                            <img src={img_role} className="mr-1" width='20px' height='20px'/>
                            {isButton?
                            <OverlayTrigger key="top" placement="top" overlay={<Tooltip id={'rea'}>??????</Tooltip>}>
                            <input type='checkbox' id='rd1' onChange={()=>onCheck(1)} checked={stasel[1]}/>
                            </OverlayTrigger>:<>{series.data[1]}</>
                            }
                        </td>
                    </tr>
                    <tr>
                        <td className="list-td" colSpan={1}>
                            <img src={img_stra} className="mr-1" width='20px' height='20px'/>
                            {isButton?
                            <OverlayTrigger key="top" placement="top" overlay={<Tooltip id={'rea'}>??????</Tooltip>}>
                            <input type='checkbox' id='rd1' onChange={()=>onCheck(2)} checked={stasel[2]}/>
                            </OverlayTrigger>:<>{series.data[2]}</>
                            }
                        </td>
                        <td className="list-td" colSpan={1}>
                            <img src={img_oper} className="mr-1" width='20px' height='20px'/>
                            {isButton?
                            <OverlayTrigger key="top" placement="top" overlay={<Tooltip id={'rea'}>??????</Tooltip>}>
                            <input type='checkbox' id='rd1' onChange={()=>onCheck(3)} checked={stasel[3]}/>
                            </OverlayTrigger>:<>{series.data[3]}</>
                            }
                        </td>
                    </tr>
                    <tr>
                        <td className="list-td" colSpan={1}>
                            <img src={img_agil} className="mr-1" width='20px' height='20px'/>
                            {isButton?
                            <OverlayTrigger key="top" placement="top" overlay={<Tooltip id={'rea'}>??????</Tooltip>}>
                            <input type='checkbox' id='rd1' onChange={()=>onCheck(4)} checked={stasel[4]}/>
                            </OverlayTrigger>:<>{series.data[4]}</>
                            }
                        </td>
                        <td className="list-td" colSpan={1}>
                            <img src={img_gamb} className="mr-1" width='20px' height='20px'/>
                            {isButton?
                            <OverlayTrigger key="top" placement="top" overlay={<Tooltip id={'rea'}>??????</Tooltip>}>
                            <input type='checkbox' id='rd1' onChange={()=>onCheck(5)} checked={stasel[5]}/>
                            </OverlayTrigger>:<>{series.data[5]}</>
                            }
                        </td>
                    </tr>
                    <tr>
                        <td className="list-td" colSpan={2}>
                            <Button className={classN} onClick={onSend} disabled={userId==data.uid}>{text}</Button>
                            {isButton?<Button className="list-td-button" variant="danger" onClick={onCancel}>??????</Button>:null}
                        </td>
                    </tr>
                    <tr>
                        <td className="list-td" colSpan={3}>
                            <div className="flex">
                                <img src={up_mg} width='30px' height='30px'/>
                                <p className="px-3 my-0">{favorUp}</p>
                            </div>
                        </td>
                        <td className="list-td" colSpan={3}>
                            <div className="flex">
                                <img src={down_mg} width='30px' height='30px'/>
                                <p className="px-3 my-0">{favorDown}</p>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className="list-th"></td>
                        <td className="list-th"></td>
                        <td className="list-th"></td>
                        <td className="list-th"></td>
                        <td className="list-th"></td>
                        <td className="list-th"></td>
                    </tr>
                </tbody>
            </table>
            <Modal
                show={miniShow}
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                backdrop={"static"}
                centered
            >
                <Modal.Body className='memlist-mini'>
                    <p>{miniText}</p>
                </Modal.Body>
                <Modal.Footer>
                <Button variant={alertColor} onClick={onMiniOk}>??????</Button>
                </Modal.Footer>
            </Modal>

            <Button className='my-3' onClick={()=>{setAlertText(""); setInputShow(true)}} disabled={userId==data.uid}>????????? ??????</Button>
            
            <Modal
                show={inputShow}
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                backdrop={"static"}
                onHide={()=>{setInputShow(false)}}
                centered
                
            >
                <Modal.Header closeButton>
                    <img src={myavatar} width='40px' height='40px' className="rounded me-2" alt="" />
                    <strong className="me-auto fs-3">??????</strong>
                </Modal.Header>
                <Modal.Body >
                    <div className='memlist-input mb-3'>
                        {
                            favorValue>=0?
                            <img src={up_mg} width='40px' height='40px' className="rounded me-2" alt="" />:
                            <img src={down_mg} width='40px' height='40px' className="rounded me-2" alt="" />
                        }
                        <strong className="fs-3">{favorValue}</strong>
                    </div>
                    <Form.Range step={10} min={-50} max={50} value={favorValue} onChange={(e)=>{console.log("onChange",e.target.value); setFavorValue(e.target.value)}} className="fs-3"/>
                    <small className="me-auto">* ???????????? Point??? ???????????????</small>
                </Modal.Body>
                <Modal.Body className='memlist-mini'>
                    <Form>
                        <Form.Control as="textarea" value={inputText} onChange={(e)=>{if(e.target.value.length<41)setInputText(e.target.value)}} />
                    </Form>
                    <small>{inputText.length + "/40"}</small>
                </Modal.Body>
                <Modal.Footer>
                    <small className="me-auto fs-red">{alertText}</small>
                    <Button variant={alertColor} onClick={onFavorOk}>?????????</Button>
                </Modal.Footer>
            </Modal>

            {
                favordata.map((e)=>{
                    let classN = "toast-l mt-3";
                    let icon = up_mg;
                    let mem = member.map((mem)=>{
                        if(e.uid == mem.uid)
                            return mem;
                    })

                    let userAvatar = imagePath()+ "/avatars/" + mem[0].path;
                    console.log("userAvatar",userAvatar);
                    if(e.favor<0)
                    {
                        classN = "toast-r mt-3";
                        icon = down_mg;
                    }
                    return(
                        <div className={classN}>                
                            <Toast >
                                <Toast.Header closeButton={false}>
                                    <img src={userAvatar} width='20px' height='20px' className="rounded me-2" alt="" />
                                    <strong className="me-auto">??????</strong>
                                    <img src={icon} width='20px' height='20px'/>
                                    <strong className="me-2">{e.favor}</strong>
                                    <small>{timeForToday(e.date)}</small>
                                </Toast.Header>
                                <Toast.Body>{e.text}</Toast.Body>
                            </Toast>
                        </div>
                    )
                }) 
            }
            {/* <Toast className="toast mt-3">
                <Toast.Header closeButton={false}>
                    <img src={img} width='20px' height='20px' className="rounded me-2" alt="" />
                    <strong className="me-auto">??????</strong>
                    <img src={up_mg} width='20px' height='20px'/>
                    <strong className="me-2">+20</strong>
                    <small>1??????</small>
                </Toast.Header>
            </Toast>
            <div className="toast-r mt-3">                
                <Toast >
                    <Toast.Header closeButton={false}>
                        <img src={img} width='20px' height='20px' className="rounded me-2" alt="" />
                        <strong className="me-auto">??????</strong>
                        <img src={down_mg} width='20px' height='20px'/>
                        <strong className="me-2">-20</strong>
                        <small>1??????</small>
                    </Toast.Header>
                    <Toast.Body>Hello, world!.</Toast.Body>
                </Toast>
            </div>
            <Toast className="toast mt-3">
                <Toast.Header closeButton={false}>
                    <img src={img} width='20px' height='20px' className="rounded me-2" alt="" />
                    <strong className="me-auto">??????</strong>
                    <img src={up_mg} width='20px' height='20px'/>
                    <strong className="me-2">+20</strong>
                    <small>1??????</small>
                </Toast.Header>
                <Toast.Body>Hello, world!.</Toast.Body>
            </Toast> */}
            <div className='my-5'>
                <Button  onClick={props.callback}>??????</Button>
            </div>
        </div>
    )
}



export default MemberStatus;