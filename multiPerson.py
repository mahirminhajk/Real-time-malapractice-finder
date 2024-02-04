import tensorflow as tf
import tensorflow_hub as hub
import cv2
import numpy as np
import matplotlib.pyplot as plt
import os

# to ignore the warning messages
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
# Optional if you want to use GPU
# gpus = tf.config.experimental.list_physical_devices('GPU')
# for gpu in gpus:
#     tf.config.experimental.set_memory_growth(gpu, True)

# Load the model
model = hub.load("https://tfhub.dev/google/movenet/multipose/lightning/1")
movenet = model.signatures['serving_default']

#* find continously looking direction using time
#? Add a dictionary to store the duration the object has been looking in each direction
direction_timers = {'D':0, 'L':0, 'R':0}
#? Add a dictionary to store the threshold for each direction
direction_thresholds = {'D':40, 'L':40, 'R':40}

# Load the video
# cap = cv2.VideoCapture('video/project_test_video.mp4')
cap = cv2.VideoCapture(0)

def draw_keypoints(frame, keypoints, confidence_threshold, person_id):
    y, x, c = frame.shape
    shaped = np.squeeze(np.multiply(keypoints, [y, x, 1]))

    for kp in shaped:
        ky, kx, kp_conf = kp
        if kp_conf > confidence_threshold:
            cv2.circle(frame, (int(kx), int(ky)), 4, (0, 255, 0), -1)
            # Display person ID next to the nose keypoints only
            if kp.tolist() == shaped[0].tolist():
                cv2.putText(frame, str(person_id), (int(kx) + 5, int(ky) + 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 1,
                            cv2.LINE_AA)


def draw_person_id(frame, keypoints, confidence_threshold, person_id):
    y, x, c = frame.shape
    shaped = np.squeeze(np.multiply(keypoints, [y, x, 1]))

    ky, kx, kp_conf = shaped[0]
    if kp_conf > confidence_threshold:
        cv2.putText(frame, str(person_id), (int(kx) + 5, int(ky) + 5), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 1,
                    cv2.LINE_AA)

def find_head_postion(frame, keypoints, confidence_threshold):
    y, x, c = frame.shape
    shaped = np.squeeze(np.multiply(keypoints, [y, x, 1]))

    ley, lex, le_conf = shaped[1]
    rey, rex, re_conf = shaped[2]

    leay, leax, lea_conf = shaped[3]
    reay, reax, rea_conf = shaped[4]

    #? looking down
    if le_conf > confidence_threshold and re_conf > confidence_threshold and lea_conf > confidence_threshold and rea_conf > confidence_threshold:
        rdDiff = round(reay - rey  , 1)
        lDiff = round(leay - ley, 1)
        if rdDiff < 0 and lDiff < 0:
            cv2.putText(frame, "D", (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2, cv2.LINE_AA)
            direction_timers['D'] += 1
        else:
            direction_timers['D'] = 0


    #? right
    if re_conf > confidence_threshold and rea_conf > confidence_threshold:
        # right eye and right ear difference
        rDiff = round(rex - reax, 1)
          # head position in right
        if rDiff < 5:
            cv2.putText(frame, "R", (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2, cv2.LINE_AA)
            direction_timers['R'] += 1
        else:
            direction_timers['R'] = 0

    #? left
    if le_conf > confidence_threshold and lea_conf > confidence_threshold:
        # left eye and left ear difference
        lDiff = round(lex - leax, 1)
         # head position in left
       # head position in left
        if lDiff > 5:
            cv2.putText(frame, "L", (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2, cv2.LINE_AA)
            direction_timers['L'] += 1
        else:
            direction_timers['L'] = 0

    for direction, timer in direction_timers.items():
        if timer >= direction_thresholds[direction]:
            if(direction == 'D'):
                content = f"Student is looking down"
            elif(direction == 'L'):
                content = f"Student is looking left"
            elif(direction == 'R'):
                content = f"Student is looking right"
            print(content)


    

EDGES = {
    (0, 1): 'm',
    (0, 2): 'c',
    (1, 3): 'm',
    (2, 4): 'c',
    (0, 5): 'm',
    (0, 6): 'c',
    (5, 7): 'm',
    (7, 9): 'm',
    (6, 8): 'c',
    (8, 10): 'c',
    (5, 6): 'y',
    (5, 11): 'm',
    (6, 12): 'c',
    (11, 12): 'y',
    (11, 13): 'm',
    (13, 15): 'm',
    (12, 14): 'c',
    (14, 16): 'c'
}

def draw_connections(frame, keypoints, edges, confidence_threshold):
    y, x, c = frame.shape
    shaped = np.squeeze(np.multiply(keypoints, [y, x, 1]))

    for edge, color in edges.items():
        p1, p2 = edge
        y1, x1, c1 = shaped[p1]
        y2, x2, c2 = shaped[p2]

        if (c1 > confidence_threshold) & (c2 > confidence_threshold):
            cv2.line(frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 0, 255), 2)

#* Function to loop through each person detected and render
def loop_through_people(frame, keypoints_with_scores, edges, confidence_threshold):
    for person_id, person in enumerate(keypoints_with_scores):
        if(person_id == 0):
            draw_person_id(frame, person, confidence_threshold, person_id)
            # draw_keypoints(frame, person, confidence_threshold, person_id)
            # draw_connections(frame, person, edges, confidence_threshold)
            find_head_postion(frame, person, confidence_threshold)

while cap.isOpened():
    ret, frame = cap.read()

    # print(frame.shape)

    # Reshape the frame as per the model input
    #! max of 256 and multiple of 16
    img = frame.copy()
    # img = tf.image.resize_with_pad(tf.expand_dims(img, axis=0), 192, 256)
    img = tf.image.resize_with_pad(tf.expand_dims(img, axis=0), 192, 320)
    input_img = tf.cast(img, dtype=tf.int32)

    # Detection section
    results = movenet(input_img)
    keypoints_with_scores = results['output_0'].numpy()[:,:,:51].reshape((6,17,3))

    # Rendering section
    loop_through_people(frame, keypoints_with_scores, EDGES, 0.3)

    cv2.imshow('MOVENET MULTIPOSE', frame)

    if cv2.waitKey(10) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()




# (720, 1280, 3)

# 1280 / 4 = 320
# 720 / 4 = 0.5625

# 320 * 0.5625 = 180
# 180 */ 32  = 5.625
# 32 * 5 = 160
# 32 * 6 = 192

# 192	320