#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from flask_login import UserMixin
from flask_login._compat import unicode

from ...init import db


class User(db.Model, UserMixin):
    id = db.Column('id', db.String(12), primary_key=True)
    username = db.Column(db.String(20), unique=True)
    password = db.Column(db.String(50))
    name = db.Column(db.String(20))
    role = db.Column(db.Integer)
    state = db.Column(db.Integer)
    create_time = db.Column(db.DateTime)

    __tablename__ = 'hetl_user'

    def __init__(self, id=None, username=None, password=None, name=None, role=None, state=None, create_time=None):
        self.id = id
        self.username = username
        self.password = password
        self.name = name
        self.role = role
        self.state = state
        self.create_time = create_time

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return unicode(self.id)

    def __repr__(self):
        return '<User %r>' % (self.username)

    def save(self):
        db.session.add(self)
        db.session.commit()