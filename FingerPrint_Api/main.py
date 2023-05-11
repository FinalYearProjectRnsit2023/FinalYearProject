
# uvicorn main:app --reload

from typing import Union
from fastapi import FastAPI
from pydantic import BaseModel
import sys

import time
from lib.pyfingerprint import PyFingerprint
from lib.pyfingerprint import FINGERPRINT_CHARBUFFER1
from lib.pyfingerprint import FINGERPRINT_CHARBUFFER2

from time import gmtime, strftime

import fingerprint as fp

app = FastAPI()

# Tries to initialize the sensor
try:
    f = PyFingerprint('/dev/serial0', 57600, 0xFFFFFFFF, 0x00000000)

    if (f.verifyPassword() == False):
        raise ValueError('The given fingerprint sensor password is wrong!')

except Exception as e:
    print('The fingerprint sensor could not be initialized!')
    print('Exception message: ' + str(e))
    sys.exit(1)

print("The fingerprint sensor is now initialized")

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/read")
def readFingerprint():
    return fp.scanFingerPrint(f)

@app.get("/verify")
def verifyFingerprint():
    return {"verify": "Fingerprint"}