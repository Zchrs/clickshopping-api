/* eslint-disable no-unused-vars */
import React from "react";
import { Link, Navigate } from "react-router-dom"
import { useForm } from "../../hooks/useForm";
import { useDispatch } from "react-redux";
import { startLogin } from "../../actions/auth";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import '../../css/login.scss';
import { getFile } from "../../reducers/globalReducer";


const initialForm = {
  email: "",
  password: "",
};

const validationsLogin = (form) => {
  let errors = {};
 let regexEmail = /^(\w+[/./-]?){1,}@[a-z]+[/.]\w{2,}$/;
  let regexPass = /^@[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;

const email = document.getElementById("email");
const pass = document.getElementById("password");

if (!form.email) {
  email.style.cssText = "border: red 1px solid";
  errors.email = "Field email is required";
} else if (!regexEmail.test(form.email.trim())) {
  errors.email = "Email incorrect";
} else {
  email.style.cssText = "border: #34B0BE 1px solid;";
}


if (!form.pass) {
  pass.style.cssText = "border: red 1px solid";
  errors.pass = "Field Password is required";
} 
else if (!regexPass.test(form.pass.trim())) {
  errors.pass = "Password field have must letters and numbers";
} else {
  pass.style.cssText = "border: #34B0BE 1px solid;";
  console.log('entrando al else');
}
if (pass.value !== '') {
  pass.style.cssText = "border: #34B0BE 1px solid;";
  errors.pass = false
}


 return errors;
};

export const Login = () =>{

  
  const dispatch = useDispatch();

  const handleLogin2 = (e) =>{
    e.preventDefault();
    dispatch(startLogin( form.email, form.password ));
    
    loadingActive();

     <Navigate to="/dashboard" />

  }


  const {
    form,
    errors,
    loading,
    loadingActive,
    response,
    handleChange,
    handleBlur,
    handleLogin
  } = useForm(initialForm, validationsLogin);

    return (
      <section className="login">

         <div className='login-left'>
          <div className='login-logo'>
          <img src={getFile('img', `logoPersonal`, 'png')} alt="" />
          </div>
          <div className='login-titles'>
            <div>
              <h2>Welcome</h2>
              <p>Iniciar sesión</p>
            </div>
            <div>
              <h3>¿Not have an account?</h3>
              <Link to={'/auth/register'}>Create account</Link>
            </div>
          </div>
         </div>

         <div className='login-right'>
            <div className="login-form">
              <form onSubmit={handleLogin2}>
                <div>
                  <label htmlFor="email">Email</label>
                  <input type="email" 
                    name="email" 
                    id="email" 
                    value={form.email}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Type your email"
                  />
                  {errors.email && <p className="warnings-form">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="password">Password</label>
                  <input type="password" 
                    name="password" 
                    id="password" 
                    value={form.pass}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    placeholder="Type your password"
                  />
                  {errors.pass && <p className="warnings-form">{errors.pass}</p>}
                </div>
              <div className="button-container">

                <button type="submit">
                  {loading ? <Loader /> : <p>Login</p> }
                </button>
              <Link to={'/'}>Volver al inicio</Link>
              </div>
              </form>
              
            </div>
         </div>

        </section>
    )
}
