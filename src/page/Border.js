import './Border.scss';
import React,{useState,useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import {Pagination , Modal, Button,Spinner,Alert} from 'react-bootstrap';
import {serverPath} from '../IP_PORT';
import {useSelector} from 'react-redux'

function Border()
{
    let member = useSelector((state)=>{return state.member});
    let userData = useSelector((state)=>{return state.data});
    let [userId,setUserId] = useState(userData.uid);

    let history = useHistory();
    const [sel, setsel] = useState("list-color-00");
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


        // let element = document.getElementById("test");
        // console.log("element",element, element.className);
        // element.className = "Border-color-16";

        // if(Borders.length == 0)
        // {
        //     fetch(serverPath()+"/out_Border",{
        //         method:"post",
        //         headers : {
        //             "content-type" : "application/json",
        //         },
        //         body : JSON.stringify({sex:mem[0].sex}),
        //     })
        //     .then((res)=>res.json())
        //     .then((json)=>{
        //         console.log('out_Border', json);
        //         setBorders(json);
        //     })
        // }
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


    const onSend = (avt)=>{
        setIsSpinner(true);

        fetch(serverPath()+"/buy_Border",{
            method:"post",
            headers : {
                "content-type" : "application/json",
            },
            body : JSON.stringify({Border:avt.idx, uid:userId,cash:avt.cash}),
        })
        .then((res)=>res.json())
        .then((json)=>{
            console.log('buy_Border', json);
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
                    if(json.err=="Border") 
                        onMini("서버 에러 : Border",0);
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

    const onCollback = (idx)=>{
        console.log(idx);
        setsel("list-color-"+idx);
    }

    

    return(
        <div>
            <div className="title">
                <h3> Border </h3>
            </div>

            <div className="Border-midle">
                <div>
                    <MyPastelColor  col={1} row={6} onClick={(idx)=>onCollback(idx)}/>
                </div>
                <div>
                    <MyPastelColor  col={2} row={7} onClick={(idx)=>onCollback(idx)}/>
                </div>
                <div>
                    <MyPastelColor  col={3} row={8} onClick={(idx)=>onCollback(idx)}/>
                </div>
                <div>
                    <MyPastelColor  col={4} row={9} onClick={(idx)=>onCollback(idx)}/>
                </div>
                <div>
                    <MyPastelColor  col={5} row={10} onClick={(idx)=>onCollback(idx)}/>
                </div>
                <div>
                    <MyPastelColor  col={6} row={11} onClick={(idx)=>onCollback(idx)}/>
                </div>
                <div>
                    <MyPastelColor  col={7} row={10} onClick={(idx)=>onCollback(idx)}/>
                </div>
                <div>
                    <MyPastelColor  col={8} row={9} onClick={(idx)=>onCollback(idx)}/>
                </div>
                <div>
                    <MyPastelColor  col={9} row={8} onClick={(idx)=>onCollback(idx)}/>
                </div>
                <div>
                    <MyPastelColor  col={10} row={7} onClick={(idx)=>onCollback(idx)}/>
                </div>
                <div>
                    <MyPastelColor  col={11} row={6} onClick={(idx)=>onCollback(idx)}/>
                </div>
            </div>

            <table className="list-Table mt-5" >
                <tbody>
                    <tr>
                        <th className={sel}></th>
                        <th className={sel}></th>
                        <th className={sel}></th>
                        <th className={sel}></th>
                        <th className={sel}></th>
                        <th className={sel}></th>
                    </tr>
                    <tr>
                        <td className="list-td">1</td>
                        <td className="list-td"></td>
                        <td className="list-td-m" colSpan={2}>홍길동</td>
                        <td className="list-td" colSpan={2}>1000 TP</td>
                    </tr>
                    <tr>
                        <td className="list-td" colSpan={4}>{"--"}</td>
                        <td className="list-td">-</td>
                        <td className="list-td">-</td>
                    </tr>
                    <tr>
                        <td className={sel}></td>
                        <td className={sel}></td>
                        <td className={sel}></td>
                        <td className={sel}></td>
                        <td className={sel}></td>
                        <td className={sel}></td>
                    </tr>
                </tbody>
            </table>
            {
                <Modal
                 show={miniShow}
                 size="sm"
                 aria-labelledby="contained-modal-title-vcenter"
                 backdrop={"static"}
                 className="Border-mini"
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

            <div className="MyPw-button">
                <Button variant="secondary" onClick={onSend}>구매</Button>
            </div>

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

    let name = "Border-color-" + col;

    return (
    <div>
        {
            array.map((e)=>{return <div className={name + e}  onClick={()=>props.onClick(String(col)+e)}/>})
        }   
    </div>)
}

export default Border;