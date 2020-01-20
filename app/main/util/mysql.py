import pymysql

from app.main.util.dbbase import Dbbase


class Mysql(Dbbase):
    def connect(self):
        try:
            conn = pymysql.connect(host=self.host, port=self.port, user=self.user, password=self.password, db=self.db,
                                   charset=self.charset)
        except pymysql.err.OperationalError as e:
            print('except:', e)
            return False
        finally:
            self.conn = conn
            return conn

    def test(self):
        try:
            conn = pymysql.connect(host=self.host, port=self.port, user=self.user, password=self.password, db=self.db,
                                   charset=self.charset)
        except pymysql.err.OperationalError as e:
            print('except:', e)
            return False
        finally:
            conn.close()
            return True