import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { SIZES } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface VideoPlayerProps {
  duration: number; // total duration in seconds
  currentTime?: number; // current time in seconds
  thumbnail?: string;
  videoUrl: string; // Required for the exercise content
}

const { width } = Dimensions.get('window');

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  duration,
  currentTime = 0,
  thumbnail,
  videoUrl, // FIXED: Added destructuring here to satisfy the interface
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <View style={styles.container}>
      {/* Video Placeholder/Thumbnail */}
      <TouchableOpacity
        style={styles.videoContainer}
        onPress={() => setIsPlaying(!isPlaying)}
        activeOpacity={0.9}
      >
        <View style={styles.videoPlaceholder}>
          {/* Note: This is currently a UI placeholder. 
              To play the actual videoUrl, you would use <Video source={{ uri: videoUrl }} /> from expo-av here. */}
          {!isPlaying && (
            <View style={styles.playButton}>
              <Ionicons name="play" size={48} color={colors.text} />
            </View>
          )}
          {isPlaying && (
             <View style={styles.playButton}>
                <Ionicons name="pause" size={48} color={colors.text} />
             </View>
          )}
        </View>
      </TouchableOpacity>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
          <View style={[styles.scrubber, { left: `${progress}%` }]} />
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: SIZES.radiusLg,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  videoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    width: '100%',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: colors.inputBg,
    borderRadius: 2,
    position: 'relative',
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  scrubber: {
    position: 'absolute',
    top: -6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    marginLeft: -8,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});