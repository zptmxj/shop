//import Calender from './component/CheckIn/Calender';
import { Form, Button, InputGroup,FormControl,Dropdown, FormGroup } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {serverPath,imagePath} from '../IP_PORT';
import './TestPage.scss';
import ReactApexChart from "react-apexcharts"; 
//import {Unity,useUnityContext } from 'react-unity-webgl';
const apiUrl =  "https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20230214T165905Z.8a81df36b7695a30.58c549c08f8e2ded06162d28bb1c6696e4afb196&lang=en-en&flag=4&text="
const img1 = imagePath()+ "/avatars/m/m001.png";
const img2 = imagePath()+ "/animal/a054.png";

function TestPage(props)
{
    // const { unityProvider } = useUnityContext({
    //     loaderUrl: "Build/WebGl.loader.js",
    //     dataUrl: "Build/WebGl.data",
    //     frameworkUrl: "Build/WebGl.framework.js",
    //     codeUrl: "Build/WebGl.wasm",
    //   });
    const [ctx, setCtx] = useState("");
    const [touchX, setTouchX] = useState(0);
    const [touchY, setTouchY] = useState(0);
    const [painting, setPainting] = useState(false);
    
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
            
           
            
    const [data00, setData00] = useState('');
    const [testData, setTestData] = useState('');
    const [outdata00, setOutData00] = useState('');
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



    const onClick00 = ()=>{
        fetch(serverPath()+"/out_test",{
            method:"post",
            headers : {
                "content-type" : "application/json",
            },
            body : JSON.stringify({text:data00}),
        })
        .then((res)=>res.json())
        .then((json)=>{
            console.log('out_test', json);
            setOutData00(json.text);
        })
    }

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

    const onTestButton = (e)=>{
      
        let url = apiUrl + data00;
        console.log("in:",data00);

        const options = {method: 'GET', headers: {accept: 'application/json'}};

        fetch(url, options)
          .then(response => response.json())
          .then(json => 
            {
                console.log("API:",json);
            })
          .catch(err => console.error(err));
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

    const INITIAL_COLOR = "#2c2c2c";
    const INITIAL_LINEWIDTH = 5.0;
    const CANVAS_SIZE = 500;

    function onMouseMove(e) {
        // const x = tochedX - event.changedTouches[0].pageX;
        // const y = tochedY - event.changedTouches[0].pageY;
        

        const x = e.changedTouches[0].pageX - e.target.offsetLeft;
        const y = e.changedTouches[0].pageY - e.target.offsetTop;
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
        console.log("start",e);
        const x = e.changedTouches[0].pageX - e.target.offsetLeft;
        const y = e.changedTouches[0].pageY - e.target.offsetTop;
        setTouchX(x);
        setTouchY(y);
        console.log("start",x,y);

        ctx.save();
        ctx.beginPath();
        ctx.globalCompositeOperation='destination-out';
        ctx.fillStyle='rgba(120,120,120,1)';
        ctx.lineWidth = 20;
        
        setPainting(true);
    }


    const [svgCvs, setSvgCvs] = useState("");

    useEffect(()=>{
        console.log("testSVG");
        const CORNER_RADIUS = 5;
        let width = 150; 
        let height = 150; 

        let container = document.getElementById("ContainerBox");

        console.log("childNodes",container.hasChildNodes(),svgCvs);
        console.log("ContainerBox",container);

        if(container.hasChildNodes())
            container.removeChild(svgCvs);

        let baseImage_ = createSvgElement("g",{rx:CORNER_RADIUS,ry:CORNER_RADIUS,x:10,y:10,width:width,height:height,fill:"#101010",stroke:"solid"},container);
        setSvgCvs(baseImage_);
        let miniImage_ = createSvgElement("path",{d:getLEDiconPath(30,30,50,50,10),fill:"#ffffff",stroke:"blue"},baseImage_);
    },[]);

    function createSvgElement(a,b,c)
    {
        a=document.createElementNS("http://www.w3.org/2000/svg",a);
        for(var d in b)
            a.setAttribute(d,b[d]);

        document.body.runtimeStyle&&(a.runtimeStyle=a.currentStyle=a.style);

        c&&c.appendChild(a);
        return a
    };

    function getLEDiconPath(a,b,c,d,e){
        var f = "M"+(a+c/2)+" "+b+" L"+(a+e)+" "+b+"  Q"+a+" "+b+" "+a+" "+(b+e)+" L"+a+" "+(b+d-e)+" Q"+a+" "+(b+d)+" "+(a+e)+" "+(b+d)+" L"+(a+c-e)+" "+(b+d)+" Q"+(a+c)+" "+(b+d)+" "+(a+c)+" "+(b+d-e)+" L"+(a+c)+" "+(b+e)+" Q"+(a+c)+" "+b+" "+(a+c-e)+" "+b+" L"+(a+c/2)+" "+b
        return f;
    };

    function stopPainting(e) { 
        console.log("stop"); 
        ctx.restore();

        setPainting(false);
    }

    return(
        <div>
            <h3> TestPage </h3>
            
            <div>
                <svg  className='testImg' width="100" height="100" id='ContainerBox'>
                </svg>
            </div>

            <svg class="octicon octicon-star v-align-text-bottom"
                viewBox="0 0 30 30" version="1.1"
                width="30" height="30" aria-hidden="true" fill="#0D6EFD">

                <path fill-rule="evenodd" d="M30 8 l-10 -0 L15 0 10 8 0 8 l7 9 L5 30 l10 -8 10 8 -2 -12">{/* L은 절대좌표 l은 상대좌표 */}
                </path> 
            </svg>

            {/* <Unity unityProvider={unityProvider}></Unity> */}

            <input value={data00} onChange={(e)=>setData00(e.target.value)}/>
            <button onClick={onClick00}>data0</button>
            <p>{outdata00}</p>
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


            <Button variant="outline-secondary" id="button-addon2" onClick={onTestButton}>
                    Button
            </Button>
            
            </div>
        </div>
    )
}

export default TestPage;