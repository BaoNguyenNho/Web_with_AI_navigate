
import librosa   #for audio processing
import IPython.display as ipd
import numpy as np
import soundfile as sf
import sounddevice as sd
from keras.models import Model, load_model
import time
import os
from flask import Flask
from flask import Flask, request, redirect
from flask_restful import Resource, Api
from json import dumps
from flask import jsonify
from werkzeug.utils import secure_filename
from flask_cors import CORS, cross_origin
# from flask_cors Simport CORS, cross_origin

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
model = load_model('C:/Users/admin/Downloads/best_model.hdf5')

def predict(audio):
    # classes = ['app', 'gmail', 'image', 'mess', 'phone']
    # classes = ['one', 'two', 'three', 'four', 'five']
    classes = ['five', 'four', 'one', 'three', 'two']
    prob=model.predict(audio.reshape(1,8000,1))
    index=np.argmax(prob[0])
    return classes[index]

app = Flask(__name__)
cors = CORS(app)
app.config['UPLOAD_FOLDER'] = 'E:/Temporary (chứa code các bài tập)/Da_phuong_tien/AI/audiofile/'
app.config['CORS_HEADERS'] = 'Content-Type'
api=Api()

ALLOWED_EXTENSIONS ={'wav'}

def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.',1)[1].lower() in ALLOWED_EXTENSIONS

class Predict(Resource):
    def post(self):
        if request.method == 'POST':
            if 'audio' not in request.files:
                return 'no audio'
            file = request.files['audio']
            # print(file)
            if file.filename == '':
                return 'no file selected'
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                # return 'yes'
                time.sleep(3)   
                filename = 'E:/Temporary (chứa code các bài tập)/Da_phuong_tien/AI/audiofile/'+filename
                # filename = 'C:/Users/admin/Downloads/test_bot_' + str(i)+'.wav'
                samplerate = 16000  
                duration = 1 # seconds
                # print("start the " + str(i)+"th time")
                # mydata = sd.rec(int(samplerate * duration), samplerate=samplerate, channels=1, blocking=True)
                # sd.wait()
                # mydata=request.files['audio']
                # print(mydata)
                # print("end")
                # sf.write(filename,, samplerate)

                #os.listdir('../input/voice-commands/prateek_voice_v2')
                #filepath='../input/voice-commands/prateek_voice_v2'

                samples, sample_rate = librosa.load(filename, sr = 16000)
                samples = librosa.resample(samples, sample_rate, 8000)
                samples=samples[:8000]
                threshold = 0.05
                extra = [i for i in samples if i>threshold]
                result = 'Blank'
                if extra:
                    ipd.Audio(samples,rate=8000)

                    result= predict(samples)
                    print("Result: ",result)
                else:
                    print("Result: ",result)
                    return result
                return result
        return 'hello'

api.add_resource(Predict, '/predict')
api.init_app(app)
# @app.route('/predict', methods=['POST'])
# @cross_origin()
# def result():
    
#     time.sleep(3)
    
#     # filename = 'C:/Users/admin/Downloads/022cd682_nohash_1.wav'
#     # filename = 'C:/Users/admin/Downloads/test_bot_' + str(i)+'.wav'
#     samplerate = 16000  
#     duration = 1 # seconds
#     # print("start the " + str(i)+"th time")
#     mydata = sd.rec(int(samplerate * duration), samplerate=samplerate, channels=1, blocking=True)
#     sd.wait()
#     print("end")
#     sf.write(filename, mydata, samplerate)

#     #os.listdir('../input/voice-commands/prateek_voice_v2')
#     #filepath='../input/voice-commands/prateek_voice_v2'

#     samples, sample_rate = librosa.load(filename, sr = 16000)
#     samples = librosa.resample(samples, sample_rate, 8000)
#     ipd.Audio(samples,rate=8000)

#     result= predict(samples)
#     print("Result: ",result)
#     return result


if __name__ == '__main__':
    app.run(debug=True)