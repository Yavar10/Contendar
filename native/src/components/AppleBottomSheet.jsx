import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export function AppleBottomSheet({
  visible,
  onClose,
  maxHeight = '84%',
  children,
  footer
}) {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 20);

  const [isMounted, setIsMounted] = useState(visible);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const isClosingRef = useRef(false);

  useEffect(() => {
    if (visible) {
      isClosingRef.current = false;
      setIsMounted(true);
      slideAnim.setValue(SCREEN_HEIGHT);
      backdropAnim.setValue(0);

      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 260,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 28,
          mass: 0.9,
          stiffness: 240,
          useNativeDriver: true
        })
      ]).start();
    } else if (isMounted && !isClosingRef.current) {
      animateClose();
    }
  }, [visible]);

  const animateClose = (callback) => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    Animated.parallel([
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 220,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 240,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true
      })
    ]).start(() => {
      isClosingRef.current = false;
      setIsMounted(false);
      if (callback) callback();
      else if (onClose) onClose();
    });
  };

  const handleBackdropPress = () => {
    animateClose(onClose);
  };

  if (!isMounted) return null;

  return (
    <Modal
      visible={isMounted}
      transparent
      animationType="none"
      onRequestClose={handleBackdropPress}
      statusBarTranslucent
    >
      <View style={styles.backdrop}>
        {/* Dimmer backdrop with smooth fade animation */}
        <Animated.View style={[styles.dimmer, { opacity: backdropAnim }]}>
          <TouchableOpacity
            style={styles.dismissOverlay}
            onPress={handleBackdropPress}
            activeOpacity={1}
          />
        </Animated.View>

        {/* Slide-Up Sheet Container with Spring Physics & Safe Bottom Breathing Room */}
        <Animated.View
          style={[
            styles.sheetContainer,
            {
              maxHeight,
              paddingBottom: bottomInset + 18,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.grabHandle} />
          {children}
          {Boolean(footer) && <View style={styles.footerWrap}>{footer}</View>}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    position: 'relative'
  },
  dimmer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.65)'
  },
  dismissOverlay: {
    flex: 1
  },
  sheetContainer: {
    backgroundColor: COLORS.secondarySystemBackground,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 20
  },
  grabHandle: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 6
  },
  footerWrap: {
    paddingHorizontal: 20,
    paddingTop: 10
  }
});

