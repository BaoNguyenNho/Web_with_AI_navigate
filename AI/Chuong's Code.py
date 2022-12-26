
import librosa   #for audio processing
import IPython.display as ipd
import numpy as np
import soundfile as sf
import sounddevice as sd
from keras.models import Model, load_model
import time
import os

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
model = load_model('C:/Users/admin/Downloads/best_model.hdf5')

def predict(audio):
    # classes = ['app', 'gmail', 'image', 'mess', 'phone']
    # classes = ['one', 'two', 'three', 'four', 'five']
    classes = ['five', 'four', 'one', 'three', 'two']
    prob=model.predict(audio.reshape(1,8000,1))
    index=np.argmax(prob[0])
    return classes[index]

for i in range(1,11):
    time.sleep(3)
    
    # filename = 'E:/Temporary (chứa code các bài tập)/Da_phuong_tien/AI/audiofile/test_audio.wav'
    filename = 'C:/Users/admin/Downloads/test_bot_' + str(i)+'.wav'
    samplerate = 16000  
    duration = 1 # seconds
    x=''
    if (i==1):
        x='st'
    elif (i ==2):
        x='nd'
    elif (i==3):
        x='rd'
    else:
        x='th'
    print("start the " + str(i)+ " "+ x + " time")
    mydata = sd.rec(int(samplerate * duration), samplerate=samplerate, channels=1, blocking=True)
    sd.wait()
    # print(mydata.shape)
    print("end")
    sf.write(filename, mydata, samplerate)

    #os.listdir('../input/voice-commands/prateek_voice_v2')
    #filepath='../input/voice-commands/prateek_voice_v2'

    samples, sample_rate = librosa.load(filename, sr = 16000)
    samples = librosa.resample(samples, sample_rate, 8000)
    # samples=samples[:8000]
    ipd.Audio(samples,rate=8000)

    print("Result: ",predict(samples))