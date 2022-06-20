//import Calender from './component/CheckIn/Calender';
import { Form, Button, InputGroup,FormControl,Dropdown, FormGroup } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import axios from 'axios';
import serverIP from '../IP_PORT';
import './TestPage.scss';
import ReactApexChart from "react-apexcharts"; 

function TestPage(props)
{
    let count = [1,2,3,4,5];
    const [data, setData] = useState({
            series: [{
              name: 'Series 1',
              data: [1, 0, 3, 10, 5 ,4],
            }],
           
            options: {
                fill: {
                    opacity: 0.3
                },
                chart: {
                    type: 'radar',
                    toolbar: {
                        show: false,
                    }
                },
                title: {
                    text: ""   
                },
                yaxis: {
                    show: false,
                },
                xaxis: {
                    categories: ['추리', '역할', '전략', '조작', '민첩', '도박'],
                    labels: {
                        show: true,
                        style: {
                            colors: ["#a8a8a8"],
                            fontSize: "13px",
                            fontFamily: 'Arial'
                        }
                    }
                }
            },
           
});
    const [data01, setData01] = useState('');
    const [data02, setData02] = useState('');
    const [checklist, setChecklist] = useState([false,false,false,false,false]);
    const [curlist, setCurlist] = useState([false,false,false,false,false]);
    const [refresh, setRefresh] = useState(false);
    const [imagefile, setImagefile] = useState({
        file: "",
        URL: "img/default_image.png",
      });

    useEffect(()=>{
        let tset = [false,false,false,false,false];
        let tset1 = tset.map(e=>e);
        
        setChecklist(tset);
        setCurlist(tset1);
        console.log('tset',tset);
        console.log('tset1',tset1);
    },[])

    useEffect(()=>{
        // if(!imagefile) return false;
        // const imgEL = document.querySelector("imgbox");
        // const reader = new FileReader();
        // reader.onload = () => (imgEL.getElementsByClassName.backgroundImage = 'url(${reader.result})');
        // reader.readAsDataURL(imagefile[0]);
    });

    const onChange01 = (e)=>{
        setData01(e.target.value);
    }
    const onClick01 = (e)=>{
        
        let rt = window.btoa(data01);
        console.log(rt);
    }

    const onChange02 = (e)=>{
        setData02(e.target.value);
    }
    const onClick02 = (e)=>{
        let rt = window.atob(data02);
        console.log(rt);
    }

    const onClickCheck = (e)=>{
        let checked = checklist;
        checked[e] = !checked[e];
        setChecklist(checked);
        console.log(checked);
        setRefresh(!refresh);
        console.log('checklist',checklist);
        console.log('curlist',curlist);
    }

    const onChangeImg = (e)=>{
        let upimg = e.target.files[0]; 

        const fileReader = new FileReader();

        if(e.target.files[0]){
            fileReader.readAsDataURL(e.target.files[0])
        }
        fileReader.onload = () => {
            setImagefile({
                file: upimg,
                URL: fileReader.result
            });
        }
    }

    const onSendImg = async (e)=>{
        const formData= new FormData();
        formData.append("file",imagefile.file);
        // await axios({
        //     method: 'post',
        //     url: '/in_boardimage',
        //     data: formData,
        //     headers: {
        //       'Content-Type': 'multipart/form-data',
        //     },
        //   }).then(()=>{console.log('onSendImg','then')});
        const config = {
            Headers:{
                "content-type":"multipart/form-data"
            }
        };
        console.log('onSendImg',imagefile,formData);
        await axios.post(serverIP+"/in_boardimage",formData,config);
    }



    return(
        <div>
        {
            <div>
                <h3> TestPage </h3>
                
                <div className='ApexChart'>
                    <ReactApexChart options={data.options} series={data.series} type="radar" height={300}/>
                </div>

                <input value={data01} onChange={onChange01}/>
                <button onClick={onClick01}>data1</button>
                <input value={data02} onChange={onChange02}/>
                <button onClick={onClick02}>data2</button>
           
                <div>
                {
                    count.map((e,i)=>{
                        return(
                        <Form.Check key ={i} type='checkbox' id='rd1' onChange={()=>onClickCheck(i)} checked={checklist[i]}/>
                        )
                    })
                }
                </div>
                <div>
                <div className='imgbox'></div>
                <InputGroup className="mb-3">
                    <FormControl type="file" accept='image/*' aria-label="First name" onChange={onChangeImg} />
                    <Button variant="outline-secondary" id="button-addon2" onClick={onSendImg}>
                        Button
                    </Button>
                </InputGroup>
                </div>
            </div>
        }
        </div> 
    )
}

export default TestPage;