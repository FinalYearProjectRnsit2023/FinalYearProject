
import time
from lib.pyfingerprint import PyFingerprint
from lib.pyfingerprint import FINGERPRINT_CHARBUFFER1
from lib.pyfingerprint import FINGERPRINT_CHARBUFFER2

from time import gmtime, strftime

def scanFingerPrint(sensor: PyFingerprint):
    print("Scanning for fingerprint")
    while sensor.read() == False:
        pass
    
    sensor.convertImage(FINGERPRINT_CHARBUFFER1)
    template = sensor.downloadCharacteristics(FINGERPRINT_CHARBUFFER1)
    print(f"template: {template}")

template = "[231,1234,2345,73,3245]"
template = template[1:-1]
template = [int(t) for t in template.split(',')]