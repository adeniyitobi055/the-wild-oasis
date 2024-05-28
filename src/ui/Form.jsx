import styled, { css } from "styled-components";

const Form = styled.form`
  ${(props) =>
    props.type === "regular" &&
    css`
      padding: 2.4rem 4rem;

      /* Box */
      background-color: var(--color-grey-0);
      /* background-color: red; */
      border: 1px solid var(--color-grey-100);
      border-radius: var(--border-radius-md);
      margin: auto;
    `}

  ${(props) =>
    props.type === "modal" &&
    css`
      width: 80rem;
    `}
    
  overflow: hidden;
  font-size: 1.4rem;

  /* &:has(button) {
    padding-right: 2rem;
  } */
`;

Form.defaultProps = {
  type: "regular",
};

export default Form;
