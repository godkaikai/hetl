import json
import uuid
from time import time

from flask import render_template, request, jsonify
# 导入蓝本 main
from .init import main
from .models import Datasource
from .dao import select, insert
from flask_login import login_required


# @main.route('/selectdatasource', methods=['POST'])
# @login_required
# def selectdatasource():
#     if request.method == 'POST':
#         page = int(request.values.get("page"))
#         page_num = int(request.values.get("page_num"))
#         rows = Datasource.query.all()
#         datas = []
#         for item in rows:
#             datas.append(dict(item))
#         return json.dumps(datas)

@main.route('/datasourcelist', methods=['POST'])
@login_required
def datasourcelist():
    if request.method == 'POST':
        page = int(request.values.get("page"))
        page_num = int(request.values.get("page_num"))
        begin_time = time()
        sql = '''select distinct null PK_ID, to_char(sysdate, 'yyyyMMddhh24miss') OPERATION_TIME, b.clinic_no OUTPATIENT_NUM , to_char(b.presc_date,'yyyyMMddhh24miss')||b.presc_no RECIPE_NUM, d.item_no SERIAL_NUM, (select max(drug_code) from comm.drug_dict m where m.drug_name = d.drug_name) DRUG_CODE, d.drug_name DRUG_NAME, d.drug_spec DRUG_SPEC, (select max(form_code) from comm.drug_form_dict m where m.form_name = h.drug_form) DRUG_FORM_CODE, round(nvl(d.dosage_each,0.00),2) DRUG_DOSE_SINGLE, d.dosage_units DRUG_DOSE_UNIT , (case substr(d.administration,instr(d.administration,';',1,3)+1,instr(d.administration,';',1,4)-1-instr(d.administration,';',1,3)) when '1/日' then '09' when '2/日' then '01' when '3/日' then '08' when '4/日' then '10' when '1/晚' then '03' when '即刻' then '13' when '1/睡前' then '03' else '99' end) DRUG_FREQUENCY_CODE, (case substr(d.administration,instr(d.administration,';',1,2)+1,instr(d.administration,';',1,3)-1-instr(d.administration,';',1,2)) when '口服' then '1' when '嚼服' then '610' when '外用' then '612' when '皮下注射' then '401' when '雾化吸入' then '5' when '静推' then '404' when '局麻' then '6' else '9' end) DRUG_ROUTE_CODE, round(nvl(d.quantity,0.00),2) DRUG_QUANTITY, d.presc_no||d.item_no GROUP_NO , '' CHINESE_PIECES_DETAILS, (case b.presc_type when 1 then b.repetition else 0 end ) CHINESE_PIECES_DOSE, b.freq_master CHINESE_PIECES_DECOCTING, b.freq_master CHINESE_DRUG_METHOD, d.is_basic IS_ESSENTIAL, '' ESSENTIL_GRADE , (case h.limit_class when '3' then '1' when '2' then '1' when '1' then '1' else '0' end ) IS_ANTI, h.limit_class ANTI_USE_GRADE_CODE, 		null ANTI_USE_GRADE_NAME from PHARMACY.drug_presc_master b, PHARMACY.drug_presc_detail d, COMM.drug_dict h where b.presc_date > to_date('20190101','yyyymmdd') and b.presc_source = 0  and b.dispensary in ('301302','301304') and b.presc_date = d.presc_date and b.presc_no = d.presc_no and d.drug_code = h.drug_code and d.drug_spec = h.drug_spec'''
        datas = select(sql)
        print(type(datas))
        print(type(datas[0]))
        print(datas[0])
        newdatas = []
        for i in range(len(datas)):
            uid = str(uuid.uuid4())
            suid = ''.join(uid.split('-'))
            item = list(datas[i])
            item[0] = suid
            newdatas.append(item)
        insql = "insert into cdr.chinese_medicine_pr_item (PK_ID, OPERATION_TIME, OUTPATIENT_NUM, RECIPE_NUM, SERIAL_NUM, DRUG_CODE, DRUG_NAME, DRUG_SPEC, DRUG_FORM_CODE, DRUG_DOSE_SINGLE, DRUG_DOSE_UNIT, DRUG_FREQUENCY_CODE, DRUG_ROUTE_CODE, DRUG_QUANTITY, GROUP_NO, CHINESE_PIECES_DETAILS, CHINESE_PIECES_DOSE, CHINESE_PIECES_DECOCTING, CHINESE_DRUG_METHOD, IS_ESSENTIAL, ESSENTIL_GRADE, IS_ANTI, ANTI_USE_GRADE_CODE, ANTI_USE_GRADE_NAME) values (:PK_ID, :OPERATION_TIME, :OUTPATIENT_NUM, :RECIPE_NUM, :SERIAL_NUM, :DRUG_CODE, :DRUG_NAME, :DRUG_SPEC, :DRUG_FORM_CODE, :DRUG_DOSE_SINGLE, :DRUG_DOSE_UNIT, :DRUG_FREQUENCY_CODE, :DRUG_ROUTE_CODE, :DRUG_QUANTITY, :GROUP_NO, :CHINESE_PIECES_DETAILS, :CHINESE_PIECES_DOSE, :CHINESE_PIECES_DECOCTING, :CHINESE_DRUG_METHOD, :IS_ESSENTIAL, :ESSENTIL_GRADE, :IS_ANTI, :ANTI_USE_GRADE_CODE, :ANTI_USE_GRADE_NAME)"
        num = insert(insql, newdatas)
        end_time = time()
        run_time = end_time - begin_time
        print('该循环程序运行时间：', run_time)
        return jsonify({"success": 200, "data": num})
