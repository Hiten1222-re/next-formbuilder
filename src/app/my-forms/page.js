'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
// import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MyFormsPage() {
  const [forms, setForms] = useState([]);
  const [formnames, setFormnames] = useState([]);
  const [formno, setFormno] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [toast, setToast] = useState(null);
  const router=useRouter()
  const [cooki,setcooki]=useState(null)
  
  
  useEffect(() => {
      if (Cookies.get('client')) {
        setcooki(JSON.parse(Cookies.get('client')))
          loadForms();
      }
      else
      {
        router.push('/login')
      }
  }, []);

  const loadForms = async () => {
    try {
      const cook=JSON.parse(Cookies.get('client'))
      const response = await fetch('http://localhost:3200/forms');
      const data = await response.json();
      // Filter forms by current user
      const userForms = data.filter(form => form.id === cook.id);
      console.log(userForms[0].formdata);
      setForms(userForms[0].formdata);
      setFormnames(userForms[0].formtitle)
    } catch (error) {
      console.error('Error loading forms:', error);
      showToast('Error loading forms', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePreview = (form,i) => {
   
    setSelectedForm(form);
    setShowPreview(true);
    setFormno(i)
  };
  
  const handleCopyLink = async (i) => {
    const cook=JSON.parse(Cookies.get('client'))
    console.log(i);
    
    const formUrl = `${window.location.origin}/preview/${cook.id}_${formnames[i]}`;
    try {
      await navigator.clipboard.writeText(formUrl);
      showToast('Form link copied to clipboard!', 'success');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      showToast('Error copying link', 'error');
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const closePreview = () => {
    setShowPreview(false);
    setSelectedForm(null);
  };

  const renderField=(field)=>{
const value=field.id
// const hasError=!!errors[field.id]

switch (field.type) {
      case "textarea":
        return (<>
        {field.label}{field.required?(<sup style={{color:'red'}}>*</sup>):null}:<br/>
          <textarea
            className={`form-control `}
            id={field.id}

            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={4}
          />
          </>
        )

      case "select":
        return (<>
        {field.label}{field.required?(<sup style={{color:'red'}}>*</sup>):null}:<br/>
          <select
            className={`form-select `}
            id={field.id}
     
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
          </>
        )

      case "radio":
  return (
    <div>
      {field.label}{field.required?(<sup style={{color:'red'}}>*</sup>):null}:<br/>
      {field.options?.map((option, index) => (
        <div key={index} className="form-check">
          <input
            className={`form-check-input `}
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
            {field.label}{field.required?(<sup style={{color:'red'}}>*</sup>):null}:<br/>
            <input
              className={`form-check-input `}
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
        return (<>
        {field.label}{field.required?(<sup style={{color:'red'}}>*</sup>):null}:<br/>
          <input
            className={`form-control `}
            type="file"
            id={field.id}
            onChange={(e) => {
              const file = e.target.files?.[0]
              handleInputChange(field.id, file ? file.name : "")
            }}
            required={field.required}
          /></>
        )

      default:
        return (<>
        {field.label}{field.required?(<sup style={{color:'red'}}>*</sup>):null}:<br/>
          <input
            className={`form-control `}
            type={field.type}
            id={field.id}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
          /></>
        )
    }
}

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="h2 mb-1">My Forms</h1>
                <p className="text-muted mb-0">Manage and view your created forms</p>
              </div>
              <Link href='/builder' className="btn btn-primary">
                <i className="bi bi-plus-circle me-2"></i>
                Create New Form
              </Link>
            </div>

            {forms.length === 0 ? (
              <div className="text-center py-5">
                <div className="mb-4">
                  <i className="bi bi-file-earmark-text display-1 text-muted"></i>
                </div>
                <h3 className="h4 mb-2">No forms yet</h3>
                <p className="text-muted mb-4">Create your first form to get started</p>
                <button className="btn btn-primary">Create Your First Form</button>
              </div>
            ) : (
              <div className="row">
                <div className="col-12">
                  <div className="card shadow-sm">
                    <div className="card-body p-0">
                      <div className="table-responsive">
                        <table className="table table-hover mb-0">
                          <thead className="table-light">
                            <tr>
                              <th className="px-4 py-3">Form Name</th>
                              <th className="px-4 py-3">Description</th>
                              <th className="px-4 py-3">Created</th>
                              <th className="px-4 py-3">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {forms.map((form,index) => (
                              <tr key={formnames[index]} onClick={() => handlePreview(form,index)}>
                                <td className="px-4 py-3">
                                  <div>
                                    <h6 className="mb-1">{formnames[index]}</h6>
                                    {/* <small className="text-muted">ID: {form.id}</small> */}
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <span className="text-muted">{form.description}</span>
                                </td>
                                <td className="px-4 py-3">
                                  <small className="text-muted">{formatDate()}</small>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="btn-group" role="group">
                                    <a href={`http://localhost:3201/results/${cooki.id}_${formnames[index]}`}
                                      className="btn btn-outline-primary btn-sm"
                                      onClick={(e) => e.stopPropagation()}
                                     
                                    >
                                      <i className="bi bi-eye me-1"></i>
                                      Responses
                                    </a>
                                    <button
                                      className="btn btn-outline-secondary btn-sm"
                                      onClick={(e) => {e.stopPropagation();handleCopyLink(index)}}
                                      title="Copy Form Link"
                                    >
                                      <i className="bi bi-link-45deg me-1"></i>
                                      Copy Link
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && selectedForm && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Preview: {formnames[formno]}</h5>
                <button type="button" className="btn-close" onClick={closePreview}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <p className="text-muted">{selectedForm.description}</p>
                </div>
                <form >
                <br/>
            <table style={{marginLeft:"auto",marginRight:"auto",maxHeight:"75vh",width:"40vw",overflowY:"scroll"}}>
              <tbody>
                <tr style={{height:"50px"}}>
                    <td>Full Name:<sup style={{color:"red"}}>*</sup></td>
                    <td><input type="text" placeholder="Your Name"/></td>
                </tr>
        {selectedForm.map((data)=>(
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
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closePreview}>
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleCopyLink(formno)}
                >
                  Copy Form Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1080 }}>
          <div className={`alert alert-${toast.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`} role="alert">
            {toast.message}
            <button type="button" className="btn-close" onClick={() => setToast(null)}></button>
          </div>
        </div>
      )}
    </>
  );
}