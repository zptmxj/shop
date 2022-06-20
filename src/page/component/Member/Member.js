import './Member.scss';
import {Form,Col,Row,Table } from 'react-bootstrap';
import img_male from './male.png';
import img_female from './female.png';
import super_mg from './super-mg.png';
import sub_mg from './sub-mg.png';
import eng_mg from './eng-mg.png';


function Member(props)
{
    let Year = new Date().getFullYear();
    console.log("Member_avatar", Year);

    let data =props.data;
    let idx = props.idx;
    let path = data.path;

    return(
        <div className="list">
            <table className="list-Table" >
                <tbody>
                    <tr>
                        <th className="list-th"></th>
                        <th className="list-th"></th>
                        <th className="list-th"></th>
                        <th className="list-th"></th>
                        <th className="list-th"></th>
                        <th className="list-th"></th>
                    </tr>
                    <tr>
                        <td className="list-td">{
                            data.privilege===2?
                            <img src={sub_mg} width='25px' height='25px'/>:
                            (data.privilege===3?
                            <img src={super_mg} width='25px' height='25px'/>:
                            (data.privilege===4?
                            <img src={eng_mg} width='25px' height='25px'/>:
                            idx
                            ))
                        }</td>
                        <Character sex={data.sex} path={path} />
                        <td className="list-td" colSpan={2} onClick={()=>{props.setMemberSel(data.idx)}}>{ data.name }</td>
                        <td className="list-td">{((Year+1)-data.age)}</td>
                        <td className="list-td">{data.sex?
                            <img src={img_female} width='30px' height='30px'/>:
                            <img src={img_male} width='30px' height='30px'/>
                        }</td>
                    </tr>
                    <tr>
                        <td className="list-td" colSpan={4}>{"--"}</td>
                        <td className="list-td" colSpan={2}>{data.total_point+" TP"}</td>
                    </tr>
                    <tr>
                        <td className="list-th"></td>
                        <td className="list-th"></td>
                        <td className="list-th"></td>
                        <td className="list-th"></td>
                        <td className="list-th"></td>
                        <td className="list-th"></td>
                    </tr>
                          {/* <Form.Group as={Row} controlId={"Member"+idx} className="Form-Group">
                            <Col xs={2} className='Cal-td'>{ idx }</Col>
                            <Col xs={2} className='Cal-td'>{
                                data.privilege===2?
                                <img src={sub_mg} width='25px' height='25px'/>:
                                (data.privilege===3?
                                <img src={super_mg} width='25px' height='25px'/>:
                                (data.privilege===4?
                                <img src={eng_mg} width='25px' height='25px'/>:
                                null
                                ))
                            }</Col>
                            <Col xs={8} className='Cal-td'>{ data.nickname }</Col>
                            <Col xs={2} className='Cal-td'>{ idx }</Col>
                            <Col xs={2} className='Cal-td'>{ idx }</Col>
                            <Col xs={4} className='Cal-td'>{ idx }</Col>
                            <Col xs={2} className='Cal-td'>{ idx }</Col>
                            <Col xs={2} className='Cal-td'>{ idx }</Col>
                    </Form.Group> */}
                {/* <p className="list-black">{idx}</p>
                <div className="list-img">
                {
                    data.privilege===2?
                    <img src={sub_mg} width='25px' height='25px'/>:
                    (data.privilege===3?
                    <img src={super_mg} width='25px' height='25px'/>:
                    (data.privilege===4?
                    <img src={eng_mg} width='25px' height='25px'/>:
                    null
                    ))
                }
                </div>
                <p> / </p>
                <p className="list-black">{ data.name}</p>
                <p> / </p>
                <div className="list-black">
                {
                    data.sex?
                    <img src={img_girl} width='30px' height='30px'/>:
                    <img src={img_boy} width='30px' height='30px'/>
                }
                </div>
                <p> / </p>
                <p className="list-black">{ (Year+ 1) - (1900+data.age)}</p>
                <p> / </p>
                <p className="list-black">{ data.adddate.substr(2,8)}</p> */}

                </tbody>
            </table>
        </div>
    )
}

function Character(props){
    let img = "http://168.126.179.44:3002/avatars/";
    let sex = "m/";
    let path = props.path;
    if(props.sex==1) sex="w/";

    img = img + sex + path;
    return(
        <td className="list-td">
            <img src={img} width='40px' height='40px'/>
        </td>
    )

}


export default Member;