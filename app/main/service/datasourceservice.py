from app.main.model.datasource import Datasource


class DatasourceService:
    @staticmethod
    def select(data):
        page = int(data.get("page"))
        limit = int(data.get("limit"))
        sortfield = data.get("sortfield")
        searchfield = data.get("searchfield")
        order = data.get("order")
        value = data.get("value")
        rows = Datasource.query
        if searchfield is not None and searchfield != '' and value is not None and value != '':
            rows = rows.filter(getattr(Datasource, searchfield).like('%' + value + '%'))
        if sortfield is not None and order is not None:
            if order == 'asc':
                rows = rows.order_by(sortfield)
            else:
                from sqlalchemy import desc
                rows = rows.order_by(desc(sortfield))
        rows = rows.paginate(page, limit)
        data = rows.items
        count = rows.total
        datas = []
        for item in data:
            datas.append(dict(item))
        return {"code": 0, "msg": "查询成功", "count": count, "data": datas}

    @staticmethod
    def test(data):
        args = data.to_dict()
        dbconfig = {
            'host': args['datasource_ip'],
            'port': args['datasource_port'],
            'user': args['datasource_username'],
            'password': args['datasource_password'],
            'db': args['datasource_dbname'],
            'charset': 'utf8'
        }
        from app.main.util.dbFactory import DbFactory
        db = DbFactory.getDb(config=dbconfig, dbtype=args['datasource_type'])
        if db.test():
            return {"success": True, "msg": "链接测试成功"}
        else:
            return {"success": False, "msg": "链接测试失败,请检查链接信息"}

    @staticmethod
    def insert(data):
        test = DatasourceService.test(data)
        if test["success"]:
            args = data.to_dict()
            if "datasource_enc" not in args:
                args['datasource_enc'] = 0
            if "state" not in args:
                args['state'] = 0
            import datetime
            from time import time
            create_time = datetime.datetime.fromtimestamp(time())
            from flask_login import current_user
            user = current_user._get_current_object()
            from app.main.model.sequence import Sequence
            sequence = Sequence.query.filter(Sequence.sequencename == 'hetl_datasource').one()
            args['create_time'] = create_time
            args['create_user'] = user.id
            args['update_time'] = create_time
            args['update_user'] = user.id
            args['id'] = sequence.currentvalue
            datasource = Datasource(**args)
            datasource.save()
            sequence.update()
            return {"success": True, "msg": "新增成功"}
        else:
            return {"success": False, "msg": "新增失败，链接测试失败,请检查链接信息"}

    @staticmethod
    def update(data):
        test = DatasourceService.test(data)
        if test["success"]:
            args = data.to_dict()
            id = data.get("id")
            import datetime
            from time import time
            args['update_time'] = datetime.datetime.fromtimestamp(time())
            from flask_login import current_user
            args['update_user'] = current_user._get_current_object().id
            datasource = Datasource.query.filter_by(id=id).first()
            if datasource:
                {setattr(datasource, k, v) for k, v in args.items()}
                datasource.update()
            return {"success": True, "msg": "修改成功"}
        else:
            return {"success": False, "msg": "修改失败，链接测试失败,请检查链接信息"}

    @staticmethod
    def delete(data):
        id = data.get("id")
        datasource = Datasource.query.filter_by(id=id).first()
        if datasource:
            datasource.delete()
            return {"success": True, "msg": "删除成功"}
        return {"success": False, "msg": "删除失败"}

    @staticmethod
    def muldelete(data):
        ids = data.get("ids").split(",")
        Datasource.query.filter(Datasource.id.in_(ids)).delete(synchronize_session=False)
        return {"success": True, "msg": "删除成功"}
        #return {"success": False, "msg": "删除失败"}

    @staticmethod
    def getUpdatePage(data):
        id = data.get("id")
        datasource = Datasource.query.filter_by(id=id).one()
        from flask import render_template
        return render_template('updatedatasource.html', datasource=datasource)
