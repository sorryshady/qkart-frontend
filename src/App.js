import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import { Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";
import Checkout from "./components/Checkout"
import Thanks from "./components/Thanks"

 export const config = {
  endpoint: 'https://qkart-frontend-c53l.onrender.com',
};
function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={Products} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/thanks" component={Thanks} />
      </Switch>
      {/* TODO: CRIO_TASK_MODULE_LOGIN - To add configure routes and their mapping */}
    </div>
  );
}

export default App;
