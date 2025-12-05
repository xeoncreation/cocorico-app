"use client";

import { useState, useEffect } from 'react';

export interface MediaPermissions {
  camera: PermissionState | 'unknown';
  microphone: PermissionState | 'unknown';
}

export function useMediaPermissions() {
  const [permissions, setPermissions] = useState<MediaPermissions>({
    camera: 'unknown',
    microphone: 'unknown',
  });

  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.permissions) {
      return;
    }

    const checkPermissions = async () => {
      try {
        const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });
        const microphonePermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });

        setPermissions({
          camera: cameraPermission.state,
          microphone: microphonePermission.state,
        });

        // Listen for permission changes
        cameraPermission.addEventListener('change', () => {
          setPermissions(prev => ({ ...prev, camera: cameraPermission.state }));
        });

        microphonePermission.addEventListener('change', () => {
          setPermissions(prev => ({ ...prev, microphone: microphonePermission.state }));
        });
      } catch (error) {
        console.warn('Could not query permissions:', error);
      }
    };

    checkPermissions();
  }, []);

  const requestCameraPermission = async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setPermissions(prev => ({ ...prev, camera: 'granted' }));
      return true;
    } catch (error) {
      console.error('Camera permission denied:', error);
      setPermissions(prev => ({ ...prev, camera: 'denied' }));
      return false;
    }
  };

  const requestMicrophonePermission = async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setPermissions(prev => ({ ...prev, microphone: 'granted' }));
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      setPermissions(prev => ({ ...prev, microphone: 'denied' }));
      return false;
    }
  };

  const requestBothPermissions = async (): Promise<{ camera: boolean; microphone: boolean }> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      stream.getTracks().forEach(track => track.stop());
      setPermissions({ camera: 'granted', microphone: 'granted' });
      return { camera: true, microphone: true };
    } catch (error) {
      console.error('Media permissions denied:', error);
      // Try individually
      const camera = await requestCameraPermission();
      const microphone = await requestMicrophonePermission();
      return { camera, microphone };
    }
  };

  return {
    permissions,
    requestCameraPermission,
    requestMicrophonePermission,
    requestBothPermissions,
  };
}
