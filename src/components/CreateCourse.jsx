import React, { useEffect } from 'react'
import './CreateCourse.css';
import Modal from 'react-modal';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import {yearOptions, departmentOptions} from './Register'
import {Book, Copy, X, Plus} from 'react-feather'
import {toast} from 'react-toastify'
import Axios from 'axios'
var randomstring = require("randomstring");

let userType = 'teacher'

let randomString = randomstring.generate({
	length: 5,
	charset: 'alphabetic'
})

export const customStyles = {
//   
content: {
	position: 'absolute',
	top: '12%',
	left: '20%',
	right: '20%',
	bottom: '12%',
	background: '#fff',
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
	backgroundColor: '#000000ba',
	zIndex: 9999
  },
};



const CreateCourse = () => {

	const [modalIsOpen,setIsOpen] = React.useState(false);
	
	const [year, setYear] = React.useState(yearOptions[0].label);
	const [department, setDepartment] = React.useState(departmentOptions[0].label);
	const [courseName, setCourseName] = React.useState('')
	const [description, setDescription] = React.useState('')

	function openModal() {
    setIsOpen(true);
	}
	
	function afterOpenModal() {
    // references are now sync'd and can be accessed.
  	}
 
	function closeModal(){
		setIsOpen(false);
	}

	const createCourse = () => {
		
		let courseObject = {teacher_id : 456, name : courseName, description, year, department}
	
		if(!courseName.length || !year.length || !department.length) {
			return toast.error('Please fill out required fields')
		}
		
		Axios.post("https://dbms-back.herokuapp.com/course", courseObject, {
			header: {
                "Content-Type": "application/json; charset=utf-8"
            }
		})
		.then(res => {	
			if(res.data.success) {
				
				const courseID = res.data.data.insertId
				setTimeout(() => {
                    toast.success('Course created')
                },2000)
				//window.location.href = `/course/${courseID}`

			} else {
				return toast.error('Could not create a new course')
			}
		})
		.catch( () => toast.error('Error creating a new course'))
	}

	return (
		<div>
		<div className="create-course-div">
        
		<Plus onClick={openModal} size={23} color="white"/>
        
		
		<Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
		  contentLabel="Modal"
		  closeTimeoutMS={200}
        >
				
				<div style={{width: 'auto', display: "flex", flexDirection: "row", alignItems: "center",}}>
					<div style={{width: '3rem', height: '3rem', borderRadius: '5rem', backgroundColor: '#eeeeee', display: "flex", alignItems: 'center', justifyContent: "center", overflow: "hidden"}}>
						<Book size={25} color="#09a407"/>
					</div>
					<div style={{marginLeft: '1rem'}}>
						<h2 style={{textAlign: "left", fontFamily: 'Poppins', color: '#232323', fontWeight: 600, fontSize: 22, padding:0, marginBottom:0}}>{userType === 'student' ? 'Join a new course' : 'Create New Course'}</h2>
						<p style={{fontFamily: 'Mulish', fontSize: 16, color: '#878787', fontWeight: 600, margin:0, padding:0, marginTop:5}}>{userType === 'student' ? 'Enter course code to join' : 'Enter course details to get started'}</p>
					</div>
            	</div>

				
				{userType === 'teacher' ? 

					<React.Fragment>
						<div style={{width: '100%', display: "flex", flexDirection: "row-reverse", alignItems: "center", marginTop: 15}}>
							
							<div style={{display: "flex", flexDirection: "column",}}>
							<p style={{fontFamily: 'Poppins', fontSize: 16, color: '#232323', fontWeight: 600, margin:0, textAlign: "left", marginBottom: '0.5rem'}}>Department</p>
								<div style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
									<Dropdown options={departmentOptions} onChange={option => setDepartment(option.value)} value={departmentOptions[0]} placeholder="Select an option" className="dropdown" />
								</div>
							</div>
							
							<div style={{display: "flex", flexDirection: "column", marginRight: 15}}>
							<p style={{fontFamily: 'Poppins', fontSize: 16, color: '#232323', fontWeight: 600, margin:0, textAlign: "left", marginBottom: '0.5rem'}}>Year</p>
								<div style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
									<Dropdown options={yearOptions} onChange={option => setYear(option.value)} value={yearOptions[0]} placeholder="Select an option" className="dropdown" />
								</div>
							</div>

							<div style={{flexGrow: 1, marginRight: 15}}>
								<p style={{fontFamily: 'Poppins', fontSize: 16, color: '#232323', fontWeight: 600, margin:0, padding:0, textAlign: "left",marginTop: 25, marginBottom:0}}>Course Name</p>
								<input type="text" style={{height:40,}} value={courseName} onChange={t => setCourseName(t.target.value)}></input>
							</div>
							
							
						
						</div>



						<p style={{fontFamily: 'Poppins', fontSize: 16, color: '#232323', fontWeight: 600, margin:0, padding:0, textAlign: "left",marginTop: 20, marginBottom:0}}>Course Description</p>
						<input type="text" style={{height:40}} value={description} onChange={t => setDescription(t.target.value)}></input>


						<p style={{fontFamily: 'Poppins', fontSize: 16, color: '#232323', fontWeight: 600, margin:0, padding:0, textAlign: "left",marginTop: 35, marginBottom:0}}>Course Code</p>

						<div style={{width: '30%', height: 40, backgroundColor: '#f6f6f6', borderRadius: 5, display: "flex", flexDirection: 'row-reverse', alignItems: "center", marginTop: 10, overflow: "hidden", paddingLeft: 10, justifyContent: "space-between"}}>
							<div style={{width: 40, borderRadius: 0, height: 40, backgroundColor: '#ddd', display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer"}}>
								<Copy size={22} color="#434343"/>
							</div>
							<p style={{fontFamily:'Poppins', fontSize: 17, color: '#434343', fontWeight: 600, verticalAlign: "middle", margin:0, padding: 0, letterSpacing: 0.3}}>
								{randomString}
							</p>
						</div>
						<p style={{fontFamily:'Mulish', fontSize: 16, color: '#878787', fontWeight: 600, verticalAlign: "middle", margin:0, padding: 0, marginTop: 10}}>
								Copy this code and share with the students. They will use this code to join this course
						</p>
					</React.Fragment>
				: 
					<React.Fragment>
						<div style={{flexGrow: 1, marginRight: 15}}>
							<p style={{fontFamily: 'Poppins', fontSize: 16, color: '#232323', fontWeight: 600, margin:0, padding:0, textAlign: "left",marginTop: 25, marginBottom:0}}>Course Code</p>
							<input type="text" style={{height:40,}}></input>

							<p style={{fontFamily: 'Poppins', fontSize: 16, color: '#232323', fontWeight: 600, margin:0, padding:0, textAlign: "left",marginTop: 25, marginBottom:0}}>When you join a course,</p>
							<ul style={{margin:0, padding: 0, marginLeft: 20}}>
								<li><p style={{fontFamily: 'Poppins', fontSize: 14, color: '#545454', fontWeight: 500, margin:0, padding:0, textAlign: "left",marginTop: 10, marginBottom:0}}>You gain access to study material posted by teachers</p></li>
								<li><p style={{fontFamily: 'Poppins', fontSize: 14, color: '#545454', fontWeight: 500, margin:0, padding:0, textAlign: "left",marginTop: 10, marginBottom:0}}>Teachers can post assignments which have due dates and some marks alloted for them</p></li>
								<li><p style={{fontFamily: 'Poppins', fontSize: 14, color: '#545454', fontWeight: 500, margin:0, padding:0, textAlign: "left",marginTop: 10, marginBottom:0}}>You can attach files and submit these assignments</p></li>
								<li><p style={{fontFamily: 'Poppins', fontSize: 14, color: '#545454', fontWeight: 500, margin:0, padding:0, textAlign: "left",marginTop: 10, marginBottom:0}}>You can leave the course at anytime, but must re-enter the code again to join</p></li>
							</ul>
						</div>
					</React.Fragment> 
				}
				
				<div style={{position: "absolute", bottom: 25, right: 25, display: "flex", flexDirection: "row-reverse", alignItems: "center"}}>
					<button onClick={userType === 'teacher' ? createCourse : () => {}}>
						<p style={{fontSize: 16, fontWeight: 600, color: 'white', margin:0, fontFamily: 'Poppins', letterSpacing: 0.8,}}>{userType === 'student' ? 'Join' : 'Create'}</p>
					</button>
					<button style={{backgroundColor: 'white', boxShadow: 'none'}} onClick={closeModal}>
						<p style={{fontSize: 16, fontWeight: 600, color: '#09a407', margin:0, fontFamily: 'Poppins', letterSpacing: 0.8}}>Cancel</p>
					</button>
				</div>

				<X size={25} color="#ababab" style={{position: "absolute", top: 25, right: 25, cursor: "pointer"}} onClick={closeModal}/>		
				
        </Modal>



		
			</div>
			
		</div>
	)
}

export default CreateCourse;
