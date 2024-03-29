
import './MyAnimal.scss';
import React,{useState,useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import {Pagination , Modal, Button,Spinner,Alert} from 'react-bootstrap';
import {serverPath,imagePath} from '../../IP_PORT';
import {useSelector,useDispatch} from 'react-redux'
import {setStoreMember, setStorePlate, setStoreUserData} from '../../store'

function MyAnimal()
{
    const dispatch = useDispatch();
    let member = useSelector((state)=>{return state.member});
    let userData = useSelector((state)=>{return state.data});
    let [userId,setUserId] = useState(userData.uid);
    let [userAni,setUserAni] = useState(userData.aniidx);

    let history = useHistory();
    const [sel, setSel] = useState(0);
    const [imgNum, setImgNum] = useState(0);
    const [imgPath, setImgPath] = useState('');
    const [MyAnimals, setMyAnimals] = useState([]);
    const [sex, setSex] = useState();
    const [modalShow, setModalShow] = useState(false);
    const [miniShow, setMiniShow] = useState(false);
    const [miniText, setMiniText] = useState("");
    const [isSpinner, setIsSpinner] = useState(false);

    const [isAlert, setIsAlert] = useState(false);
    const [alertColor,setAlertColor] = useState("primary");
    const [refresh, setRefresh] = useState(true);

    useEffect(()=>{
        console.log("userData",userData);
        if(refresh == true)
        {
            setRefresh(false);
            fetch(serverPath()+"/out_myanimal",{
                method:"post",
                headers : {
                    "content-type" : "application/json",
                },
                body : JSON.stringify({uid:userId}),
            })
            .then((res)=>res.json())
            .then((json)=>{
                console.log('out_MyAnimal', json);
                setMyAnimals(json);
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


    const onSend = (ani)=>{

        fetch(serverPath()+"/sel_myanimal",{
            method:"post",
            headers : {
                "content-type" : "application/json",
            },
            body : JSON.stringify({sel:ani.idx, uid:userId}),
        })
        .then((res)=>res.json())
        .then((json)=>{
            try {
                if(json.succes=="succes") 
                {
                    setModalShow(false);
                    setMyAnimals([]);
                    setUserAni(ani.idx);
                    setRefresh(true)
                    let udata = {...userData};
                    udata.animal = ani.path;
                    udata.aniidx = ani.idx;
                    dispatch(setStoreUserData(udata));

                    let asset = [...member];
                    let rt = asset.map((e)=>{
                        let data = {...e};
                        if(e.uid == userId)
                        {
                            data.aniname = ani.name;
                            data.animal = udata.aniidx;
                            data.anipath = udata.animal;
                        }
                        return data;
                    });
                    console.log("rt",rt);
                    dispatch(setStoreMember(rt));
                }
                else 
                {
                    onMini("서버 에러 : asset",0);
                }
            }catch (e) {
                onMini("서버에서 처리를 실패 했습니다",0);
            }
        })
    }

    const onSale = ()=>{

   
    }

    const onHide = ()=>{
        setModalShow(false)
        setImgNum(0);
    }


    return(
        <div>
            <div className="title">
                <h3> MyAnimal </h3>
            </div>
                <MyAnimalList array={MyAnimals} sel={sel} sex={sex} userAni={userAni} onClick={(idx,path)=>onModal(idx,path)}/>
            <div className="MyAnimal-pag">
                <MyPagination max={Math.ceil(MyAnimals.length/16)} sel={sel} setValue={(idx)=>(setSel(idx-1))} />
            </div>
            {
                MyAnimals.length>0?<MyModal
                    show={modalShow}
                    onSend={(avt)=>{onSend(avt)}}
                    onHide={onHide}
                    onSale={onSale}
                    MyAnimal={MyAnimals[(sel*16)+imgNum]}
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
                   <Button variant={alertColor} onClick={()=>{setMiniShow(false)}}>확인</Button>
                 </Modal.Footer>
               </Modal>
            }
        </div> 
    )
}

function MyAnimalList(props)
{
    let sel = props.sel;
    let array = [];

    if(props.array.length>0)
    {
        let max = props.array.length - (sel * 16);
        if(max > 15) max =16;

        for(let i=0; i < max; i++)
            array.push(props.array[(sel*16)+i]);

        return (
            <div className="container mag-top">
                <div className="MyAnimal-midle row">
                    {
                        array.map((e,i)=>{
                            let path = imagePath()+"/animals/" + e.path;
                            let classN = "MyAnimal-img p-0";
                            let uid = "----"
                            let Cilck = ()=>props.onClick(i,path);
                            if(props.userAni==e.idx) 
                            {
                                classN = "MyAnimal-img-non p-0";
                                uid = "사용중";
                                Cilck = ()=>{};
                            } 
                            return(
                                <>
                                    <div key={i} className="col-3 MyAnimal-pad ">
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
    let onHide=props.onHide;
    let onSale=props.onSale;

    
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
            <h4>Buy MyAnimal</h4>
        </Modal.Header>
        <Modal.Body>
          <div className='row'>
            <img className="MyAnimal-modal-img col-7" src={imgpath} />
            <div className='col-7'>
                <p className="px-1 pt-3">
                    이름 : {props.MyAnimal.name}
                </p>
                <p className="px-1 mb-1">
                    구매가 : {props.MyAnimal.point}p
                </p>
                <p className="px-1">
                    판매가 : {props.MyAnimal.point/2}p
                </p>
            </div>
            <p className="px-3 pt-3 mb-0">
                * 사용중인 Animal만 대표로 적용됩니다.
            </p>

          </div>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="primary" onClick={()=>{onSend(props.MyAnimal)}} disabled={isspinner}>사용</Button>
            <Button onClick={onSale} variant="warning" disabled={isspinner}>판매</Button>
            <Button onClick={onHide} variant="danger" disabled={isspinner}>취소</Button>
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

export default MyAnimal;