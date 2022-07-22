//import Calender from './component/CheckIn/Calender';
import { Form, Button, InputGroup,FormControl,Dropdown, FormGroup } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {serverPath} from '../IP_PORT';
import './TestPage.scss';
import ReactApexChart from "react-apexcharts"; 
//import {Unity,useUnityContext } from 'react-unity-webgl';

function TestPage(props)
{
    // const { unityProvider } = useUnityContext({
    //     loaderUrl: "Build/WebGl.loader.js",
    //     dataUrl: "Build/WebGl.data",
    //     frameworkUrl: "Build/WebGl.framework.js",
    //     codeUrl: "Build/WebGl.wasm",
    //   });

    let count = [1,2,3,4,5];
    const [series, setSeries] = useState(
     [{
        name: 'Series 1',
        data: [1, 0, 3, 10, 5 ,4],
      }]
    );

    const [options, setOptions] = useState({
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
    });

    const [data, setData] = useState();
            
           
            
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
        await axios.post(serverPath()+"/in_boardimage",formData,config);
    }


    const onApexChartClick01 = (e)=>{
        
        let ApexChart = [{
            ...series,
            data:[series[0].data[0]+1,series[0].data[1],series[0].data[2],series[0].data[3],series[0].data[4],series[0].data[5]]
        }];
        setSeries(ApexChart);
        console.log(ApexChart);
    }


    return(
        <div>
        {
            <div>
                <h3> TestPage </h3>
                
                {/* <Unity unityProvider={unityProvider}></Unity> */}
                <div className='ApexChart'>
                    <ReactApexChart options={options} series={series} type="radar" height={300}/>
                </div>
                <button onClick={onApexChartClick01}>ApexChart</button>

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