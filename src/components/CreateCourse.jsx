import React, { useEffect, useState } from 'react'
import './CreateCourse.css';
import Modal from 'react-modal';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import {yearOptions, departmentOptions} from './Register'
import {Book, Copy, X, Plus} from 'react-feather'
import {toast} from 'react-toastify'
import Axios from 'axios'
var randomstring = require("randomstring");

let theme = JSON.parse(localStorage.getItem('theme'))
// let randomString = randomstring.generate({
// 	length: 7,
// 	charset: 'alphanumeric'
// })

let localdata = JSON.parse(localStorage.getItem('userDetails'))
let user = localdata ? localdata : {
		fname: "",
		lname: "",
		email: "",
		password: "",
		_id: "404"
}

let {_id, fname, lname, email} = user

let userType = JSON.parse(localStorage.getItem('userType'))
console.log(theme)

export const customStyles = {
//   
content: {
	position: 'absolute',
	top: '12%',
	left: '20%',
	right: '20%',
	bottom: '12%',
	background: theme == 'dark' ? '#1b1b1b' : '#fff',
	overflow: 'auto',
	WebkitOverflowScrolling: 'touch',
	borderRadius: '10px',
	outline: 'none',
	width: '60%',
	padding: '25px',
	alignSelf: 'center',
	height: 'auto',
	paddingTop: '30px'
  },
  overlay: {
	position: 'fixed',
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
	backgroundColor: '#000000aa',
	zIndex: 9999
  },
};

const validateCourse = (formData) => {
    const errors = {};
    if (!formData.courseName) {
        errors.courseName = 'Course name is required';
    }
    if (!formData.department) {
        errors.department = 'Department is required';
    }
    if (!formData.year) {
        errors.year = 'Year is required';
    }
    if (!formData.description) {
        errors.description = 'Description is required';
    }
    return { isValid: Object.keys(errors).length === 0, errors };
}

const CreateCourse = () => {
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [formData, setFormData] = React.useState({
        year: '',
        department: '',
        courseName: '',
        description: '',
        code: ''
    });
    const [errors, setErrors] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const [randomString, setRandomString] = useState(() => {
        return randomstring.generate({
            length: 7,
            charset: 'alphanumeric'
        })
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const createCourse = async () => {
        const { isValid, errors: validationErrors } = validateCourse(formData);
        
        if (!isValid) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        
        const courseObject = {
            teacher_id: _id,
            name: formData.courseName,
            description: formData.description,
            year: formData.year,
            department: formData.department,
            course_code: randomString
        };

        Axios.post("https://dbms-back.herokuapp.com/course", courseObject, {
            header: {
                "Content-Type": "application/json; charset=utf-8"
            }
        })
        .then(res => {    
            if(res.data.success) {
                
                const courseID = res.data.data.insertId
                setFormData({
                    year: '',
                    department: '',
                    courseName: '',
                    description: '',
                    code: ''
                });
                setIsOpen(false);
                setRandomString(() => {
                    return randomstring.generate({
                        length: 7,
                        charset: 'alphanumeric'
                    })
                })

                setTimeout(() => {
                    toast.success('Course created')
                },500)
                //window.location.href = `/course/${courseID}`

            } else if(res.data.success === false){
                if(res.data.reason === 'course code exists'){
                    toast.error('Course Code exists, Try again !')
                }
                else toast.error('Error')
            } 
            else {
                return toast.error('Could not create a new course')
            }
        })
        .catch( () => toast.error('Error creating a new course'))
        .finally(() => setLoading(false));
    };

    return (
        <div style={{position: 'absolute', bottom: 110, right: 110}}>
            <div className="create-course-div">
                <Plus onClick={() => setIsOpen(true)} size={40} color="white"/>
            </div>
            
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setIsOpen(false)}
                style={customStyles}
                contentLabel="Create Course"
                closeTimeoutMS={200}
                className="background"
            >
                <div className="modal-content">
                    <h2>Create New Course</h2>
                    
                    <div className="form-group">
                        <label>Course Name</label>
                        <input
                            type="text"
                            name="courseName"
                            value={formData.courseName}
                            onChange={handleInputChange}
                            className={errors.courseName ? 'error' : ''}
                        />
                        {errors.courseName && <span className="error-text">{errors.courseName}</span>}
                    </div>

                    <div className="form-group">
                        <label>Department</label>
                        <Dropdown options={departmentOptions} onChange={option => setFormData(prev => ({...prev, department: option.value}))} value={formData.department} placeholder="Select an option" className={"dropdown sub"} />
                        {errors.department && <span className="error-text">{errors.department}</span>}
                    </div>

                    <div className="form-group">
                        <label>Year</label>
                        <Dropdown options={yearOptions} onChange={option => setFormData(prev => ({...prev, year: option.value}))} value={formData.year} placeholder="Select an option" className={"dropdown sub"} />
                        {errors.year && <span className="error-text">{errors.year}</span>}
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className={errors.description ? 'error' : ''}
                        />
                        {errors.description && <span className="error-text">{errors.description}</span>}
                    </div>

                    <div className="form-group">
                        <label>Course Code</label>
                        <div className="changeColorBG" style={{width: '30%', height: 40, borderRadius: 5, display: "flex", flexDirection: 'row-reverse', alignItems: "center", marginTop: 10, overflow: "hidden", paddingLeft: 10, justifyContent: "space-between"}}>
                            <div style={{width: 40, borderRadius: 0, height: 40, backgroundColor: '#ddd', display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer"}}>
                                <Copy size={22} color="#434343" onClick={() =>  {
                                    navigator.clipboard.writeText(randomString)
                                    toast.info("Course code copied to clipboard")
                                }}/>
                            </div>
                            <p className="sub" style={{fontFamily:'Poppins', fontSize: 17, color: '#434343', fontWeight: 600, verticalAlign: "middle", margin:0, padding: 0, letterSpacing: 0.3}}>
                                {randomString}
                            </p>
                        </div>
                    </div>

                    <div className="button-group">
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="cancel-button"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={createCourse}
                            className="create-button"
                            disabled={loading}
                        >
                            {loading ? <p>Loading...</p> : 'Create Course'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default CreateCourse;
