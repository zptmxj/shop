import './Farmer.scss';
import React,{useState,useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import {Pagination , Modal, Button,ProgressBar,Alert} from 'react-bootstrap';
import {serverPath,imagePath,farmPath} from '../IP_PORT';
import {useSelector} from 'react-redux'

function Farmer()
{
    let member = useSelector((state)=>{return state.member});
    let userData = useSelector((state)=>{return state.data});
    let [userId,setUserId] = useState(userData.uid);

    let history = useHistory();
    const [sel, setSel] = useState(-1);
    const [modalShow, setModalShow] = useState(false);
    const [miniShow, setMiniShow] = useState(false);
    const [miniText, setMiniText] = useState("");
    const [isSpinner, setIsSpinner] = useState(false);
    const [refresh, setRefresh] = useState(true);

    const [isAlert, setIsAlert] = useState(false);
    const [alertColor,setAlertColor] = useState("primary");
    const [fields, setFields] = useState([]);
    const [btnInfo, setBtnInfo] = useState({name:"벌목",path:"/farmer/felling.png"});
    const [farmer, setFarmer] = useState([]);
    const [crops, setCrops] = useState([]);
    const [cropsProg, setCropsProg] = useState(0);
    const [cropsTime, setCropsTime] = useState("");

    useEffect(()=>{
        if(!modalShow) return;
        let crop = crops.filter((e)=>e.farmidx==sel);
        let time = new Date();
        console.log("crop",crop);    
        if(crop.length>0)
        {
            let dateParts = crop[0].hvstime.split(/[- :]/);
            dateParts[1]=dateParts[1]-1;
            let time2 = new Date(...dateParts);
            let tS  = Math.floor((time2 - time)/1000);
            if(tS>0){
                let prog;
                if(crop[0].crop==1) prog = 3600;
                else if(crop[0].crop==2) prog = 7200;
                else if(crop[0].crop==4) prog = 14400;

                console.log("prog",prog);    
                console.log("tS",tS);    
                setCropsProg(100-Math.ceil(tS/(prog/100)));

                let tH = Math.floor(tS/3600);
                tS-=(tH*3600);
                let tM = Math.floor(tS/60);
                tS-=(tM*60);
                setCropsTime(`${('00' + tH).slice(-2)}:${('00' + tM).slice(-2)}:${('00' + tS).slice(-2)}`);
            }
            else{
                setCropsProg(100);
                setCropsTime(`00:00:00`);
            }

        }
        let timer = setInterval(()=>{
            setRefresh(true);
        },1000);
        return () => clearInterval(timer);
    },[refresh,modalShow]);
    
    // modalShow
    useEffect(()=>{

        if(refresh)
        {
            setRefresh(false);
            fetch(farmPath()+"/out_farmfield",{
                method:"post",
                headers : {
                    "content-type" : "application/json",
                },
                body : JSON.stringify(),
            })
            .then((res)=>res.json())
            .then((json)=>{
                console.log('out_farmfield', json);
                setFields(json);
            })
            
            fetch(farmPath()+"/out_crops",{
                method:"post",
                headers : {
                    "content-type" : "application/json",
                },
                body : JSON.stringify(),
            })
            .then((res)=>res.json())
            .then((json)=>{
                console.log('out_crops', json);
                setCrops(json);
            })
        }
    });

    const onModal = (idx,path)=>{
        console.log('onModal', idx);
        setModalShow(true);
    } 

    const onMini = (str,n)=>{
        let colorlist = ["danger","primary"];
        setAlertColor(colorlist[n]);
        setMiniText(str);
        setMiniShow(true);
        setIsSpinner(false);
    } 


    const onSend = (idx)=>{

        let url = idx==0?"/in_felling":"/in_clearing"
        let data = {idx:sel, uid:userId};
        fetch(farmPath()+url,{
            method:"post",
            headers : {
                "content-type" : "application/json",
            },
            body : JSON.stringify(data),
        })
        .then((res)=>res.json())
        .then((json)=>{
            console.log(url, json);
            try {
                if(json.succes=="succes") 
                {
                    setModalShow(false);
                    setRefresh(true);
                    setSel(-1);
                }
                else 
                {
                    if(json.err=="over") 
                        onMini("이미 농지가 있습니다.",0);
                    if(json.err=="lack") 
                        onMini(idx==0?"포인트가 부족합니다":"이미 주인이 있습니다.",0);
                    if(json.err=="asset") 
                        onMini("서버 에러 : asset",0);
                }
            }catch (e) {
                onMini("서버에서 처리를 실패 했습니다",0);
            }
        })
    }

    const onHide = ()=>{
        setModalShow(false)
    }

    const onButton = ()=>{
        setModalShow(true);
    }

    const onSelField = (idx,date)=>{
        console.log(idx,date);
        setSel(idx);
        let farmerinfo = member.filter((m)=>m.uid==date);
        setFarmer(farmerinfo);
        if(farmerinfo.length>0){
            setBtnInfo({name:farmerinfo[0].name,path:"/avatars/"+farmerinfo[0].path});

            setCropsTime()
        }
        else if(date=="----"){
            setBtnInfo({name:"개간",path:"/farmer/clearing.png"});
        }
        else{
            setBtnInfo({name:"벌목",path:"/farmer/felling.png"});
        }
    }

    

    return(
        <div>
            <div className="title">
                <h3> Farmer </h3>
            </div>
            <div className="Farmer-top">
                <img src={imagePath()+"/farmer/Farm01.png"} width={70} height={70}/>
                <div className="Farmer-img-l"> <img src={imagePath()+"/farmer/farmer00.png"} width={100} height={100}/> </div>
                <div className="Farmer-img-r"> <img src={imagePath()+"/farmer/farmer01.png"} width={100} height={100}/> </div>
                <img src={imagePath()+"/farmer/Farm02.png"} width={70} height={70}/>
            </div>
            <div className="Farmer-midle00">
                <div className={`wrap`}  >
                    <FarmerPixel sel={sel} fields={fields} members={member} onClick={(e,d)=>onSelField(e,d)}/>
                </div>
            </div>
            <div className="Farmer-midle01 my-3">
                {sel==-1?<img className={`Farmer-button p-2 m-1`} src={imagePath()+"/farmer/null.png"} />:<img className={`Farmer-button p-2 m-1`} onClick={()=>onButton()} src={imagePath()+btnInfo.path} />}
            </div>
         

            {
                <Modal
                 show={modalShow}
                 onHide={()=>setModalShow(false)}
                 centered
               >
                    <Modal.Header closeButton>
                        <div className='w-100 flex'><h2 className="m-0">{farmer.length>0?`${farmer[0].name}님의 농장`:btnInfo.name}</h2></div>
                    </Modal.Header>
                    <Modal.Body>
                        { btnInfo.name=="벌목"?
                        <div>
                            <div className='flex m-2'><img className='border border-3 p-3' src={imagePath()+"/farmer/trees.png"} width={150} height={150}/></div>
                            <div className='flex m-4'><h5 className="m-0">나무를 베어 초원지역으로 만듭니다.</h5></div>
                            <div className='m-3'>
                                <p className="m-0">* 50p를 사용합니다.</p>
                                <p className="m-0">* 초원지역은 누구든 사용할 수 있습니다.</p>
                                <p className="m-0">* 초원지역을 개간해야 본인만 사용합니다.</p>
                            </div>
                        </div>:
                        btnInfo.name=="개간"?
                        <div>
                            <div className='flex m-2'><img className='border border-3 p-3' src={imagePath()+"/farmer/grass.png"} width={150} height={150}/></div>
                            <div className='flex m-4'><h5 className="m-0">초원을 개간하여 농지를 만듭니다.</h5></div>
                            <div className='m-3'>
                                <p className="m-0">* 농지는 한개 이상 갖을 수 없습니다.</p>
                                <p className="m-0">* 개간한 지역은 본인만 사용가능합니다.</p>
                                <p className="m-0">* 일정시간 관리하지 않으면 숲으로 돌아갑니다.</p>
                            </div>
                        </div>:
                        farmer.length>0?
                        <div>
                            <div className='Farmer-top mb-4'>
                                <img className='mx-4' src={imagePath()+"/farmer/Farm00.png"} width={50} height={50}/>
                                <img className='' src={imagePath()+"/avatars/"+farmer[0].path} width={70} height={70}/>
                                <img className='mx-1' src={imagePath()+"/farmer/Farm05.png"} width={100} height={100}/>
                            </div>
                            <div className='Farmer-modal-midle mb-2'>
                                <img className='mx-1' src={imagePath()+"/farmer/Farm03.png"} width={50} height={50}/>
                                <img className='Farmer-button p-2 mx-1' src={imagePath()+"/farmer/crops07.png"} width={50} height={50}/>
                                <img className='Farmer-button p-2 mx-1' src={imagePath()+"/farmer/crops07.png"} width={50} height={50}/>
                                <img className='Farmer-button p-2 mx-1' src={imagePath()+"/farmer/crops07.png"} width={50} height={50}/>
                                {farmer[0].animal==0?null:<img className='mx-1' src={imagePath()+"/animals/"+farmer[0].anipath} width={50} height={50}/>}
                            </div>
                            <div className='Farmer-modal-midle mb-0'>
                                <ProgressBar className='Farmer-modal-progress mx-1' now={cropsProg} label={`${cropsProg}%`}/>
                            </div>
                            <div className='Farmer-modal-midle mb-2'>
                                <div className='Farmer-modal-text mx-1'><string>{cropsTime}</string></div>
                            </div>
                            <div className='Farmer-modal-midle'>
                                <img className='mx-1' src={imagePath()+"/farmer/Farm04.png"} width={50} height={50}/>
                                <img className='mx-1' src={imagePath()+"/farmer/Farm04.png"} width={50} height={50}/>
                                <img className='mx-1' src={imagePath()+"/farmer/Farm04.png"} width={50} height={50}/>
                                <img className='mx-1' src={imagePath()+"/farmer/Farm04.png"} width={50} height={50}/>
                                <img className='mx-1' src={imagePath()+"/farmer/Farm04.png"} width={50} height={50}/>
                            </div>
                        </div>:null
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        { btnInfo.name=="벌목"?
                        <div>
                            <Button variant="primary" onClick={()=>{onSend(0)}}>확인</Button>
                            <Button className="mx-3" variant="danger" onClick={onHide}>취소</Button>
                        </div>:
                        btnInfo.name=="개간"?
                        <div>
                            <Button variant="primary" onClick={()=>{onSend(1)}}>확인</Button>
                            <Button className="mx-3" variant="danger" onClick={onHide}>취소</Button>
                        </div>:
                        farmer.length>0?
                            <Button className="mx-3" variant="primary" onClick={onHide}>나가기</Button>
                        :null
                        }
                    </Modal.Footer>
                </Modal>
            }

            {/* <div className="MyPw-button">
                <Button variant="secondary" onClick={onSend}>구매</Button>
            </div> */}

        </div> 
    )
}

function MyPastelColor(props)
{
    let col = props.col;
    let row = props.row;
    let array = [];

    for(let i=0; i<row;i++)
        array.push(i+1);

    let name = "Farmer-color-" + col;

    return (
    <div>
        {
            array.map((e,i)=>{return <div className={`Farmer-rect flex`}  onClick={()=>props.onClick(col+i)}><img src={(col+i)==props.sel?imagePath()+"/farmer/hex_on.png":imagePath()+"/farmer/hex_off.png"} width={74} height={72}/></div>})
        }   
    </div>)
}


function FarmerPixel(props)
{

    let sel = props.sel;
    let fields = props.fields;
    let members = props.members;

    return  fields.map((e,i)=>{
                let farmer = members.filter((m)=>m.uid==e.uid);
                let path = "";
                let css = sel==i?"content-sel":"content";

                if(farmer.length==1)
                    path = imagePath()+"/avatars/"+farmer[0].path;
                else
                    path = e.uid==null? imagePath()+"/farmer/trees.png" : imagePath()+"/farmer/grass.png";

                return <div className={`hex`} onClick={()=>props.onClick(i,e.uid)}>
                    <div className={`hex-inner`}>
                        <div className={css}>
                            <img src={path} width={50} height={50}/>
                        </div>
                    </div>
                </div>
            })
}

export default Farmer;