import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import Header from "../../Header";
import Footer from "../../Footer";
import { ErrorMessage } from "@hookform/error-message";
import { ToastContainer, toast } from 'react-toastify';
import Menu from "../../Menu";
import { useNavigate } from "react-router-dom";
import { isAuth, getCookie, signout } from "../auth/helpers";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarFilterButton, GridToolbarExport
} from '@mui/x-data-grid';
function CustomToolbar({ setFilterButtonEl }) {
    return (
        <GridToolbarContainer>
            <GridToolbarFilterButton ref={setFilterButtonEl} />
            <GridToolbarExport printOptions={{ disableToolbarButton: true }} />
        </GridToolbarContainer>
    );
}
const url = `${process.env.REACT_APP_BACKEND_URL}`
function IssueMaster() {
    const {
        register,
        control,
        handleSubmit,
        reset,
        trigger,
        setError,
        formState: { errors },
    } = useForm({
        defaultValues: {
            formdata: [
                {
                    issue: "",
                },
            ],
        },
    });
    const navigate = useNavigate();
    const [datas, setData] = useState([])
    const [modalShow, setModalShow] = React.useState(false);

    useEffect(() => {
        if (!getCookie('token'))
            signout(() => {
                navigate("/");
            })
    }, []);

    const onSubmit = async (data) => {
        try {
            const issue = data.formdata[0].issue
            const response = await fetch(`${url}/api/create-master-issue`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ issue })
            });

            if (!response.ok) {
                toast.error("Issue Exists!")
            }

            await response.json();
            if (response.status === 200) {
                // reset()
                reset({
                    formdata: [
                        {
                            issue: "",
                        }
                    ]
                });
                getIssue()
                toast.success("Issue Created!")
            }
        } catch (error) {
            toast.error("Issue Exists!")
        }
    };

    const getIssue = async () => {
        try {
            const response = await fetch(`${url}/api/get-master-issue`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                toast.error("Error Occured!")
            }

            const data = await response.json();
            if (response.status === 200) {
                if (data.length > 0) {
                    setData(data)
                }
            }
        } catch (error) {

        }
    };
    useEffect(() => {
        getIssue()
    }, [])


    const columns = [
        {
            field: "id",
            headerName: "S. No.",
            headerClassName: "font-weight-bold small",
            cellClassName: "small ",
            width: 60,
        },
        {
            field: "issue",
            headerClassName: "font-weight-bold small",
            cellClassName: "small ",
            headerName: "Belongs To",
            width: 150,
        },
        {
            field: "status",
            headerClassName: "font-weight-bold small",
            cellClassName: "small ",
            headerName: "Status",
            width: 90,
        },
        {
            field: "view",
            headerClassName: "font-weight-bold small",
            cellClassName: "small ",
            headerName: "Action",
            width: 80,
            renderCell: (row) =>
                <td>
                    <div><button className="btn btn-sm btn-primary" onClick={(e) => handleModal(e, row.row._id)}>
                        View
                    </button></div>
                </td>
        },
    ];
    const [getids, setIds] = useState("")
    const handleModal = async (e, id) => {
        e.preventDefault()
        setIds(id)
        setModalShow(true)
    };
    const rows = datas ? datas.map((element, index) => ({
        id: index + 1,
        _id: element._id,
        issue: element.issue,
        status: element.status
    })) : null;
    function MyVerticallyCenteredModal(props) {
        const [issue, setIssue] = useState('')
        const [status, setStatus] = useState('')
        const [validRemark, setValidRemark] = useState(false)
        const [validSelect, setValidSelect] = useState(false)
        const [modalData, setModalData] = useState([])
        // setStatus(modalData.status)
        const handleIssue = (e) => {
            e.preventDefault()
            setValidRemark(false)
            setIssue(e.target.value)
        }

        useEffect(() => {
            const id = props.ids
            if (id) {
                const getData = async () => {
                    try {
                        const response = await fetch(`${url}/api/get-master-issue-by-id`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            }, body: JSON.stringify({ id })
                        });

                        if (!response.ok) {
                            toast.error("Error Occured!")
                        }

                        const data = await response.json();
                        if (response.status === 200) {
                            setModalData(data)
                            setIssue(data.issue)
                            setStatus(data.status)
                            // setModalShow(true)

                        }
                    } catch (error) {

                    }
                }
                getData()
            }
        }, [])


        const handleUpdate = async (e, id) => {
            e.preventDefault()
            if (!status) {
                setValidSelect(true)
                return false
            } else if (!issue) {
                setValidRemark(true)
                return false
            } else {
                try {

                    const id = modalData._id
                    const response = await fetch(`${url}/api/update-master-issue-by-id`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        }, body: JSON.stringify({ id, status, issue })
                    });

                    if (!response.ok) {
                        toast.error("Error Occured!")
                    }

                    const data = await response.json();
                    if (response.status === 200) {
                        toast.success("Issue Updated!")
                        props.onHide()
                        getIssue()
                    }
                } catch (error) {
                    toast.error("Issue Exists!")
                }
            };
        }
        return (
            <Modal
                {...props}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Belongs To Master
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ fontSize: '.7rem' }}>

                        <div className=" form-group row">
                            <div className="col-md-4">
                                <label
                                    htmlFor="validationCustom01"
                                    style={{ fontSize: "12.4px" }}
                                >
                                    Belongs To :
                                </label>
                            </div>
                            <div className="col-md-6">
                                <input onChange={handleIssue} value={issue} className='form-control form-control-sm'></input>
                                {validRemark ? <span className='text-danger'>*Required</span> : null}

                            </div>
                        </div>
                        <div className=" form-group row">
                            <div className="col-md-4">
                                <label
                                    htmlFor="validationCustom01"
                                >
                                    Status :
                                </label>
                            </div>

                            <div className="col-md-6">
                                <select
                                    name="status"
                                    id="validationCustom01"
                                    onChange={(e) => (setStatus(e.target.value), setValidSelect(false))}
                                    value={status}
                                    className="form-control form-control-sm"
                                >
                                    <option value="">Select</option>
                                    <option>active</option>
                                    <option>inactive</option>

                                </select>
                                {validSelect ? <span className='text-danger'>*Required</span> : null}
                            </div>
                        </div>


                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleUpdate} className='btn btn-sm btn-primary'>Submit</Button>
                    <Button className='btn btn-sm btn-primary' onClick={props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
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
                                        <h5 className="card-title">Belongs To Master</h5>
                                        <MyVerticallyCenteredModal
                                            show={modalShow}
                                            ids={getids}
                                            onHide={() => setModalShow(false)}
                                        />
                                        <br />
                                        <hr />
                                        <form onSubmit={handleSubmit(onSubmit)}>

                                            <div className="row">
                                                <div className="col-sm-5">
                                                    {/* textarea */}
                                                    <div className="form-group">
                                                        <label style={{ fontSize: ".7rem" }}>
                                                            Belongs To :
                                                        </label>
                                                        <input
                                                            style={{ fontSize: ".8rem" }}
                                                            type="text"
                                                            className="form-control form-control-sm form-control-border"
                                                            id="exampleInputBorder"
                                                            placeholder="Issue"
                                                            {...register(`formdata[0].issue`, {
                                                                required: "Issue is required.",
                                                            })}
                                                            aria-invalid={
                                                                errors.communicated_with ? "true" : "false"
                                                            }
                                                        />
                                                        <ErrorMessage
                                                            errors={errors}
                                                            name="formdata[0].issue"
                                                            render={({ message }) => (
                                                                <p style={{ color: "red", fontSize: "0.8rem" }}>
                                                                    {message}
                                                                </p>
                                                            )}
                                                        />
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="">
                                                <button type="submit" style={{ fontSize: ".8rem" }} className="btn btn-sm btn-primary">
                                                    Add Belongs To
                                                </button>
                                            </div>
                                        </form>
                                        <div className="card mt-4">
                                            <DataGrid
                                                style={{ fontWeight: "400" }}
                                                slots={{
                                                    toolbar: CustomToolbar,
                                                }}
                                                density="compact"
                                                autoHeight
                                                experimentalFeatures={{ columnGrouping: true }}
                                                getRowId={(element) => element._id}
                                                rows={rows}
                                                disableRowSelectionOnClick
                                                columns={columns}
                                                initialState={{
                                                    pagination: {
                                                        paginationModel: {
                                                            pageSize: 8,
                                                        },
                                                    },
                                                }}
                                            />
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

export default IssueMaster;
