import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface BundleItemProps {
  bundle: {
    id: string;
    name: string;
    description: string;
    discount: string;
    originalPrice: string;
    price: string;
    items: string[];
  };
  selectedCurrency: string;
}

const BundleItem = ({ bundle, selectedCurrency }: BundleItemProps) => {
  const currencySymbol = selectedCurrency === 'USD' ? '$' : (selectedCurrency === 'EUR' ? '€' : 'Kč');
  
  return (
    <TouchableOpacity style={styles.bundleItem}>
      <View style={styles.bundleHeader}>
        <Text style={styles.bundleName}>{bundle.name}</Text>
        <View style={styles.bundleBadge}>
          <Text style={styles.bundleBadgeText}>{bundle.discount}</Text>
        </View>
      </View>
      <View style={styles.bundleContent}>
        <View style={styles.bundleIconContainer}>
          <FontAwesome5 name="gift" size={32} color="#667eea" />
        </View>
        <View style={styles.bundleDetails}>
          <Text style={styles.bundleDescription}>{bundle.description}</Text>
          <View style={styles.bundleItems}>
            {bundle.items.map((item, index) => (
              <Text key={index} style={styles.bundleItemText}>• {item}</Text>
            ))}
          </View>
        </View>
      </View>
      <View style={styles.bundlePricing}>
        <Text style={styles.bundleOriginalPrice}>{currencySymbol}{bundle.originalPrice}</Text>
        <Text style={styles.bundlePrice}>{currencySymbol}{bundle.price}</Text>
        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buyButtonText}>Koupit</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bundleItem: {
    backgroundColor: '#1a1a35',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  bundleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bundleName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  bundleBadge: {
    backgroundColor: '#667eea',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  bundleBadgeText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 12,
  },
  bundleContent: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  bundleIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  bundleDetails: {
    flex: 1,
  },
  bundleDescription: {
    fontSize: 14,
    color: '#a0aec0',
    marginBottom: 8,
  },
  bundleItems: {
    gap: 4,
  },
  bundleItemText: {
    fontSize: 14,
    color: '#e2e8f0',
  },
  bundlePricing: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  bundleOriginalPrice: {
    fontSize: 14,
    color: '#a0aec0',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  bundlePrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 16,
  },
  buyButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buyButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default BundleItem;