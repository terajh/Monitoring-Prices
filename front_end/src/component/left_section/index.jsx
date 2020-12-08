import React from 'react';
import './style.css'
import {connect} from 'react-redux'
import MainOne from './mainOne';
import MainTwo from './mainTwo';
import Comment from './comments';

class Left_section extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            pnu: '',
        }
        this.check_mod = this.check_mod.bind(this);
    }
    componentDidMount() {
        if(this.state.pnu !== this.props.mod[4]) {
            this.setState({
                pnu:this.props.mod[4]
            });
        }
    }
    check_mod = () => {
        if(this.props.mod[4] === 0){
            return <div id="left_body"><MainOne></MainOne></div>
        }
        else {
            return <div id="left_body">
                <MainTwo></MainTwo>
                <Comment></Comment>  
            </div>
        }
    }
    render(){
        return (
            this.check_mod()
        )
    }
}

const mapStateToProps = (state) => {
    return {
        mod: state.maps
    }
}
export default connect(mapStateToProps, null)(Left_section);