"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"



export default function Preview() {
const [fields,setfields]=useState([])
const [errors,setErrors]=useState({})
const [formData,setFormData]=useState({})
const [submittedData,setsubmittedData]=useState({})
const [title,settitle]=useState('')
const router=useRouter()
const [clientid,setclientid]=useState(null)



useEffect(()=>{
    const form=localStorage.getItem('myform')
    const a=localStorage.getItem('myformtitle')
    const check=Cookies.get('client')
    if (!check) {
      router.push('/login')
    }
    else{
    const pars=JSON.parse(Cookies.get('client'))
    setclientid(pars.id)
}
    if (form) {
        setfields(JSON.parse(form))
    }
    settitle(a)
},[])

const resetForm=()=>{
setfields([])

}

const validateForm = () => {
    const newErrors = {}

    fields.forEach((field) => {
      if (field.required) {
        const value = formData[field.id]
        if (!value || (typeof value === "string" && !value.trim())) {
          newErrors[field.id] = `${field.label} is required`
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

function handleInputChange(id,val) {
    setFormData((pre)=>({
        ...pre,
        [id]:val,
    }))
}

const handleSubmit=(e)=>{
e.preventDefault()

if (validateForm()) {
    const ans={}

    fields.forEach((a)=>{
        const val=formData[a.id]
        ans[a.label]=val
    })
    setsubmittedData(ans)
}

}



const renderField=(field)=>{
const value=fields[field.id]
const hasError=!!errors[field.id]

switch (field.type) {
      case "textarea":
        return (
          <textarea
            className={`form-control ${hasError ? "is-invalid" : ""}`}
            id={field.id}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={4}
          />
        )

      case "select":
        return (
          <select
            className={`form-select ${hasError ? "is-invalid" : ""}`}
            id={field.id}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
          >
            <option value="">Choose...</option>
            {field.options?.map((option, index) => (
              <option value={option}>
                {option}
              </option>
            ))}
          </select>
        )

      case "radio":
  return (
    <div>
      {field.options?.map((option, index) => (
        <div key={index} className="form-check">
          <input
            className={`form-check-input ${hasError ? "is-invalid" : ""}`}
            type="radio"
            name={field.id} // All options must share the same name
            id={`${field.id}_${index}`} // Unique id
            value={option}
            checked={formData[field.id] === option}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
          />
          <label className="form-check-label" htmlFor={`${field.id}_${index}`}>
            {option}
          </label>
        </div>
      ))}
    </div>
  );


      case "checkbox":
        return (
          <div className="form-check">
            <input
              className={`form-check-input ${hasError ? "is-invalid" : ""}`}
              type="checkbox"
              id={field.id}
              checked={value === true}
              onChange={(e) => handleInputChange(field.id, e.target.checked)}
              required={field.required}
            />
            <label className="form-check-label" htmlFor={field.id}>
              {field.placeholder || "Check this box"}
            </label>
          </div>
        )

      case "file":
        return (
          <input
            className={`form-control ${hasError ? "is-invalid" : ""}`}
            type="file"
            id={field.id}
            onChange={(e) => {
              const file = e.target.files?.[0]
              handleInputChange(field.id, file ? file.name : "")
            }}
            required={field.required}
          />
        )

      default:
        return (
          <input
            className={`form-control ${hasError ? "is-invalid" : ""}`}
            type={field.type}
            id={field.id}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
          />
        )
    }
}

return(
    <div className="container p-4" >
      <div className="row">
        <div className="col-md-6 my-5 mx-auto" >
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Form Preview</h5>
              <div>
                <button type="button" className="btn btn-outline-secondary btn-sm me-2" onClick={resetForm}>
                  Reset
                </button>
                <Link href="/builder" className="btn btn-outline-primary btn-sm">
                  Edit Form
                </Link>
              </div>
            </div>
            <div className="card-body" style={{maxHeight:"75vh",overflowY:"scroll"}}>
                <h3>{title}</h3>
              <form onSubmit={handleSubmit}>
                {fields.map((field) => (
                  <div key={field.id} className="mb-3">
                    <label htmlFor={field.id} className="form-label">
                      {field.label}
                      {field.required && <span className="text-danger"> *</span>}
                    </label>
                    {renderField(field)}
                    {errors[field.id] && <div className="invalid-feedback d-block">{errors[field.id]}</div>}
                  </div>
                ))}
                <button type="submit" className="btn btn-primary">
                  Submit Form
                </button>
              </form>
            </div>z
          </div>
        </div>

      </div>
    </div>

)
}