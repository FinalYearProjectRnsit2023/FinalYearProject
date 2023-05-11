
import time
from lib.pyfingerprint import PyFingerprint
from lib.pyfingerprint import FINGERPRINT_CHARBUFFER1
from lib.pyfingerprint import FINGERPRINT_CHARBUFFER2

from time import gmtime, strftime


def scanFingerPrint(sensor: PyFingerprint):
    print("Scanning for fingerprint")
    while sensor.readImage() == False:
        pass

    sensor.convertImage(FINGERPRINT_CHARBUFFER1)
    template = sensor.downloadCharacteristics(FINGERPRINT_CHARBUFFER1)
    print(f"template: {template}")
    return template


def verifyFingerprint(sensor: PyFingerprint, compareTemp: list):
    print("Scanning for fingerprint")
    while sensor.readImage() == False:
        pass

    verf = list()
    for i in range(3):
        sensor.convertImage(FINGERPRINT_CHARBUFFER1)
        sensor.uploadCharacteristics(FINGERPRINT_CHARBUFFER2, compareTemp)
        verf.append(sensor.compareCharacteristics())

    maxVerf = max(verf)
    minVerf = min(verf)
    avgVerf = 0 if len(verf) == 0 else sum(verf)/len(verf)

    return {"maxVerf": maxVerf, "minVerf": minVerf, "avgVerf": avgVerf}
