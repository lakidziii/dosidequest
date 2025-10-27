import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface CoinPackageProps {
  pack: {
    id: string;
    name: string;
    amount: string;
    bonus: number;
    price: string;
  };
  selectedCurrency: string;
}

const CoinPackage = ({ pack, selectedCurrency }: CoinPackageProps) => {
  const currencySymbol = selectedCurrency === 'USD' ? '$' : (selectedCurrency === 'EUR' ? '€' : 'Kč');
  
  return (
    <TouchableOpacity style={styles.coinPackage}>
      <View style={styles.coinIconContainer}>
        <FontAwesome5 name="coins" size={24} color="#fbbf24" />
        <Text style={styles.coinAmount}>{pack.amount}</Text>
      </View>
      <View style={styles.coinContent}>
        <Text style={styles.coinName}>{pack.name}</Text>
        {pack.bonus > 0 && (
          <Text style={styles.coinBonus}>+{pack.bonus} bonus</Text>
        )}
      </View>
      <View style={styles.coinPricing}>
        <Text style={styles.coinPrice}>{currencySymbol}{pack.price}</Text>
        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buyButtonText}>Koupit</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  coinPackage: {
    backgroundColor: '#1a1a35',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  coinIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  coinAmount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 4,
  },
  coinContent: {
    flex: 1,
  },
  coinName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  coinBonus: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '500',
  },
  coinPricing: {
    alignItems: 'flex-end',
  },
  coinPrice: {
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

export default CoinPackage;