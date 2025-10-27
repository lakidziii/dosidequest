import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BoostItemProps {
  boost: {
    id: string;
    name: string;
    description: string;
    duration: string;
    price: string;
  };
  selectedCurrency: string;
}

const BoostItem = ({ boost, selectedCurrency }: BoostItemProps) => {
  const currencySymbol = selectedCurrency === 'USD' ? '$' : (selectedCurrency === 'EUR' ? '€' : 'Kč');
  
  return (
    <TouchableOpacity style={styles.boostItem}>
      <View style={styles.boostIconContainer}>
        <Ionicons name="flash" size={28} color="#667eea" />
      </View>
      <View style={styles.boostContent}>
        <Text style={styles.boostName}>{boost.name}</Text>
        <Text style={styles.boostDescription}>{boost.description}</Text>
        <Text style={styles.boostDuration}>Trvání: {boost.duration}</Text>
      </View>
      <View style={styles.boostPricing}>
        <Text style={styles.boostPrice}>{currencySymbol}{boost.price}</Text>
        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buyButtonText}>Koupit</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  boostItem: {
    backgroundColor: '#1a1a35',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  boostIconContainer: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  boostContent: {
    flex: 1,
  },
  boostName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  boostDescription: {
    fontSize: 14,
    color: '#a0aec0',
    marginBottom: 4,
  },
  boostDuration: {
    fontSize: 12,
    color: '#e2e8f0',
  },
  boostPricing: {
    alignItems: 'flex-end',
  },
  boostPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
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

export default BoostItem;