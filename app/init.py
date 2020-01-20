#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import pymysql
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import config
from flask_login import LoginManager


dbconfig = {
    'host': '10.1.60.23',
    'port': 3306,
    'user': 'root',
    'password': 'djkebhlhtpt',
    'database': 'hengine',
    'charset': 'utf8',
    'cursorclass': pymysql.cursors.Cursor,
}

db = SQLAlchemy()
login_manager = LoginManager()
login_manager.login_view = "user.login"

def create_app(config_name):
    app = Flask(__name__, template_folder='../templates', static_folder="../static", static_url_path="")
    app.config.from_object(config[config_name])
    login_manager.init_app(app)
    config[config_name].init_app(app)

    db.init_app(app)

    # 注册蓝本
    # 增加auth蓝本
    from .main.view.main import main as main_blueprint
    app.register_blueprint(main_blueprint)
    from .main.view.login import user
    app.register_blueprint(user)

    # 附加路由和自定义的错误页面
    return app
