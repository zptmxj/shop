import './VCoinMine.scss';
import React,{useState,useEffect} from 'react';
import { Link, useHistory } from 'react-router-dom';
import ReactApexChart from "react-apexcharts"; 
import {Toast , Modal, Button,ListGroup,Form,Table,Popover,Row,Col,Breadcrumb} from 'react-bootstrap';
import {serverPath,imagePath,vcoinPath} from '../../IP_PORT';
import {useSelector} from 'react-redux'
import NamePlate from '../component/NamePlate/NamePlate'
import { intervalToDuration } from 'date-fns';
import moment from 'moment';

function VCoinMine()
{
    const member = useSelector((state)=>{return state.member});
    const userData = useSelector((state)=>{return state.data});
    const [userId] = useState(userData.uid);
    const [userName] = useState(userData.name);
    const [userPrivilege] = useState(userData.privilege);
    const [refresh, setRefresh] = useState(true);
    
    const [buyShow, setBuyShow] = useState(false);
    const [alertText, setAlertText] = useState("");
    const [alertColor,setAlertColor] = useState("me-auto fs-red");
    const [myBonus, setMyBonus] = useState(0);
    const [proceeding, setProceeding] = useState(true);

    const [isFirst, setIsFirst] = useState(true);
    const [ready, setReady] = useState(false);

    const [btnReady, setBtnReady] = useState(true);

    const [coinMines, setCoinMines] = useState([]);
    const [coinMiningLogs, setCoinMiningLogs] = useState([]);
    const [mineImgs] = useState([[{idx:1,path:imagePath()+"/mine/mine1-1.png"},{idx:2,path:imagePath()+"/mine/mine1-2.png"},{idx:3,path:imagePath()+"/mine/mine1-3.png"},{idx:4,path:imagePath()+"/mine/mine1-4.png"},{idx:5,path:imagePath()+"/mine/mine1-5.png"}]]);
    const [resultImgs] = useState([{idx:1,path:imagePath()+"/mine/check00.png"},{idx:2,path:imagePath()+"/mine/check01.png"}]);

    const [countTime, setCountTime] = useState(0);
    const [onHide, setOnHide] = useState(0);
    const [showSelect, setShowSelect] = useState([1,1,1,1,1]);
    const [miningSets, setMiningSets] = useState([]);
    
    const [modaldata,setModaldata] = useState({idx:1});

    useEffect(()=>{
        let timer = setInterval(()=>{
            let toDate = new Date();
            let countDate = new Date();
            countDate.setSeconds(toDate.getSeconds()-5);
            let minute = 59 - Number(countDate.getMinutes());
            let seconds = 59 - Number(countDate.getSeconds());
            let count = ('00' + minute).slice(-2) + ':' + ('00' + seconds).slice(-2);
            setCountTime(count);
            console.log("countTime",count);
            setRefresh(true);
        },1000);
        return () => clearInterval(timer);
    },[countTime]);

    useEffect(()=>{
        console.log("isFirst",isFirst);
        if(isFirst)
        {
            setIsFirst(false);

            fetch(vcoinPath()+"/out_mine",{
                method:"post",
                headers : {
                    "content-type" : "application/json",
                },
                body : JSON.stringify(),
            })
            .then((res)=>res.json())
            .then((minejson)=>{
                setCoinMines(minejson);

                let mines = [];
                for(let i=0;i<minejson.length;i++)
                {
                    let minings = [];
                    for(let j=0;j<minejson[i].digit;j++)
                    {
                        minings.push(0);
                    }
                    mines.push(minings);
                }
                setMiningSets(mines);
            });

            fetch(vcoinPath()+"/out_mining",{
                method:"post",
                headers : {
                    "content-type" : "application/json",
                },
                body : JSON.stringify(),
            })
            .then((res)=>res.json())
            .then((miningjson)=>{
                miningjson.map((e)=>{
                    e.numbers = e.numbers.split(',').map(Number);
                })
                //console.log("first_mineing",miningjson);
                setCoinMiningLogs(miningjson);
            });
        }

        if(refresh)
        {
            setRefresh(false);

            fetch(vcoinPath()+"/out_mine",{
                method:"post",
                headers : {
                    "content-type" : "application/json",
                },
                body : JSON.stringify(),
            })
            .then((res)=>res.json())
            .then((minejson)=>{
                setCoinMines(minejson);
                let mines = [];
                for(let i=0;i<minejson.length;i++)
                {
                    let minings = [];
                    for(let j=0;j<minejson[i].digit;j++)
                    {
                        minings.push(0);
                    }
                    mines.push(minings);
                }
                setMiningSets(mines);
            });

            fetch(vcoinPath()+"/out_mining",{
                method:"post",
                headers : {
                    "content-type" : "application/json",
                },
                body : JSON.stringify(),
            })
            .then((res)=>res.json())
            .then((miningjson)=>{
                miningjson.map((e)=>{
                    e.numbers = e.numbers.split(',').map(Number);
                })
                setCoinMiningLogs(miningjson);
            });



            fetch(serverPath()+"/out_asset",{
                method:"post",
                headers : {
                "content-type" : "application/json",
                },
                body : JSON.stringify({uid:userId}),
            })
            .then((res)=>res.json())
            .then((json)=>{
                //console.log('MyAsset',json.Bonus);
                setMyBonus(json[0].bonus);
            });
        }
    });

    const setAlert = (text,sel)=>{

        if(sel==0) setAlertColor("me-auto fs-red");
        else if(sel==1) setAlertColor("me-auto fs-blue");
        else if(sel==2) setAlertColor("me-auto fs-green");
        setAlertText(text);
        setBtnReady(true);
    }

    const onBuyShow = (mine,hide,minset)=>{
        console.log(minset);
        setAlertText("");
        setShowSelect(minset);
        setOnHide(hide);
        setModaldata(mine);
        setBuyShow(true);
        setReady(false); 
    }

    const onBuyOk = ()=>{
        if(!btnReady) return;

        if(!ready) 
        {
            setAlert("한번 더 누르면 결정됩니다.",1);
            setReady(true); 
        }    
        else
        {
            setBtnReady(false);
            let buydata = {uid:userId , idx:modaldata.idx, numbers:showSelect, hide:onHide};
            fetch(vcoinPath()+"/buy_mining",{
                method:"post",
                headers : {
                    "content-type" : "application/json",
                },
                body : JSON.stringify(buydata),
            })
            .then((res)=>res.json(res))
            .then((pjson)=>{
                try {
                    if(pjson.succes=="succes") 
                    {
                        setBuyShow(false);
                        setRefresh(true);
                        setBtnReady(true);
                    }
                    else 
                    {
                        if(pjson.err=="lack") 
                            setAlert("Bonus가 부족합니다",0);
                        else
                            setAlert("서버 에러",0);
                    }
                }catch (e) {
                    setAlert("서버에서 처리를 실패 했습니다",0);
                    console.log("서버에서 처리를 실패 했습니다",e);
                }
            })
        }
    }

    const onBreadcrumb = (idx)=>{
        if(idx == 0)
        {
            setProceeding(true);
            setRefresh(true);
        }
        else if(idx == 1)
        {
            setProceeding(false);
            setRefresh(true);
        }
        else if (idx == 2)
        {
            setAlert('',0);
            setReady(false); 
        }
    }


    return(
    <div className="flex">
    <div className="VCoinMine-body">
            <div className="title">
                <h3>{"VCoinMine (작업중..)"}</h3>
            </div>
            <Breadcrumb className="mx-4">
                    <Link to="/Exchange">환전하러가기</Link>
            </Breadcrumb>
            <div className="MyBonus-top mb-4">
                <ListGroup>
                    <ListGroup.Item>
                        MyBonus :
                    </ListGroup.Item>
                </ListGroup>
                <ListGroup>
                    <ListGroup.Item>
                        {myBonus + " Bonus"}
                    </ListGroup.Item>
                </ListGroup>
            </div>
            <Breadcrumb className="mx-4">
                <Breadcrumb.Item active={proceeding} onClick={()=>onBreadcrumb(0)}>진행중</Breadcrumb.Item>
                <Breadcrumb.Item active={!proceeding} onClick={()=>onBreadcrumb(1)}>종료됨</Breadcrumb.Item>
            </Breadcrumb>
            <div>
                {coinMines.map((e,i)=>{return ((e.end==0&&proceeding)||(e.end==1&&!proceeding))?<VCoinMineList key={i} info={e} userId={userId} proceeding={proceeding} mineImgs={mineImgs[0]} miningSets={miningSets[i]} coinMiningLogs={coinMiningLogs} resultImgs={resultImgs} onBuyShow={onBuyShow} members={member} refresh={refresh}/>:null})}
            </div>

            <Modal
                show={buyShow}
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                backdrop={"static"}
                onHide={()=>{setBuyShow(false)}}
                centered
            >
                <Modal.Header closeButton>
                    <strong className="me-auto fs-3">{`[${onHide?"비밀":"공개"}] 채굴시도`}</strong>
                </Modal.Header>
                <Modal.Body >
                    <div className="flex-wrap mb-4">
                        {showSelect.length>0?showSelect.map((e,i)=>{
                            if(e!=0)
                            return <img key={i} className="VCoinMine-numimg-img" src={mineImgs[0][e-1].path} /> 
                        }):null}
                    </div>
                    <p className="me-auto fs-6 mb-0">* 100 Bonus를 사용합니다</p>
                    {onHide?<>
                    <p className="me-auto fs-6 mb-0">* 비밀채굴은 본인만 확인 가능합니다.</p>
                    <p className="me-auto fs-6 mb-0">* 채굴지분을 받을 수 없습니다.</p>
                    </>:<>
                    <p className="me-auto fs-6 mb-0">* 공개채굴은 결과를 공유합니다.</p>
                    <p className="me-auto fs-6 mb-0">* 공유한 만큼 채굴지분을 얻게됩니다.</p>
                    <p className="me-auto fs-6 mb-0">* (해답자) 50 : 50 (지분 분배)</p>
                    </>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <small className={alertColor}>{alertText}</small>
                    {onHide?<Button variant="secondary" onClick={onBuyOk}>시도하기</Button>:<Button variant="primary" onClick={onBuyOk}>시도하기</Button>}
                </Modal.Footer>
            </Modal>
         
        </div> 
    </div>
    )
}


function VCoinMineList(props)
{
    const member = useSelector((state)=>{return state.member});
    const userData = useSelector((state)=>{return state.data});
    const [isCheck, setIsCheck] = useState(false);
    const [onSel, setOnSel] = useState(0);
    const [miningSets, setMiningSets] = useState(props.miningSets);


    let info = props.info;
    let digit =  props.info.digit;
    let members = props.members;
    let coinI = info.coinidx-1;

    let coinMiningLogs = props.coinMiningLogs.filter(e=>e.mineidx == info.idx);
    let mineImgs = props.mineImgs;
    let resultImgs = props.resultImgs;
    let proceeding = props.proceeding;
    let trackName = "Track Type :";
    let count = props.count;

    console.log("info",info);
    console.log("coinMiningLogs:",info.idx,coinMiningLogs);
    
    let numbers = info.numbers;
    //let anilist = animals.filter(e=>aniIdxs.includes(e.idx));

    // console.log("anilist",anilist);


    const onSendShow = ()=>{
        if(onSel<digit) return;
        props.onBuyShow(info,0,miningSets);
    }

    const onSendHide = ()=>{
        if(onSel<digit) return;
        props.onBuyShow(info,1,miningSets);
    }

    const onMineClick = (idx)=>{
        console.log("cli",idx);
        let cm = miningSets;
        console.log("cm",cm);
        if(onSel<miningSets.length)
        {
            for(let i=0;i<digit;i++)
            {
                if(cm[i]==0) 
                {   
                    cm[i] = idx;
                    break;
                }
            }
            setMiningSets(cm);
            setOnSel(onSel+1);
        }
        console.log("MiningSets",miningSets);
    }

    const onMineCancel = (idx)=>{
        console.log("can",idx);
        console.log("onSel",onSel);
        let cm = miningSets;
        if(onSel>0)
        {
            console.log("can",idx);
            cm[idx] = 0;
            setMiningSets(cm);
            setOnSel(onSel-1);
        }
        console.log("MiningSets",miningSets);
    }

    const onMineShow = ()=>{
        setIsCheck(!isCheck);
    }

    return (
        <div className="mb-3 Sort-c">
            <Toast className="VCoinMine-toast">
                <Toast.Header className="Sort-auto" closeButton={false} >
                        <img className='mr-1' src={ imagePath() + '/coin/' + info.path} width='25px' height='25px' />
                        <strong className="w-75 fs-6" >{`${info.title}`}</strong>
                        <Form>
                        <Form.Check 
                            type="switch"
                            id="custom-switch"
                            label=""
                            checked={isCheck}
                            onChange={()=>{onMineShow()}}
                        />
                    </Form>
                </Toast.Header>
                {
                (isCheck)?<Toast.Body>
                    {proceeding?<>
                    <div className="flex mb-3">
                        {mineImgs.map((e,i)=><img className="VCoinMine-numimg-img" key={i} onClick={()=>{onMineClick(i+1)}} src={e.path} /> )}
                    </div>
                    <div className="flex py-2">
                        <div className='flex-wrap'>
                            {miningSets.length>0?miningSets.map((e,i)=>e==0?<div key={i} className="VCoinMine-select-nonimg"/>:<img className="VCoinMine-select-img" onClick={()=>onMineCancel(i)} src={mineImgs[e-1].path} /> ):null}
                        </div>
                    </div>
                    <div className="flex pb-3 pt-2">
                        <Button variant="primary" className="mx-3" onClick={()=>{onSendShow()}} disabled={onSel<digit}>공개시도</Button>
                        <Button variant="secondary" className="mx-3" onClick={()=>{onSendHide()}} disabled={onSel<digit}>비밀시도</Button>
                    </div>
                    </>:null}
                    <div className="flex my-3">
                        <Table bordered className="m-0">
                            <thead>
                                <tr>
                                    <th className="VCoinMine-Plate">멤버</th>
                                    <th className="VCoinMine-Process">제출</th>
                                    <th className="VCoinMine-Result">결과</th>
                                </tr>
                            </thead>
                                <tbody>
                                    {coinMiningLogs.map(e=>{
                                        let mem = members.find(mem=>{
                                            if(e.uid==mem.uid) return mem;
                                        });
                                        let numpaths =  e.numbers.map(numidx=>mineImgs.find(mi=>mi.idx==numidx)) ;
                                        let balls = [];  
                                        let strikes = []; 
                                        let colorN = "VCoinMine-tr-show";
                                        for(let i=0; i<e.ball;i++){balls.push(resultImgs[0]);}
                                        for(let i=0; i<e.strike;i++){strikes.push(resultImgs[1]);}
                                        
                                        if(strikes.length == info.digit){
                                            colorN = "VCoinMine-tr-succes";
                                        }
                                        else if(e.hide==1){
                                            colorN = "VCoinMine-tr-hide";
                                            if(e.uid!=props.userId && proceeding) return;
                                        } 
                                         
                                        return(
                                            <tr className={colorN}>
                                                <td className="px-0"><NamePlate mem={mem}/></td>
                                                <td className="px-0">
                                                    <div className="flex-wrap">{numpaths.map(e=><img className="VCoinMine-mining-img m-0" src={e.path}/>)} </div>
                                                </td>
                                                <td className="px-0">
                                                    <div className="flex-wrap">
                                                        <>{balls.map(e=><img className="VCoinMine-result-img m-0" src={e.path}/>)}</>
                                                        <>{strikes.map(e=><img className="VCoinMine-result-img m-0" src={e.path}/>)}</>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                        </Table>
                    </div>
                </Toast.Body>:null
                }
            </Toast>
        </div>
    )
    
}

export default VCoinMine;