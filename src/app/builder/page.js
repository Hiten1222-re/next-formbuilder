'use client'
import Cookies from "js-cookie"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect,useState } from "react"

export default function Builder(){
    const opt = [
  { value: "text", label: "Text Input" },
  { value: "email", label: "Email" },
  { value: "password", label: "Password" },
  { value: "number", label: "Number" },
  { value: "date", label: "Date" },
  { value: "time", label: "Time" },
  { value: "url", label: "URL" },
  { value: "search", label: "Search" },
  { value: "select", label: "Dropdown/Select" },
  { value: "radio", label: "Radio Buttons" },
  { value: "file", label: "Image" },
  { value: "color", label: "Colour picker" },
]

const [newFieldLabel,setNewFieldLabel]=useState('')
const [fields,setfields]=useState([])
const [newFieldPlaceholder,setNewFieldPlaceholder]=useState('')
const [newFieldOptions,setNewFieldOptions]=useState('')
const [newFieldRequired,setNewFieldRequired]=useState(false)
const [selectedType,setSelectedType]=useState('text')
const [title,settitle]=useState("")
const [formid,setformid]=useState(undefined)
const [formlist,setformlist]=useState([])
const router=useRouter()


  useEffect(() => {
    const aaa=async(id)=>{
      const res=await fetch(`http://localhost:3200/forms/${id}`)
      const result=await res.json()
      
      if (result.formdata.length>0) {
        setformlist(result.formtitle)
      }
    }
    if (Cookies.get('client')) {
      const cook=JSON.parse(Cookies.get('client'))
      aaa(cook.id)
    }
  }, [setformlist])
  
  useEffect(()=>{
    if (formid!=undefined) {
      const cook=JSON.parse(Cookies.get('client'))
      const aaa=async()=>{
        const res=await fetch(`http://localhost:3200/forms/${cook.id}`)
        const result=await res.json()
        setfields(result.formdata[formid])
        settitle(result.formtitle[formid])
      }
      aaa()
    }
  },[formid])

useEffect(()=>{
  // console.log(fields);
if (fields.length!=0) {
  
  localStorage.setItem('myform',JSON.stringify(fields))
}
},[fields])

useEffect(()=>{
localStorage.setItem('myformtitle',title)
},[title])


const addfield=async()=> {
  if (!newFieldLabel.trim()) return
  const con=Cookies.get('client')

  if (!con){
    router.push('/login')
    return
  }
  
  const abc={
    id:Date.now(),
    type:selectedType,
    label:newFieldLabel,
    placeholder:newFieldPlaceholder||undefined,
    required:newFieldRequired
  }

  if (selectedType=='radio'||selectedType=='select') {
    abc.options=newFieldOptions.split('\n').map((ch)=>ch.trim()).filter((ch)=>ch.length>0)
  }

  setfields([...fields,abc])
  setSelectedType('text')
  setNewFieldLabel('')
  setNewFieldPlaceholder('')
  setNewFieldOptions('')
  setNewFieldRequired(false)
}

const clearForm=()=>{
  setfields([])
}

const deleteField=(id)=>{
const new1=fields.filter((e)=> e.id!=id)
setfields(new1)
}

const preview=async()=>{
  if (title=='') {
    alert('enter title for form')
    return
  }
  if (fields.length==0) {
    alert('enter atleast 1 field to preview and save form')
    return
  }

  const cook=JSON.parse(Cookies.get('client'))
  // console.log(fields)
  const current=await fetch(`http://localhost:3200/forms/${cook.id}`)
  console.log(current);
  
  if (current.ok) {
    const c1=await current.json()
    c1.formdata.push(fields)
    c1.formtitle.push(title)
    console.log(c1.formdata);
    // console.log(title);
    
    await fetch(`http://localhost:3200/forms/${cook.id}`,{
      method:"PATCH",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        formdata:c1.formdata,
        formtitle:c1.formtitle
      })
    })
  }
  else{
const res=await fetch(`http://localhost:3200/forms`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        id:cook.id,
        formdata:[fields],
        formtitle:[title]
      })
    }) 
  }

  router.push('/preview')
}

const newformfunc=(select)=>{
const val=select.target.value
if (val=='') {
  setfields([])
  settitle('')
  return
}
const index=formlist.indexOf(val)
setformid(index)
}

const moveField=(i,ch)=>{
  const newfields=[].concat(fields)
  console.log(newfields);
switch (ch) {
  case 'up':
            newfields[i-1]=fields[i]
            newfields[i]=fields[i-1]
            setfields(newfields)
    break;
  case 'down':
            newfields[i+1]=fields[i]
            newfields[i]=fields[i+1]
            
            setfields(newfields)
    break;
}
}

    return(<>
         <div className="container p-4">
      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <input type="text" value={title} onChange={(e)=>settitle(e.target.value)} placeholder="Enter title for form" style={{backgroundColor:"#f8f8f8",border:'none',fontSize:'20px'}}/>
            </div>
            <div className="card-body">
              <div className="mb-3">
                
                <label className="form-label">Field Type</label>
                <select className="form-select" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                  {opt.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Label *</label>
                <input
                  type="text"
                  className="form-control"
                  value={newFieldLabel}
                  onChange={(e) => setNewFieldLabel(e.target.value)}
                  placeholder="Enter field label"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Placeholder</label>
                <input
                  type="text"
                  className="form-control"
                  value={newFieldPlaceholder}
                  onChange={(e) => setNewFieldPlaceholder(e.target.value)}
                  placeholder="Enter placeholder text"
                />
              </div>

              {(selectedType === "select" || selectedType === "radio") && (
                <div className="mb-3">
                  <label className="form-label">Options (one per line)</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={newFieldOptions}
                    onChange={(e) => setNewFieldOptions(e.target.value)}
                    placeholder="Option 1&#10;Option 2&#10;Option 3"
                  />
                </div>
              )}
              
              

              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="required"
                  checked={newFieldRequired}
                  onChange={(e) => setNewFieldRequired(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="required">
                  Required field
                </label>
              </div>

              <button className="btn btn-primary w-100" onClick={addfield} disabled={!newFieldLabel.trim()}>
                Add Field
              </button>
              <select className="" disabled={formlist.length==0?true:false} onChange={(e)=>newformfunc(e)}>
                <option key='' value=''>
                      Your forms
                    </option>
              {formlist.map((e)=>(
                <option key={e} value={e}>
                      {e}
                    </option>
              ))}
              </select>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>Form Fields ({fields.length ||0})</h4>
            <div>
              <button className="btn btn-outline-danger me-2" onClick={clearForm} disabled={fields.length === 0}>
                Clear All
              </button>
              <button onClick={preview} className="btn btn-success">
                Create and Preview Form
              </button>

            </div>
          </div>

          {fields.length === 0 ? (
            <div className="alert alert-info">
              <h6>No fields added yet</h6>
              <p className="mb-0">Start by adding fields using the form on the left.</p>
            </div>
          ) : (
            <div className="list-group">
              {fields.map((field, index) => (
                <div key={field.id} className="list-group-item field-item">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center mb-2">
                        <span className="badge bg-secondary me-2">
                          {opt.find((t) => t.value === field.type)?.label}
                        </span>
                        <strong>{field.label}</strong>
                        {field.required && <span className="badge bg-danger ms-2">Required</span>}
                      </div>
                      {field.placeholder && <small className="text-muted">Placeholder: {field.placeholder}</small>}
                      {field.options && (
                        <div className="mt-1">
                          <small className="text-muted">Options: {field.options.join(", ")}</small>
                        </div>
                      )}
                    </div>
                    <div className="btn-group-vertical btn-group-sm">
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => moveField(index, "up")}
                        disabled={index === 0}
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => moveField(index, "down")}
                        disabled={index === fields.length - 1}
                        title="Move down"
                      >
                        ↓
                      </button>
                      <button className="btn btn-outline-danger" onClick={() => deleteField(field.id)} title="Delete">
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
              <button onClick={()=>{Cookies.remove('client');router.push("/login");}} className="btn btn-danger" style={{position:"fixed",top:"90vh",left:"90vw"}}>
                Sign Out
              </button>

    </>
    )
}