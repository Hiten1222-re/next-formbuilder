"use client"
import { useParams } from "next/navigation";
export default async function Forms({params}) {
    
    const param=useParams()
    const slug=param['slug'].split('_')
    
    const res=await fetch(`http://localhost:3200/forms/${slug[0]}`)
    const response=await res.json()
    // console.log(response);
    const no=response['formtitle'].indexOf(slug[1])
    const data=response["formdata"][no]

function save() {
    
}

    return(<>
    <div className="card shadow pb-5 mb-5 bg-body-tertiary rounded" style={{position:"relative",top:"40px",maxHeight:'80vh',width:"65vw",marginLeft:"auto",marginRight:"auto"}}>
        <div style={{position:"relative",width:"100%",height:'10px',backgroundColor:"blue",borderStartEndRadius:"7px",borderTopLeftRadius:"7px"}} ></div>
        <h1 style={{marginLeft:"auto",marginRight:"auto",width:"100%",paddingLeft:"26%",height:"80px",paddingTop:"10px",borderRadius:"10px"}}>{slug[1]}</h1><hr/>
        <form>
            <table style={{marginLeft:"auto",marginRight:"auto",maxHeight:"75vh",width:"40vw",overflowY:"scroll"}}>
                <br/>
        {data.map((data)=>(
            <tr style={{height:"50px"}}>
            
                <td>{data.label}:{data.required==true?<sup style={{color:"red"}}>*</sup>:null}</td><td> <input type={data.type} placeholder={data.placeholder}/></td>
            </tr>
        ))}
        <tr>
            <td>
        <button type="submit" className="btn btn-primary">
                  Submit Form
                </button>
             </td></tr>
                </table>
        </form>
    </div>
    
    
    </>)
}