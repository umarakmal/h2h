import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
function SubIssueMaster() {
    const {
        register,
        control,
        handleSubmit,
        reset,
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
            const id = data.formdata[0].issue
            const subissue = data.formdata[0].subissue
            const response = await fetch(`${url}/api/create-master-sub-issue`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id, subissue })
            });

            if (!response.ok) {
                throw new Error('Request failed');
            }

            await response.json();
            if (response.status === 200) {
                // reset()
                reset({
                    formdata: [
                        {
                            issue: "",
                            subissue: '',
                        }
                    ]
                });
                getIssue()
                toast.success("Issue Created!")
            }
        } catch (error) {
            toast.error("SubIssue Exists!")
            // setError(error.message);
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
                throw new Error('Request failed');
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
            width: 70
        },
        {
            field: "issue",
            headerClassName: "font-weight-bold small",
            cellClassName: "small ",
            headerName: "Issue",
            width: 160
        },
        {
            field: "status",
            headerClassName: "font-weight-bold small",
            cellClassName: "small ",
            headerName: "Status",
            width: 100
        },
        {
            field: "view",
            headerClassName: "font-weight-bold small",
            cellClassName: "small ",
            headerName: "Action",
            width: 70,
            renderCell: (row) =>
                <td>
                    <div><button style={{ fontSize: '.8rem' }} className="btn btn-sm btn-primary" onClick={(e) => handleModal(e, row.row._id, row.row.issue)}>
                        View
                    </button></div>
                </td>
        },
    ];
    const [getids, setIds] = useState("")
    const [getIss, setIss] = useState("")
    const [getIssueBind, setIssueBind] = useState([])
    const handleModal = async (e, id, issue) => {
        e.preventDefault()
        setIds(id)
        setIss(issue)
        setModalShow(true)
    };
    const rows = datas ? datas.map((element, index) => ({
        id: index + 1,
        _id: element._id,
        issue: element.issue,
        status: element.status
    })) : null;

    const getIssueForBind = async () => {
        try {
            const response = await fetch(`${url}/api/get-master-issue-active`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            if (!response.ok) {
                throw new Error('Request failed');
            }

            const data = await response.json();
            if (response.status === 200) {
                if (data.length > 0) {
                    setIssueBind(data)
                }
            }
        } catch (error) {

        }
    };
    useEffect(() => {
        getIssueForBind()
    }, [])

    function MyVerticallyCenteredModal(props) {
        const [subIssue, setSubIssue] = useState('')
        const [status, setStatus] = useState('')
        const [subIssueId, setSubIssueid] = useState('')
        const [validRemark, setValidRemark] = useState(false)
        const [validSelect, setValidSelect] = useState(false)
        const [validStatus, setValidStatus] = useState(false)
        const [modalData, setModalData] = useState([])
        const [idIssue, setIdIssue] = useState('')

        const handleSubIssue = (e) => {
            e.preventDefault()
            let subiss = e.target.value.split('-')
            setSubIssueid(subiss[0])
            setValidSelect(false)
            const subissue = subiss[1]
            const belongsTo = props.issu
            const getDataSubIssue = async () => {
                try {
                    const response = await fetch(`${url}/api/get-master-sub-issue`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }, body: JSON.stringify({ belongsTo, subissue })
                    });

                    if (!response.ok) {
                        throw new Error('Request failed');
                    }

                    const data = await response.json();
                    if (response.status === 200) {
                        // setSubiss(data[0])
                        setStatus(data[0].status)
                        setSubIssue(data[0].subissue)
                    }
                } catch (error) {

                }
            }
            getDataSubIssue()
        }

        const handleIssue = (e) => {
            e.preventDefault()
            setValidRemark(false)
            setSubIssue(e.target.value)

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
                            throw new Error('Request failed');
                        }

                        const data = await response.json();
                        if (response.status === 200) {
                            setModalData(data.subIssue)
                            console.log(data);
                            setIdIssue(data._id)
                        }
                    } catch (error) {

                    }
                }
                getData()
            }
        }, [])


        const handleUpdate = async (e, id) => {
            e.preventDefault()
            if (!subIssueId) {
                setValidSelect(true)
                return false
            } else if (!subIssue) {
                setValidRemark(true)
                return false
            } else if (!status) {
                setValidStatus(true)
                return false
            } else {
                try {

                    const id = idIssue
                    const response = await fetch(`${url}/api/update-master-sub-issue`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        }, body: JSON.stringify({ id, status, subIssue, subIssueId })
                    });

                    if (!response.ok) {
                        throw new Error('Request failed');
                    }

                    const data = await response.json();
                    if (response.status === 200) {
                        toast.success("Issue Updated!")
                        props.onHide()
                        getIssue()
                    }
                } catch (error) {

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
                                >
                                    Request Type :
                                </label>
                            </div>

                            <div className="col-md-6">
                                <select
                                    name="status"
                                    id="validationCustom01"
                                    onChange={handleSubIssue}
                                    className="form-control form-control-sm"
                                >
                                    <option value="">Select</option>
                                    {modalData ? modalData.map((el) => {
                                        return <option value={el._id + "-" + el.subissue} key={el._id}>{el.subissue}</option>
                                    }) : null}

                                </select>
                                {validSelect ? <span className='text-danger'>*Required</span> : null}
                            </div>
                        </div>

                        <div className=" form-group row">
                            <div className="col-md-4">
                                <label
                                    htmlFor="validationCustom01"
                                // style={{ fontSize: "12.4px" }}
                                >
                                    Update Request Type :
                                </label>
                            </div>

                            <div className="col-md-6">
                                <input onChange={handleIssue} value={subIssue} className='form-control form-control-sm'></input>
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
                                    onChange={(e) => (setStatus(e.target.value), setValidStatus(false))}
                                    value={status}
                                    className="form-control form-control-sm"
                                >
                                    <option value="">Select</option>
                                    <option>active</option>
                                    <option>inactive</option>

                                </select>
                                {validStatus ? <span className='text-danger'>*Required</span> : null}
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
                                        <h5 className="card-title">Request Type Master</h5>
                                        <MyVerticallyCenteredModal
                                            show={modalShow}
                                            ids={getids}
                                            issu={getIss}
                                            onHide={() => setModalShow(false)}
                                        />
                                        <br />
                                        <hr />
                                        <form onSubmit={handleSubmit(onSubmit)}>

                                            <div className="row">
                                                <div className="col-sm-5">
                                                    {/* text input */}
                                                    <div className="form-group">
                                                        <label style={{ fontSize: ".7rem" }}>
                                                            Belongs To
                                                        </label>
                                                        <select
                                                            style={{ fontSize: ".8rem" }}
                                                            className="form-control form-control-sm"
                                                            {...register(`formdata[0].issue`, {
                                                                required: "Issue is required.",
                                                            })}
                                                            aria-invalid={
                                                                errors.formdata?.[0].issue
                                                                    ? "true"
                                                                    : "false"
                                                            }
                                                        //   onChange={belongsto}
                                                        >
                                                            <option value="">Select Belongs To</option>
                                                            {getIssueBind ? getIssueBind.map((el) => {
                                                                return <option value={el._id} key={el._id}>{el.issue}</option>
                                                            }) : null}
                                                        </select>
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
                                                <div className="col-sm-5">
                                                    {/* textarea */}
                                                    <div className="form-group">
                                                        <label style={{ fontSize: ".7rem" }}>
                                                            Request Type
                                                        </label>
                                                        <input
                                                            style={{ fontSize: ".8rem" }}
                                                            type="text"
                                                            className="form-control form-control-sm form-control-border"
                                                            id="exampleInputBorder"
                                                            placeholder="Sub Issue"
                                                            {...register(`formdata[0].subissue`, {
                                                                required: "sub issue is required.",
                                                            })}
                                                            aria-invalid={
                                                                errors.subissue ? "true" : "false"
                                                            }
                                                        />
                                                        <ErrorMessage
                                                            errors={errors}
                                                            name="formdata[0].subissue"
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
                                                    Add Request Type
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
                                                // columnGroupingModel={columnGroupingModel}
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

export default SubIssueMaster;
