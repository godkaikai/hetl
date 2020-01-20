import os

from app.main.util.dbbase import Dbbase
import cx_Oracle


class Oracle(Dbbase):

    def connect(self):
        try:
            os.environ['NLS_LANG'] = 'SIMPLIFIED CHINESE_CHINA.UTF8'
            self.conn = cx_Oracle.connect("{}/{}@{}:{}/{}".format(self.user, self.password, self.host, self.port, self.db))
        except cx_Oracle.DatabaseError as e:
            print('except:', e)
            return False
        finally:
            return self.conn

    def test(self):
        try:
            os.environ['NLS_LANG'] = 'SIMPLIFIED CHINESE_CHINA.UTF8'
            self.conn = cx_Oracle.connect("{}/{}@{}:{}/{}".format(self.user, self.password, self.host, self.port, self.db))
            self.conn.close()
        except cx_Oracle.DatabaseError as e:
            print('except:', e)
            return False
        finally:
            return True
