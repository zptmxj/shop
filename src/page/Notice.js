import './Notice.scss';
import {Accordion } from 'react-bootstrap';
import {serverPath,imagePath} from '../IP_PORT';
import { useEffect, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux'


function Notice(props)
{
 
    let member = useSelector((state)=>{return state.member});
    const dispatch = useDispatch();

    const curDate = new Date();
    const Year = curDate.getFullYear();
    
    const [sel, setSel] = useState(-1);
    const [noticeList, setNoticeList] = useState([]);
    const [isButton,setIsButton] = useState(false);
    const [allStatus, setAllStatus] = useState([]);
    const [scrollY, setScrollY] = useState(0);


    useEffect(()=>{
        if(noticeList.length==0)
        {
            fetch(serverPath()+"/out_notice",{
                method:"post",
                headers : {
                    "content-type" : "application/json",
                },
                body : JSON.stringify(),
            })
            .then((res)=>res.json())
            .then((all)=>{
                console.log('all',all);
            
                setNoticeList(all);

            });
        }
    })

    // const setBackCallback = ()=>{
    //     setIsButton(false);
    //     setSel(-1);
    // }

    // const onSend = ()=>{
    //     console.log('onSend');
    //     if(!isButton) setIsButton(true);
    //     else
    //     {
    //         setIsButton(false);
    //         setAllStatus([]);
    //     }
    // }

    // const onCancel = ()=>{
    //     console.log('onCancel');
    //     setIsButton(false)
    // }

    let num = 0;
    return(
        <div >
        {
            <div id="scrollbar">
                <div className="title">
                    <h3> Notice </h3>
                </div>   
                <div>
                <Accordion alwaysOpen>
                {
                    noticeList.length!=0?
                    noticeList.map((notice,i)=>{
                        return <Accordion.Item eventKey={i}>
                        <Accordion.Header>{notice.title}</Accordion.Header>
                        <Accordion.Body bsPrefix='accordion-body'>
                        {notice.text}
                        </Accordion.Body>
                    </Accordion.Item>
                    }) : null 

                }
                </Accordion>
                </div>   
            </div>
        }
        </div> 
    )
}

export default Notice;
