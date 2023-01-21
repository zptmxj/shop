import './VCoin.scss';
import React,{useState,useEffect} from 'react';
import { Link, useHistory } from 'react-router-dom';
import ReactApexChart from "react-apexcharts"; 
import {Toast , Modal, Button,ListGroup,Form,Table,Popover,Row,Col,Breadcrumb} from 'react-bootstrap';
import {serverPath,imagePath,vcoinPath} from '../../IP_PORT';
import {useSelector} from 'react-redux'
import NamePlate from '../component/NamePlate/NamePlate'
import { intervalToDuration } from 'date-fns';

function VCoin()
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

    const [ready, setReady] = useState(false);
    const [btnReady, setBtnReady] = useState(true);
    const [isFirst, setIsFirst] = useState(true);

    const [countTime, setCountTime] = useState(0);
    const [test, setTest] = useState(0);

    const [vcoins,setVCoins] = useState([]);
    const [vcoinTypes,setVCoinTypes] = useState([]);
    const [quotes,setQuotes] = useState([]);
    const [modaldata,setModaldata] = useState([]);

    useEffect(()=>{
        let timer = setInterval(()=>{
            let toDate = new Date();
            let countDate = new Date();
            countDate.setSeconds(toDate.getSeconds()-3);
            setCountTime(60-countDate.getSeconds());
            console.log("countTime",60-countDate.getSeconds());
            let secTime = toDate.getSeconds();
            if(secTime == 3)
            {
                setCountTime(59);
                setRefresh(true);
            }
        },1000);
        return () => clearInterval(timer);
    },[countTime]);

    useEffect(()=>{
        if(isFirst)
        {
            setIsFirst(false);
            fetch(vcoinPath()+"/out_coin",{
                method:"post",
                headers : {
                    "content-type" : "application/json",
                },
                body : JSON.stringify(),
            })
            .then((res)=>res.json())
            .then((vcoinsjson)=>{
                vcoinsjson.map((e)=>{
                    fetch(vcoinPath()+"/out_quotes",{
                        method:"post",
                        headers : {
                            "content-type" : "application/json",
                        },
                        body : JSON.stringify({coinidx:e.idx}),
                    })
                    .then((res)=>res.json())
                    .then((quotes)=>{
                        console.log("quotes",quotes);
                        setQuotes(quotes);
                        e.quotes = quotes;
                        e.pay = (e.price+e.uservar+e.quotevar);
                    })
                })
                console.log("vcoins",vcoinsjson);
                setVCoins(vcoinsjson);
                setVCoinTypes(vcoinsjson);
            });
        }

        if(refresh)
        {
            setRefresh(false);

            if(vcoins.length>0)
            {
                fetch(vcoinPath()+"/out_coin",{
                    method:"post",
                    headers : {
                        "content-type" : "application/json",
                    },
                    body : JSON.stringify(),
                })
                .then((res)=>res.json())
                .then((vcoinsjson)=>{
                    vcoins.map((e,i)=>{
                    fetch(vcoinPath()+"/out_quotes",{
                        method:"post",
                        headers : {
                            "content-type" : "application/json",
                        },
                        body : JSON.stringify({coinidx:e.idx}),
                    })
                    .then((res)=>res.json())
                    .then((quotes)=>{
                        console.log("quotes",quotes);
                        setQuotes(quotes);
                        e.ea = vcoinsjson[i].ea;
                        e.quotes = quotes;
                        e.pay = (vcoinsjson[i].price+vcoinsjson[i].uservar+vcoinsjson[i].quotevar);
                        return e;
                    })});
                    console.log("vcoins",vcoins);
                    setVCoins(vcoins);
                });
            }

            fetch(serverPath()+"/out_coinassetall",{
                method:"post",
                headers : {
                "content-type" : "application/json",
                },
                body : JSON.stringify({uid:userId}),
            })
            .then((res)=>res.json())
            .then((json)=>{
                console.log('MyAsset',json);
                setMyCoins(json);

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

    const onBuyShow = (idx)=>{
        console.log(idx);
        setModaldata(vcoins[idx]);
        let price = vcoins[idx].price+ vcoins[idx].uservar + vcoins[idx].quotevar;
        let maxv = Math.floor(myBonus / price);
        if(maxv > 50) maxv = 50;
        setMaxValue(maxv);
        setAlert('',0);
        setInputValue(0);
        setReady(false); 
        setBuyShow(true);
    }

    const onSaleShow = (idx)=>{
        
        //console.log(vcoins[idx].idx);
        if(myCoins[idx].ea<1) return;

        let coin = vcoins.filter(e=>e.idx==myCoins[idx].coinidx);
        console.log("vcoins.filter",coin);

        setModaldata(coin[0]);
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

        <div className="VCoin-body">
            <div className="title">
                <h3> VCoin </h3>
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

            <div className="MyCoin-VCoinWidth mb-5">
                <Table bordered hover >
                    <thead>
                        <tr>
                        <th>#</th>
                        <th>코인명</th>
                        <th>보유 수</th>
                        <th>평단가</th>
                        <th>판매</th>
                        </tr>
                    </thead>
                    {
                        (myCoins.length!==0)?(
                            <tbody>
                            {
                                myCoins.map((e,i)=>{
                                    return(
                                        <tr key ={i}>
                                            <td>{i}</td>
                                            <td>{e.name}</td>
                                            <td>{e.ea}</td>
                                            <td>{e.average}</td>
                                            <td>
                                                <Button variant="primary" className="" onClick={()=>{onSaleShow(i)}}>판매</Button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        ):null
                    }
                </Table>
            </div>

            <Breadcrumb className="mx-4">
                    <Breadcrumb.Item onClick={()=>setRefresh(true)}>새로고침</Breadcrumb.Item>
                    <string>{`(${countTime})`}</string>
            </Breadcrumb>

            <div>
                {vcoinTypes.map((e,i)=>{
                    return (<VCoinList key={i} info={vcoins[i]} sel={i} onBuyShow={onBuyShow} onSaleShow={onSaleShow} members={member} refresh={refresh}/>)
                })}
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
                    <strong className="me-auto fs-3">{`[${modaldata.name}] coin`}</strong>
                </Modal.Header>
                <Modal.Body >
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
                    <Button variant="primary" onClick={onBuyOk}>구매하기</Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={saleShow}
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                backdrop={"static"}
                onHide={()=>{setSaleShow(false)}}
                centered
            >
                <Modal.Header closeButton>
                    <strong className="me-auto fs-3">{`[${modaldata.name}] coin`}</strong>
                </Modal.Header>
                <Modal.Body >
                    <div className='memlist-input mb-3'>
                        <p className="mb-0 mr-1">{"보유 코인 : "}</p>
                        <strong className=" fs-3">{`${mycoin.ea}`}</strong>
                    </div>
                    <div className='memlist-input mb-3'>
                        <p className="mb-0 mr-1">{"판매 코인 : "}</p>
                        <strong className=" fs-3">{`${inputValue}`}</strong>
                    </div>
                    <div className='memlist-input mb-3'>
                        <p className="mb-0 mr-1">{"매도 예상가격 : "}</p>
                        <strong className=" fs-3">{estimatedSale(modaldata,inputValue)}</strong>
                    </div>
                    <div className='memlist-input mb-3'>
                        <Form.Range step={1} min={0} max={mycoin.ea} value={inputValue} onChange={(e)=>{console.log("onChange",e.target.value); setInputValue(e.target.value)}} className="fs-3"/>
                    </div>
                    <p className="me-auto fs-6 mb-0">* 가격만큼 Bonus를 사용합니다</p>
                    <p className="me-auto fs-6 mb-0">* 코인 매도/매수는 시세에 영향을 줍니다.</p>
                    <p className="me-auto fs-6 mb-0">* 실시간 시세의 가격에 거래됩니다.</p>
                </Modal.Body>
                <Modal.Footer>
                    <small className={alertColor}>{alertText}</small>
                    <Button variant="primary" onClick={onSaleOk}>판매하기</Button>
                </Modal.Footer>
            </Modal>
         
        </div> 
        </div>
    )
}


function VCoinList(props)
{
    const member = useSelector((state)=>{return state.member});
    const userData = useSelector((state)=>{return state.data});
    const [isCheck, setIsCheck] = useState(false);
    const [coinMember, setCoinMember] = useState([]);


    let graph = {
        series: [{
            data: [{
                x: 1,
                y: [5,5,5, 0]
              }
            ]
          }],
          options: {
            chart: {
            toolbar: {show:false},
            type: 'candlestick',
            height: 350
          },
          xaxis: {
            type: 'datetime',
        },
          yaxis: {
            tooltip: {
              enabled: true
            }
          }
        }
    };

    graph.series[0].data.splice(0);

    let members = props.members;
    let sel = props.sel;
    let info = props.info;
    //let mem = member.filter((f)=>f.uid==info.uid)
    useEffect(()=>{
        if(props.refresh){
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
        
    });

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

    if(!info.hasOwnProperty("quotes")) return;
    
    let size = 119;
    if(info.quotes.length<size)
    {
        size = info.quotes.length-2;
    }
    
    for(let i=size;i>=0;i--)
    {
        let curdata = info.price+ info.quotes[i+1].pricediff;
        let nextdata = info.price+ info.quotes[i].pricediff;
        graph.series[0].data.push({x:info.quotes[i].date,y:[nextdata,nextdata,nextdata,curdata]});
    }

    return (
        <div className="mb-3 Sort-c">
            <Toast className="VCoin-toast">
                <Toast.Header className="VCoinMine-toast" closeButton={false} >
                    <img className='mr-1' src={ imagePath() + '/coin/' + info.path} width='25px' height='25px' />
                    <div className="w-75">
                        <strong className="fs-6" >{`[${info.name}] coin`}</strong>
                    </div>
                    <Form>
                        <Form.Check 
                            type="switch"
                            id="custom-switch"
                            label=""
                            checked={isCheck}
                            onChange={()=>{onCoinShow()}}
                        />
                    </Form>
                </Toast.Header>
                <Toast.Body>
                    <div className="racing mb-0">
                        {isCheck?<ReactApexChart className="z-index-0" options={graph.options} series={graph.series} type="candlestick" height={150} />:null}
                    </div>

                    <div className="">
                        {isCheck?<Table bordered hover >
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>회원명</th>
                                    <th>보유 수</th>
                                    <th>평단가</th>
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
                                                <td className="Sort-c"><NamePlate className="w-25" mem={mem}/></td>
                                                <td>{e.ea}</td>
                                                <td>{e.average}</td>
                                            </tr>
                                        )
                                    })
                                }
                                </tbody>
                            ):null}
                        </Table>:null}
                    </div>

                    {isCheck?
                    <div className="Sort-r">
                        <strong className="fs-6">{`남은: ${info.ea}`}</strong>
                        <strong className="fs-6 mx-2">{`/`}</strong>
                        <strong className="fs-6">{`단가: ${info.pay}B`}</strong>
                        <Button variant="danger" className="mx-3" onClick={()=>{props.onBuyShow(sel)}}>구매</Button>
                    </div>:
                    <div className="">
                        <strong className="fs-6">{`남은: ${info.ea}`}</strong>
                        <strong className="fs-6 mx-2">{`/`}</strong>
                        <strong className="fs-6">{`단가: ${info.pay}B`}</strong>
                    </div>
                    }

                    <div>
                        {/* <Button variant="primary" className="" onClick={()=>{props.onSaleShow(sel)}}>판매</Button> */}
                        {/* {(userPrivilege>1)?<Button variant="secondary" className="mx-1" onClick={()=>{props.onEndShow(sel)}}>베팅종료</Button>:null} */}
                    </div>
                </Toast.Body>
            </Toast>
        </div>
    )
    
}

export default VCoin;