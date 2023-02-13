import './Notice.scss';
import {Accordion,Card,useAccordionButton } from 'react-bootstrap';
import {serverPath} from '../IP_PORT';
import { useEffect, useState } from 'react';
import {useSelector} from 'react-redux'


function Notice(props)
{
 
    let member = useSelector((state)=>{return state.member});

    // const curDate = new Date();
    // const Year = curDate.getFullYear();
    
    const [noticeList, setNoticeList] = useState([]);
    // const [sel, setSel] = useState(-1);
    // const [isButton,setIsButton] = useState(false);
    // const [allStatus, setAllStatus] = useState([]);
    // const [scrollY, setScrollY] = useState(0);


    useEffect(()=>{
        if(noticeList.length===0)
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
    function HeaderToggle({ HeaderText, eventKey }) {
        const [isOpen, setIsOpen] = useState(false);
        const [compStyle, setCompStyle] = useState("notice-title-text notice-title-close");

        const decoratedOnClick = useAccordionButton(eventKey, () =>{
            console.log('totally custom!',isOpen);
            setIsOpen(!isOpen); 
            if(isOpen) setCompStyle("notice-title-text notice-title-close");
            else setCompStyle("notice-title-text notice-title-open");
        });

        return (
          <Card.Header className={compStyle}
            onClick={decoratedOnClick}
          >
            {HeaderText}
          </Card.Header>
        );
    }

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
                    noticeList.length!==0?
                    noticeList.map((notice,i)=>{
                        return (
                        <Accordion.Item eventKey={i} key={i}>
                            {/* <Card.Header className='notice-title' onClick={useAccordionButton(i)} >{notice.title}</Card.Header> */}
                            <HeaderToggle HeaderText={`${('00' + notice.idx).slice(-3)} ||  ${notice.title}`} eventKey={i}></HeaderToggle>
                            <Accordion.Collapse eventKey={i}>
                                <Card.Body>
                                    <div className='notice-text'>
                                        {notice.text}
                                    </div>   
                                </Card.Body>
                            </Accordion.Collapse>
                        </Accordion.Item>
                        )
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
