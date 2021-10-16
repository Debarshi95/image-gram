import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import * as ROUTES from '../../constant/routes';
import './index.css';
import { auth, checkUserNameExists, saveUser } from '../../firebase';
import ButtonSubmitting from '../../components/ButtonSubmitting';

function SignUp() {
  const [input, setInput] = React.useState({
    fullname: '',
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const history = useHistory();
  const disabled =
    input.fullname === '' || input.username === '' || input.email === '' || input.password === '';

  const handleInput = (e) => {
    setInput((value) => ({ ...value, [e.target.name]: e.target.value }));
  };

  const setupSignUp = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const usernameExists = await checkUserNameExists(input.username);
      if (usernameExists) {
        setSubmitting(false);
        setError('Username taken. Please try another username');
        setInput({
          ...input,
          password: '',
        });
      } else {
        const newUser = await auth.createUserWithEmailAndPassword(input.email, input.password);

        await newUser.user.updateProfile({ displayName: input.fullname });

        await saveUser(newUser.user.uid, input.username, input.fullname, newUser.user.email);

        history.push(ROUTES.HOME);
      }
    } catch (err) {
      setSubmitting(false);
      setInput({
        ...input,
        password: '',
      });
      setError(err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="signup__root">
        <div className="signup__form">
          <h2>Sign Up</h2>
          <p>Sign up to get started</p>
          <form autoComplete="off" onSubmit={setupSignUp}>
            <input
              type="text"
              name="fullname"
              onChange={handleInput}
              placeholder="Fullname"
              aria-label="Fullname"
              value={input.fullname}
            />
            <input
              type="text"
              name="username"
              onChange={handleInput}
              placeholder="Username"
              aria-label="Username"
              value={input.username}
            />
            <input
              type="email"
              name="email"
              onChange={handleInput}
              placeholder="Email"
              aria-label="Email"
              value={input.email}
            />
            <input
              type="password"
              name="password"
              onChange={handleInput}
              placeholder="Password"
              aria-label="Password"
              value={input.password}
            />
            <ButtonSubmitting
              submitting={submitting}
              disabled={disabled}
              text="Sign up"
              handler={setupSignUp}
            />
          </form>
          {error && <p className="signup__error">{error}</p>}
          <p>
            Have an account?
            <Link to={ROUTES.SIGN_IN}>Sign in</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default SignUp;
