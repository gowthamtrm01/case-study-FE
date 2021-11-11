import React,{useContext, useState} from 'react';
import {Table, ToggleButtonGroup, ToggleButton, Modal, Button, Col, Row} from 'react-bootstrap';
import moment from 'moment';
import {FaTrashAlt} from 'react-icons/fa';
import axios from 'axios';

import {stateContext} from './../../app';

const Lists = () => {

    const {state, dispatch, setCurrentId, mobileView, handleShow} = useContext(stateContext);
    const [show, setShow] = useState(false);
    const [profile, setProfile] = useState('');
    const handleClose = () => {
        setShow(false)
        setProfile('')
    };
    const handleOpen = () => setShow(true);
    const onModal = (image) => {
        handleOpen();
        setProfile(image);
    }

    const onText = (id) => {
        dispatch({
            type: "SHOW_INFO",
            id
        })
    }    

    const onEdit = (id) => {
        setCurrentId(id);
        handleShow();
    }

    const onDelete = (id) => {
        axios.delete(`http://localhost:5000/delete/${id}`).then((res) => dispatch({
            type: "DELETE_INFO",
            id
        }))

    }

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Profile Pic</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <img className="profile" src={profile} alt="profile" />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            {mobileView ? (
                <Row xs={12} className="full-table">
                    {state.map((info, index) => {
                        if(info.hide) {
                            return undefined;
                        }else{
                            return (
                                <Row key={index} xs={12} className="padding center" >
                                    <Row xs={12} className="padding" >
                                        <Col xs={12} className="first-row padding">
                                            <Button variant="secondary" size="lg" className="large-button" onClick={() => {onText(info._id)}} >{info.name}</Button>
                                        </Col>
                                    </Row>
                                    {info.show && (
                                        <Row xs={12} id="table-body">
                                              <Row  >
                                                <Col xs={8}>{info.email}</Col>
                                                <Col xs={4}>
                                                    <img className="mobile-pic" src={info.profilePic} alt="profile" />
                                                </Col>
                                            </Row>
                                            <Row className ="table-row">
                                                <Col xs={8}>{`${info.addOn ? '+' : ''}${info.addOn}${info.mobile}`}</Col>
                                            </Row>
                                            <Row className ="table-row">
                                                <Col xs={6}>{moment(info.dob).format('DD.MM.YYYY')}</Col>
                                            </Row>
                                            <Row className ="table-row">
                                                <Col xs={6}>{info.jobType}</Col>
                                                <Col xs={6}>
                                                    <div>
                                                        <Button variant="secondary" className="editButton"
                                                            onClick={() => {onEdit(info._id)}}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button variant="danger" onClick={() => {onDelete(info._id)}} >
                                                            <FaTrashAlt/>
                                                        </Button>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Row>
                                    )}
                                </Row>
                            )
                        }
                    })}
                </Row>
            ) : (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>DOB</th>
                            <th>Job Type</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.map((info, index) => (
                            <tr key={index}>
                                <td>{info.name}</td>
                                <td>{info.email}</td>
                                <td>{ `${info.addOn ? '+' : ''}${info.addOn}${info.mobile}`}</td>
                                <td>{moment(info.dob).format('DD.MM.YYYY')}</td>
                                <td>{info.jobType}</td>
                                <td>{
                                    <ToggleButtonGroup type="checkbox">
                                        <ToggleButton onClick={() => onModal(info.profilePic)}>Pic</ToggleButton>
                                        <ToggleButton variant="secondary" onClick={() => setCurrentId(info._id)}>Edit</ToggleButton>
                                        <ToggleButton variant="danger" onClick={() => {onDelete(info._id)}} >Delete</ToggleButton>
                                    </ToggleButtonGroup>
                                }</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    );
}

export default Lists;