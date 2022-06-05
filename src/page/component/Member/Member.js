import './Member.scss';
import {Form,Col,Row,Table } from 'react-bootstrap';
import img_boy from './icon-boy.png';
import img_girl from './icon-girl.png';
import super_mg from './super-mg.png';
import sub_mg from './sub-mg.png';
import eng_mg from './eng-mg.png';


function Member(props)
{
    let data =props.data;
    let idx =props.idx;

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
                        <Character sex={data.sex} />
                        <>{
                            data.sex==0?
                            <td className="list-td-m" colSpan={2}>{ data.name }</td>:
                            <td className="list-td-w" colSpan={2}>{ data.name }</td>
                        }</>
                        <td className="list-td" colSpan={2}>{data.total_point+" TP"}</td>
                    </tr>
                    <tr>
                        <td className="list-td" colSpan={4}>{"--"}</td>
                        <td className="list-td">-</td>
                        <td className="list-td">-</td>
                    </tr>
                    <tr>
                        <td className="list-th"></td>
                        <td className="list-th"></td>
                        <td className="list-th"></td>
                        <td className="list-th"></td>
                        <td className="list-th"></td>
                        <td className="list-th"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

function Character(props){
    let img = img_boy;
    if(props.sex==1) {
        img = img_girl;
    }
    return(
        <td className="list-td">
            <img src={img} width='30px' height='30px'/>
        </td>
    )

}


export default Member;