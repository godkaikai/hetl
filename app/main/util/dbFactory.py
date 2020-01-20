class DbFactory:

    @staticmethod
    def getDb(config, dbtype):
        if dbtype == 'MYSQL':
            from app.main.util.mysql import Mysql
            return Mysql(**config)
        if dbtype == 'ORACLE':
            from app.main.util.oracle import Oracle
            return Oracle(**config)
