import { useState } from "react";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import Input from "../../ui/Input";
import FormRowVertical from "../../ui/FormRowVertical";
import { useLogin } from "./useLogin";
import SpinnerMini from "../../ui/SpinnerMini";
// import FormRow from "../../ui/FormRow";
// import { useSignup } from "./useSignup";
// import { useNavigate } from "react-router-dom";
// import Users from "../../pages/Users";
// import { Route } from "react-router-dom";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useLogin();
  // const { isLoading: isSignup } = useSignup();

  // const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) return;

    login(
      { email, password },
      {
        onSettled: () => {
          setEmail("");
          setPassword("");
        },
      }
    );
  }

  // function handleCreateAccount(e) {
  //   // e.preventDefault();
  //   navigate("/createAccount");
  // }

  return (
    <Form onSubmit={handleSubmit}>
      <FormRowVertical label="Email address">
        <Input
          type="email"
          id="email"
          // This makes this form better for password managers
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </FormRowVertical>

      <FormRowVertical label="Password">
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
      </FormRowVertical>
      <FormRowVertical>
        <Button size="large" disabled={isLoading}>
          {!isLoading ? "Login" : <SpinnerMini />}
        </Button>
      </FormRowVertical>
      {/* <FormRow></FormRow>
      <FormRow>
        <Button
          size="medium"
          disabled={isSignup}
          style={{ marginRight: "25px" }}
          onClick={handleCreateAccount}
        >
          Create account
        </Button>
        <Button
          size="medium"
          disabled={isLoading}
          style={{ marginRight: "25px" }}
        >
          Login as staff
        </Button>
      </FormRow> */}
    </Form>
  );
}

export default LoginForm;
