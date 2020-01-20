

class Dbbase:

    def __init__(self, host, port, user, password, db, charset):
        self.conn = None
        self.cursor = None
        self.host = host
        self.port = port
        self.user = user
        self.password = password
        self.db = db
        self.charset = charset

    def connect(self):
        pass

    def close(self):
        self.cursor.close()
        self.conn.close()

    def queryAll(self, sql):
        self.cursor.execute(sql)
        return self.cursor.fetchall()

    def queryBatch(self, sql, size):
        if self.cursor is None:
            self.cursor.execute(sql)
        return self.cursor.fetchmany(size)

    def execute(self, sql, data):
        self.cursor.executemany(sql, data)
        self.conn.commit()
        return len(data)

    def test(self):
        pass
