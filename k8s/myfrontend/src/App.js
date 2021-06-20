import logo from './logo.svg';
import './App.css';
import {useState} from "react";
import MyForm from './MyForm';

function App() {

  const [ initialValue, setInitilValue ] = useState(1234);

  const handleInitialValue = (event) => {
    setInitilValue(event.target.value);
  };

  return (
    <div className="App">
      <br/>

      <MyForm noPosts={initialValue} changeParentHandler={setInitilValue} />
    </div>
  );
}

export default App;
