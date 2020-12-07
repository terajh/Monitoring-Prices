import React from 'react';
import './style.css'
import axios from 'axios';
import {connect} from 'react-redux';
import {updateMod, toggleMain} from '../../../../actions/state';


class DongBox extends React.Component {
    constructor(props){
        super(props);
        this.getApartList = this.getApartList.bind(this);
    }

    getApartList = (e) => {
        document.querySelector('.wrap-loading').setAttribute('class', 'wrap-loading');

        document.getElementById('bottom_city_box_id').setAttribute('class','bottom_city_box');
        axios.post('http://terajoo.tk:3001/api/get_list',{
            code: e.target.innerText,
            pnu: e.target.attributes[2].value
        }, { withCredentials: true })
        .then(response => {
            document.querySelector('.wrap-loading').setAttribute('class', 'wrap-loading display-none');
            this.props.update_to(response.data.list, response.data.pnulist);
            this.props.setdong(e.target.innerText)
            if(this.props.mod === 1) this.props.toggleMain()
        })
        .catch(error => {
            console.log(error);
        })
    }
    render() {
        return (
            <li>
                <strong>읍/면/동 선택</strong>
                <div className="Inner border_vis" id="eupmyeondong">
                    <div className="scroll-wrapper scrollbar-inner button_area scrollbar_block">
                        <div className="scrollbar-inner button_area scrollbar_block scroll-content" id="eupmyeondong_buttons">
                            {this.props.donglist.map((x, i) => {
                                    return (
                                        <span type="button" className="cigudong" key={i} codes={this.props.codelist[i]} onClick={this.getApartList}>{x}</span>
                                    );
                                })}
                        </div>
                        <div className="scroll-element scroll-x">
                            <div className="scroll-element_outer">
                                <div className="scroll-element_size"></div>
                                <div className="scroll-element_track"></div>
                                <div className="scroll-bar"></div>
                            </div>
                        </div>
                        <div className="scroll-element scroll-y">
                            <div className="scroll-element_outer">
                                <div className="scroll-element_size"></div>
                                <div className="scroll-element_track"></div>
                                <div className="scroll-bar"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        )
    }
}

const mapStateToProps = state => {
    return {
        mod:state.maps[4]
    }
}
const mapDispatchToProps = dispatch => {
    return {
        update_to: function(list, pnulist){
            dispatch(updateMod(list, pnulist));
        },toggleMain: function () {
            dispatch(toggleMain());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DongBox);