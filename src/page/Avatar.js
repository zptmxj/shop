import './Avatar.scss';
import React,{useState,useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import {Pagination , Modal, Button,Spinner,Alert} from 'react-bootstrap';
import serverIP from '../IP_PORT';
import {useSelector} from 'react-redux'

function Avatar()
{
    let member = useSelector((state)=>{return state.member});
    let [userId,setUserId] = useState(sessionStorage.getItem('user_uid'));

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
            fetch(serverIP+"/out_avatar",{
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

        fetch(serverIP+"/buy_avatar",{
            method:"post",
            headers : {
                "content-type" : "application/json",
            },
            body : JSON.stringify({avatar:avt.idx, uid:userId,cash:avt.cash}),
        })
        .then((res)=>res.json())
        .then((json)=>{
            console.log('buy_avatar', json);
            try {
                if(json.succes=="succes") 
                {
                    setModalShow(false);
                    setAvatars([]);
                    onMini("구매를 완료했습니다",1);
                }
                else 
                {
                    if(json.err=="lack") 
                        onMini("포인트가 부족합니다",0);
                    if(json.err=="avatar") 
                        onMini("서버 에러 : avatar",0);
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
                    imgPath={imgPath}
                    isSpinner={isSpinner}
                />:null
            }
            {
                <Modal
                 show={miniShow}
                 size="sm"
                 aria-labelledby="contained-modal-title-vcenter"
                 backdrop={"static"}
                 className="Avatar-mini"
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
        </div> 
    )
}

function AvatarList(props)
{
    let sex = props.sex==0?'m/':'w/';
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
                            let path = "http://168.126.179.44:3002/avatars/" + sex + e.path;
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
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        backdrop={"static"}
        className="Avatar-modal"
        centered
      >
        <Modal.Header>
            <h4>Buy Avatar</h4>
        </Modal.Header>
        <Modal.Body>
          <div className='row'>
            <img className="Avatar-modal-img col-7" src={props.imgPath} />
            <div className='col-5'>
                <p className="px-1 pt-3">
                    이름 : {props.avatar.path}
                </p>
                <p className="px-1">
                    가격 : {props.avatar.cash}p
                </p>
            </div>
            <p className="px-3 pt-3 mb-0">
                * 해당 Avatar는 구매자에게 귀속됩니다.
            </p>
            <p className="px-3 pt-0">
                * 다른 Avatar구매 시 귀속이 해제됩니다.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="primary" onClick={()=>{props.onSend(props.avatar)}} disabled={props.isSpinner}>
                {
                    props.isSpinner?<Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="false"
                    />:null
                }
                구매
            </Button>
            <Button onClick={props.onHide} variant="danger" disabled={props.isSpinner}>취소</Button>
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