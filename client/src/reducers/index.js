import { combineReducers } from "redux";
import alert from "../reducers/alert";
import auth from "./auth";
export default combineReducers({ alert, auth });
