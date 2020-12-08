import React, { useState, useEffect } from 'react';
import './style.css';
import Title from './title';
import {connect} from 'react-redux';
import axios from 'axios';

import { RenderAfterNavermapsLoaded, NaverMap, Marker } from 'react-naver-maps';
axios.default.withCredentials = true;

const NaverMapAPI = (props) => {
    const navermaps = window.naver.maps;
    const [[xLoc, yLoc, modify], setstate] = useState([37.3595704, 127.105399, 0])

    useEffect(()=>{
        if(props.pnu[6] === 0) return;
        else if(props.pnu[6][0] != xLoc && yLoc != props.pnu[6][1]){
            setstate([props.pnu[6][0], props.pnu[6][1], 1]);
        }
    })
    
    return (
        <NaverMap 
            id="map"
            mapDivID={'maps-getting-started-uncontrolled'}
            style={{
                width: '100%', // 네이버지도 가로 길이
            }}
            center={new navermaps.LatLng(xLoc, yLoc)}     // 지도 초기 위치
            defaultZoom={(xLoc === 37.3595704) ? 12 : 15}>   
            <Marker  position={new navermaps.LatLng(xLoc, yLoc)}
                animation={navermaps.Animation.BOUNCE}
                onClick={() => {
                    alert('여기는 네이버 입니다.')
                }}>
            </Marker>
        </NaverMap>
    )
}
const Map = (props) => {
    // eslint-disable-next-line

    return (
        <RenderAfterNavermapsLoaded
            ncpClientId={'fomot3guwd'} // 자신의 네이버 계정에서 발급받은 Client ID
            error={<p>Maps Load Error</p>}
            loading={<p>Maps Loading...</p>}
            >
            <NaverMapAPI pnu={props.pnu} ></NaverMapAPI>
            <Title></Title> 
        </RenderAfterNavermapsLoaded> 
    )
}

const mapStateToProps = (state) => {
    return {
        pnu : state.maps
    }
}
export default connect(mapStateToProps, null)(Map);