import datetime

from ..init import main
from flask import render_template, request, jsonify, Blueprint
from flask_login import login_user, login_required, logout_user
from ..model.user import User
from ...init import login_manager
from ...init import db

user = Blueprint('user', __name__)


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


@user.before_request
def before_request():
    pass


@user.route('/')
@login_required
def index():
    return render_template('index.html')


@user.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.values.get("username")
        password = request.values.get("password")

        # user = User('10000000', 'admin', 'sa', '超级管理员', 1, 1, datetime.datetime.now())
        # user.save()
        user = User.query.filter(User.username == username, User.password == password).first()
        if user:
            login_user(user)
            return jsonify({"msg": '登陆成功', "success": '200'})
        return jsonify({"msg": '账号或密码不正确'})
    if request.method == 'GET':
        return render_template('login.html')


@user.route('/logout', methods=['GET'])
@login_required
def logout():
    logout_user()
    return render_template('login.html')

@user.route('/<name>', methods=['GET'])
@login_required
def htmlpage(name):
    if request.method == 'GET':
        return render_template('%s.html' % name)

# @user.route('/datasource', methods=['GET'])
# @login_required
# def page():
#     if request.method == 'GET':
#         return render_template('datasource.html')
