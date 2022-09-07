import './MonkeyLottery.scss';
import React,{useState,useEffect,useRef } from 'react';
import { useHistory } from 'react-router-dom';
import {Row , Modal, Button,Form,Col,Table} from 'react-bootstrap';
import {serverPath,imagePath} from '../../IP_PORT';
import {useSelector} from 'react-redux'
import {CSSTransition} from 'react-transition-group'
import main_img from './monkey01.png';
import lotterybg_img from './_monkey00.png';
import mon0_img from './mon00.png';
import mon1_img from './mon01.png';
import mon2_img from './mon02.png';
import mon3_img from './mon03.png';
import mon4_img from './mon04.png';
import mon5_img from './mon05.png';
import mon0bg_img from './_mon00.png';
import mon1bg_img from './_mon01.png';
import mon2bg_img from './_mon02.png';
import mon3bg_img from './_mon03.png';
import mon4bg_img from './_mon04.png';
import mon5bg_img from './_mon05.png';
function MonkeyLottery()
{
    let member = useSelector((state)=>{return state.member});
    let userData = useSelector((state)=>{return state.data});
    const [userId] = useState(userData.uid);
    const [userName] = useState(userData.name);

    let history = useHistory();
    const [lotteryImg, setLotteryImg] = useState(0);
    const [isScratch, setIsScratch] = useState(false);

    const [modalShow, setModalShow] = useState(false);

    const [ctx, setCtx] = useState("");
    const [touchX, setTouchX] = useState(0);
    const [touchY, setTouchY] = useState(0);
    const [painting, setPainting] = useState(false);

    const [isPopup, setIsPopup] = useState(false);
    const [isLottory, setIsLottory] = useState(false);
    const [isCheckOk, setIsCheckOk] = useState(false);
    const [isWinning, setIsWinning] = useState(false);

    const [isDelay, setIsDelay] = useState(false);

    const [alertText, setAlertText] = useState("");
    const [alertColor,setAlertColor] = useState("me-auto fs-red");

    const [refresh, setRefresh] = useState(true);
    const [isSend, setIsSend] = useState(false);
    const [toDay, setToDay] = useState(0);

    const [cvs, setCvs] = useState(0);

    useEffect(()=>{
        let tcvs;
        if(!isLottory)
        {
            tcvs = document.getElementById("jsCanvas");
            setCvs(tcvs);
        }
        
        if(refresh)
        {
            setRefresh(false);
            let jsonData = {uid:userId}
            fetch(serverPath()+"/cost_monkey",{
                method:"post",
                headers : {
                    "content-type" : "application/json",
                },
                body : JSON.stringify(jsonData),
            })
            .then((res)=>res.json())
            .then((json)=>{
                console.log('cost_monkey', json);
                setToDay(json.length);
            })
        }

        console.log('useEffect_isPopup', isPopup,isScratch);
        if(cvs&&isPopup&&!isLottory)
        {
            setIsLottory(true);
            let tctx = tcvs.getContext("2d")
            setCtx(tctx);
            tctx.save();
            tctx.beginPath();
            tctx.fillStyle='rgba(120,120,120,1)';
            tctx.fillRect(45,30,100,100);
            tctx.restore();
            console.log('useEffect_cvs', tcvs);
        }
        if(!isDelay&&isScratch)
        {
            let timer = setInterval(()=>{setIsDelay(true);},100);
            return () => clearInterval(timer);
        }
    });

    function onMouseMove(e) {

        const scrollY = window.scrollY;
        
        const x = e.changedTouches[0].pageX - (e.target.getBoundingClientRect().left);
        const y = (e.changedTouches[0].pageY) - (scrollY + e.target.getBoundingClientRect().top);

        console.log("move",x,y);
        if(painting) {
            ctx.beginPath();
            ctx.moveTo(touchX, touchY);
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.arc(x,y,20,0,Math.PI*2, false)
            ctx.fill();
        }
        setTouchX(x);
        setTouchY(y);
    }

    function startPainting(e) { 
        console.log("start_e",e);
        const scrollY = window.scrollY;
        const x = e.changedTouches[0].pageX - (e.target.getBoundingClientRect().left);
        const y = (e.changedTouches[0].pageY) - (scrollY + e.target.getBoundingClientRect().top);

        setTouchX(x);
        setTouchY(y);
        console.log("start",x,y);
        console.log("start_par_x",e.target.getBoundingClientRect().top);
        console.log("start_par_y",e.target.getBoundingClientRect().left);
        
        ctx.save();
        ctx.beginPath();
        ctx.globalCompositeOperation='destination-out';
        ctx.fillStyle='rgba(120,120,120,1)';
        ctx.lineWidth = 30;
        
        setPainting(true);
    }

    const pixelData = (img) =>{
        let count = 0;
        
        for(let i = 0; i<10000 ; i++)
        {
            let idx = (i*4);
            let imgpix = img.data[idx] + img.data[idx+1] + img.data[idx+2] + img.data[idx+3];

            if(imgpix == 0) count++;
        }
        console.log("count",count,img);
        return count>7000;
    }

    function stopPainting(e) { 
        console.log("stop"); 
        ctx.restore();

        setPainting(false);
        let imgdata = ctx.getImageData(45,30,100,100);
        if(pixelData(imgdata))
        {
            setIsCheckOk(true);
            if(!isSend) onSend();
        }
    }

    const setAlert = (text,sel)=>{
        if(sel==0) setAlertColor("me-auto fs-red");
        else if(sel==1) setAlertColor("me-auto fs-blue");
        else if(sel==2) setAlertColor("me-auto fs-green");
        setAlertText(text);
    }

    const onSend = ()=>{
        setIsSend(true);
        let p = 0 ;
        let h = "Monkey 꽝" ;
        
        if(isWinning==5)
        {
            p = 2;
            h="Monkey 5등 2p"
        }
        else if(isWinning==4)
        {
            p = 6;
            h="Monkey 4등 6p"
        }
        else if(isWinning==3)
        {
            p = 12;
            h="Monkey 3등 12p"
        }
        else if(isWinning==2)
        {
            p = 25;
            h="Monkey 2등 25p"
        }
        else if(isWinning==1)
        {
            p = 60;
            h="Monkey 1등 60p"
        }
        
        let jsonData = {uid:userId ,name:userName ,point:p,history:h}

        fetch(serverPath()+"/in_monkey",{
            method:"post",
            headers : {
                "content-type" : "application/json",
            },
            body : JSON.stringify(jsonData),
        })
        .then((res)=>res.json())
        .then((json)=>{
            console.log('in_monkey', json);
            try {
                if(json.succes=="succes") 
                {
                    setAlert("정상적으로 기록 되었습니다!",1);
                }
                else 
                {
                    if(json.err=="asset") 
                        setAlert("서버 에러 : asset",0);
                }
            }catch (e) {
                setAlert("서버에서 처리를 실패 했습니다",0);
            }
        })
        
    }
    const getRandom = (min, max) => Math.random() * (max - min) + min;

    const onShowModal = ()=>{
        if(toDay>4) return;
        
        setAlertText("");
        setModalShow(true);
        setIsPopup(true);
      
    }

    const onHide = ()=>{
        if(ctx)ctx.restore();
        setModalShow(false)
        setIsPopup(false);
        setIsLottory(false);
        setIsScratch(false);
        setIsCheckOk(false);
        setIsDelay(false);

        setRefresh(true);
        setIsSend(false);

    }

    const onBuyLottery = ()=>{
        fetch(serverPath()+"/buy_monkey",{
            method:"post",
            headers : {
                "content-type" : "application/json",
            },
            body : JSON.stringify({uid:userId, point:2}),
        })
        .then((res)=>res.json())
        .then((json)=>{
            console.log('buy_monkey', json);
            try {
                if(json.succes=="fail") 
                {
                    if(json.err=="lack") 
                        setAlert("포인트가 부족합니다",0);
                }
                else 
                {
                    switch(json.succes)
                    {
                        case 1:
                            setLotteryImg(mon5bg_img);
                            setIsWinning(1);
                            break;
                        case 2:
                            setLotteryImg(mon4bg_img);
                            setIsWinning(2);
                            break;
                        case 3:
                            setLotteryImg(mon3bg_img);
                            setIsWinning(3);
                            break;
                        case 4:
                            setLotteryImg(mon2bg_img);
                            setIsWinning(4);
                            break;
                        case 5:
                            setLotteryImg(mon1bg_img);
                            setIsWinning(5);
                            break;
                        case 6:
                            setLotteryImg(mon0bg_img);
                            setIsWinning(6);
                            break;
                    }

                    setIsScratch(true);
                    setAlertText("");
                    
                }
            }catch (e) {
                setAlert("서버에서 처리를 실패 했습니다",0);
            }
        })

    }


    return(
        <div>
            <div className="title">
                <h3> Monkey Lottery </h3>
            </div>

            <div className="MonkeyLottery-body mb-3">
                <img className="MonkeyLottery-modal-img col-6" src={main_img} />
            </div>

            <div className="MonkeyLottery-body mb-1">
                {/* <p className='text-primary'>{`ToDay : ${toDay}`}</p> */}
                {toDay>4?<p className='text-danger'>{`ToDay : (${toDay}/5)`}</p>:<p className='text-primary'>{`ToDay : (${toDay}/5)`}</p>}
            </div>
            <div className="MonkeyLottery-body mb-5">
                <Button onClick={onShowModal}>사러가기</Button>
            </div>
            <div className="MonkeyLottery-body mb-1">
               
            </div>
           
            

            <div className="MonkeyLottery-body mb-3">
                <Table bordered >
                    <thead>
                        <tr>
                            <th className='px-0'>이미지</th>
                            <th className='px-0'>Point</th>
                            <th className='px-0'>확률</th>
                            <th className='px-0'>매수</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className='px-0'><img src={mon5_img} width={50} height={50}/></td>
                            <td className='px-0'>60</td>
                            <td className='px-0'>1:333</td>
                            <td className='px-0'>3/1000</td>
                        </tr>
                        <tr>
                            <td className='px-0'><img src={mon4_img} width={50} height={50}/></td>
                            <td className='px-0'>25</td>
                            <td className='px-0'>1:166</td>
                            <td className='px-0'>6/1000</td>
                        </tr>
                        <tr>
                            <td className='px-0'><img src={mon3_img} width={50} height={50}/></td>
                            <td className='px-0'>12</td>
                            <td className='px-0'>1:50</td>
                            <td className='px-0'>20/1000</td>
                        </tr>
                        <tr>
                            <td className='px-0'><img src={mon2_img} width={50} height={50}/></td>
                            <td className='px-0'>6</td>
                            <td className='px-0'>1:10</td>
                            <td className='px-0'>100/1000</td>
                        </tr>
                        <tr>
                            <td className='px-0'><img src={mon1_img} width={50} height={50}/></td>
                            <td className='px-0'>2</td>
                            <td className='px-0'>1:2.5</td>
                            <td className='px-0'>400/1000</td>
                        </tr>
                        <tr>
                            <td className='px-0'><img src={mon0_img} width={50} height={50}/></td>
                            <td className='px-0'>0</td>
                            <td className='px-0'>-</td>
                            <td className='px-0'>471/1000</td>
                        </tr>
                    </tbody>
                </Table>
            </div>

            {
                <Modal
                    id="jsModal"
                    show={modalShow}
                    onHide={onHide}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    backdrop={"static"}
                    centered
                >
                    <Modal.Header>
                        <h4>Buy MonkeyLottery</h4>
                    </Modal.Header>
                    <Modal.Body>
                    <div className='row flex mb-4'>
                        {isScratch?
                            <div className='img-parent col-7 px-0' >
                                {isDelay?<img className="" src={lotteryImg} width={190} height={300}/>:null}
                                <div className='img-child' id="jsChild" >
                                    <canvas className="scr-canvas " onTouchStart={startPainting} onTouchMove={onMouseMove} onTouchEnd={stopPainting} id="jsCanvas" width={190} height={300} />
                                </div>
                            </div>:null}
                        {/* <p>{`${touchX},${touchY}`}</p> */}
                        {!isScratch?<p className="px-3 pt-3 mb-0">
                            * 구매 즉시 2 Point가 차감됩니다.
                        </p>:null}
                        {!isScratch?<p className="px-3 pt-0 mb-0">
                            * 회색 부분을 긁어 결과를 확인하세요.
                        </p>:null}
                        {!isScratch?<p className="px-3 pt-0 mb-0 text-danger">
                            * PC접속은 위 기능이 지원되지 않습니다.
                        </p>:null}
                        {!isScratch?<p className="px-3 pt-0 mb-0">
                            * 당첨 후 정상기록 문구를 확인해주세요.
                        </p>:null}
                        {isScratch&&!isCheckOk?<p className="px-3 pt-3 mb-0">
                            * 스크레치를 많이 지워야 결과가 나옵니다.
                        </p>:null}

                    </div>
                    <div className='flex'>
                        {(isCheckOk&&isWinning==1)?<p className="px-3 mb-0">
                            <p className='fs-2 mb-0'>* 축 60P 당첨 *</p>
                        </p>:null}
                        {(isCheckOk&&isWinning==2)?<p className="px-3 mb-0">
                            <p className='fs-2 mb-0'>* 축 25P 당첨 *</p>
                        </p>:null}
                        {(isCheckOk&&isWinning==3)?<p className="px-3 mb-0">
                            <p className='fs-2 mb-0'>* 축 12P 당첨 *</p>
                        </p>:null}
                        {(isCheckOk&&isWinning==4)?<p className="px-3 mb-0">
                            <p className='fs-2 mb-0'>* 축 6P 당첨 *</p>
                        </p>:null}
                        {(isCheckOk&&isWinning==5)?<p className="px-3 mb-0">
                            <p className='fs-2 mb-0'>* 축 2P 당첨 *</p>
                        </p>:null}
                        {(isCheckOk&&isWinning==6)?<p className="px-3 mb-0">
                            <p className='fs-2 mb-0'>* 꽝! *</p>
                        </p>:null}
                    </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <small className={alertColor}>{alertText}</small>
                        {(isCheckOk)?<Button variant="primary" onClick={onHide}>확인</Button>:null}
                        {!isScratch?<Button variant="primary" onClick={onBuyLottery}>구매 : 2p</Button>:null}
                        {!isScratch?<Button variant="danger" onClick={onHide}>취소</Button>:null}
                    </Modal.Footer>
                </Modal>
            }
        </div> 
    )
}


export default MonkeyLottery;