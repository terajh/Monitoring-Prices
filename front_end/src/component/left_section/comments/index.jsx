import React from 'react';
import './style.css'
import axios from 'axios';
import {connect} from 'react-redux';
import {InputGroup, Button, FormControl} from 'react-bootstrap';
import {updateDescriptionLists} from '../../../actions/state';
import {getHost} from '../../../lib/host';

class Comments extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            description_list : this.props.pnu[7],
            description: '',
            nickname : this.props.pnu[5],
            pnu: this.props.pnu[3]
        }
        this.commentSave = this.commentSave.bind(this);
    }

    componentDidMount() {
        if(this.state.nickname !== this.props.pnu[5]) {
            this.setState({
                nickname:this.props.pnu[5],
                pnu : this.props.pnu[3],
                description_list : this.props.pnu[7]
            })
        }
    }

    inputChange = (e) => {
        this.setState({
            description : e.target.value
        });
    }

    commentSave = () => {
        let today = new Date();
        if(this.props.pnu[5] === 0){
            alert('로그인이 필요 합니다.');
            this.setState({
                description:''
            });
            return;
        }
        else{
            axios.put(getHost()+'/api/input_comment', 
                {
                    description : this.state.description,
                    pnu : this.state.pnu,
                    nickname : this.state.nickname,
                    dt : today.toLocaleString()
                },
                { withCredentials: true })
            .then(res => {
                if(res.data.success === false) {
                    alert('댓글을 다시 입력해주세요');
                }else{
                    alert('댓글 입력 성공');
                    this.props.updateDescriptionLists(this.state.nickname, today.toLocaleString(), this.state.description);

                }
            })

                    
            .catch(err => {
                console.log(err);
            })
        }
    }

    removeComment = (e) => {
        console.log('remove click',e);
        var id = e.target.attributes['2'].value;
        var dt = e.target.attributes['1'].value

        axios.post(getHost()+'/api/remove_comment', 
        {
            nickname : id,
            dt : dt
        },
        { withCredentials: true })
        .then(res => {
            if(res.data.success === false) {
                alert('댓글 삭제 실패');
            }else{
                alert('댓글 삭제 성공');
                e.target.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode);
            }
        })
    }

    render() {
        var des_list = this.props.pnu[7];
        return (
            <div id="comments_block">
                <InputGroup className="mb-3" style={{'height':10+'%', 'marginTop':2+'px'}}>
                        <InputGroup.Text id="basic-addon1">댓글</InputGroup.Text>
                        <FormControl
                            placeholder="댓글을 입력하세요"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            onChange={this.inputChange}
                            value={this.state.description}
                        />
                        <Button id="comment_button" variant="outline-secondary" onClick={this.commentSave}>Button</Button>
                </InputGroup>
                <div id="comment_des" style={{'height':80+"%"}}>
                    <ol id="comment_list">
                        {(des_list.length === 0) ? null :des_list.map((item, i) => {
                            return (
                                <li key={i}>
                                    <div className="name time">
                                        <strong>{item.userid}님</strong>
                                        <time style={{ 'float': 'right' }}>{item.dt}</time>
                                    </div>
                                    <div className="comment_content">{item.description} <br /></div>
                                    {(item.userid === this.props.pnu[5]) ? <div className="buttons" style={{'display':'block'}}>
                                        <a className="icon block reply" dt={item.dt} id={item.userid} href="#" onClick={this.removeComment}><span className="ico ico_reply" ></span> 삭제</a>
                                    </div>:<div className="buttons">
                                        <a className="icon block reply" href="#"><span className="ico ico_reply"></span> 삭제</a>
                                    </div>}
                                    
                                </li>
                            )
                        })}
                    </ol>
                </div>
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        pnu : state.maps
    }
}
const mapDispatchToProps = dispatch => {
    return {
        updateDescriptionLists: function(nickname, dt, description){
            dispatch(updateDescriptionLists(nickname, dt, description));
        }

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Comments);
