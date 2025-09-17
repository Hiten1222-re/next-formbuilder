"use client"
import { useParams } from "next/navigation";
import { useState,useRef, useEffect } from "react";
export default function Forms({params}) {
    const [imp,setimp]=useState([])
    const [data,setdata]=useState([])
    // const [result,setresult]=useState({})
    const param=useParams()
    const slug=param['slug']?.split('_')
    const name=useRef()
    useEffect(()=>{
         if (!slug || slug.length < 2) return;

        async function aaa(params) {
            
            const res=await fetch(`http://localhost:3200/forms/${slug[0]}`)
            const response=await res.json()
            // console.log(response);
            const no=response['formtitle'].indexOf(slug[1])
            const form=response["formdata"][no]
        
           const arr = form.map((d) => d.required);
        setimp(arr);
        setdata(form)
        }

        aaa()
    },[slug])

async function save() {
    const all=document.getElementsByTagName('input')
    const dict={}

    
    for (let i = 0; i < all.length; i++) {
        if (all[i].value.length==0 && imp[i] ||name.current.value=="") {
            alert("Please fill all * fields")
            return false
        }
        if (all[i].type=='email' && !all[i].value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            alert("Please enter proper email")
            return false
        }
        if(all[i].type=='password' && !all[i].value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/))
        {
            alert("Password have min 8, at least 1 uppercase, 1 lowercase, 1 digit")
            return false
        }
        if (i==0 && all[i].value.trim().length!=0) {
            dict["Full name"]=name.current.value.trim()
            continue
        }
       dict[data[i-1].label]=all[i].value

    }
    const current=await fetch(`http://localhost:3201/results/${param['slug']}`)
    if (current.ok) {
    const c1=await current.json()
    c1.data.push(dict)

    await fetch(`http://localhost:3201/results/${param['slug']}`,{
      method:"PATCH",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        data:c1.data
      })
    }) 

    }else{
        const res=await fetch(`http://localhost:3201/results`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        id:param['slug'],
        data:[dict]
      })
    }) 
  }

}



    return(<>
    <div className="card shadow pb-5 mb-5 bg-body-tertiary rounded" style={{position:"relative",top:"40px",maxHeight:'80vh',width:"65vw",marginLeft:"auto",marginRight:"auto"}}>
        <div style={{position:"relative",width:"100%",height:'10px',backgroundColor:"blue",borderStartEndRadius:"7px",borderTopLeftRadius:"7px"}} ></div>
        <h1 style={{marginLeft:"auto",marginRight:"auto",width:"100%",paddingLeft:"26%",height:"80px",paddingTop:"10px",borderRadius:"10px"}}>{slug[1]}</h1><hr/>
        <form >
                <br/>
            <table style={{marginLeft:"auto",marginRight:"auto",maxHeight:"75vh",width:"40vw",overflowY:"scroll"}}>
              <tbody>
                <tr style={{height:"50px"}}>
                    <td>Full Name:<sup style={{color:"red"}}>*</sup></td>
                    <td><input type="text" ref={name} placeholder="Your Name"/></td>
                </tr>
        {data.map((data)=>(
            <tr style={{height:"50px"}}>
            
                <td>{data.label}:{data.required==true?<sup style={{color:"red"}}>*</sup>:null}</td><td> <input type={data.type} 
                 placeholder={data.placeholder}/></td>
            </tr>
        ))}
        <tr>
            <td>
        <button type="submit" className="btn btn-primary" onClick={()=>{save()}}>
                  Submit Form
                </button>
             </td></tr>
             </tbody>
                </table>
        </form>
    </div>
    
    
    </>)
}