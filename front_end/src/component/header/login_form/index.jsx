import React from "react";
import { Link } from "react-router-dom";
import "./style.css";
import axios from 'axios';
import { connect } from 'react-redux';
import { loginSession, toggleMain, setModal, updateLoc, gotoProfile} from '../../../actions/state';
import { InputGroup, FormControl, Card, Jumbotron } from 'react-bootstrap'
import {getHost} from '../../../lib/host';
axios.default.withCredentials = true;

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      address: "",
      name: "",
      nickname: "",
      toggle: ""
    };
    this.loginClickHandler = this.loginClickHandler.bind(this);
    this.inputHandler = this.inputHandler.bind(this);
    this.getContent = this.getContent.bind(this);
  }
  componentDidMount() {
    if (this.props.list[9] == 'profile') {
      this.props.toggleMain();
      
    }
  }

  inputHandler = (e = []) => {
    e.preventDefault();
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  loginClickHandler = () => {

    const { email, password } = this.state;
    axios.post(getHost()+"/auth/signin", {
      email: email,
      password: password
    }, { withCredentials: true })
      .then((res) => {
        if (res.data.success === false) {
          alert('로그인에 실패했습니다. 다시 시도해 주세요');
          this.setState({
		  email:'',
		  password:''
		 });
	  this.props.setModal('');
        } else {
          alert('로그인 성공');
          this.props.setSession(res.data.nickname);
          this.props.setModal('');
        }
      })
      .catch((err) => {
        alert('로그인에 실패했습니다. 다시 시도해 주세요');
        this.setState({
		email:'',
		password:''
	});
	this.props.setModal('');
      })
  };

  signupClickHandler = () => {
    document.querySelector('.wrap-loading').setAttribute('class', 'wrap-loading');
    const { email, password, address, name, nickname } = this.state;
    axios.post(getHost()+"/auth/signup", {
      email: email,
      password: password,
      address: address,
      name: name,
      nickname: nickname
    }, { withCredentials: true })
      .then((res) => {
        document.querySelector('.wrap-loading').setAttribute('class', 'wrap-loading display-none');
        if (res.data.success === false) {
          alert(res.data.message);
          this.props.close();
          this.props.setModal('');
        } else {
          alert('회원가입 완료되었습니다.')
          this.props.gotoSignin();
        }
        // 회원가입 했으니까 로그인 화면으로 가기
      })
      .catch((err) => {
        console.log(err)
      });
  };

  toggleTwo = e => {
    e.preventDefault();
    this.props.setModal('');
    this.props.gotoProfile(1,e.target.attributes[2].value);
  }

  getContent = () => {
    if (this.props.list[9] == 'signin') {
      return (
        <div className="modal" style={{ 'display': 'block' }}>
          <div>
            <div className="loginModal">
              <span className="close" onClick={this.props.close} style={{ "cursor": "pointer" }}>
                &times;
              </span>
              <div className="modalContents" style={{ 'marginTop': 90 + 'px' }}>
                <input
                  name="email"
                  className="loginId"
                  type="text"
                  placeholder="아이디"
	          value={this.state.email}
                  onChange={this.inputHandler}
                />
                <input
                  name="password"
                  className="loginPw"
                  type="password"
                  placeholder="비밀번호"
	      	  value={this.state.password}
                  onChange={this.inputHandler}
                />
                <button className="loginBtn" onClick={this.loginClickHandler}>
                  {" "}
                      로그인{" "}
                </button>
                <div className="loginEnd">
                  <div className="loginLine">
                    회원이 아니신가요? <Link to='/' onClick={this.props.gotoSignup}>회원가입</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
    else if (this.props.list[9] == 'signup') {
      return (
        <div className="modal" style={{ 'display': 'block' }}>
          <div>
            <div className="loginModal">
              <span className="close" onClick={this.props.close} style={{ "cursor": "pointer" }}>
                &times;
                        </span>
              <div className="modalContents">
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon1">아이디</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    className="loginId"
                    placeholder="아이디"
                    name="email"
                    aria-label="Userid"
                    aria-describedby="basic-addon1"
                    onChange={this.inputHandler}
                  />
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon1">비밀번호</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    className="loginPw"
                    placeholder="password"
                    name="password"
                    type="password"
                    aria-label="password"
                    aria-describedby="basic-addon1"
                    onChange={this.inputHandler}
                  />
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon1">이름</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    className="loginId"
                    placeholder="이름"
                    name="name"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    onChange={this.inputHandler}
                  />
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon1">닉네임</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    className="loginId"
                    placeholder="이름"
                    name="nickname"
                    aria-label="nickname"
                    aria-describedby="basic-addon1"
                    onChange={this.inputHandler}
                  />
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon1">이메일</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    className="loginId"
                    placeholder="이메일"
                    aria-label="email"
                    name="address"
                    aria-describedby="basic-addon1"
                    onChange={this.inputHandler}
                  />
                </InputGroup>
                <button className="loginBtn" onClick={this.signupClickHandler}>
                  {" "}
                    회원가입{" "}
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    } else if (this.props.list[9] == 'profile') {
      var _list = this.props.list[8].filter((x) => x.user === this.props.list[5]);
      return (
        <div className="modal" style={{ 'display': 'block' }}>
          <div>
            <Jumbotron className="listModal">
              <span className="close" onClick={this.props.close} style={{ "cursor": "pointer" }}>
                &times;
                      </span>
              <h1>찜 목록 리스트</h1>
              <p>
                찜 목록 리스트입니다. 원하는 목록을 클릭해 가격을 확인해보세요.
                      </p>
              {_list.map((item, i) => {
                return (
                  <Card className="card_bodys" key={i} style={{ width: '18rem' }}>
                    <Card.Body>
                      <Card.Title>{item._name}</Card.Title>
                      <Card.Text>
                        {item.address}
                      </Card.Text>
                      <Card.Link href="#" value={item.pnu} onClick={this.toggleTwo}>확인하기</Card.Link>
                    </Card.Body>
                  </Card>
                )
              })}

            </Jumbotron>
          </div>
        </div>
      )


      
    } else {
      return null;
    }
  }
  render() { //아까 버튼에서 props로 가져온것
    return (
      <>
        {this.getContent()}
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    list: state.maps
  }
}
const mapDispatchToProps = dispatch => {
  return {
    updateLoc: function (pnu) {
      dispatch(updateLoc(pnu));
    },
    setSession: function (session) {
      dispatch(loginSession(session));
    },
    toggleMain: function (a) {
      dispatch(toggleMain(a))
    },
    setModal: function(mode){
        dispatch(setModal(mode));
    },
    gotoProfile: function(mod, pnu){
      dispatch(gotoProfile(mod, pnu));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
