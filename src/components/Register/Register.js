import "./Register.scss";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { registerNewUser } from "../../services/userService";
const Register = (props) => {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const defaultValidInput = {
        isValidEmail: true,
        isValidPhone: true,
        isValidUsername: true,
        isValidPassword: true,
        isValidConfirmPassword: true
    }
    const [objectCheckInput, setObjectCheckInput] = useState(defaultValidInput);

    let history = useHistory();
    const handleLogin = () => {
        history.push("/login");
    }

    useEffect(() => {
        // axios.get("http://localhost:8080/api/v1/test-api")
        //     .then(data => {
        //         console.log("Check data axios: ", data);
        //     })



    }, []);

    const isValidInput = () => {
        setObjectCheckInput(defaultValidInput);
        if (!email) {
            toast.error("Email is required");
            setObjectCheckInput({ ...defaultValidInput, isValidEmail: false });
            return false;
        }

        let regx = /\S+@\S+\.\S+/;
        if (!regx.test(email)) {
            setObjectCheckInput({ ...defaultValidInput, isValidEmail: false });
            toast.error("Please enter a correct email!");
            return false;
        }

        else if (!phone) {
            toast.error("Phone number is required");
            setObjectCheckInput({ ...defaultValidInput, isValidPhone: false });
            return false;
        }
        else if (!username) {
            toast.error("Username is required");
            setObjectCheckInput({ ...defaultValidInput, isValidUsername: false });
            return false;
        }
        else if (!password) {
            toast.error("Password is required");
            setObjectCheckInput({ ...defaultValidInput, isValidPassword: false });
            return false;
        }
        else if (password != confirmPassword) {
            toast.error("Passwords are not the same");
            setObjectCheckInput({ ...defaultValidInput, isValidConfirmPassword: false });
            return false;
        }

        return true;

    }


    const handleRegister = async () => {
        let check = isValidInput();

        if (check === true) {
            let response = await registerNewUser(email, phone, username, password);
            let serverData = response.data;
            if (+serverData.EC === 0) {
                toast.success(serverData.EM);
                history.push("/login");
            } else {
                toast.error(serverData.EM);
            }
        }

    }

    return (
        <div className="register-container">
            <div className="container">
                <div className="row px-3 px-sm-0">
                    <div className="content-left col-12 d-none col-sm-7 d-sm-block">
                        <div className="brand">
                            Nguyen Do <br />
                        </div>
                        <div className="detail">
                            Let's study together!
                        </div>
                    </div>
                    <div className="content-right col-12 col-sm-5 green d-flex flex-column gap-3 py-3">
                        <div className="brand d-sm-none">
                            Nguyen Do
                        </div>
                        <input type="text" className={objectCheckInput.isValidEmail ? "form-control" : "form-control is-invalid"} placeholder="Email"
                            value={email} onChange={(event) => setEmail(event.target.value)}
                        />
                        <input type="text" className={objectCheckInput.isValidPhone ? "form-control" : "form-control is-invalid"} placeholder="Phone number"
                            value={phone} onChange={(event) => setPhone(event.target.value)}
                        />
                        <input type="text" className={objectCheckInput.isValidUsername ? "form-control" : "form-control is-invalid"} placeholder="Username"
                            value={username} onChange={(event) => setUsername(event.target.value)}
                        />
                        <input type="password" className={objectCheckInput.isValidPassword ? "form-control" : "form-control is-invalid"} placeholder="Password"
                            value={password} onChange={(event) => setPassword(event.target.value)}
                        />
                        <input type="password" className={objectCheckInput.isValidConfirmPassword ? "form-control" : "form-control is-invalid"} placeholder="Confirm password"
                            value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)}
                        />
                        <button className="btn btn-primary" onClick={() => handleRegister()}>Register</button>
                        <hr />
                        <div className="text-center">
                            <button className="btn btn-success" onClick={() => handleLogin()}>
                                Account already exists?
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;