import React, { useState, useEffect } from 'react'
import Header from "../Header";
import Footer from "../Footer";
import { ToastContainer, toast } from 'react-toastify';
import Menu from '../Menu';
import { useParams } from 'react-router-dom';
import { decode as base64_decode } from 'base-64';
import Spinner from 'react-bootstrap/Spinner';
import { useNavigate } from "react-router-dom";
import { isAuth, getCookie, signout } from "../component/auth/helpers";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
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

    // const [maxMonth, setMaxMonth] = useState(
    //     new Date().toISOString().split("-").slice(0, 2).join("-")
    // );

    // const currentDate = new Date();
    // const currentYear = currentDate.getFullYear();
    // const currentMonth = currentDate.getMonth() + 1; // Note: JavaScript months are zero-based (0 to 11)
    // const minYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    // const minMonth = currentMonth === 1 ? 12 : currentMonth - 1;

    // const [minAllowedMonth, setMinAllowedMonth] = useState(`${minYear}-${String(minMonth).padStart(2, '0')}`);

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
                        <div className='row'>
                            {isData ? <>   {datas.attandanceList ? datas.attandanceList.map((el, ind) => {
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
                                return <div className='col-md-2'><Card key={el.id} className=' ml-1 mb-2' >
                                    <CardContent>
                                        <Typography variant="body2" >
                                            {el.dayName} {el.date.slice(8).toString().padStart(2, '0')}
                                        </Typography>
                                        <Typography variant="body2" component="div" className={`${el.attandance === "P" ? "bg-info" : el.attandance === "WO" ? "bg-success" : el.attandance === "L" ? "bg-success" : "border"}`}>
                                            {el.attandance ? el.attandance : "-"}
                                        </Typography>
                                        <Typography variant="body2">
                                            <span style={{ marginRight: '3.5px' }}>Roster</span>{el.roasterIn}-{el.roasterOut}
                                        </Typography>

                                        <Typography variant="body2">
                                            <span style={{ marginRight: '6px' }}>In Time</span>{el.InTime}
                                        </Typography>
                                        <Typography variant="body2">
                                            <span style={{ marginRight: '2px' }}>Out Time</span>{el.OutTime}
                                        </Typography>

                                        {aprShow ? <Typography variant="body2" >
                                            <span style={{ marginRight: '2px' }}>Downtime</span>{el.downtime}
                                        </Typography> : null}
                                        {aprShow ? <Typography variant="body2">
                                            <span style={{ marginRight: '2px' }}>Net Hours</span>{el.netHours}
                                        </Typography> : null}
                                        <Typography variant="body2">
                                            <span style={{ marginRight: '3px' }}>Bio Hours</span>{formattedTimeDifference ? formattedTimeDifference : null}
                                        </Typography>
                                    </CardContent>
                                </Card>
                                </div>
                            }) : null}
                            </> : null}

                        </div>
                        {isLoading && <center className='mt-2'><Spinner animation="border" role="status">
                            <span className="visually-hidden"></span>
                        </Spinner></center>}
                    </div>
                </div>
                {/* /.card */}
            </div>
            {/* /.col-md-5 */}

            <Footer />
        </>
    )
}

export default RosterAndBiometric