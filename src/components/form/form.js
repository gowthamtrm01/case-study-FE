import React,{useState, useContext, useEffect} from 'react';
import {Button, Container, Row, Col, Form, ToggleButtonGroup, ToggleButton, InputGroup} from 'react-bootstrap'
import DatePicker from 'react-datepicker';
import 'react-dates/initialize';
import 'react-datepicker/dist/react-datepicker.css';
import {BiCalendar} from 'react-icons/bi';
import FileBase from 'react-file-base64';
import axios from 'axios';

import './form.css';
import {stateContext} from './../../app';

const initialState = { name: '', mobile: '', addOn: '', jobType: '', profilePic: '', location: '', email: '', dob: new Date().toISOString(), hide: false, show: false}

const From = () => {


    const [postData, setPostData] = useState(initialState);
    const [date, setDate] = useState(new Date());
    const {state, dispatch, setCurrentId, currentId, mobileView} = useContext(stateContext);
    const info = currentId ? state.find(info => info._id === currentId) : null;

    useEffect(() => {
        if(info){
            setPostData(info);
        }
    }, [info])

    const submit = (e) => {
        e.preventDefault();
        if(postData !== initialState){
            if(currentId){
                axios.patch(`http://localhost:5000/update/${postData._id}`, { ...postData }).then((res) => dispatch({
                    type: 'UPDATE_INFO',
                    payload: res.data
                }))
            }else{
                console.log("add-method", postData)
                axios.post('http://localhost:5000/add', { ...postData }).then((res) => dispatch({
                    type: 'ADD_INFO',
                    payload: res.data
                }))
            }
            setPostData(initialState);
            setCurrentId(null);
        }
    }

    return(
        <Container >
            <fieldset className="border">
                <legend  className="register">Registration</legend>
                <Form onSubmit={submit} >
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={2} xs={12}>Fullname</Form.Label>
                        <Col sm={4} xs={12}>
                            <Form.Control type="text" value={postData.name} onChange={(e) => setPostData({...postData, name: e.target.value})} ></Form.Control>
                        </Col>
                        <Form.Label column sm={2} xs={12}>Profile Pic</Form.Label>
                        <Col sm={4} xs={12}>
                            <div className="pic-container">
                                <FileBase  type="file"  mutiple={false} onDone={({base64}) => setPostData({...postData, profilePic: base64})} />
                            </div>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label   column sm={2} xs={12}>Mobile</Form.Label>
                        <Col sm={2} xs={3}>
                            <InputGroup className="mb-3">
                                <InputGroup.Text>+</InputGroup.Text>
                                <Form.Control type="text" value={postData.addOn} onChange={(e) => setPostData({...postData, addOn: e.target.value})}></Form.Control>
                            </InputGroup>
                        </Col>
                        <Col sm={2} xs={9}>
                            <Form.Control type="text" value={postData.mobile} onChange={(e) => setPostData({...postData, mobile: e.target.value})}></Form.Control>
                        </Col>
                        <Form.Label column sm={2} xs={12}>Email Id</Form.Label>
                        <Col sm={4} xs={12}>
                            <Form.Control type="email" value={postData.email} onChange={(e) => setPostData({...postData, email: e.target.value})} ></Form.Control>
                        </Col> 
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label   column sm={2} xs={12}>Job Type</Form.Label>
                        <Col sm={4} xs={12}>
                            <ToggleButtonGroup type="checkbox"  >
                                <ToggleButton variant="outline-secondary" onClick={() => setPostData({...postData, jobType: 'Full Time'})} >FT</ToggleButton>
                                <ToggleButton variant="outline-secondary" onClick={() => setPostData({...postData, jobType: 'Part Time'})} >PT</ToggleButton>
                                <ToggleButton variant="outline-secondary" onClick={() => setPostData({...postData, jobType: 'Consultant'})} >Consultant</ToggleButton>
                            </ToggleButtonGroup>
                        </Col>
                        <Form.Label column sm={2} xs={12}>DOB</Form.Label>
                        <Col sm={3} xs={12}>
                            <div className="calendar-container">
                                <DatePicker className="datepicker" selected={date} 
                                    onChange={(da) => {
                                        console.log(da);
                                        setDate(da)
                                        console.log('date',date);
                                        setPostData({...postData, dob: da.toISOString()})
                                    }  } />
                                <div className="icon-container">
                                    <BiCalendar className="calendar"/>
                                </div>
                            </div>
                        </Col> 
                    </Form.Group>
                    <Form.Group as ={Row} className="mb-3">
                        <Form.Label column sm={2} xs={6}>Pref Location</Form.Label>
                        <Col sm={4} xs={6}>
                            <Form.Select value={postData.location} onChange={(e) => setPostData({...postData, location: e.target.value})} >
                                <option  value="">Select</option>
                                <option  value="chennai">Chennai</option>
                                <option  value="bangalore">Bangalore</option>
                                <option  value="pune">Pune</option>
                            </Form.Select>
                        </Col>
                        <Col xs={12} sm={6}>
                            {mobileView ? (
                                <div style={{textAlign: 'center'}}>
                                    <Button variant="outline-success" type="submit" >GO</Button>
                                </div>
                            ) : (
                                <div className="submit-container" >
                                    <Button variant="outline-success" type="submit"  >+ Add / Update</Button>
                                </div>
                            )}
                        </Col>
                    </Form.Group>
                </Form>
            </fieldset>
         </Container>
    );
}

export default From;