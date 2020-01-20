from ...init import db


class Datasource(db.Model):
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    datasource_name = db.Column(db.String(20), unique=True)
    datasource_title = db.Column(db.String(50))
    datasource_type = db.Column(db.String(20))
    datasource_driver = db.Column(db.String(50))
    datasource_ip = db.Column(db.String(50))
    datasource_port = db.Column(db.String(20))
    datasource_dbname = db.Column(db.String(50))
    datasource_username = db.Column(db.String(255))
    datasource_password = db.Column(db.String(255))
    datasource_purpose = db.Column(db.Integer)
    datasource_enc = db.Column(db.Integer)
    state = db.Column(db.Integer)
    notes = db.Column(db.String(255))
    create_time = db.Column(db.DateTime)
    create_user = db.Column(db.String(50))
    update_time = db.Column(db.DateTime)
    update_user = db.Column(db.String(50))

    __tablename__ = 'hetl_datasource'

    def __init__(self, id, datasource_name, datasource_title, datasource_type, datasource_driver, datasource_ip,
                 datasource_port, datasource_dbname, datasource_username, datasource_password, datasource_purpose,
                 datasource_enc, state, notes, create_time, create_user, update_time, update_user):
        self.id = id
        self.datasource_name = datasource_name
        self.datasource_title = datasource_title
        self.datasource_type = datasource_type
        self.datasource_driver = datasource_driver
        self.datasource_ip = datasource_ip
        self.datasource_port = datasource_port
        self.datasource_dbname = datasource_dbname
        self.datasource_username = datasource_username
        self.datasource_password = datasource_password
        self.datasource_purpose = datasource_purpose
        self.datasource_enc = datasource_enc
        self.state = state
        self.notes = notes
        self.create_time = create_time
        self.create_user = create_user
        self.update_time = update_time
        self.update_user = update_user

    def save(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def keys(self):
        return ('id', 'datasource_name', 'datasource_title', 'datasource_type', 'datasource_driver', 'datasource_ip',
                'datasource_port', 'datasource_dbname', 'datasource_username', 'datasource_password',
                'datasource_purpose', 'datasource_enc', 'state', 'notes', 'create_time', 'create_user', 'update_time',
                'update_user')

    def __getitem__(self, item):
        return getattr(self, item)
