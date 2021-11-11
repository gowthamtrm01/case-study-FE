import React,{createContext, useReducer, useState, useEffect} from 'react';
import {Container, FormControl, InputGroup, Row, Col, Button, Modal, Form, ToggleButtonGroup, ToggleButton} from 'react-bootstrap';
import {useMediaQuery} from '@react-hook/media-query';
import {BsSearch} from 'react-icons/bs';
import {MdKeyboardVoice} from 'react-icons/md';
import {BsPlusLg} from 'react-icons/bs'
import {BiCalendar} from 'react-icons/bi';
import FileBase from 'react-file-base64';
import DatePicker from 'react-datepicker';
import axios from 'axios';

import FormInfo from './components/form/form';
import Lists from './components/Lists/lists';
import reducer from './reducer/reducer';

const stateContext = createContext(null);
export {stateContext};

const initialState = { name: '', mobile: '', addOn: '', jobType: '', profilePic: '', location: '', email: '', dob: new Date().toISOString(), hide: false, show: false}

const App = () => {
    
    const infoList = []
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [state, dispatch] = useReducer(reducer, infoList);
    const [date, setDate] = useState(new Date());
    const [currentId, setCurrentId] = useState(null);
    const mobileView = useMediaQuery('only screen and (max-width: 576px)');
    const [postData, setPostData] = useState(initialState);
    const info = currentId ? state.find(info => info._id === currentId) : null;

    useEffect(() =>{
      axios.get('http://localhost:5000/all').then((res) => dispatch({
          type: 'FETCH_ALL_INFO',
          payload: res.data
      }))
    },[])

    useEffect(() => {
      if(info){
        setPostData(info);
      }
    }, [info])

    const onSearch = (e) => {
        const value = e.target.value;
        console.log(value);
        if (value) {
            const filtersObj = state.map((info) => {
              if (info.name.toLowerCase().includes(value.toLowerCase())) {
                info.hide = true;
                return info
              }
              return info;
            })
            dispatch({
              type: "SEARCH_INFO",
              payload: filtersObj
            })
          } else {
            const allInfo = state.map((info) => {
              info.hide = false;
              return info;
            })
            dispatch({
              type: "SEARCH_INFO",
              payload: allInfo
            })
          }
    }

    const submit = (e) => {
      e.preventDefault();
      console.log(postData);
      if(postData !== initialState){
          if(currentId){
            axios.patch(`http://localhost:5000/update/${postData._id}`, { ...postData }).then((res) => dispatch({
                type: 'UPDATE_INFO',
                payload: res.data
            }))
          }else{
            axios.post('http://localhost:5000/add', { ...postData }).then((res) => dispatch({
                type: 'ADD_INFO',
                payload: res.data
            }))
          }
          setPostData(initialState);
          setCurrentId(null);
          handleClose();
      }
  }

    return (
        <div>
              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                  <fieldset className="border">
                  <legend  className="register" >Registration</legend>
                  <Form onSubmit={submit} >
                      <Form.Group as={Row} className="mb-3">
                          <Form.Label column xs={12}>Profile Pic</Form.Label>
                          <Col xs={12}>
                              <div className="pic-container">
                                  <FileBase  type="file"  mutiple={false} onDone={({base64}) => setPostData({...postData, profilePic: base64})} />
                              </div>
                          </Col>
                          <Form.Label column xs={12}>Fullname</Form.Label>
                          <Col xs={12}>
                              <Form.Control type="text" value={postData.name} onChange={(e) => setPostData({...postData, name: e.target.value})} ></Form.Control>
                          </Col>
                      </Form.Group>
                      <Form.Group as={Row} className="mb-3">
                          <Form.Label   column xs={12}>Mobile</Form.Label>
                          <Col xs={3}>
                              <InputGroup className="mb-3">
                                  <InputGroup.Text>+</InputGroup.Text>
                                  <Form.Control type="text" value={postData.addOn} onChange={(e) => setPostData({...postData, addOn: e.target.value})}></Form.Control>
                              </InputGroup>
                          </Col>
                          <Col xs={9}>
                              <Form.Control type="text" value={postData.mobile} onChange={(e) => setPostData({...postData, mobile: e.target.value})}></Form.Control>
                          </Col>
                          <Form.Label   column  xs={12}>Job Type</Form.Label>
                          <Col xs={12}>
                              <ToggleButtonGroup type="checkbox"  >
                                  <ToggleButton variant="outline-secondary" onClick={() => setPostData({...postData, jobType: 'Full Time'})} >FT</ToggleButton>
                                  <ToggleButton variant="outline-secondary" onClick={() => setPostData({...postData, jobType: 'Part Time'})} >PT</ToggleButton>
                                  <ToggleButton variant="outline-secondary" onClick={() => setPostData({...postData, jobType: 'Consultant'})} >Consultant</ToggleButton>
                              </ToggleButtonGroup>
                          </Col>
                      </Form.Group>
                      <Form.Group as={Row} className="mb-3">
                          <Form.Label column xs={6}>Pref Location</Form.Label>
                          <Col xs={6}>
                              <Form.Select value={postData.location} onChange={(e) => setPostData({...postData, location: e.target.value})} >
                                  <option  value="">Select</option>
                                  <option  value="chennai">Chennai</option>
                                  <option  value="bangalore">Bangalore</option>
                                  <option  value="pune">Pune</option>
                              </Form.Select>
                          </Col>
                      </Form.Group>
                      <Form.Group as ={Row} className="mb-3">
                          <Form.Label column xs={12}>Email Id</Form.Label>
                          <Col xs={12} >
                              <Form.Control type="email" value={postData.email} onChange={(e) => setPostData({...postData, email: e.target.value})} ></Form.Control>
                          </Col>
                          <Form.Label column  xs={4}>DOB</Form.Label>
                          <Col xs={8} >
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
                          <Col xs={12} >
                              <div style={{textAlign: 'center'}}>
                                  <Button variant="outline-success" type="submit" >GO</Button>
                              </div>
                          </Col>
                      </Form.Group>
                  </Form>
              </fieldset>
                </Modal.Body>
              </Modal>
            <stateContext.Provider value={{state, dispatch, currentId, setCurrentId, mobileView, handleShow}}>
                {!mobileView && <FormInfo/>}
                <Container className="sub-main">
                   {mobileView && (
                    <Row className="search-container">
                        <Col xs={12}>
                            <InputGroup>
                                <InputGroup.Text><BsSearch/></InputGroup.Text>
                                <FormControl type="text" placeholder="Search" onChange={(e) => onSearch(e)}></FormControl>
                                <InputGroup.Text><MdKeyboardVoice/></InputGroup.Text>
                            </InputGroup>
                        </Col>
                    </Row>
                   )}
                    <Lists/>
                </Container>
                {mobileView && (
                    <Row xs={12}  >
                        <Col xs={12} className="cricle-button-container" >
                            <Button className="circle-button" variant="success" onClick={() => {handleShow()}} >
                                <BsPlusLg style={{marginLeft: '5px'}} /><span>Add</span>
                            </Button>
                        </Col>
                    </Row>
                )}
            </stateContext.Provider>
        </div>
    );
}

export default App;