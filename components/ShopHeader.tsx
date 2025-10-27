import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface Currency {
  code: string;
  symbol: string;
  name: string;
}

interface ShopHeaderProps {
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
}

const ShopHeader: React.FC<ShopHeaderProps> = ({ selectedCurrency, onCurrencyChange }) => {
  const router = useRouter();
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  const currencies: Currency[] = [
    { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' }
  ];

  const handleCurrencySelect = (currency: string) => {
    onCurrencyChange(currency);
    setShowCurrencyDropdown(false);
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#ffffff" />
      </TouchableOpacity>
      
      <View style={styles.headerCenter}>
        <Ionicons name="storefront" size={32} color="#667eea" />
        <Text style={styles.headerTitle}>Shop</Text>
      </View>
      
      <View style={styles.currencyContainer}>
        <TouchableOpacity 
          style={styles.currencyButton}
          onPress={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
        >
          <Text style={styles.currencyText}>{selectedCurrency}</Text>
          <Ionicons 
            name={showCurrencyDropdown ? "chevron-up" : "chevron-down"} 
            size={16} 
            color="#ffffff" 
          />
        </TouchableOpacity>
        
        {showCurrencyDropdown && (
          <View style={styles.currencyDropdown}>
            {currencies.map((currency) => (
              <TouchableOpacity
                key={currency.code}
                style={[
                  styles.currencyOption,
                  selectedCurrency === currency.code && styles.selectedCurrencyOption
                ]}
                onPress={() => handleCurrencySelect(currency.code)}
              >
                <Text style={[
                  styles.currencyOptionText,
                  selectedCurrency === currency.code && styles.selectedCurrencyOptionText
                ]}>
                  {currency.code} ({currency.symbol})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1e1e3f',
    backgroundColor: '#0f0f23',
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'System',
    letterSpacing: 1,
  },
  currencyContainer: {
    position: 'relative',
  },
  currencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e3f',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 1,
    borderWidth: 1,
    borderColor: '#667eea',
  },
  currencyDropdown: {
    position: 'absolute',
    top: 50,
    right: 0,
    backgroundColor: '#1e1e3f',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#667eea',
    minWidth: 150,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  currencyOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(102, 126, 234, 0.2)',
  },
  selectedCurrencyOption: {
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
  },
  currencyOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'System',
  },
  selectedCurrencyOptionText: {
    color: '#667eea',
  },
  currencyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'System',
  },
});

export default ShopHeader;