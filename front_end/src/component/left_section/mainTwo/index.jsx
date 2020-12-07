import React from 'react';
import './style.css'
import axios from 'axios';
import {connect} from 'react-redux'
import {updatePniInfo, setLike} from '../../../actions/state';

axios.default.withCredentials = true;

class MainTwo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            road_address : '',
            address_name : '',
            name:'',
            arealist:[],
            loglist:[],
            this_area:0
        }
        this.updateThisArea = this.updateThisArea.bind(this);
        this.removeList = this.removeList.bind(this);
        this.insertList = this.insertList.bind(this);
    }

    componentDidMount() {
        // if(this.state.road_address == '' && this.props.pnu[3] !== 0 && this.props.pnu[6] === 0) {
            document.querySelector('.wrap-loading').setAttribute('class', 'wrap-loading');
            axios.post('http://terajoo.tk:3001/api/get_extra',{
                pnu: this.props.pnu[3]
            }, { withCredentials: true })
            .then(response => {
                let data = response.data;
                
                axios.post('http://terajoo.tk:3001/api/get_log',{
                    pnu: this.props.pnu[3],
                    area: data.items[0].area
                }, { withCredentials: true })
                .then(res => {
                    document.querySelector('.wrap-loading').setAttribute('class', 'wrap-loading display-none');
                    this.setState({
                        road_address : data.roadAddress,
                        address_name : data.address,
                        name : data.name,
                        arealist: data.items,
                        loglist: res.data.loglist,
                        this_area: data.items[0].area
                    })
                    this.props.updatePniInfo(data.xLoc, data.yLoc, data.description);
                })
                .catch(err => {
                    console.log(err);
                })
                
            })
            .catch(error => {
                console.log(error);
            })
            /***********************************************************************************************************/
        // }
    }
    parseprice(number) {
        number *= 1; 
        var auk = parseInt(number/100000000);
        var manwow = parseInt((number%100000000)/10000);

        return auk +'억 '+ manwow+'만'
    }
    updateThisArea = (e) => {
        e.preventDefault();
        var itemSelect = document.getElementById('list_pyeong');
        var itemValue = itemSelect.options[itemSelect.selectedIndex].value;
        document.querySelector('.wrap-loading').setAttribute('class', 'wrap-loading');

        axios.post('http://terajoo.tk:3001/api/get_log',{
            pnu: this.props.pnu[3],
            area: itemValue
        }, { withCredentials: true })
        .then(res => {
            document.querySelector('.wrap-loading').setAttribute('class', 'wrap-loading display-none');
            this.setState({
                loglist: res.data.loglist,
                this_area: itemValue
            })
        })
        .catch(err => {
            console.log(err);
        })
    }

    insertList() {
        document.querySelector('.wrap-loading').setAttribute('class', 'wrap-loading');
        axios.post('http://terajoo.tk:3001/api/putLike',{
            pnu: this.props.pnu[3]
        }, { withCredentials: true })
        .then(res => {
            document.querySelector('.wrap-loading').setAttribute('class', 'wrap-loading display-none');
            this.props.pnu[8].push(this.props.pnu[3]);
            this.props.setLike(this.props.pnu[8]);
        })
        .catch(err => {
            console.log(err);
        })
    }
    removeList() {
        document.querySelector('.wrap-loading').setAttribute('class', 'wrap-loading');
        axios.post('http://terajoo.tk:3001/api/removeLike',{
            pnu: this.props.pnu[3]
        }, { withCredentials: true })
        .then(res => {
            document.querySelector('.wrap-loading').setAttribute('class', 'wrap-loading display-none');
            this.props.setLike(this.props.pnu[8].filter((x)=>x!==this.props.pnu[3]));
        })
        .catch(err => {
            console.log(err);
        })
    }
    render() {
        console.log('mainTwo component',this.props.pnu)
        return (
            <>
                <div className="marker_info vis">
                    <div className="marker_info_txt">
                        <strong className="marker_title" id="view_danzi">{this.state.name}</strong>
                        {(this.props.pnu[5] === 0) ? null : (this.props.pnu[8].includes(this.props.pnu[3])) ? 
                            <svg onClick={this.removeList} style={{'float':'right', 'cursor':'pointer'}} width="20" height="20" viewBox="0 0 16 16" className="bi bi-star-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                            </svg> 
                            : <svg onClick={this.insertList} style={{'float':'right', 'cursor':'pointer'}} width="20" height="20" viewBox="0 0 16 16" className="bi bi-star" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.523-3.356c.329-.314.158-.888-.283-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767l-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288l1.847-3.658 1.846 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.564.564 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
                            </svg>}
                        <span className="marker_address" id="view_addr">{this.state.address_name}</span><br />
                        <div className="marker_address_number">
                            <em>도로명  </em>
                            <span id="view_roadaddr">{this.state.road_address}</span>
                        </div>
                    </div>

                    <div id="expected_price_layer">
                        <div className="price_box">
                            <div className="price_box_title" id="year_price">2020년도 공시가격</div>
                            <div id="expected_price_list">
                                {this.state.arealist.map((item, i) => {
                                    return (
                                        <dl key={i} className="">
                                            <dt>{parseInt(item.area*0.3025)}평 / 전용 {item.area}m²</dt>
                                            <dd>{this.parseprice(item.price.min)} ~ {this.parseprice(item.price.max)}</dd>
                                        </dl>
                                    )
                                })}
                                
                            </div>
                        </div>
                    </div>

                    <div id="actual_price_graph" className="actual_price_graph">
                        <span className="tit_txt" id="sameprcwords">실거래가 변동<em>(최근 3년)</em></span>
                        <div className="selectarea">
                            <div className="selectBox select_line default">
                                <select name="" id="list_pyeong" onChange={this.updateThisArea}>
                                    {this.state.arealist.map((item, i) => {
                                        return (
                                            <option key={i} value={item.area} >{parseInt(item.area*0.3025)}평({item.area}m²)</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="dealings_list">
                            <div className="table_style_box" >
                                <table className="table_style" id="table_test">
                                    <colgroup>
                                        <col className="col_st01" />
                                        <col className="col_st02" />
                                        <col className="col_st03" />
                                        <col className="col_st04" />
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th>계약일</th>
                                            <th>실거래가</th>
                                            <th>전용면적</th>
                                            <th>층</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(this.state.loglist.length === 0) 
                                        ? <tr>
                                            <td colSpan="4">이력이 없습니다.</td>
                                        </tr>
                                        : this.state.loglist.map((item, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td>{item.update.split('T')[0]}</td>
                                                    <td><strong>{this.parseprice(item.price)}</strong></td>
                                                    <td>{item.area}m²</td><td>{item.floor}층</td>
                                                </tr>
                                            )
                                        })}
                                        
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </>

        )
    }
}

const mapStateToProps = (state) => {
    return {
        pnu : state.maps
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updatePniInfo: function(x,y, description){
            dispatch(updatePniInfo(x,y, description));
        },
        setLike : function(list){
            dispatch(setLike(list));
        }

    }
}


export default connect(mapStateToProps, mapDispatchToProps)(MainTwo);