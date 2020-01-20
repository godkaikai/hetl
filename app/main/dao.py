# coding=utf-8
import os
import sys
from imp import reload

import pymysql
import cx_Oracle

from ..init import dbconfig


def selectColumn():
    conn = pymysql.connect(**dbconfig)
    with conn:
        # ****** 判断是否连接?
        print(conn.open)  # 返回True，说明连接成功
        # 2. 创建游标对象，
        cur = conn.cursor()
        # 3).
        sqli = "select * from ddp_datasource;"
        result = cur.execute(sqli)  # 默认不返回查询结果集， 返回数据记录数。
        info = cur.fetchall()

    # 显示每列的详细信息
    des = cur.description
    print("表的描述:", des)

    # 获取表头
    print("表头:", ",".join([item[0] for item in des]))
    cur.close()
    conn.close()
    return info


def select(sql):
    os.environ['NLS_LANG'] = 'SIMPLIFIED CHINESE_CHINA.UTF8'
    conn = cx_Oracle.connect('system/xiou@10.30.0.170:1521/orcl')
    cur = conn.cursor()
    cur.execute(sql)
    info = cur.fetchall()
    print(len(info))
    cur.close()
    conn.close()
    return info


def insert(sql, recordList):
    os.environ['NLS_LANG'] = 'SIMPLIFIED CHINESE_CHINA.UTF8'
    conn = cx_Oracle.connect('cdr/cdr@10.1.50.119:1521/orcl')
    cur = conn.cursor()
    cur.prepare(sql)
    rown = cur.executemany(None, recordList)
    print(rown)
    conn.commit()
    cur.close()
    conn.close()
    return rown