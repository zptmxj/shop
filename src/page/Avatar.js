import './Avatar.scss';
import React,{useState,useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import {Pagination , Modal, Button,Spinner,Alert} from 'react-bootstrap';
import {serverPath,imagePath} from '../IP_PORT';
import {useSelector} from 'react-redux'

function Avatar()
{
    let member = useSelector((state)=>{return state.member});
    let userData = useSelector((state)=>{return state.data});
    let [userId,setUserId] = useState(userData.uid);

    let history = useHistory();
    const [sel, setsel] = useState(0);
    const [imgNum, setImgNum] = useState(0);
    const [imgPath, setImgPath] = useState('');
    const [avatars, setAvatars] = useState([]);
    const [sex, setSex] = useState();
    const [modalShow, setModalShow] = useState(false);
    const [miniShow, setMiniShow] = useState(false);
    const [miniText, setMiniText] = useState("");
    const [isSpinner, setIsSpinner] = useState(false);

    const [isAlert, setIsAlert] = useState(false);
    const [alertColor,setAlertColor] = useState("primary");

    useEffect(()=>{
        console.log('useEffect', member);

        let mem = member.filter((e)=>{
            if(e.uid == userId) 
                return e;
        });
        setSex(mem[0].sex);

        if(avatars.length == 0)
        {
            fetch(serverPath()+"/out_avatar",{
                method:"post",
                headers : {
                    "content-type" : "application/json",
                },
                body : JSON.stringify({sex:mem[0].sex}),
            })
            .then((res)=>res.json())
            .then((json)=>{
                console.log('out_avatar', json);
                setAvatars(json);
            })
        }
    });

    const onModal = (idx,path)=>{
        console.log('onModal', idx);
        setModalShow(true);
        setImgNum(idx);
        setImgPath(path);
    } 

    const onMini = (str,n)=>{
        let colorlist = ["danger","primary"];
        setAlertColor(colorlist[n]);
        setMiniText(str);
        setMiniShow(true);
        setIsSpinner(false);
    } 


    const onSend = (avt)=>{
        setIsSpinner(true);

        fetch(serverPath()+"/buy_avatar",{
            method:"post",
            headers : {
                "content-type" : "application/json",
            },
            body : JSON.stringify({avatar:avt.idx, uid:userId,point:avt.point}),
        })
        .then((res)=>res.json())
        .then((json)=>{
            console.log('buy_avatar', json);
            try {
                if(json.succes=="succes") 
                {
                    setModalShow(false);
                    setAvatars([]);
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

    const onHide = ()=>{
        setModalShow(false)
    }


    return(
        <div>
            <div className="title">
                <h3> Avatar </h3>
            </div>
            <AvatarList array={avatars} sel={sel} sex={sex} onClick={(idx,path)=>onModal(idx,path)}/>
            <div className="Avatar-pag">
                <MyPagination max={Math.ceil(avatars.length/16)} sel={sel} setValue={(idx)=>(setsel(idx-1))} />
            </div>
            {
                avatars.length>0?<MyModal
                    show={modalShow}
                    onSend={(avt)=>{onSend(avt)}}
                    onHide={onHide}
                    avatar={avatars[(sel*16)+imgNum]}
                    imgpath={imgPath}
                    isspinner={isSpinner}
                />:null
            }
            {
                <Modal
                 show={miniShow}
                 size="sm"
                 aria-labelledby="contained-modal-title-vcenter"
                 backdrop={"static"}
                 centered
               >
                 <Modal.Body>
                    <h5>{miniText}</h5>
                 </Modal.Body>
                 <Modal.Footer>
                   <Button variant={alertColor} onClick={()=>{setMiniShow(false)}}>??????</Button>
                 </Modal.Footer>
               </Modal>
            }
        </div> 
    )
}

function AvatarList(props)
{
    let sel = props.sel;
    let array = [];
    console.log("AvatarList",sel);


    if(props.array.length>0)
    {
        let max = props.array.length - (sel * 16);
        if(max > 15) max =16;

        for(let i=0; i < max; i++)
            array.push(props.array[(sel*16)+i]);

        console.log("AvatarList",array);

        return (
            <div className="container mag-top">
                <div className="Avatar-midle row">
                    {
                        array.map((e,i)=>{
                            console.log("array.map",array);
                            let path = imagePath()+"/avatars/" + e.path;
                            let classN = "Avatar-img p-0";
                            let uid = "----"
                            let Cilck = ()=>props.onClick(i,path);
                            if(e.uid!=null) 
                            {
                                classN = "Avatar-img-non p-0";
                                uid = e.uid;
                                Cilck = ()=>{};
                            } 
                            return(
                                <>
                                    <div key={i} className="col-3 Avatar-pad ">
                                        <div>
                                            <img className={classN} onClick={Cilck} src={path} />
                                            <p className="mb-0">{uid}</p>
                                        </div>
                                    </div>
                                </>
                            )
                        })
                    }
                </div>
            </div>
        )
    }

}

function MyModal(props) {

    let imgpath=props.imgpath;
    let onSend=props.onSend;
    let isspinner=props.isspinner;
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        backdrop={"static"}
        centered
      >
        <Modal.Header>
            <h4>Buy Avatar</h4>
        </Modal.Header>
        <Modal.Body>
          <div className='row'>
            <img className="Avatar-modal-img col-7" src={imgpath} />
            <div className='col-5'>
                <p className="px-1 pt-3">
                    ?????? : {props.avatar.path.substring(2,6)}
                </p>
                <p className="px-1">
                    ?????? : {props.avatar.point}p
                </p>
            </div>
            <p className="px-3 pt-3 mb-0">
                * ?????? Avatar??? ??????????????? ???????????????.
            </p>
            <p className="px-3 pt-0">
                * ?????? Avatar?????? ??? ????????? ???????????????.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="primary" onClick={()=>{onSend(props.avatar)}} disabled={isspinner}>
                {
                    isspinner?<Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="false"
                    />:null
                }
                ??????
            </Button>
            <Button onClick={props.onHide} variant="danger" disabled={isspinner}>??????</Button>
        </Modal.Footer>
      </Modal>
    );
  }

function MyPagination(props)
{
    let max = props.max;
    let sel = props.sel;
    let isFirst = false;
    let isPrev = false;    
    let isLast = false;
    let isNext = false;
    let array = [];
    let rt = 0;

    const setArray =()=>{
        let limit = 2;
        for(let i = 0; i < max; i++)
        {
            if(sel < 3)
                rt = 4;
            else
                rt = sel+2;
    
            if(max>3 && max-3<sel) limit = max-(sel+1);
            if(i>sel-(5-limit))
                array.push({num:(i+1),active:(i==sel)});
    
            if(i == rt)
                i = max;
        }
    }
    
    setArray();

    const onFirst = ()=>{
        if(sel >0)
            props.setValue(1);
    }
    const onPrev = (e)=>{
        if(sel >0)
            props.setValue(sel);
    }
    const onNext = (e)=>{
        if(sel < (max-1))
            props.setValue(sel+2);
    }

    const onLast = ()=>{
        console.log("onLast",max)
        if(sel < (max-1))
            props.setValue(max);
    }

    const onTime = (e)=>{
        if(e.target.text != undefined)
        {
            console.log("onTime",sel,e.target.text)
            sel = Number(e.target.text);
            props.setValue(sel);
        }
    }

    return (
    <Pagination>
        <Pagination.First onClick={onFirst} disabled={isFirst}/>
        <Pagination.Prev onClick={onPrev} disabled={isPrev}/>
        <>
            {
               array.map((e,i)=>{
                return <Pagination.Item key={i} onClick={onTime} active={e.active}>{e.num}</Pagination.Item>
               })
            }
        </>
        <Pagination.Next onClick={onNext} disabled={isNext}/>
        <Pagination.Last onClick={onLast} disabled={isLast}/>
    </Pagination>)
}

export default Avatar;