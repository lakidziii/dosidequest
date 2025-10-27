import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

interface Category {
  id: string;
  name: string;
  icon: string;
  iconColor: string;
  iconLibrary: 'FontAwesome5' | 'Ionicons';
}

interface CategoryCardProps {
  category: Category;
  onPress?: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress }) => {
  return (
    <TouchableOpacity style={styles.categoryCard} onPress={onPress}>
      <View style={styles.categoryIcon}>
        {category.iconLibrary === 'FontAwesome5' ? (
          <FontAwesome5 name={category.icon} size={32} color={category.iconColor} />
        ) : (
          <Ionicons name={category.icon as any} size={32} color={category.iconColor} />
        )}
      </View>
      <Text style={styles.categoryName}>{category.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  categoryCard: {
    width: '100%',
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.3)',
  },
  categoryIcon: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(102, 126, 234, 0.4)',
  },
  categoryName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'System',
    letterSpacing: 0.5,
    marginLeft: 20,
    flex: 1,
  },
});

export default CategoryCard;