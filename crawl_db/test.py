import requests
import pymysql
import pandas as pd 
from urllib.request import Request, urlopen
from urllib.parse import urlencode, quote_plus
from xml.etree.ElementTree import parse
import xml.etree.ElementTree as ET
import time
import csv
import requests
 
conn = pymysql.connect(host='localhost', user='root', password='dkd352487',
                       db='price', charset='utf8')
 
 
def getLatLng(address):
    try:
        result = ""
    
        url = 'https://dapi.kakao.com/v2/local/search/address.json?query=' + address
        rest_api_key = 'ab4e46ce47766d0b13004313d91a1f79'
        header = {'Authorization': 'KakaoAK ' + rest_api_key}
    
        r = requests.get(url, headers=header)
    
        if r.status_code == 200:
            result_address = r.json()["documents"][0]
            result = result_address["y"], result_address["x"], result_address['road_address']['address_name']

        else:
            result = "ERROR[" + str(r.status_code) + "]"
        
        return result
    except Exception as e:
        print(address, e)
        return False
 

def getKakaoMapHtml(address_latlng):
    javascript_key = "c5d1c10f13c76f1b58e4bace2662692d"
 
    result = ""
    result = result + "<div id='map' style='width:300px;height:200px;display:inline-block;'></div>" + "\n"
    result = result + "<script type='text/javascript' src='//dapi.kakao.com/v2/maps/sdk.js?appkey=" + javascript_key + "'></script>" + "\n"
    result = result + "<script>" + "\n"
    result = result + "    var container = document.getElementById('map'); " + "\n"
    result = result + "    var options = {" + "\n"
    result = result + "           center: new kakao.maps.LatLng(" + address_latlng[0] + ", " + address_latlng[1] + ")," + "\n"
    result = result + "           level: 3" + "\n"
    result = result + "    }; " + "\n"
    result = result + "    var map = new kakao.maps.Map(container, options); " + "\n"
    
    # 검색한 좌표의 마커 생성을 위해 추가
    result = result + "    var markerPosition  = new kakao.maps.LatLng(" + address_latlng[0] + ", " + address_latlng[1] + ");  " + "\n"
    result = result + "    var marker = new kakao.maps.Marker({position: markerPosition}); " + "\n"
    result = result + "    marker.setMap(map); " + "\n"
 
    result = result + "</script>" + "\n"
    
    return result
 
# main()
if __name__ == "__main__":
    curs = conn.cursor()
    sql =""" select distinct address from apart"""
    curs.execute(sql)
    rows = curs.fetchall()

    count = 27058
    for i in range(27058, len(rows)):
        print(count)
        count += 1
        address_latlng = getLatLng(rows[i][0])
        if(address_latlng):
            sql =""" update apart set xLoc=%s, yLoc=%s, roadAddress=%s where address=%s
                        """
            curs.execute(sql, (address_latlng[0], address_latlng[1], address_latlng[2], rows[i][0]))
            conn.commit()

