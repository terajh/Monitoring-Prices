import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import {connect} from 'react-redux'
import './style.css';
import {logoutSession, setLike, loginSession, setModal, toggleMain} from '../../actions/state';
import axios from 'axios';
import LoginForm from './login_form';
import {getHost} from '../../lib/host';

axios.default.withCredentials = true;

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: '',
            nickname:''
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.gotoSignup = this.gotoSignup.bind(this);
        this.logout = this.logout.bind(this);
        this.showProfiles = this.showProfiles.bind(this);
    }
    openModal = (e) => {
        if(this.props.id[5] === 0) {
            e.preventDefault();
            this.setState({
                isModalOpen: 'signin'
            });
            this.props.setModal('signin');
        }
        else {
            e.preventDefault();
        }
    };

    closeModal = () => {
        this.setState({
            isModalOpen: ''
        });
        this.props.setModal('');
    };
    gotoSignup = (e = []) => {
        if (e.length !== 0) {
            e.preventDefault();
        }
        this.setState({
            isModalOpen: 'signup'
        });
        this.props.setModal('signup');
    }

    logout = e => {
        e.preventDefault();
        axios.get(getHost()+'/auth/logout', { withCredentials: true })
        .then(res => {
            if(res.data.success === true) {
                this.props.logout();
                this.setState({
                    isModalOpen:''
                })
                window.location.href='/';
            }else{
                alert('로그아웃 에러');
            }
        })
        .catch(err => {
            console.log(err);
        })
    }

    showProfiles = (e) => {
        e.preventDefault();        
        document.querySelector('.wrap-loading').setAttribute('class', 'wrap-loading');

        axios.get(getHost()+'/api/getLike', { withCredentials: true })
        .then(res => {
            if(res.data.success === true) {
            document.querySelector('.wrap-loading').setAttribute('class', 'wrap-loading display-none');

                this.setState({
                    isModalOpen:'profile'
                });
                this.props.setLike(res.data.pnu);
                this.props.toggleMain(0);
                this.props.setModal('profile');
            }else{
            }
        })
        .catch(err => {
            console.log(err);
        })
    }
    render() {
        return (
            <header>
                <Navbar id="nav" variant="dark">
                    <Navbar.Brand href="/">
                        <svg width="40px" height="40px" viewBox="0 0 16 16" className="bi bi-building" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M14.763.075A.5.5 0 0 1 15 .5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .342-.474L6 7.64V4.5a.5.5 0 0 1 .276-.447l8-4a.5.5 0 0 1 .487.022zM6 8.694L1 10.36V15h5V8.694zM7 15h2v-1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V15h2V1.309l-7 3.5V15z" />
                            <path d="M2 11h1v1H2v-1zm2 0h1v1H4v-1zm-2 2h1v1H2v-1zm2 0h1v1H4v-1zm4-4h1v1H8V9zm2 0h1v1h-1V9zm-2 2h1v1H8v-1zm2 0h1v1h-1v-1zm2-2h1v1h-1V9zm0 2h1v1h-1v-1zM8 7h1v1H8V7zm2 0h1v1h-1V7zm2 0h1v1h-1V7zM8 5h1v1H8V5zm2 0h1v1h-1V5zm2 0h1v1h-1V5zm0-2h1v1h-1V3z" />
                        </svg>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto" style={{'color':'white'}}>
                            {(this.props.id[5] == 0) ? null : this.props.id[5] + '님 안녕하세요'}
                        </Nav>
                        <Nav>
                            {(this.props.id[5] == 0) ? 
                                <Nav.Link href="/" onClick={this.openModal}>
                                    <svg width="30" height="30" viewBox="0 0 16 16" className="nav_icon bi bi-power" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M5.578 4.437a5 5 0 1 0 4.922.044l.5-.866a6 6 0 1 1-5.908-.053l.486.875z"/>
                                        <path fillRule="evenodd" d="M7.5 8V1h1v7h-1z"/>
                                    </svg>
                                    <span className="nav_text">로그인</span>
                                </Nav.Link> 
                                :<>
                                    <Nav.Link href="/" onClick={this.showProfiles}>
                                        <svg width="30" height="30" viewBox="0 0 16 16" className="nav_icon bi bi-person-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                                            <path fillRule="evenodd" d="M2 15v-1c0-1 1-4 6-4s6 3 6 4v1H2zm6-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                                        </svg> 
                                        <span className="nav_text">찜목록</span>
                                    </Nav.Link>
                                    <Nav.Link href="/" onClick={this.logout}>
                                        <svg width="30" height="30" viewBox="0 0 16 16" className="nav_icon bi bi-power" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M5.578 4.437a5 5 0 1 0 4.922.044l.5-.866a6 6 0 1 1-5.908-.053l.486.875z"/>
                                            <path fillRule="evenodd" d="M7.5 8V1h1v7h-1z"/>
                                        </svg>
                                        <span className="nav_text">로그아웃</span>
                                    </Nav.Link>
                                </>
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <LoginForm isOpen={this.props.id} close={this.closeModal} gotoSignup={this.gotoSignup} gotoSignin={this.openModal} />
            </header>
        );
    }
}

const mapStateToProps = state => {
    return {
        id:state.maps
    }
}
const mapDispatchToProps = dispatch => {
    return {
        logout: function(){
            dispatch(logoutSession());
        },
        setLike : function(list){
            dispatch(setLike(list));
        },
        setSession: function(session) {
            dispatch(loginSession(session));
        },
        setModal: function(mode){
            dispatch(setModal(mode));
        },toggleMain: function (a) {
            dispatch(toggleMain(a))
          }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);