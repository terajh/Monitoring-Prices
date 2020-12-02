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
 


def from_xlsx():
    #sheetname = '시트명 or 숫자' , header = 숫자 skiprow=숫자 
    xlsx = pd.read_excel('./locaCode.xlsx') #상위 데이터 확인 
    print(xlsx.head()) 
    print() 
    print(xlsx.tail()) 
    print() 
    print(xlsx.shape) #행, 열
    print(type(xlsx))
    sql =""" insert into cigudong(city, gu, dong, cityname, guname, dongname) 
                values (%s, %s, %s, %s, %s, %s)"""
    xlsx = xlsx.dropna(axis=0)
    for i in range(5,xlsx.shape[0]):
        
        ci_name = xlsx.iloc[i][1] # 시
        gu_name = xlsx.iloc[i][2] # 구
        dong_name = xlsx.iloc[i][4] # 동
        ci = int(xlsx.iloc[i][3]/100000000) # 시코드
        gu = int(xlsx.iloc[i][3]/1000)%100000 # 구코드
        dong = int(xlsx.iloc[i][3]) # 동코드

        print(ci, gu, dong)
        curs.execute(sql, (ci, gu, dong, ci_name, gu_name, dong_name))
        conn.commit()

    conn.close()


def get_opendata():
    curs = conn.cursor()
    sql =""" select distinct dong from cigudong"""
    curs.execute(sql)
    rows = curs.fetchall()
    # csv = pd.read_csv('./test.csv')
    # print(csv)
    # for l in titleList:
    #     csvWirter.writerow(l)
    # f.close
    count = 0
    for i in range(4377, len(rows)):
        try:
            print(count) # + 4377
            count += 1
            _url = 'http://realtyprice.chosun.com/app/start.php?mode=al&code=' + rows[i][0] + '&page=1'
            params = {}
            headers = {
                'Referer': 'http://realtyprice.chosun.com/',
            }
            res = requests.get(_url, headers=headers, timeout=1)
            rs_json = res.json()
            print(rs_json['status'])
            if(rs_json['status'] != 'success'): continue
            rs_data = rs_json['data']
            rs_item = rs_data['items']

            for ele in rs_item:
                print(ele['danzi'])
                sql =""" insert into apart(dongCode, _dongname) 
                    values (%s, %s)"""
                curs.execute(sql, (str(rows[i][0]), ele['danzi']))
                conn.commit()
        except Exception as e:
            print(e)
            continue

def updatedata():
    curs = conn.cursor()
    sql =""" select distinct dongCode from apart"""
    curs.execute(sql)
    rows = curs.fetchall()
    # csv = pd.read_csv('./test.csv')
    # print(csv)
    # for l in titleList:
    #     csvWirter.writerow(l)
    # f.close
    count = 644
    for i in range(644, len(rows)):
        try:
            print(count)
            count += 1
            _url = 'http://realtyprice.chosun.com/app/start.php?mode=al&code=' + rows[i][0] + '&page=1'
            params = {}
            headers = {
                'Referer': 'http://realtyprice.chosun.com/',
            }
            res = requests.get(_url, headers=headers, timeout=1)
            rs_json = res.json()
            if(rs_json['status'] != 'success'): continue
            rs_data = rs_json['data']
            rs_item = rs_data['items']

            for ele in rs_item:
                sql =""" update apart set pnu=%s, address=%s where _name=%s
                    """
                curs.execute(sql, (ele['pnu'], ele['address'], ele['danzi']))
                conn.commit()
        except Exception as e:
            print(e)
            continue



if __name__ == "__main__":
    updatedata()