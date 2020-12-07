import React, { useState, useEffect } from 'react';
import Left_section from '../../component/left_section';
import Right_section from '../../component/right_section';
import Header from '../../component/header';
import './style.css';
import { connect } from 'react-redux';
import {loginSession} from '../../actions/state'
import axios from 'axios';
import {getHost} from '../../lib/host';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.id = (this.props.maps) ? this.props.maps[5] : 0
    }
    componentDidMount() {
        axios.get(getHost()+"/auth/session", 
        { withCredentials: true })
        .then((res) => {
            console.log(res);
            if (res.data.success === true) {
                this.props.setSession(res.data.data);
            } 
            // 회원가입 했으니까 로그인 화면으로 가기
        })
        .catch((err) => {
            console.log('no id');
        });
    }

    render() {
        return (
            <div id="home_body">
                <Header></Header>
                <Left_section></Left_section>
                <Right_section></Right_section>
                
            </div>
        );
    }
};

const mapStateToProps = state => {
    return {
        id: state.maps
    }
}
const mapDispatchToProps = dispatch => {
    return {
        setSession: function(session) {
            dispatch(loginSession(session));
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Home);
