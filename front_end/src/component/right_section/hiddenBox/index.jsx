import React from 'react';
import './style.css'
import axios from 'axios';
import CityBox from './cityBox';
import GuBox from './guBox';
import DongBox from './dongBox';
// import { Container, Row, Col } from "react-bootstrap";

axios.default.withCredentials = true;

export default class HiddenBox extends React.Component {
    constructor(props){
        super(props);
        this.getgu = this.getgu.bind(this);
        this.getdong = this.getdong.bind(this);
    }
    
    getgu = (e) => {
        document.querySelector('.wrap-loading').setAttribute('class', 'wrap-loading');
        axios.post('http://terajoo.tk:3001/api/get_guname',
            {_cityname: e.target.innerText}, { withCredentials: true }
        )
        .then(response => {
            document.querySelector('.wrap-loading').setAttribute('class', 'wrap-loading display-none');
            this.props.setCity(e.target.innerText, response.data.list);
        })
        .catch(error => {
            console.log(error);
        })
    }

    getdong = (e) => {
        document.querySelector('.wrap-loading').setAttribute('class', 'wrap-loading');
        axios.post('http://terajoo.tk:3001/api/get_dongname',
            {_guname: e.target.innerText}, { withCredentials: true }
        )
        .then(response => {
            document.querySelector('.wrap-loading').setAttribute('class', 'wrap-loading display-none');
            this.props.setGu(e.target.innerText, response.data.list, response.data.codelist);
        })
        .catch(error => {
            console.log(error);
        })
    }
    render() {
        return (
            <div className="bottom_hidden_box">
                <ul className="area_block">
                    <CityBox citylist={this.props.prop.citylist} getgu={this.getgu} />
                    <GuBox gulist={this.props.prop.gulist} getdong={this.getdong} />
                    <DongBox donglist={this.props.prop.donglist} codelist={this.props.prop.codelist} setdong={this.props.setDong}/>
                </ul>
                <a href="#none" className="btn_selected gray" id="btn_selected_id">선택완료</a>
            </div>
        )
    }
}