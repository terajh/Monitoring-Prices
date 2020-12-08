
import React from 'react';
import './style.css'
import { connect } from 'react-redux';
import axios from 'axios';
import {getHost} from '../../../lib/host';
import { updateLoc, toggleMain, updateMod } from '../../../actions/state'

class MainOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query:''
        }
        this.getQuery = this.getQuery.bind(this);
        this.clearQuery = this.clearQuery.bind(this);
        this.searchQuery = this.searchQuery.bind(this);
        this.clickHouse = this.clickHouse.bind(this);
    }

    getQuery = (e) => {
        e.preventDefault();
        console.log(e);
        this.setState({
            query:e.target.value
        })
    }
    clearQuery = (e) => {
        e.preventDefault();
        this.setState({
            query:''
        })
    }
    searchQuery = (e) => {
        console.log('search click');
        e.preventDefault();
        document.querySelector('.wrap-loading').setAttribute('class', 'wrap-loading');
        axios.post(getHost()+'/api/search', {query:this.state.query},
        { withCredentials: true })
        .then(res => {
            if(res.data.success === true) {
                console.log(res.data)
                document.querySelector('.wrap-loading').setAttribute('class', 'wrap-loading display-none');

                this.props.update_to(res.data.list, res.data.pnulist);
            }else{
                alert('로그아웃 에러');
            }
        })
        .catch(err => {
            console.log(err);
        })
    }
    clickHouse = (e) => {
        e.preventDefault();
        this.props.updateLoc(e.target.attributes[1].nodeValue);
        this.props.toggleMain(1);
    }
    
    render() {
        // let lists = this.props._list;
        let get_list = this.props.list;
        let homelist = (!!get_list[1]) ? get_list[1] : [];
        let pnulist = (!!get_list[2]) ? get_list[2] : [];
        return (
            <>
                <div className="sch_inputbox">
                    <form method="get" name="frm" id="id_searchForm" action="">
                        <fieldset>
                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-broadcast" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M3.05 3.05a7 7 0 0 0 0 9.9.5.5 0 0 1-.707.707 8 8 0 0 1 0-11.314.5.5 0 0 1 .707.707zm2.122 2.122a4 4 0 0 0 0 5.656.5.5 0 0 1-.708.708 5 5 0 0 1 0-7.072.5.5 0 0 1 .708.708zm5.656-.708a.5.5 0 0 1 .708 0 5 5 0 0 1 0 7.072.5.5 0 1 1-.708-.708 4 4 0 0 0 0-5.656.5.5 0 0 1 0-.708zm2.122-2.12a.5.5 0 0 1 .707 0 8 8 0 0 1 0 11.313.5.5 0 0 1-.707-.707 7 7 0 0 0 0-9.9.5.5 0 0 1 0-.707z" />
                                <path d="M10 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
                            </svg>
                            <span className="input_outline">
                                <input type="text" className="searchTerm" id="query" name="query" title="검색어 입력" placeholder="예) 프루지오" onChange={this.getQuery} value={this.state.query} />
                            </span>
                        </fieldset>
                    </form>
                    <a href="#none" className="comn_bg btn_delete" id="btn_delete" onClick={this.clearQuery}>
                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-x-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                            <path fillRule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                        </svg>
                    </a>
                    <a href="#none" className="comn_bg btn_input_search" id="btn_search" onClick={this.searchQuery}>
                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-search" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z" />
                            <path fillRule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z" />
                        </svg>
                    </a>
                </div>
                <div className="inner">
                    <ul className="container apthouse_list" id="apthouse_list_id">
                        {homelist.map((item, x) => {
                            return (
                                <li key={x}>
                                    <a href="#none" pnu={pnulist[x]} onClick={this.clickHouse}>{item}
                                    </a>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </>
        )
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
        toggleMain: function (a) {
            dispatch(toggleMain(a));
        },update_to: function(list, pnulist){
            dispatch(updateMod(list, pnulist));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(MainOne);