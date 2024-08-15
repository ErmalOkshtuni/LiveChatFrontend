import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axiosInstance from "../api/Axios";
import { Link } from "react-router-dom";
const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[.!@#$%]).{8,24}$/;
const REGISTER_URL = '/Auth/register';

const Register = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [Name, setName] = useState('');

    const [LastName, setLastName] = useState('');

    const [Username, setUsername] = useState('');
    const [validUsername, setValidUsername] = useState(false);
    const [UsernameFocus, setUsernameFocus] = useState(false);

    const [Password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [PasswordFocus, setPasswordFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidUsername(USER_REGEX.test(Username));
    }, [Username])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(Password));
    }, [Password])

    useEffect(() => {
        setErrMsg('');
    }, [Username, Password])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const v1 = USER_REGEX.test(Username);
        const v2 = PWD_REGEX.test(Password);
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            const response = await axiosInstance.post(REGISTER_URL,
                JSON.stringify({ Username, Password, Name, LastName }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(response);
            setSuccess(true);
            setName('');
            setLastName('');
            setUsername('');
            setPassword('');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Registration Failed')
            }
            errRef.current.focus();
        }
    }

    return (
              <section>
                  <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                  <h1>Register</h1>
                  <form onSubmit={handleSubmit}>
                    <label htmlFor="Name">
                          Name:
                      </label>
                      <input
                          type="text"
                          id="Name"
                          ref={userRef}
                          autoComplete="off"
                          onChange={(e) => setName(e.target.value)}
                          value={Name}
                          required
                      />
                      <label htmlFor="LastName">
                          Last Name:
                      </label>
                      <input
                          type="text"
                          id="LastName"
                          ref={userRef}
                          autoComplete="off"
                          onChange={(e) => setLastName(e.target.value)}
                          value={LastName}
                          required
                      />
                      <label htmlFor="username">
                          Username:
                          <FontAwesomeIcon icon={faCheck} className={validUsername ? "valid" : "hide"} />
                          <FontAwesomeIcon icon={faTimes} className={validUsername || !Username ? "hide" : "invalid"} />
                      </label>
                      <input
                          type="text"
                          id="username"
                          ref={userRef}
                          autoComplete="off"
                          onChange={(e) => setUsername(e.target.value)}
                          value={Username}
                          required
                          aria-invalid={validUsername ? "false" : "true"}
                          aria-describedby="uidnote"
                          onFocus={() => setUsernameFocus(true)}
                          onBlur={() => setUsernameFocus(false)}
                      />
                      <p id="uidnote" className={UsernameFocus && Username && !validUsername ? "instructions" : "offscreen"}>
                          <FontAwesomeIcon icon={faInfoCircle} />
                          4 to 24 characters.<br />
                          Must begin with a letter.<br />
                          Letters, numbers, underscores, hyphens allowed.
                      </p>
                      <label htmlFor="password">
                          Password:
                          <FontAwesomeIcon icon={faCheck} className={validPassword ? "valid" : "hide"} />
                          <FontAwesomeIcon icon={faTimes} className={validPassword || !Password ? "hide" : "invalid"} />
                      </label>
                      <input
                          type="password"
                          id="password"
                          onChange={(e) => setPassword(e.target.value)}
                          value={Password}
                          required
                          aria-invalid={validPassword ? "false" : "true"}
                          aria-describedby="pwdnote"
                          onFocus={() => setPasswordFocus(true)}
                          onBlur={() => setPasswordFocus(false)}
                      />
                      <p id="pwdnote" className={PasswordFocus && !validPassword ? "instructions" : "offscreen"}>
                          <FontAwesomeIcon icon={faInfoCircle} />
                          8 to 24 characters.<br />
                          Must include uppercase and lowercase letters, a number and a special character.<br />
                          Allowed special characters: <span aria-label="period">.</span> <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                      </p>
                      <button disabled={!validUsername || !validPassword  ? true : false}>Sign Up</button>
                  </form>
                  <p>
                      Already registered?<br />
                      <span className="line">
                          <Link to="/login">Sign in</Link>
                      </span>
                  </p>
              </section>
            )
      }

export default Register