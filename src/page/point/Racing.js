import './Racing.scss';
import React,{useState,useEffect} from 'react';
import { Link, useHistory } from 'react-router-dom';
import ReactApexChart from "react-apexcharts"; 
import {Toast , Modal, Button,ListGroup,Form,Table,Popover,Row,Col,Breadcrumb} from 'react-bootstrap';
import {serverPath,imagePath,vcoinPath} from '../../IP_PORT';
import {useSelector} from 'react-redux'
import NamePlate from '../component/NamePlate/NamePlate'
import { intervalToDuration } from 'date-fns';
import moment from 'moment';

function Racing()
{
    const member = useSelector((state)=>{return state.member});
    const userData = useSelector((state)=>{return state.data});
    const [userId] = useState(userData.uid);
    const [userName] = useState(userData.name);
    const [userPrivilege] = useState(userData.privilege);
    const [refresh, setRefresh] = useState(true);
    

    const [inputValue, setInputValue] = useState(0);
    const [maxValue, setMaxValue] = useState(0);
    const [buyShow, setBuyShow] = useState(false);
    const [saleShow, setSaleShow] = useState(false);
    const [alertText, setAlertText] = useState("");
    const [alertColor,setAlertColor] = useState("me-auto fs-red");
    const [mycoin, setMycoin] = useState([]);
    const [myCoins, setMyCoins] = useState([]);
    const [myBonus, setMyBonus] = useState(0);
    const [proceeding, setProceeding] = useState(true);

    const [ready, setReady] = useState(false);
    const [btnReady, setBtnReady] = useState(true);
    const [isFirst, setIsFirst] = useState(true);
    const [stadiumType, setStadiumType] = useState();

    const [userImgPath, setUserImgPath] = useState('');
    const [aniImgPath, setAniImgPath] = useState('');

    const [countTime, setCountTime] = useState(0);
    
    const [racingDate,setRacingData] = useState([]);
    const [animals,setAnimals] = useState([]);
    const [quotes,setQuotes] = useState([]);
    const [modaldata,setModaldata] = useState([]);
    const [modalIdx,setModalIdx] = useState([]);

    useEffect(()=>{
        // let timer = setInterval(()=>{
        //     let toDate = new Date();
        //     let countDate = new Date();
        //     countDate.setSeconds(toDate.getSeconds()-5);
        //     let minute = 59 - Number(countDate.getMinutes());
        //     let seconds = 59 - Number(countDate.getSeconds());
        //     let count = ('00' + minute).slice(-2) + ':' + ('00' + seconds).slice(-2);
        //     setCountTime(count);
        //     console.log("countTime",count);
        //     if(minute == 0 && seconds == 0)
        //     {
        //         setRefresh(true);
        //     }
        // },1000);
        // return () => clearInterval(timer);
    },[countTime]);

    useEffect(()=>{
        if(isFirst)
        {
            // setIsFirst(false);
            // fetch(vcoinPath()+"/out_coin",{
            //     method:"post",
            //     headers : {
            //         "content-type" : "application/json",
            //     },
            //     body : JSON.stringify(),
            // })
            // .then((res)=>res.json())
            // .then((vcoinsjson)=>{
            //     vcoinsjson.map((e)=>{
            //         fetch(vcoinPath()+"/out_quotes",{
            //             method:"post",
            //             headers : {
            //                 "content-type" : "application/json",
            //             },
            //             body : JSON.stringify({coinidx:e.idx}),
            //         })
            //         .then((res)=>res.json())
            //         .then((quotes)=>{
            //             console.log("quotes",quotes);
            //             setQuotes(quotes);
            //             e.quotes = quotes;
            //             e.pay = (e.price+e.uservar+e.quotevar);
            //         })
            //     })
            //     console.log("vcoins",vcoinsjson);
            //     setRacings(vcoinsjson);
            //     setRacingTypes(vcoinsjson);
            // });
        }

        if(refresh)
        {
            setRefresh(false);

            // if(racingDate.length>0)
            // {
                fetch(serverPath()+"/out_racing",{
                    method:"post",
                    headers : {
                        "content-type" : "application/json",
                    },
                    body : JSON.stringify(),
                })
                .then((res)=>res.json())
                .then((racing)=>{
                    console.log("racing",racing);
                    setRacingData(racing);
                    fetch(serverPath()+"/out_animal",{
                        method:"post",
                        headers : {
                        "content-type" : "application/json",
                        },
                        body : JSON.stringify({uid:userId}),
                    })
                    .then((res)=>res.json())
                    .then((json)=>{
                        let aniamls = json.map((e)=>{
                            e.path = imagePath() + "/animals/" + e.path;
                            if(e.uid==null)
                                e.avtpath = imagePath() + "/avatars/w055.png";
                            else
                            {
                                if(e.avtpath==null)
                                {
                                    e.avtpath = imagePath() + "/avatars/m001.png";
                                }
                                else
                                    e.avtpath = imagePath() + "/avatars/" + e.avtpath;
                            }
                            return e;
                        })

                        console.log('Animals',aniamls);
                        setAnimals(aniamls);
                    });
                });
            // }

            // fetch(serverPath()+"/out_coinassetall",{
            //     method:"post",
            //     headers : {
            //     "content-type" : "application/json",
            //     },
            //     body : JSON.stringify({uid:userId}),
            // })
            // .then((res)=>res.json())
            // .then((json)=>{
            //     console.log('MyAsset',json);
            //     setMyCoins(json);

            // });

            fetch(serverPath()+"/out_asset",{
                method:"post",
                headers : {
                "content-type" : "application/json",
                },
                body : JSON.stringify({uid:userId}),
            })
            .then((res)=>res.json())
            .then((json)=>{
                console.log('MyAsset',json.Bonus);
                setMyBonus(json[0].bonus);
            });
        }
    },[refresh]);

    const setAlert = (text,sel)=>{

        if(sel==0) setAlertColor("me-auto fs-red");
        else if(sel==1) setAlertColor("me-auto fs-blue");
        else if(sel==2) setAlertColor("me-auto fs-green");
        setAlertText(text);
        setBtnReady(true);
    }

    const estimatedBuy = (data,ea)=>{

        let p = 0;
        let rt = 0;
        for(let i=0; i< ea; i ++)
        {
            p += 1;
            rt += (data.pay+p);

        }
        return rt+' B';
    }

    const estimatedSale = (data,ea)=>{

        let p = 0;
        let rt = 0;
        for(let i=0; i< ea; i ++)
        {
            rt += (data.pay+p);
            p -= 1;

        }
        return rt+' B';
    }

    const onBuyShow = (ani,idx)=>{
        console.log(ani);
        setModaldata(ani);
        setModalIdx(idx);

        let anipath = imagePath() + "/animals/" + ani.path;
        let userpath = imagePath() + "/avatars/" + userData.avatar;

        // let price = vcoins[idx].price+ vcoins[idx].uservar + vcoins[idx].quotevar;
        // let maxv = Math.floor(myBonus / price);
        // if(maxv > 50) maxv = 50;
        // setMaxValue(maxv);
        // setAlert('',0);
        // setInputValue(0);
        // setReady(false); 
        setBuyShow(true);
    }

    const onSaleShow = (idx)=>{
        
        //console.log(vcoins[idx].idx);
        if(myCoins[idx].ea<1) return;

        // let coin = vcoins.filter(e=>e.idx==myCoins[idx].coinidx);
        // console.log("vcoins.filter",coin);

        // setModaldata(coin[0]);
        setAlert('',0);
        setInputValue(0);
        setReady(false); 

        fetch(vcoinPath()+"/out_coinasset",{
            method:"post",
            headers : {
                "content-type" : "application/json",
            },
            body : JSON.stringify({uid:userId, coinidx:myCoins[idx].coinidx}),
        })
        .then((res)=>res.json())
        .then((vcoinasset)=>{
            console.log(vcoinasset);
            setMycoin(vcoinasset[0]);
            setSaleShow(true);
        });
    }


    const onBuyOk = ()=>{
        if(!btnReady) return;

        // let coinEA = myCoins.filter(e=>e.idx == modaldata.idx)[0].ea;
        // if((coinEA + Number(inputValue))>50)
        // {
        //     setAlert("50개 이상 보유할 수 없습니다.",0);
        //     return;
        // }
        if(inputValue==0)
        {
            setAlert("수량이 0입니다.",0);
            return;
        }
        if(!ready) 
        {
            setAlert("한번 더 누르면 결정됩니다.",1);
            setReady(true); 
        }    
        else
        {
            setBtnReady(false);
            let buydata = {uid:userId , coinidx:modaldata.idx, ea:Number(inputValue)};
            fetch(vcoinPath()+"/buy_coin",{
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
                    }
                    else 
                    {
                        if(pjson.err=="lack") 
                            setAlert("Bonus가 부족합니다",0);
                        else if(pjson.err=="ea_err")
                            setAlert("코인 재고가 부족합니다",0);
                        else if(pjson.err=="over")
                            setAlert("50개 이상 보유할 수 없습니다",0);
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

    
    const onSaleOk = ()=>{
        if(!btnReady)
        {
            console.log("btnReady.");
            return;
        } 

        if(inputValue==0)
        {
            setAlert("수량이 0입니다.",0);
            return
        }
        if(!ready) 
        {
            setAlert("한번 더 누르면 결정됩니다.",1);
            console.log("한번 더 누르면 결정됩니다.");
            setReady(true); 
        }    
        else
        {
            setBtnReady(false);
            let buydata = {uid:userId , coinidx:modaldata.idx, ea:Number(inputValue)};

            fetch(vcoinPath()+"/check_coin",{
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
                        fetch(vcoinPath()+"/sale_coin",{
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
                                    setSaleShow(false);
                                    setRefresh(true);
                                }
                                else 
                                {
                                    setAlert("서버 에러",0);
                                }
                            }catch (e) {
                                setAlert("서버에서 처리를 실패 했습니다",0);
                                console.log("서버에서 처리를 실패 했습니다",e);
                            }
                        })
                    }
                    else 
                    {
                        if(pjson.err=="lack") 
                            setAlert("보유 코인이 부족합니다",0);
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



    return(
    <div className="flex">
        <div className="Racing-body">
            <div className="title">
                <h3>{"Racing (작업중..)"}</h3>
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
                    <Breadcrumb.Item active={proceeding} onClick={()=>setRefresh(true)}>진행중</Breadcrumb.Item>
                    <Breadcrumb.Item active={!proceeding} onClick={()=>setRefresh(true)}>종료됨</Breadcrumb.Item>
            </Breadcrumb>

            <div>
                {animals.length>0?<RacingList info={racingDate} animals={animals} onBuyShow={onBuyShow} members={member} count={countTime} refresh={refresh}/>:null}
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
                    <strong className="me-auto fs-3">{`[${modalIdx+1}번]${modaldata.name}`}</strong>
                </Modal.Header>
                <Modal.Body className="row">
                    <div className='col-12 flex'>
                        <div className='Animal-parent'>
                            <img className="Animal-modal-img" src={modaldata.avtpath} />
                            <div className='Animal-child'>
                                <img className="hildimg" src={modaldata.path} />
                            </div>
                        </div>
                    </div>
                    <div className='memlist-input mb-3'>
                        <p className="mb-0 mr-1">{"구매 코인 : "}</p>
                        <strong className=" fs-3">{`${inputValue}`}</strong>
                    </div>
                    <div className='memlist-input mb-3'>
                        <p className="mb-0 mr-1">{"매수 예상가격 : "}</p>
                        <strong className=" fs-3">{estimatedBuy(modaldata,inputValue)}</strong>
                    </div>
                    <div className='memlist-input mb-3'>
                        <Form.Range step={1} min={0} max={maxValue} value={inputValue} onChange={(e)=>{console.log("onChange",e.target.value); setInputValue(e.target.value)}} className="fs-3"/>
                    </div>
                    <p className="me-auto fs-6 mb-0">* 가격만큼 Bonus를 사용합니다</p>
                    <p className="me-auto fs-6 mb-0">* 코인 매도/매수는 시세에 영향을 줍니다.</p>
                    <p className="me-auto fs-6 mb-0">* 실시간 시세의 가격에 거래됩니다.</p>
                </Modal.Body>
                <Modal.Footer>
                    <small className={alertColor}>{alertText}</small>
                    {/* <Button variant="primary" onClick={onBuyOk}>구매하기</Button> */}
                </Modal.Footer>
            </Modal>
         
        </div> 
    </div>
    )
}


function RacingList(props)
{
    const member = useSelector((state)=>{return state.member});
    const userData = useSelector((state)=>{return state.data});
    const [isCheck, setIsCheck] = useState(false);
    const [coinMember, setCoinMember] = useState([]);


    let members = props.members;
    let sel = props.sel;
    let info = props.info;

    let animals = props.animals;
    let trackPath = imagePath() + "/track/track" + ("00" + info.track).slice(-2) +".png";
    let trackName = "Track Type :";
    let count = props.count;

    console.log("info",info);
    
    let aniStrs = info.animals.split(',');
    let aniIdxs = [Number(aniStrs[0]),Number(aniStrs[1]),Number(aniStrs[2]),Number(aniStrs[3]),Number(aniStrs[4])]

    // console.log("animals",animals);
    // console.log("aniIdxs",aniIdxs);

    let anilist = animals.filter(e=>aniIdxs.includes(e.idx));

    // console.log("anilist",anilist);

    if(props.info.track == 0)
        trackName = trackName + " 평지";
    else if(props.info.track == 1)
        trackName = trackName + " 협곡";
    else if(props.info.track == 2)
        trackName = trackName + " 바다";


    const onCoinShow = ()=>{
        setIsCheck(!isCheck);
        if(!isCheck)
        {
            fetch(vcoinPath()+"/out_coinmember",{
                method:"post",
                headers : {
                    "content-type" : "application/json",
                },
                body : JSON.stringify({coinidx:info.idx}),
            })
            .then((res)=>res.json())
            .then((members)=>{
                console.log("/out_coinmember",members);
                setCoinMember(members);
            })
        }
    }

    return (
        <div className="mb-3 Sort-c">
            <Toast className="Racing-toast">
                <Toast.Header className="Sort-c" closeButton={false} >
                        <strong className="fs-6" >{info.title}</strong>
                </Toast.Header>
                <Toast.Body>
                    <div>
                        <img className="Racing-img" src={trackPath} />
                        <p className="m-0">{trackName}</p>
                        <p>{`${count}`}</p>
                    </div>
                    <div className="flex">
                        {anilist.map((e,i)=>{
                            return (<div>
                                <img className="Racing-animal-img p-1 m-1" onClick={()=>{props.onBuyShow(anilist[i],i)}} src={anilist[i].path} />
                                <p>{`${i+1}번`}</p>
                            </div>)
                        })}
                    </div>
                    <div>
                        <Table bordered hover >
                            <thead>
                                <tr>
                                    <th>1번</th>
                                    <th>2번</th>
                                    <th>3번</th>
                                    <th>4번</th>
                                    <th>5번</th>
                                </tr>
                            </thead>
                            {(coinMember.length!==0)?(
                                <tbody>
                                {
                                    coinMember.map((e,i)=>{
                                        let mem = members.find(mem=>e.uid==mem.uid);
                                        return(
                                            <tr key ={i}>
                                                <td>{i}</td>
                                                <td><NamePlate className="w-25" mem={mem}/></td>
                                                <td>{e.ea}</td>
                                                <td>{e.average}</td>
                                            </tr>
                                        )
                                    })
                                }
                                </tbody>
                            ):null}
                        </Table>
                    </div>

                    <div>
                        {/* <Button variant="primary" className="" onClick={()=>{props.onSaleShow(sel)}}>판매</Button> */}
                        {/* {(userPrivilege>1)?<Button variant="secondary" className="mx-1" onClick={()=>{props.onEndShow(sel)}}>베팅종료</Button>:null} */}
                    </div>
                </Toast.Body>
            </Toast>
        </div>
    )
    
}

export default Racing;