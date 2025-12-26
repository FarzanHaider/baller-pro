import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, SIZES } from '@/constants/theme';
import { Post } from '@/types/community';

interface PostCardProps {
  post: Post;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onUserPress?: () => void;
}

export default function PostCard({ 
  post, 
  onLike, 
  onComment, 
  onShare, 
  onUserPress 
}: PostCardProps) {
  
  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const postDate = new Date(timestamp);
    const diffMs = now.getTime() - postDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity 
        style={styles.header} 
        activeOpacity={0.7}
        onPress={onUserPress}
      >
        <Image 
          source={{ uri: post.author.avatar }} 
          style={styles.avatar}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.authorName}>{post.author.name}</Text>
          <Text style={styles.timestamp}>{getTimeAgo(post.timestamp)}</Text>
        </View>
        
        {post.score && (
          <View style={styles.scoreBadge}>
            <MaterialIcons name="star" size={16} color={COLORS.primary} />
            <Text style={styles.scoreText}>{post.score}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Content */}
      <Text style={styles.content}>{post.content}</Text>

      {/* Workout Details */}
      {post.workoutType && (
        <View style={styles.workoutCard}>
          <Text style={styles.workoutType}>{post.workoutType}</Text>
          <View style={styles.workoutDetails}>
            {post.workoutDetails?.duration && (
              <Text style={styles.workoutStat}>{post.workoutDetails.duration}</Text>
            )}
            {post.workoutDetails?.distance && (
              <Text style={styles.workoutStat}>{post.workoutDetails.distance}</Text>
            )}
            {post.workoutDetails?.pace && (
              <Text style={styles.workoutStat}>{post.workoutDetails.pace}</Text>
            )}
            {post.workoutDetails?.calories && (
              <Text style={styles.workoutStat}>{post.workoutDetails.calories} kcal</Text>
            )}
          </View>
        </View>
      )}

      {/* Image */}
      {post.image && (
        <Image 
          source={{ uri: post.image }} 
          style={styles.postImage}
          resizeMode="cover"
        />
      )}

      {/* Action Bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity 
          style={styles.actionButton}
          activeOpacity={0.7}
          onPress={onLike}
        >
          <MaterialIcons 
            name={post.isLiked ? "favorite" : "favorite-border"} 
            size={20} 
            color={post.isLiked ? COLORS.primary : COLORS.textSecondary} 
          />
          <Text style={[
            styles.actionText,
            post.isLiked && { color: COLORS.primary }
          ]}>
            {post.likes}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          activeOpacity={0.7}
          onPress={onComment}
        >
          <MaterialIcons 
            name="chat-bubble-outline" 
            size={20} 
            color={COLORS.textSecondary} 
          />
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          activeOpacity={0.7}
          onPress={onShare}
        >
          <MaterialIcons 
            name="share" 
            size={20} 
            color={COLORS.textSecondary} 
          />
          <Text style={styles.actionText}>{post.shares}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    padding: SPACING.m,
    marginBottom: SPACING.m,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surfaceHighlight,
  },
  headerInfo: {
    flex: 1,
    marginLeft: SPACING.m,
  },
  authorName: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.bold,
    marginBottom: 2,
  },
  timestamp: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontFamily: FONTS.regular,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    borderRadius: SIZES.radiusFull,
    gap: 4,
  },
  scoreText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  content: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: FONTS.regular,
    lineHeight: 20,
    marginBottom: SPACING.m,
  },
  workoutCard: {
    backgroundColor: COLORS.surfaceHighlight,
    borderRadius: SIZES.radius,
    padding: SPACING.m,
    marginBottom: SPACING.m,
  },
  workoutType: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: FONTS.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.s,
  },
  workoutDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.m,
  },
  workoutStat: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.surfaceHighlight,
    marginBottom: SPACING.m,
  },
  actionBar: {
    flexDirection: 'row',
    gap: SPACING.l,
    paddingTop: SPACING.s,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
  },
  actionText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: FONTS.medium,
  },
});

