
# sudo python3 fingerTest.py

import time
from lib.pyfingerprint import PyFingerprint
from lib.pyfingerprint import FINGERPRINT_CHARBUFFER1
from lib.pyfingerprint import FINGERPRINT_CHARBUFFER2

from time import gmtime, strftime


# Enrolls new finger
##

# Tries to initialize the sensor
try:
    f = PyFingerprint('/dev/serial0', 57600, 0xFFFFFFFF, 0x00000000)

    if (f.verifyPassword() == False):
        raise ValueError('The given fingerprint sensor password is wrong!')

except Exception as e:
    print('The fingerprint sensor could not be initialized!')
    print('Exception message: ' + str(e))
    exit(1)

# Gets some sensor information
print('Currently used templates: ' + str(f.getTemplateCount()) +
      '/' + str(f.getStorageCapacity()))

# Tries to enroll new finger
try:
    print('Waiting for finger...')

    # Wait that finger is read
    while (f.readImage() == False):
        pass

    print("fingerprint read")
    print("saving fingerprint")

    curTime = strftime("%Y%m%d_%H%M%S", gmtime())

    # f.downloadImage(f"./img/test{curTime}.png")
    f.convertImage(FINGERPRINT_CHARBUFFER1)
    template = f.downloadCharacteristics(FINGERPRINT_CHARBUFFER1)
    print(template)
    # tempLoc = f.storeTemplate(FINGERPRINT_CHARBUFFER1)

    for i in range(3):
        print('Waiting for finger...')

        # Wait that finger is read
        while (f.readImage() == False):
            pass

        print("fingerprint read")
        print("saving fingerprint")

        curTime = strftime("%Y%m%d_%H%M%S", gmtime())

        # f.downloadImage(f"./img/test{curTime}.png")
        f.convertImage(FINGERPRINT_CHARBUFFER1)
        template = f.downloadCharacteristics(FINGERPRINT_CHARBUFFER1)
        print(template)


except Exception as e:
    print('Operation failed!')
    print('Exception message: ' + str(e))
    exit(1)
