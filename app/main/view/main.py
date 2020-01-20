from flask import request, render_template
from flask_login import login_required
from ..init import main
from ..service.datasourceservice import DatasourceService


@main.route('/datasourcePage')
@login_required
def datasourcePage():
    return render_template('datasourcePage.html')


@main.route('/selectdatasource', methods=['POST'])
@login_required
def selectdatasource():
    if request.method == 'POST':
        return DatasourceService.select(request.values)


@main.route('/testdatasource', methods=['POST'])
@login_required
def testdatasource():
    if request.method == 'POST':
        return DatasourceService.test(request.values)


@main.route('/savedatasource', methods=['POST'])
@login_required
def savedatasource():
    if request.method == 'POST':
        return DatasourceService.insert(request.values)


@main.route('/deletedatasource', methods=['POST'])
@login_required
def deletedatasource():
    if request.method == 'POST':
        return DatasourceService.delete(request.values)


@main.route('/muldeletedatasource', methods=['POST'])
@login_required
def muldeletedatasource():
    if request.method == 'POST':
        return DatasourceService.muldelete(request.values)


@main.route('/updatedatasource', methods=['GET', 'POST'])
@login_required
def updatedatasource():
    if request.method == 'GET':
        return DatasourceService.getUpdatePage(request.values)
    if request.method == 'POST':
        return DatasourceService.update(request.values)
