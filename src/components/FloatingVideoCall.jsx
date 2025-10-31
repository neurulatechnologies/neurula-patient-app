import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { Maximize2, X } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useVideoCall } from '../context/VideoCallContext';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;
const POPUP_WIDTH = 120;
const POPUP_HEIGHT = 160;

export default function FloatingVideoCall() {
  const navigation = useNavigation();
  const { isVideoCallActive, videoCallData, endVideoCall } = useVideoCall();
  const [hasPermission, setHasPermission] = useState(null);

  // Position animation
  const pan = useRef(new Animated.ValueXY({
    x: WINDOW_WIDTH - POPUP_WIDTH - 20,
    y: WINDOW_HEIGHT - POPUP_HEIGHT - 100,
  })).current;

  // Request camera permissions
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Pan responder for dragging
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gesture) => {
        pan.flattenOffset();

        // Snap to edges
        let finalX = pan.x._value;
        let finalY = pan.y._value;

        // Constrain to screen bounds
        if (finalX < 0) finalX = 0;
        if (finalX > WINDOW_WIDTH - POPUP_WIDTH) finalX = WINDOW_WIDTH - POPUP_WIDTH;
        if (finalY < 0) finalY = 0;
        if (finalY > WINDOW_HEIGHT - POPUP_HEIGHT) finalY = WINDOW_HEIGHT - POPUP_HEIGHT;

        Animated.spring(pan, {
          toValue: { x: finalX, y: finalY },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const handleMaximize = () => {
    navigation.navigate('VideoCallScreen', {
      doctor: videoCallData?.doctor,
    });
  };

  const handleClose = () => {
    endVideoCall();
  };

  if (!isVideoCallActive) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
          ],
        },
      ]}
      {...panResponder.panHandlers}
    >
      {/* Camera View */}
      <View style={styles.videoContainer}>
        {hasPermission ? (
          <CameraView
            style={styles.camera}
            facing="front"
          />
        ) : (
          <View style={styles.cameraPlaceholder} />
        )}
      </View>

      {/* Control Buttons */}
      <View style={styles.controls}>
        <Pressable
          style={styles.controlBtn}
          onPress={handleMaximize}
          hitSlop={8}
        >
          <Maximize2 size={16} color="#FFFFFF" />
        </Pressable>
        <Pressable
          style={styles.controlBtn}
          onPress={handleClose}
          hitSlop={8}
        >
          <X size={16} color="#FFFFFF" />
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: POPUP_WIDTH,
    height: POPUP_HEIGHT,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1F104A',
    borderWidth: 2,
    borderColor: '#7A5AF8',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 10,
    zIndex: 9999,
  },
  videoContainer: {
    flex: 1,
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  cameraPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1F104A',
  },
  controls: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    gap: 6,
  },
  controlBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
