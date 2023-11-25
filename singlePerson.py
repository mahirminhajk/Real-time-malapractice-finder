import tensorflow as tf
import numpy as np
from matplotlib import pyplot as plt
import cv2
import os

# to ignore the warning messages
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

interpreter = tf.lite.Interpreter(model_path='lite-model_movenet_singlepose_lightning_3.tflite')
interpreter.allocate_tensors()

def draw_keypoints(frame, keypoints, confidence_threshold):
    y, x, c = frame.shape

    #* print(frame.shape) :- (720, 720, 3)
    #* print(keypoints.shape):- (1, 1, 17, 3),
    #* --------------------------y, x, 17 keypoints, prediction confidence
    
    shaped = np.squeeze(np.multiply(keypoints, [y,x,1]))
    
    #* np.multiply() :- Multiply arguments element-wise. eg. np.multiply(2.0, 4.0) = 8.0,
    #* eg with array: np.multiply([1, 2], [3, 4]) = array([3, 8])

    #* np.squeeze() :- Remove single-dimensional entries from the shape of an array.
    #* eg. np.squeeze([[0], [1], [2]]) = array([0, 1, 2])
    
    for kp in shaped:
        ky, kx, kp_conf = kp
        if kp_conf > confidence_threshold:
            cv2.circle(frame, (int(kx), int(ky)), 4, (0,255,0), -1) 

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
    shaped = np.squeeze(np.multiply(keypoints, [y,x,1]))
    
    for edge, color in edges.items():
        p1, p2 = edge
        y1, x1, c1 = shaped[p1]
        y2, x2, c2 = shaped[p2]
        
        if (c1 > confidence_threshold) & (c2 > confidence_threshold):      
            cv2.line(frame, (int(x1), int(y1)), (int(x2), int(y2)), (0,0,255), 2)


    #* get the kepypoints of nose, left and right shoulders
    ny, nx, n_conf = keypoints[0]
    ly, lx, l_conf = keypoints[1]
    ry, rx, r_conf = keypoints[2]

    if n_conf > confidence_threshold and l_conf > confidence_threshold and r_conf > confidence_threshold:
        # Person is likely looking straight
        return "straight"
    elif n_conf > confidence_threshold and l_conf > confidence_threshold:
        # Person is looking to the right
        return "right"
    elif n_conf > confidence_threshold and r_conf > confidence_threshold:
        # Person is looking to the left
        return "left"
    else:
        # Person is looking in some other direction or keypoints are not confident enough
        return "no"

#? custom fun
def find_direction(frame, keypoints, confidence_threshold=0.4):
    y, x, c = frame.shape
    shaped = np.squeeze(np.multiply(keypoints, [y,x,1]))
    
    ny, nx, n_conf = shaped[0]
    ley, lex, le_conf = shaped[1]
    rey, rex, re_conf = shaped[2]

    leay, leax, lea_conf = shaped[3]
    reay, reax, rea_conf = shaped[4]

    lsy, lsx, ls_conf = shaped[5]
    rsy, rsx, rs_conf = shaped[6]

    #* if button p is pressed then print the different between right eye and right ear x axis distance
    # difference = rex - reax
    # rounded_difference = round(difference, 2)
    # print(rounded_difference)        

    if n_conf > confidence_threshold:
        cv2.circle(frame, (int(nx), int(ny)), 4, (0,255,0), -1)
        cv2.circle(frame, (int(lex), int(ley)), 4, (0,255,0), -1)
        cv2.circle(frame, (int(rex), int(rey)), 4, (0,255,0), -1)
        cv2.circle(frame, (int(leax), int(leay)), 4, (0,255,0), -1)
        cv2.circle(frame, (int(reax), int(reay)), 4, (0,255,0), -1)
        cv2.circle(frame, (int(lsx), int(lsy)), 4, (0,255,0), -1)
        cv2.circle(frame, (int(rsx), int(rsy)), 4, (0,255,0), -1)
        # draw line b/w right eye and right ear
        cv2.line(frame, (int(rex), int(rey)), (int(reax), int(reay)), (0,0,255), 2)
        # draw line b/w left eye and left ear
        cv2.line(frame, (int(lex), int(ley)), (int(leax), int(leay)), (0,0,255), 2)

#? fun to find person looking right or left
def find_head_postion(frame, keypoints, confidence_threshold=0.1):
    y, x, c = frame.shape
    shaped = np.squeeze(np.multiply(keypoints, [y,x,1]))

    ley, lex, le_conf = shaped[1]
    rey, rex, re_conf = shaped[2]

    leay, leax, lea_conf = shaped[3]
    reay, reax, rea_conf = shaped[4]

    #? looking down
    if le_conf > confidence_threshold and re_conf > confidence_threshold and lea_conf > confidence_threshold and rea_conf > confidence_threshold:
        rdDiff = round(reay - rey  , 1)
        lDiff = round(leay - ley, 1)
        if rdDiff < -18 and lDiff < -18:
            cv2.putText(frame, "D", (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2, cv2.LINE_AA)


    #? right
    if re_conf > confidence_threshold and rea_conf > confidence_threshold:
        # right eye and right ear difference
        rDiff = round(rex - reax, 1)
          # head position in right
        if rDiff < 5:
            cv2.putText(frame, "R", (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2, cv2.LINE_AA)

    #? left
    if le_conf > confidence_threshold and lea_conf > confidence_threshold:
        # left eye and left ear difference
        lDiff = round(lex - leax, 1)
         # head position in left
        if lDiff > 5:
            cv2.putText(frame, "L", (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2, cv2.LINE_AA)

  
   
        
    









cap = cv2.VideoCapture('video/single_person_project_video.mp4')
#cap = cv2.VideoCapture(0)
while cap.isOpened():
    ret, frame = cap.read()
    
    # Reshape image
    img = frame.copy()
    img = tf.image.resize_with_pad(np.expand_dims(img, axis=0), 192, 192)
    input_image = tf.cast(img, dtype=tf.float32)
    
    # Setup input and output 
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    
    # Make predictions 
    interpreter.set_tensor(input_details[0]['index'], np.array(input_image))
    interpreter.invoke()
    keypoints_with_scores = interpreter.get_tensor(output_details[0]['index'])

    # direction = determine_direction(keypoints_with_scores[0])
    # cv2.putText(frame, direction, (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2, cv2.LINE_AA)

    # Rendering 
    # draw_connections(frame, keypoints_with_scores, EDGES, 0.4)
    # draw_keypoints(frame, keypoints_with_scores, 0.4)
    find_direction(frame, keypoints_with_scores, 0.4)
    find_head_postion(frame, keypoints_with_scores)
    
    cv2.imshow('MoveNet Lightning', frame)
    
    if cv2.waitKey(10) & 0xFF==ord('q'):
        break
        
cap.release()
cv2.destroyAllWindows()


# [nose, left eye, right eye, left ear, right ear, left shoulder, right shoulder, left elbow, right elbow, left wrist, right wrist, left hip, right hip, left knee, right knee, left ankle, right ankle]
# nose - shaped[0]
# left eye - shaped[1]
# right eye - shaped[2]
# left ear - shaped[3]
# right ear - shaped[4]
# left shoulder - shaped[5]
# right shoulder - shaped[6]
# left elbow - shaped[7]
# right elbow - shaped[8]
# left wrist - shaped[9]
# right wrist - shaped[10]
# left hip - shaped[11]
# right hip - shaped[12]
# left knee - shaped[13]
# right knee - shaped[14]
# left ankle - shaped[15]
# right ankle - shaped[16]

