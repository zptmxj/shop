import './Farmer.scss';
import React,{useState,useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import {Pagination , Modal, Button,Spinner,Alert} from 'react-bootstrap';
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
    const [isTouch, setIsTouch] = useState([false]);

    const [isAlert, setIsAlert] = useState(false);
    const [alertColor,setAlertColor] = useState("primary");
    const [fields, setFields] = useState([]);
    const [btnInfo, setBtnInfo] = useState({name:"벌목",path:"/farmer/felling.png"});

    useEffect(()=>{
        // console.log('useEffect', member);

        // let mem = member.filter((e)=>{
        //     if(e.uid == userId) 
        //         return e;
        // });


        // let element = document.getElementById("test");
        // console.log("element",element, element.className);
        // element.className = "Farmer-color-16";

        if(fields.length == 0)
        {
            fetch(farmPath()+"/out_farmfield",{
                method:"post",
                headers : {
                    "content-type" : "application/json",
                },
                body : JSON.stringify(),
            })
            .then((res)=>res.json())
            .then((json)=>{
                console.log('out_Farmer', json);
                setFields(json);
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

        fetch(serverPath()+"/buy_Farmer",{
            method:"post",
            headers : {
                "content-type" : "application/json",
            },
            body : JSON.stringify({Farmer:idx, uid:userId}),
        })
        .then((res)=>res.json())
        .then((json)=>{
            console.log('buy_Farmer', json);
            try {
                if(json.succes=="succes") 
                {
                    setModalShow(false);
                    onMini("구매를 완료했습니다",1);
                }
                else 
                {
                    if(json.err=="lack") 
                        onMini("포인트가 부족합니다",0);
                    if(json.err=="Farmer") 
                        onMini("서버 에러 : Farmer",0);
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

    const onCollback = (idx,date)=>{
        console.log(idx,date);
        setSel(idx);
        let farmer = member.filter((m)=>m.uid==date);

        if(farmer.length>0){
            setBtnInfo({name:farmer[0].name,path:"/avatars/"+farmer[0].path});
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
                    <FarmerPixel fields={fields} members={member} onClick={(e,d)=>onCollback(e,d)}/>
                </div>
            </div>
            <div className="Farmer-midle01 my-3">
                <img className={`Farmer-button p-2 m-1`} onClick={()=>onSend()} src={imagePath()+btnInfo.path} />
            </div>
         

            {
                <Modal
                 show={miniShow}
                 size="sm"
                 aria-labelledby="contained-modal-title-vcenter"
                 backdrop={"static"}
                 className="Farmer-mini"
                 centered
               >
                 <Modal.Body>
                    <h5>{miniText}</h5>
                 </Modal.Body>
                 <Modal.Footer>
                   <Button variant={alertColor} onClick={()=>{setMiniShow(false)}}>확인</Button>
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

                if(farmer.length==1)
                    path = imagePath()+"/avatars/"+farmer[0].path;
                else
                    path = e.uid==null? imagePath()+"/farmer/trees.png" : imagePath()+"/farmer/grass.png";

                console.log(path);

                return <div className={`hex`} onClick={()=>props.onClick(i,e.uid)}>
                    <div className={`hex-inner`}>
                        <div className={`content`}>
                            <img src={path} width={50} height={50}/>
                        </div>
                    </div>
                </div>
            })
}

export default Farmer;