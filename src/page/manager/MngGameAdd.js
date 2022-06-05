//import Calender from './component/CheckIn/Calender';
import { Form, Button, InputGroup,FormControl,Col,Row,Table,ToggleButton } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import axios from 'axios';
import serverIP from '../../IP_PORT';
import AutoComplete from '../component/AutoComplete/AutoComplete';
import {useSelector} from 'react-redux'
import './MngGameAdd.scss';

function MngGameAdd(props)
{
    let member = useSelector((state)=>{return state.member});

    const [useinfo, setUseinfo] = useState({name:"---",uid:"----"});
    const [titleinfo, setTitleinfo] = useState("");
    const [playerinfo, setPlayerinfo] = useState("");
    const [timeinfo, setTimeinfo] = useState("");
    const [value, setValue] = useState("");

    const [composlist] = useState(["카드","오브젝트","주사위"]);
    const [compos, setCompos] = useState([false,false,false]);
    const [playlist] = useState(["개인전","역할전","팀경쟁","협력"]);
    const [plays, setPlays] = useState([false,false,false,false]);
    const [typelist] = useState(["전략","마피아","추리","TRPG","파티","셋콜렉션","빌드업","타일","베팅","거래","기록","공격","방해"]);
    const [types, setTypes] = useState([false,false,false,false,false,false,false,false,false,false,false,false,false]);
    const [abilitylist] = useState(["상식","조작","계산","심리","민첩","기억"]);
    const [abilitys, setAbilitys] = useState([false,false,false,false,false,false]);

    const [viewImage, setViewImage] = useState('/noimage.jpg');
    const [imagefile, setImagefile] = useState({
        file: "",
        URL: "img/default_image.png",
    });
    const [refresh, setRefresh] = useState(false);

    useEffect(()=>{


    },[])

    useEffect(()=>{
        // if(!imagefile) return false;
        // const imgEL = document.querySelector("imgbox");
        // const reader = new FileReader();
        // reader.onload = () => (imgEL.getElementsByClassName.backgroundImage = 'url(${reader.result})');
        // reader.readAsDataURL(imagefile[0]);
    });


    const onChangeImg = (e)=>{
        let upimg = e.target.files[0]; 
        encodeFileToBase64(upimg);

        const fileReader = new FileReader();
        if(e.target.files[0]){
            fileReader.readAsDataURL(e.target.files[0])
        }
        fileReader.onload = () => {
            setImagefile({
                file: upimg,
                URL: fileReader.result
            });
        }
    }

    const getString = (array)=>{
        let str = '';
        for(let i =0; i<array.length; i++)
        {
            if(array[i] && str.length==0) 
                str += (i+1);
            else if(array[i] ) 
                str += ("," + (i+1) );
        }
        return str;
    }

    const onSendImg = async (e)=>{
        const formData= new FormData();
        formData.append("file",imagefile.file);

        const config = {
            Headers:{
                "content-type":"multipart/form-data"
            }
        };

        let cominfo = getString(compos);
        let playinfo = getString(plays);
        let typeinfo = getString(types);
        let abilityinfo = getString(abilitys);

        await axios.post(serverIP+"/in_gameimage",formData,config)
        .then((json)=>{
            console.log('gameimage',json.data);
            let data ={uid:useinfo.uid, name:titleinfo, image:json.data.filename, explanation:"",
                        pPlayer:playerinfo, pTime:timeinfo, pAge:"", formation:cominfo, playtype:playinfo,
                        category:typeinfo, ability:abilityinfo, point:10};
            
            fetch(serverIP+"/in_boardgame", {
            method : "post", // 통신방법
            headers : {
              "content-type" : "application/json",
            },
            body : JSON.stringify(data),
            })
            .then((res)=>res.json())
            .then((json)=>{
                console.log('succes',json);
            })
            // .then((res)=>{
            //     console.log('sendQuery',res);
            // })
        });




    }

    const encodeFileToBase64 = (fileBlob) => {
        const reader = new FileReader();
        reader.readAsDataURL(fileBlob);
        return new Promise((resolve) => {
          reader.onload = () => {
            setViewImage(reader.result);
            resolve();
          };
        });
      };

    const composCheck = (e,i)=>{
        let com = compos; 
        com[i] = e.currentTarget.checked; 
        console.log('composCheck',com);
        setCompos(com)
        setRefresh(!refresh);
    }

    const playsCheck = (e,i)=>{
        let com = plays; 
        com[i] = e.currentTarget.checked; 
        console.log('playsCheck',com);
        setPlays(com)
        setRefresh(!refresh);
    }
      
    const typesCheck = (e,i)=>{
        let com = types; 
        com[i] = e.currentTarget.checked; 
        console.log('playsCheck',com);
        setTypes(com)
        setRefresh(!refresh);
    }

    const abilitysCheck = (e,i)=>{
        let com = abilitys; 
        com[i] = e.currentTarget.checked; 
        console.log('playsCheck',com);
        setAbilitys(com)
        setRefresh(!refresh);
    }

    const onEnter = (idx)=>{
        setUseinfo(member[idx]);
    }

    return(
        <div>
            <div className="title">
                <h3> Game Add </h3>
            </div>  

            <Form.Group as={Row} controlId="formUser" className="mb-3">
                <Form.Label column xs={3} className="px-0">
                    소유자 :
                </Form.Label>
                <Col xs={3} className='px-0'>
                    <AutoComplete list={member.map(e=>e.name)} value={value} setValue={setValue} onEnter={onEnter} placeholder="Enter로 등록"/>
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

            <Form.Group as={Row} controlId="formTitle" className="mb-3">
                <Form.Label column xs={3} className="px-0">
                    게임명 :
                </Form.Label>
                <Col xs={9}>
                    <Form.Control type="text" placeholder="게임명" value={titleinfo} onChange={(e)=>{setTitleinfo(e.target.value)}}/>
                </Col>
            </Form.Group>

            <div className="MngGame-block">
                <Form.Group as={Row} controlId="formUser" className="mb-3">
                    <Col xs={1} className='px-0'/>
                    <Form.Label column xs={2} className="px-0">
                        인원 :
                    </Form.Label>
                    <Col xs={3} className='px-0'>
                        <Form.Control type="text" placeholder="인원" value={playerinfo} onChange={(e)=>{setPlayerinfo(e.target.value)}} />
                    </Col>
                    <Form.Label column xs={2} className="px-0">
                        시간 :
                    </Form.Label>
                    <Col xs={3} className='px-0'>
                        <Form.Control type="text" placeholder="시간" value={timeinfo} onChange={(e)=>{setTimeinfo(e.target.value)}}/>
                    </Col>
                </Form.Group>
            </div>

            <Form.Group as={Row} controlId="formFile" >
                <Form.Label column xs={4} className="px-0">
                        이미지 등록 :
                </Form.Label>
            </Form.Group>
            <FormControl type="file" accept='image/*' controlId="formImage" onChange={onChangeImg} />
            <div className="MngGame-form my-3">
                    <img src={viewImage} width = "80%"/>
            </div>

            <Form.Group as={Row} controlId="formCompos" >
                <Form.Label column xs={4} className="px-0">
                        구성 : 
                </Form.Label>
            </Form.Group>
            <div className="MngGame-block my-3">
            {
                composlist.map((e,i)=>{
                    return (
                        <ToggleButton
                            className="mb-2"
                            id={"compos"+i}
                            type="checkbox"
                            variant="outline-primary"
                            checked={compos[i]}
                            onChange={(d) => {composCheck(d,i)}}
                        >
                        {e}
                        </ToggleButton>
                    )
                })
            }
            </div>

            

            <Form.Group as={Row} controlId="formPlay" >
                <Form.Label column xs={4} className="px-0">
                        플레이 :
                </Form.Label>
            </Form.Group>
            <div className="MngGame-block my-3">
            {
                playlist.map((e,i)=>{
                    return (
                        <ToggleButton
                            className="mb-2"
                            id={"plays"+i}
                            type="checkbox"
                            variant="outline-primary"
                            checked={plays[i]}
                            onChange={(d) => {playsCheck(d,i)}}
                        >
                        {e}
                        </ToggleButton>
                    )
                })
            }
            </div>

            <Form.Group as={Row} controlId="formType" >
                <Form.Label column xs={4} className="px-0">
                        타입 :
                </Form.Label>
            </Form.Group>
            <div className="MngGame-block my-3">
            {
                typelist.map((e,i)=>{
                    return (
                        <ToggleButton
                            className="mb-2"
                            id={"types"+i}
                            type="checkbox"
                            variant="outline-primary"
                            checked={types[i]}
                            onChange={(d) => {typesCheck(d,i)}}
                        >
                        {e}
                        </ToggleButton>
                    )
                })
            }
            </div>

            <Form.Group as={Row} controlId="formAbility" >
                <Form.Label column xs={4} className="px-0">
                        영향 :
                </Form.Label>
            </Form.Group>
            <div className="MngGame-block my-3">
            {
                abilitylist.map((e,i)=>{
                    return (
                        <ToggleButton
                            className="mb-2"
                            id={"abilitys"+i}
                            type="checkbox"
                            variant="outline-primary"
                            checked={abilitys[i]}
                            onChange={(d) => {abilitysCheck(d,i)}}
                        >
                        {e}
                        </ToggleButton>
                    )
                })
            }
            </div>

            <div className="MngGame-block my-3">
                <Button variant="secondary" onClick={onSendImg}>전송</Button>
            </div>

            
        </div> 
    )
}

export default MngGameAdd;