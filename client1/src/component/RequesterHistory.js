import React, { useEffect, useState } from "react";
import Header from "../Header";
import Footer from "../Footer";
import { ToastContainer, toast } from 'react-toastify';
import Menu from "../Menu";
import Table from 'react-bootstrap/Table';
import "react-datepicker/dist/react-datepicker.css";
import { decode as base64_decode } from 'base-64';
import { useParams, useNavigate } from "react-router-dom";
import { getCookie, signout } from "../component/auth/helpers";
import { BsFillHandThumbsUpFill, BsHandThumbsDownFill } from 'react-icons/bs';
const url = `${process.env.REACT_APP_BACKEND_URL}`
function RequesterHistory() {
    const navigate = useNavigate();
    const { id1 } = useParams("")
    const [empDataDet, setEmpDataDet] = useState('')

    useEffect(() => {
        if (!getCookie('token'))
            signout(() => {
                navigate("/");
            })
    }, []);

    useEffect(() => {
        const id = base64_decode(id1)
        if (id) {
            const getData = async () => {
                try {
                    const response = await fetch(`${url}/api/get-raise-issue-by-id`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }, body: JSON.stringify({ id })
                    });

                    if (!response.ok) {
                        throw new Error('Request failed');
                    }

                    const data = await response.json();
                    if (response.status === 200) {
                        setEmpDataDet(data)

                    }
                } catch (error) {

                }
            }
            getData()
        }

    }, [id1])

    function padTo2Digits(num) {
        return num.toString().padStart(2, "0");
    }

    function formatDate(date) {
        return [
            padTo2Digits(date.getDate()),
            padTo2Digits(date.getMonth() + 1),
            date.getFullYear(),
        ].join("-");
    }
    return (
        <>
            <Header />
            <Menu />
            <ToastContainer />
            <div className="content-wrapper" >
                {/* Content Header (Page header) */}
                <div className="content-header"></div>
                {/* /.content-header */}

                {/* Main content */}
                <div className="content">
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <div className="card card-primary card-outline">
                                    <div className="card-body">
                                        <h5 className="card-title">Requester's History</h5>
                                        <br />
                                        <hr />
                                        <div className='row' style={{ fontSize: '.7rem' }}>
                                            <div className="col-sm-4">
                                                <div className="form-group">
                                                    <label
                                                        // className="text-muted"
                                                        htmlFor="validationCustom01"
                                                    >
                                                        Case ID :
                                                    </label>

                                                    <label className="ml-1">{empDataDet ? empDataDet.caseId : null}</label>
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div className="form-group">
                                                    <label
                                                        // className="text-muted"
                                                        htmlFor="validationCustom01"
                                                    >
                                                        Name :
                                                    </label>

                                                    <label className="ml-1">{empDataDet ? empDataDet.name : null}</label>
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div className="form-group">
                                                    <label
                                                        // className="text-muted"
                                                        htmlFor="validationCustom01"
                                                    >
                                                        EmployeeID :
                                                    </label>

                                                    <label className="ml-1">{empDataDet ? empDataDet.requestby : null}</label>
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div className="form-group">
                                                    <label
                                                        // className="text-muted"
                                                        htmlFor="validationCustom01"
                                                    >
                                                        Process :
                                                    </label>

                                                    <label className="ml-1">{empDataDet ? empDataDet.Process : null}</label>
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div className="form-group">
                                                    <label
                                                        htmlFor="validationCustom01"
                                                    >
                                                        Issue Type :
                                                    </label>

                                                    <label className="ml-1">{empDataDet ? empDataDet.belongsTo : null}</label>

                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div className="form-group">
                                                    <label
                                                        // className="text-muted"
                                                        htmlFor="validationCustom01"
                                                    >
                                                        Sub Issue :
                                                    </label>

                                                    <label className="ml-1">{empDataDet ? empDataDet.issue : null}</label>

                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div className="form-group">
                                                    <label
                                                        htmlFor="validationCustom01"
                                                    >
                                                        Request Date
                                                    </label>

                                                    <label className="ml-1">{empDataDet ? formatDate(new Date(empDataDet.createdAt)) : null}</label>
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div className="form-group">
                                                    <label
                                                        // className="text-muted"
                                                        htmlFor="validationCustom01"
                                                    >
                                                        Report To :
                                                    </label>

                                                    <label className="ml-1">{empDataDet ? empDataDet.reportto : null}</label>
                                                </div>
                                            </div>

                                            <div className="col-sm-4">
                                                <div className="form-group">
                                                    <label
                                                        // className="text-muted"
                                                        htmlFor="validationCustom01"
                                                    >
                                                        Communicated With :
                                                    </label>

                                                    <label className="ml-1">{empDataDet ? empDataDet.communicated_with : null}</label>
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div className="form-group">
                                                    <label
                                                        // className="text-muted"
                                                        htmlFor="validationCustom01"
                                                    >
                                                        Contact No. :
                                                    </label>

                                                    <label className="ml-1">{empDataDet ? empDataDet.mobile_no : null}</label>
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div className="form-group">
                                                    <label
                                                        htmlFor="validationCustom01"
                                                    >
                                                        Status :
                                                    </label>

                                                    <label className="ml-1">{empDataDet ? empDataDet.status : null}</label>
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div className="form-group">
                                                    <label
                                                        htmlFor="validationCustom01"
                                                    >
                                                        Requester's Status :
                                                    </label>

                                                    <label className="ml-1">{empDataDet ? empDataDet.requesterStatus : null}</label>
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div className="form-group">
                                                    <label
                                                        htmlFor="validationCustom01"
                                                    >
                                                        Requester's Feedback :
                                                    </label>

                                                    <label className="ml-1">{empDataDet.RequestersFeedback === "Satisfied" ?
                                                        <BsFillHandThumbsUpFill style={{
                                                            color: "green", fontSize: "1rem",
                                                        }} />
                                                        : empDataDet.RequestersFeedback === "Not Satisfied" ? <BsHandThumbsDownFill style={{
                                                            color: "red", fontSize: "1rem",
                                                        }} /> : null}</label>
                                                </div>
                                            </div>
                                            <div className="col-sm-8">
                                                <div className="form-group">
                                                    <label
                                                        htmlFor="validationCustom01"
                                                    >
                                                        Requester's Remark :
                                                    </label>

                                                    <label className="ml-1">{empDataDet ? empDataDet.RequestersRemark : null}</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ overflow: 'auto' }}>
                                            <Table striped bordered hover size="sm" className='table '>
                                                <thead>
                                                    <tr style={{ fontSize: '.7rem' }}>
                                                        <th>#</th>
                                                        <th>Concern</th>
                                                        <th>Concern Date</th>
                                                        <th>Handlers L1 Remark</th>
                                                        <th>Handlers L2 Remark</th>

                                                    </tr>
                                                </thead>
                                                <tbody style={{ fontSize: '.8rem' }}>
                                                    {empDataDet.concern ? empDataDet.concern.map((el, ind) => {

                                                        return <tr key={el._id}>
                                                            <td>{ind + 1}</td>
                                                            <td>{el.remark}</td>
                                                            <td>{formatDate(new Date(el.concernof))}</td>
                                                            <td>{el.handlerL1remark.split('|').map(str => <div>{str}</div>)}</td>
                                                            <td>{el.handlerL2remark.split('|').map(str => <div>{str}</div>)}</td>
                                                        </tr>
                                                    }) : null}

                                                </tbody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                                {/* /.card */}
                            </div>
                            {/* /.col-md-5 */}
                        </div>
                        {/* /.row */}
                    </div>
                    {/* /.container-fluid */}
                </div>
                {/* /.content */}
            </div>
            <Footer />
        </>
    );
}

export default RequesterHistory;
