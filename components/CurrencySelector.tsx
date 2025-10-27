import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Currency {
  code: string;
  symbol: string;
  name: string;
  flag: string;
  color: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}

interface CurrencySelectorProps {
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
}

const currencies: Currency[] = [
  { 
    code: 'CZK', 
    symbol: 'Kč', 
    name: 'Czech Koruna', 
    flag: '🇨🇿', 
    color: '#dc2626',
    icon: 'attach-money'
  },
  { 
    code: 'USD', 
    symbol: ', 
    name: 'US Dollar', 
    flag: '🇺🇸', 
    color: '#059669',
    icon: 'monetization-on'
  },
  { 
    code: 'EUR', 
    symbol: '€', 
    name: 'Euro', 
    flag: '🇪🇺', 
    color: '#2563eb',
    icon: 'euro-symbol'
  }
];

export default function CurrencySelector({ selectedCurrency, onCurrencyChange }: CurrencySelectorProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [animatedValue] = useState(new Animated.Value(0));

  const selectedCurrencyData = currencies.find(c => c.code === selectedCurrency) || currencies[1];

  const handleCurrencySelect = (currency: string) => {
    onCurrencyChange(currency);
    setShowDropdown(false);
    
    // Animate close
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const toggleDropdown = () => {
    const toValue = showDropdown ? 0 : 1;
    setShowDropdown(!showDropdown);
    
    Animated.timing(animatedValue, {
      toValue,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const dropdownTransform = {
    opacity: animatedValue,
    transform: [
      {
        translateY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [-10, 0],
        }),
      },
      {
        scale: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.95, 1],
        }),
      },
    ],
  };

  return (
    <View style={styles.currencyContainer}>
      <TouchableOpacity 
        style={[styles.currencyButton, showDropdown && styles.currencyButtonActive]}
        onPress={toggleDropdown}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['rgba(102, 126, 234, 0.1)', 'rgba(102, 126, 234, 0.05)']}
          style={styles.buttonGradient}
        >
          <View style={styles.currencyButtonContent}>
            <View style={styles.currencyInfo}>
              <MaterialIcons 
                name={selectedCurrencyData.icon} 
                size={20} 
                color="#667eea" 
              />
              <Text style={styles.currencyFlag}>{selectedCurrencyData.flag}</Text>
              <Text style={styles.currencyText}>{selectedCurrency}</Text>
              <View style={[styles.currencyDot, { backgroundColor: selectedCurrencyData.color }]} />
            </View>
            <Animated.View
              style={{
                transform: [{
                  rotate: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg'],
                  }),
                }],
              }}
            >
              <Ionicons 
                name="chevron-down" 
                size={18} 
                color="#ffffff" 
              />
            </Animated.View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
      
      {showDropdown && (
        <Animated.View style={[styles.currencyDropdown, dropdownTransform]}>
          <LinearGradient
            colors={['rgba(30, 30, 63, 0.98)', 'rgba(15, 15, 35, 0.98)']}
            style={styles.dropdownGradient}
          >
            {currencies.map((currency, index) => (
              <TouchableOpacity
                key={currency.code}
                style={[
                  styles.currencyOption,
                  selectedCurrency === currency.code && styles.selectedCurrencyOption,
                  index === currencies.length - 1 && styles.lastCurrencyOption
                ]}
                onPress={() => handleCurrencySelect(currency.code)}
                activeOpacity={0.7}
              >
                <View style={styles.currencyOptionContent}>
                  <View style={styles.currencyOptionLeft}>
                    <MaterialIcons 
                      name={currency.icon} 
                      size={24} 
                      color={selectedCurrency === currency.code ? '#667eea' : 'rgba(255, 255, 255, 0.7)'} 
                    />
                    <Text style={styles.currencyOptionFlag}>{currency.flag}</Text>
                    <View style={styles.currencyOptionInfo}>
                      <Text style={[
                        styles.currencyOptionCode,
                        selectedCurrency === currency.code && styles.selectedCurrencyOptionCode
                      ]}>
                        {currency.code}
                      </Text>
                      <Text style={styles.currencyOptionName}>{currency.name}</Text>
                    </View>
                  </View>
                  <View style={styles.currencyOptionRight}>
                    <Text style={[
                      styles.currencyOptionSymbol,
                      selectedCurrency === currency.code && styles.selectedCurrencyOptionSymbol
                    ]}>
                      {currency.symbol}
                    </Text>
                    {selectedCurrency === currency.code && (
                      <MaterialIcons name="check-circle" size={20} color="#667eea" />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </LinearGradient>
        </Animated.View>
      )}
    </View>
  );
}

export { currencies };

const styles = StyleSheet.create({
  currencyContainer: {
    position: 'relative',
    zIndex: 1000,
  },
  currencyButton: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(102, 126, 234, 0.3)',
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  currencyButtonActive: {
    borderColor: '#667eea',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  buttonGradient: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  currencyButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 140,
  },
  currencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currencyFlag: {
    fontSize: 18,
  },
  currencyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  currencyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  currencyDropdown: {
    position: 'absolute',
    top: 65,
    right: 0,
    borderRadius: 20,
    minWidth: 320,
    zIndex: 1001,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 20,
    overflow: 'hidden',
  },
  dropdownGradient: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.3)',
  },
  currencyOption: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(102, 126, 234, 0.1)',
  },
  lastCurrencyOption: {
    borderBottomWidth: 0,
  },
  selectedCurrencyOption: {
    backgroundColor: 'rgba(102, 126, 234, 0.15)',
  },
  currencyOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currencyOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  currencyOptionFlag: {
    fontSize: 24,
  },
  currencyOptionInfo: {
    flex: 1,
  },
  currencyOptionCode: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  selectedCurrencyOptionCode: {
    color: '#667eea',
  },
  currencyOptionName: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'System',
    marginTop: 2,
  },
  currencyOptionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currencyOptionSymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'System',
  },
  selectedCurrencyOptionSymbol: {
    color: '#667eea',
  },
});