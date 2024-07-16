import styled from "styled-components";
import "./App.css";
import Form from "./components/Form";

function App() {
  return (
    <WrapperForm>
      <Form />
    </WrapperForm>
  );
}

export default App;

const WrapperForm = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f4f6f8;
`;
