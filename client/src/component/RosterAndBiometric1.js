import React, { useState, useEffect } from 'react'
import Header from "../Header";
import Footer from "../Footer";
import { ToastContainer, toast } from 'react-toastify';
import Menu from '../Menu';
import { useParams } from 'react-router-dom';
import { decode as base64_decode } from 'base-64';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import { useNavigate } from "react-router-dom";
import { isAuth, getCookie, signout } from "../component/auth/helpers";
const url = `${process.env.REACT_APP_BACKEND_URL}`
const RosterAndBiometric = () => {
    const navigate = useNavigate();
    const [datas, setData] = useState([])
    const [startDate, setStartDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isData, setIsData] = useState(false);
    const [aprShow, setAprShow] = useState(false);
    const { id1, id2 } = useParams("")
    const EmployeeName = base64_decode(id2)

    useEffect(() => {
        if (!getCookie('token'))
            signout(() => {
                navigate("/");
            })
    }, []);

    const handleDate = (e) => {
        setStartDate(e.target.value)

        if (e.target.value) {
            setIsLoading(true);
            setIsData(false)
            let month = e.target.value.split('-')
            let year = month[0]
            const getRoaster = async () => {
                try {
                    const EmployeeID = base64_decode(id1)
                    month = month[1]
                    const response = await fetch(`${url}/api/get-roaster`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }, body: JSON.stringify({ EmployeeID, month, year })
                    });

                    if (!response.ok) {
                        throw new Error('Request failed');
                    }

                    const data = await response.json();
                    if (response.status === 200) {
                        setData(data)
                        setIsLoading(false);
                        setIsData(true)
                        if (isAuth().result1.des_id === 9 || isAuth().result1.des_id === 12) {
                            setAprShow(true)
                        }
                    }
                } catch (error) {

                }
            };
            getRoaster()
        }

    }

    // 
    useEffect(() => {
        const getRoaster = async () => {
            setStartDate("")
            setIsLoading(true);
            setIsData(false)
            try {
                const currentDate = new Date();
                let year = currentDate.getFullYear();
                let month = String(currentDate.getMonth() + 1).padStart(2, '0');
                const day = String(currentDate.getDate()).padStart(2, '0');
                const formattedDate = `${year}-${month}-${day}`;
                setStartDate(formattedDate)
                const yearmonth = formattedDate.split('-')
                const EmployeeID = base64_decode(id1)
                month = yearmonth[1]
                year = yearmonth[0]
                const response = await fetch(`${url}/api/get-roaster`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }, body: JSON.stringify({ EmployeeID, month, year })
                });

                if (!response.ok) {
                    throw new Error('Request failed');
                }

                const data = await response.json();
                if (response.status === 200) {
                    setData(data)
                    setIsLoading(false);
                    setIsData(true)
                    if (isAuth().result1.des_id === 9 || isAuth().result1.des_id === 12) {
                        setAprShow(true)
                    }
                }
            } catch (error) {

            }

        };

        getRoaster()
    }, [id1])

    const currentDate = new Date();
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const formattedLastDay = lastDayOfMonth.toISOString().slice(0, 10); // Convert to YYYY-MM-DD format
    const twoMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1);
    const formattedTwoMonthsAgo = twoMonthsAgo.toISOString().slice(0, 10); // Convert to YYYY-MM-DD format

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
                                        <div className='row'>
                                            <div className='col-md-6'>
                                                <h5 className="card-title">Attendance - <span style={{ fontSize: '1rem' }}>{EmployeeName ? EmployeeName : null} ({datas.EmployeeID})</span></h5>

                                            </div>
                                            {/* <div className='col-md-2'>
                                <label style={{ fontSize: '.7rem' }}>Month : {datas.month}</label>
                            </div>
                            <div className='col-md-2'>
                                <label style={{ fontSize: '.7rem' }}>Year : {datas.year}</label>
                            </div> */}
                                            <div className=" col-md-2">
                                                {/* <div className="col-md-12"> */}
                                                <label style={{ fontSize: ".7rem" }}>
                                                    Change Month
                                                </label>

                                            </div>
                                            <div className=" col-md-3">

                                                <input
                                                    style={{ fontSize: ".8rem" }}
                                                    selected={startDate}
                                                    type="date"
                                                    max={formattedLastDay}
                                                    min={formattedTwoMonthsAgo}
                                                    onChange={handleDate}
                                                    className="form-control form-control-sm form-control-border"
                                                />
                                                {/* </div> */}
                                            </div>
                                        </div>
                                        <br />

                                        <div style={{ overflow: 'auto' }}>
                                            <Table striped bordered hover size="sm" className='table '>
                                                <thead>
                                                    <tr style={{ fontSize: '.7rem' }}>
                                                        {/* <th>#</th> */}
                                                        <th>Date</th>
                                                        <th>Day</th>
                                                        <th>Attandance</th>
                                                        {aprShow ? <th>Downtime</th> : null}
                                                        {aprShow ? <th>Net Hours</th> : null}
                                                        <th>In Time</th>
                                                        <th>Out Time</th>
                                                        <th>Bio Hours</th>
                                                        <th>Roster In</th>
                                                        <th>Roster Out</th>
                                                    </tr>
                                                </thead>

                                                {isData ? <tbody style={{ fontSize: '.8rem' }}>
                                                    {datas.attandanceList ? datas.attandanceList.map((el, ind) => {
                                                        let formattedTimeDifference
                                                        const startTime = new Date(`2000-01-01T${el.InTime}`);
                                                        const endTime = new Date(`2000-01-01T${el.OutTime}`);
                                                        const differenceInMilliseconds = endTime - startTime;

                                                        if (!isNaN(differenceInMilliseconds)) {
                                                            const hours = Math.floor(differenceInMilliseconds / (1000 * 60 * 60));
                                                            const minutes = Math.floor(
                                                                (differenceInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
                                                            );
                                                            const seconds = Math.floor((differenceInMilliseconds % (1000 * 60)) / 1000);
                                                            const formattedHours = hours.toString().padStart(2, '0');
                                                            const formattedMinutes = minutes.toString().padStart(2, '0');
                                                            const formattedSeconds = seconds.toString().padStart(2, '0');

                                                            formattedTimeDifference = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
                                                        }
                                                        return <tr key={el.id}>
                                                            {/* <td>{ind + 1}</td> */}
                                                            <td>{el.date}</td>
                                                            <td>{el.dayName}</td>
                                                            <td>{el.attandance}</td>
                                                            {aprShow ? <td>{el.downtime}</td> : null}
                                                            {aprShow ? <td>{el.netHours}</td> : null}
                                                            <td>{el.InTime}</td>
                                                            <td>{el.OutTime}</td>
                                                            <td>{formattedTimeDifference ? formattedTimeDifference : null}</td>
                                                            <td>{el.roasterIn}</td>
                                                            <td>{el.roasterOut}</td>
                                                        </tr>
                                                    }) : null}
                                                </tbody> : null}
                                            </Table>
                                        </div>
                                        {isLoading && <center><Spinner animation="border" role="status">
                                            <span className="visually-hidden"></span>
                                        </Spinner></center>}
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
            </div >
            <Footer />
        </>
    )
}

export default RosterAndBiometric