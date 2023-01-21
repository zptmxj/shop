import './Betting.scss';
import React,{useState,useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import ReactApexChart from "react-apexcharts"; 
import {Toast , Modal, Button,Spinner,Form,OverlayTrigger,Popover,Row,Col,Breadcrumb} from 'react-bootstrap';
import {serverPath,imagePath} from '../../IP_PORT';
import {useSelector} from 'react-redux'
import NamePlate from '../component/NamePlate/NamePlate'

function Betting()
{
    const member = useSelector((state)=>{return state.member});
    const userData = useSelector((state)=>{return state.data});
    const [userId] = useState(userData.uid);
    const [userName] = useState(userData.name);
    const [userPrivilege] = useState(userData.privilege);
    const [refresh, setRefresh] = useState(true);
    

    const [inputValue, setInputValue] = useState(10);
    const [inputShow, setInputShow] = useState(false);
    const [alertText, setAlertText] = useState("");
    const [alertColor,setAlertColor] = useState("me-auto fs-red");
    const [selText, setSelText] = useState("");

    const [proceeding, setProceeding] = useState(true);
    const [endShow, setEndShow] = useState(false);
    const [ready, setReady] = useState(false);

    const [addShow, setAddShow] = useState(false);
    const [titleText, setTitleText] = useState("");
    const [addText01, setAddText01] = useState("");
    const [addText02, setAddText02] = useState("");
    const [addText03, setAddText03] = useState("");
    const [addText04, setAddText04] = useState("");
    const [addText05, setAddText05] = useState("");

    
    const [classN,setClassN] = useState(["outline-primary","outline-danger","outline-warning","outline-success","outline-info"]);
    const [btnSel,setBtnSel] = useState(-1);

    const [bettings,setBettings] = useState([]);
    const [modaldata,setModaldata] = useState([]);
    const [gamblers,setGambler] = useState([]);

    useEffect(()=>{
        if(refresh)
        {
            setRefresh(false);
            let get = {end:0}; 
            if(!proceeding) get.end = 1;
            fetch(serverPath()+"/out_betting",{
                method:"post",
                headers : {
                    "content-type" : "application/json",
                },
                body : JSON.stringify(get),
            })
            .then((res)=>res.json())
            .then((betAll)=>{
                console.log(betAll);
                fetch(serverPath()+"/out_gambler",{
                    method:"post",
                    headers : {
                        "content-type" : "application/json",
                    },
                    body : JSON.stringify(),
                })
                .then((res)=>res.json())
                .then((gamAll)=>{
                    let data = betAll.map((b)=>{
                        return gamAll.filter(g=>g.bettingidx==b.idx);
                    });
                    console.log(data);
                    setGambler(gamAll);
                    let betlist = betAll.map((e,i)=>{
                        e.list = data[i]; 
                        let opPoint = [0,0,0,0,0];
                        for(let j = 0 ; j < data[i].length ; j++)
                        {
                            opPoint[data[i][j].opnumber] += data[i][j].point;
                        }
                        e.points = opPoint;
                        return e
                    })
                    console.log(betlist);
                    
                });
                setBettings(betAll);
            });
        }
    });

    const setAlert = (text,sel)=>{
        if(sel==0) setAlertColor("me-auto fs-red");
        else if(sel==1) setAlertColor("me-auto fs-blue");
        else if(sel==2) setAlertColor("me-auto fs-green");
        setAlertText(text);
    }

    const onEndShow = (idx)=>{
        let off = ["outline-primary","outline-danger","outline-warning","outline-success","outline-info"];
        setClassN(off);
        console.log(idx);
        setModaldata(bettings[idx]);
        setAlert('',0);
        setBtnSel(-1);
        setReady(false); 
        setEndShow(true);
    }

    const onInputShow = (idx)=>{
        let off = ["outline-primary","outline-danger","outline-warning","outline-success","outline-info"];
        setClassN(off);
        console.log(idx);
        setModaldata(bettings[idx]);
        setAlert('',0);
        setBtnSel(-1);
        setInputValue(10);
        setReady(false); 
        setInputShow(true);
    }
    const onEndOk = ()=>{
        if(btnSel==-1) setAlert("선택지를 선택해주세요.",0)
        else if(!ready)
        {
            setAlert("한번 더 누르면 결정됩니다.",1);
            setReady(true); 
        }    
        else {
            let totalpoint = 0;
            for(let i=0;i<modaldata.options;i++) totalpoint += modaldata.points[i];

            let rate = (totalpoint/modaldata.points[btnSel]).toFixed(2);
            let end = {bettingidx:modaldata.idx ,option:btnSel, rate:rate};
            console.log("/end_betting",end);

            fetch(serverPath()+"/end_betting",{
                method:"post",
                headers : {
                    "content-type" : "application/json",
                },
                body : JSON.stringify(end),
            })
            .then((res)=>res.json(res))
            .then((gjson)=>{
                console.log(gjson);
                try {
                    if(gjson.succes=="succes") 
                    {
                        setEndShow(false);
                        setRefresh(true);
                    }
                    else
                    {
                        setAlert("서버 에러",0);
                    }
                }catch (e) {
                    setAlert("서버에서 처리를 실패 했습니다",0);
                }
            })
        }
    }

    const onInputOk = ()=>{
        if(btnSel==-1) setAlert("선택지를 선택해주세요.",0)
        else if(!ready) 
        {
            setAlert("한번 더 누르면 결정됩니다.",1);
            setReady(true); 
        }    
        else
        {
            let pay = {uid:userId , pay:inputValue};
            fetch(serverPath()+"/check_point",{
                method:"post",
                headers : {
                    "content-type" : "application/json",
                },
                body : JSON.stringify(pay),
            })
            .then((res)=>res.json(res))
            .then((pjson)=>{
                try {
                    let gamblerjson = {bettingidx:modaldata.idx,uid:userId,name:userName,opnumber:btnSel,point:inputValue};
                    if(pjson.succes=="succes") 
                    {
                        fetch(serverPath()+"/in_gambler",{
                            method:"post",
                            headers : {
                                "content-type" : "application/json",
                            },
                            body : JSON.stringify(gamblerjson),
                        })
                        .then((res)=>res.json(res))
                        .then((gjson)=>{
                            console.log(gjson);
                            try {
                                if(gjson.succes=="succes") 
                                {
                                    setInputShow(false);
                                    setRefresh(true);
                                    //setIsFavor(false);
                                }
                                else
                                {
                                    if(gjson.succes=="overlap") 
                                        setAlert("이미 베팅되어 있습니다",0);
                                    else
                                        setAlert("서버 에러",0);
                                }
                            }catch (e) {
                                setAlert("서버에서 처리를 실패 했습니다",0);
                            }
                        })
                    }
                    else 
                    {
                        if(pjson.err=="lack") 
                            setAlert("포인트가 부족합니다",0);
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
    const onAddOk = ()=>{
        if(titleText.length == 0) setAlert("제목을 넣어주세요.",0)
        else if(addText02.length == 0) setAlert("선택지는 두 가지 이상 만드세요.",0)
        else if(!ready) 
        {
            setAlert("한번 더 누르면 결정됩니다.",1);
            setReady(true); 
        }   
        else
        {
            let options = 2;
            let opText = `${addText01},${addText02}`;

            if(addText03.length > 0) 
            {
                options = 3;
                opText+=`,${addText03}`
            }
            if(addText04.length > 0) 
            {
                options = 4;
                opText+=`,${addText04}`
            }
            if(addText05.length > 0) 
            {
                options = 5;
                opText+=`,${addText05}`
            }

            let bettingData = {title:titleText, uid:userId, options:options, optext:opText}

            fetch(serverPath()+"/in_betting",{
                method:"post",
                headers : {
                    "content-type" : "application/json",
                },
                body : JSON.stringify(bettingData),
            })
            .then((res)=>res.json(res))
            .then((json)=>{
                console.log(json);
                try {
                    if(json.succes=="succes") 
                    {
                        setAddShow(false);
                        setRefresh(true);
                        //setIsFavor(false);
                    }
                    else
                    {
                        setAlert("서버 에러",0);
                    }
                }catch (e) {
                    setAlert("서버에서 처리를 실패 했습니다",0);
                }
            })
        }

    }

    const onSelectBtn = (idx)=>{
        let off = ["outline-primary","outline-danger","outline-warning","outline-success","outline-info"];
        let on = ["primary","danger","warning","success","info"];
        off[idx] = on[idx];

        setSelText(modaldata.optext.split(',',modaldata.options)[idx]);

        // if(idx==0) setSelText(modaldata.op01);
        // if(idx==1) setSelText(modaldata.op02);
        // if(idx==2) setSelText(modaldata.op03);
        // if(idx==3) setSelText(modaldata.op04);
        // if(idx==4) setSelText(modaldata.op05);
        setBtnSel(idx);
        setClassN(off);
        console.log(idx);
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
            setAddShow(true);
            setAlert('',0);
            setTitleText('');
            setAddText01('');
            setAddText02('');
            setAddText03('');
            setAddText04('');
            setAddText05('');
            setReady(false); 
        }
    }

    return(
    <div className="flex">
        <div className="betting-w">
            <div className="title">
                <h3> Betting </h3>
            </div>
            <div className="w-100 Sort-auto2">
                <Breadcrumb>
                    <Breadcrumb.Item active={proceeding} onClick={()=>onBreadcrumb(0)}>진행중</Breadcrumb.Item>
                    <Breadcrumb.Item active={!proceeding} onClick={()=>onBreadcrumb(1)}>종료됨</Breadcrumb.Item>
                </Breadcrumb>
                <Breadcrumb>
                    {userPrivilege>1?<Breadcrumb.Item onClick={()=>onBreadcrumb(2)}>추가</Breadcrumb.Item>:null}
                </Breadcrumb>
            </div>

            <>
                {bettings.map((e,i)=>{
                    return (<BettingList key={i} info={e} sel={i} onInputShow={onInputShow} onEndShow={onEndShow} proceeding={proceeding}/>)
                })}
            </>

            <Modal
                show={inputShow}
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                backdrop={"static"}
                onHide={()=>{setInputShow(false)}}
                centered
            >
                <Modal.Header closeButton>
                    <strong className="me-auto fs-3">{modaldata.title}</strong>
                </Modal.Header>
                <Modal.Body >
                    <div className='Sort-auto mb-3'>
                        <>{modaldata.options>0?<Button variant={classN[0]} onClick={()=>onSelectBtn(0)}>1번</Button>:null}</>
                        <>{modaldata.options>1?<Button variant={classN[1]} onClick={()=>onSelectBtn(1)}>2번</Button>:null}</>
                        <>{modaldata.options>2?<Button variant={classN[2]} onClick={()=>onSelectBtn(2)}>3번</Button>:null}</>
                        <>{modaldata.options>3?<Button variant={classN[3]} onClick={()=>onSelectBtn(3)}>4번</Button>:null}</>
                        <>{modaldata.options>4?<Button variant={classN[4]} onClick={()=>onSelectBtn(4)}>5번</Button>:null}</>
                    </div>
                    <div className='memlist-input mb-3'>
                        <p className="mb-0 mr-1">{"betting point : "}</p>
                        <strong className=" fs-3">{inputValue}p</strong>
                    </div>
                    <Form.Range step={10} min={10} max={500} value={inputValue} onChange={(e)=>{console.log("onChange",e.target.value); setInputValue(e.target.value)}} className="fs-3"/>
                    <small className="me-auto">* 수치만큼 Point를 사용합니다</small>
                </Modal.Body>
                <Modal.Footer>
                    <small className={alertColor}>{alertText}</small>
                    <Button variant="primary" onClick={onInputOk}>올리기</Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={endShow}
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                backdrop={"static"}
                onHide={()=>{setEndShow(false)}}
                centered
            >
                <Modal.Header closeButton>
                    <strong className="me-auto fs-3">{modaldata.title}</strong>
                </Modal.Header>
                <Modal.Body >
                    <div className='Sort-auto mb-4'>
                        <>{modaldata.options>0?<Button variant={classN[0]} onClick={()=>onSelectBtn(0)}>1번</Button>:null}</>
                        <>{modaldata.options>1?<Button variant={classN[1]} onClick={()=>onSelectBtn(1)}>2번</Button>:null}</>
                        <>{modaldata.options>2?<Button variant={classN[2]} onClick={()=>onSelectBtn(2)}>3번</Button>:null}</>
                        <>{modaldata.options>3?<Button variant={classN[3]} onClick={()=>onSelectBtn(3)}>4번</Button>:null}</>
                        <>{modaldata.options>4?<Button variant={classN[4]} onClick={()=>onSelectBtn(4)}>5번</Button>:null}</>
                    </div>
                    <div className='memlist-input mb-3'>
                        <p className="mb-0">{`* ${selText} *`}</p>
                    </div>
                    <p className='my-0'><small className="me-auto">* 결과 선택지는 눌러주세요.</small></p>
                    <p className='my-0'><small className="me-auto">* 베팅이 자동정산 됩니다.</small></p>
                </Modal.Body>
                <Modal.Footer>
                    <small className={alertColor}>{alertText}</small>
                    <Button variant="primary" onClick={onEndOk}>결과/정산</Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={addShow}
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                backdrop={"static"}
                onHide={()=>{setAddShow(false)}}
                centered
            >
                <Modal.Header closeButton>
                    <Form className="w-75">
                        <Form.Control value={titleText} placeholder="제목.." onChange={(e)=>{if(e.target.value.length<15)setTitleText(e.target.value)}} />
                    </Form>
                </Modal.Header>
                <Modal.Body >
                    <div className="Sort-c mb-2">
                        <Form className="w-75">
                            <Form.Control className="mb-1" value={addText01} placeholder="선택지1.." onChange={(e)=>{if(e.target.value.length<10)setAddText01(e.target.value)}} />
                            {addText01.length>0?<Form.Control className="mb-1" value={addText02} placeholder="선택지2.." onChange={(e)=>{if(e.target.value.length<10)setAddText02(e.target.value)}} />:null}
                            {addText02.length>0?<Form.Control className="mb-1" value={addText03} placeholder="선택지3.." onChange={(e)=>{if(e.target.value.length<10)setAddText03(e.target.value)}} />:null}
                            {addText03.length>0?<Form.Control className="mb-1" value={addText04} placeholder="선택지4.." onChange={(e)=>{if(e.target.value.length<10)setAddText04(e.target.value)}} />:null}
                            {addText04.length>0?<Form.Control className="mb-1" value={addText05} placeholder="선택지5.." onChange={(e)=>{if(e.target.value.length<10)setAddText05(e.target.value)}} />:null}
                        </Form>
                    </div>
    
                    <p className='my-0'><small className="me-auto">* 선택지는 내용이 있는 칸만 생성됩니다.</small></p>
                    <p className='my-0'><small className="me-auto">* 추가하면 수정할 수 없습니다.</small></p>
                </Modal.Body>
                <Modal.Footer>
                    <small className={alertColor}>{alertText}</small>
                    <Button variant="primary" onClick={onAddOk}>추가</Button>
                </Modal.Footer>
            </Modal>
        </div>
    </div> 
    )
}


function BettingList(props)
{
    const member = useSelector((state)=>{return state.member});
    const userData = useSelector((state)=>{return state.data});
    const [userPrivilege] = useState(userData.privilege);
    let graph = 
    {
        series: [{
            name: '1번',
            data: [10]
        }, {
            name: '2번',
            data: [20]
        }],
        options: {
            colors: ['#0D6EFD', '#DC3545','#FFC107', '#198754', '#0DCAF0'],
            chart: {
            animations: {enabled: false},
            toolbar: {show: false},
            dropShadow: {enabled: false},
            offsetX: -8,
            offsetY: -30,
            type: 'bar',
            stacked: true,
            stackType: '100%',
            width: "100%",
            height: "auto",
            sparkline: {
                enabled: false
              },
            },
            plotOptions: {
            bar: {horizontal: true}
            },
            stroke: {
            width: 1,
            colors: ['#fff']
            },
            title: {
            },
            xaxis: {
            labels: {show: false},
            axisBorder: {show: false},
            axisTicks: {show: false},
            categories:[""]
            },
            yaxis: {
            show: false,
            axisBorder: {show: false}
            },
            tooltip: {
            y: {
                formatter: function (val) {
                return val + "p"
                }
            }
            },
            grid: {show: false},
            legend: {show: false}
        }
        
    };
    graph.series.splice(0);

    
    let proceeding = props.proceeding;
    let sel = props.sel;
    let info = props.info;
    let mem = member.filter((f)=>f.uid==info.uid)
    let classN =["outline-primary","outline-danger","outline-warning","outline-success","outline-info"];
    let rate =["","","","",""];
    let oplist =[];
    let list =info.list;
    let totalpoint = 0;
    console.log("info",info);

    oplist = info.optext.split(',',info.options);
    
    if(!proceeding) classN[info.endsel] = classN[info.endsel].substring(8);

    if(info.hasOwnProperty("points"))
    {
        for(let i = 0 ; i < info.options;i++)
        {
            //console.log("BettingList",i,info.option);
            totalpoint += info.points[i];
            let seri = {
                name: (i+1)+"번",
                data: [info.points[i]]
            }
            graph.series.push(seri);
        }
        for(let i = 0 ; i < info.options;i++)
        {
            rate[i] = ((totalpoint - info.points[i])/info.points[i]).toFixed(2);
            if(rate[i]=="Infinity") rate[i]="NaN";
        }
        
        return (
            <div className="mb-5">
                <Toast className="Betting-toast">
                    <Toast.Header closeButton={false} >
                        <NamePlate mem={mem[0]}/>
                        <div className="w-75">
                            <strong className=" fs-6">{info.title}</strong>
                        </div>
                    </Toast.Header>
                    <Toast.Body>
                        <div className="betting mb-0">
                            <ReactApexChart className="z-index-0" options={graph.options} series={graph.series} type="bar" height={100} />
                        </div>
                        <div className="mb-3 ">
                            {
                                oplist.map((e,i)=>{
                                    return (
                                        <>
                                        <OverlayTrigger
                                        placement={"bottom"}
                                        overlay={
                                            <Popover id={"bottom"+i}>
                                            <Popover.Header as="h3">{`${i+1}번 선택멤버`}</Popover.Header>
                                            <Popover.Body>
                                                <PopList list={list} idx={i}/>
                                            </Popover.Body>
                                            </Popover>
                                        }
                                        >
                                            <div className="Sort-c">
                                                <Button className="Sort-auto2 w-75 " variant={classN[i]} size="sm">
                                                    <string>{(i+1)+"."}</string>
                                                    <string>{e}</string>
                                                    <string className="text-right">{`[${info.points[i]}p]`}</string>
                                                </Button>
                                            </div>
                                        </OverlayTrigger>
                                        <div className="Sort-r mb-2">
                                            <string>{`rate. 1:${rate[i]}`}</string>
                                        </div>
                                        </>
                                    )
                                })
                            }
                        </div>
                        <div>
                            {proceeding?<Button variant="info" className="" onClick={()=>{props.onInputShow(sel)}}>참가</Button>:null}
                            {(userPrivilege>1&&proceeding)?<Button variant="secondary" className="mx-1" onClick={()=>{props.onEndShow(sel)}}>베팅종료</Button>:null}
                        </div>
                    </Toast.Body>
                </Toast>
            </div>
        )
    }
}

function PopList(props) {

    let member = useSelector((state)=>{return state.member});
    let list =props.list;
    let i = props.idx;
    let rt = list.map((e,j)=>{
        let mem = member.filter((f)=>f.uid==e.uid)
        if(e.opnumber == i)
        return(
        <Form.Group as={Row} key = {j} controlId="formUser" className="Betting-poplist m-1">
            <Col xs={7} className='Attend-text-right p-0'>
                <NamePlate mem={mem[0]} />
            </Col>
            <Col xs={4} className='Betting-list p-0'>
                <p className="m-0 fw-bold">{`${e.point}p`}</p>
            </Col>
        </Form.Group>)
    });
    return rt;
}

export default Betting;