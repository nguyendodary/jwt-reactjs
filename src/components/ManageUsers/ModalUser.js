import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react';
import { createNewUser, updateCurrentUser } from '../../services/userService';
import { toast } from 'react-toastify';

const ModalUser = ({ action, dataModalUser, show, onHide }) => {
    const defaultUserData = {
        email: "",
        phone: "",
        username: "",
        password: "",
        address: "",
        sex: "Male",
        group: "Customer"
    };

    const validInputsDefault = {
        email: true,
        phone: true,
        username: true,
        password: true,
        address: true,
        sex: true,
        group: true
    };

    const [userData, setUserData] = useState(defaultUserData);
    const [validInputs, setValidInputs] = useState(validInputsDefault);

    const groupOptions = [
        { id: "Dev", name: "Dev" },
        { id: "Customer", name: "Customer" },
        { id: "Leader", name: "Leader" }
    ];

    const handleCloseModal = () => {
        setUserData(defaultUserData);
        setValidInputs(validInputsDefault);
        onHide();
    };

    useEffect(() => {
        if (show) {
            if (action === "CREATE") {
                setUserData(defaultUserData);
            } else if (action === "UPDATE" && dataModalUser) {
                setUserData({
                    email: dataModalUser.email || "",
                    phone: dataModalUser.phone || "",
                    username: dataModalUser.username || "",
                    password: "",
                    address: dataModalUser.address || "",
                    sex: dataModalUser.sex || "Male",
                    group: dataModalUser.Group?.name || "Customer"
                });
            }
        }
    }, [show, action, dataModalUser]);

    const handleOnChangeInput = (value, name) => {
        setUserData(prev => ({ ...prev, [name]: value }));
        setValidInputs(prev => ({ ...prev, [name]: true }));
    };

    const checkValidateInputs = () => {
        let arr = ["email", "phone", "group"];
        if (action === "CREATE") arr.push("password");

        let check = true;
        let _validInputs = { ...validInputsDefault };

        for (let field of arr) {
            if (!userData[field]) {
                _validInputs[field] = false;
                toast.error(`Empty input ${field}`);
                check = false;
            }
        }
        setValidInputs(_validInputs);
        return check;
    };

    const groupIdMap = {
        "Dev": 1,
        "Customer": 2,
        "Leader": 3
    };

    const handleConfirmUser = async () => {
        if (!checkValidateInputs()) return;

        try {
            let payload = {
                id: dataModalUser.id,
                email: userData.email,
                phone: userData.phone,
                username: userData.username,
                address: userData.address,
                sex: userData.sex,
                groupId: groupIdMap[userData.group]
            };

            let res = await updateCurrentUser(payload);

            if (res?.EC === 0 || res?.EC === "0") {
                toast.success(res.EM);
                handleCloseModal();
            } else {
                toast.error(res.EM);
                if (res?.DT === "email") {
                    setValidInputs(prev => ({ ...prev, email: false }));
                }
                if (res?.DT === "phone") {
                    setValidInputs(prev => ({ ...prev, phone: false }));
                }
            }
        } catch (err) {
            console.error(err);
            toast.error("Server error");
        }
    };

    return (
        <Modal size="lg" show={show} className='modal-user' onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {action === "CREATE" ? "Create new user" : "Edit user"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='content-body row'>
                    <div className='col-12 col-sm-6 form-group'>
                        <label>Email (<span className='red'>*</span>):</label>
                        <input
                            disabled={action !== "CREATE"}
                            className={validInputs.email ? 'form-control' : "form-control is-invalid"}
                            type='email'
                            value={userData.email}
                            onChange={(e) => handleOnChangeInput(e.target.value, "email")}
                        />
                    </div>
                    <div className='col-12 col-sm-6 form-group'>
                        <label>Phone number (<span className='red'>*</span>):</label>
                        <input
                            className={validInputs.phone ? 'form-control' : "form-control is-invalid"}
                            type='text'
                            value={userData.phone}
                            onChange={(e) => handleOnChangeInput(e.target.value, "phone")}
                        />
                    </div>
                    <div className='col-12 col-sm-6 form-group'>
                        <label>Username:</label>
                        <input
                            className='form-control'
                            type='text'
                            value={userData.username}
                            onChange={(e) => handleOnChangeInput(e.target.value, "username")}
                        />
                    </div>
                    {action === "CREATE" && (
                        <div className='col-12 col-sm-6 form-group'>
                            <label>Password (<span className='red'>*</span>):</label>
                            <input
                                className={validInputs.password ? 'form-control' : "form-control is-invalid"}
                                type='password'
                                value={userData.password}
                                onChange={(e) => handleOnChangeInput(e.target.value, "password")}
                            />
                        </div>
                    )}
                    <div className='col-12 col-sm-12 form-group'>
                        <label>Address:</label>
                        <input
                            className='form-control'
                            type='text'
                            value={userData.address}
                            onChange={(e) => handleOnChangeInput(e.target.value, "address")}
                        />
                    </div>
                    <div className='col-12 col-sm-6 form-group'>
                        <label>Gender:</label>
                        <select
                            className='form-select'
                            value={userData.sex}
                            onChange={(e) => handleOnChangeInput(e.target.value, "sex")}
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>
                    <div className='col-12 col-sm-6 form-group'>
                        <label>Group (<span className='red'>*</span>):</label>
                        <select
                            className={validInputs.group ? 'form-select' : "form-select is-invalid"}
                            value={userData.group}
                            onChange={(e) => handleOnChangeInput(e.target.value, "group")}
                        >
                            {groupOptions.map((g, idx) => (
                                <option key={idx} value={g.name}>{g.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                <Button variant="primary" onClick={handleConfirmUser}>
                    {action === "CREATE" ? "Save" : "Update"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalUser;