# from flask import Flask, request, redirect
# from flask_restful import Resource, Api
# from json import dumps
# from flask import jsonify

# app=Flask(__name__)
# api=Api()
# class Send(Resource):
#     def post(self):
#         # query = conn.execute("select * from employees") # Dòng này thực hiện truy vấn và trả về json
#         res = {'employees': 'Hello'} 
#         return jsonify(res)# Tìm và thêm cột đầu tiên là Employee ID


# api.add_resource(Send, '/predict')
# api.init_app(app)
# if __name__=='__main__':
#     app.run(debug=True)

from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
    return 'Hello, World!'

@app.route('/about')
def about():
    return 'About'
