import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  features: string[];
}

interface SubscriptionCardProps {
  plan: SubscriptionPlan;
  index: number;
  selectedCurrency: string;
  onPress?: () => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ plan, index, selectedCurrency, onPress }) => {
  const currencies = [
    { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' }
  ];

  const getCurrencySymbol = (code: string) => {
    const currency = currencies.find(c => c.code === code);
    return currency ? currency.symbol : '$';
  };

  const getCardStyle = () => {
    switch (index) {
      case 0:
        return styles.basicCard;
      case 1:
        return styles.proCard;
      case 2:
        return styles.ultraCard;
      default:
        return {};
    }
  };

  const getNameStyle = () => {
    switch (index) {
      case 0:
        return styles.basicName;
      case 1:
        return styles.proName;
      case 2:
        return styles.ultraName;
      default:
        return {};
    }
  };

  const getPriceStyle = () => {
    switch (index) {
      case 0:
        return styles.basicPrice;
      case 1:
        return styles.proPrice;
      case 2:
        return styles.ultraPrice;
      default:
        return {};
    }
  };

  const getFeatureStyle = () => {
    switch (index) {
      case 0:
        return styles.basicFeature;
      case 1:
        return styles.proFeature;
      case 2:
        return styles.ultraFeature;
      default:
        return {};
    }
  };

  const getIconSize = () => {
    switch (index) {
      case 0:
        return 16;
      case 1:
        return 18;
      case 2:
        return 20;
      default:
        return 16;
    }
  };

  const getIconColor = () => {
    switch (index) {
      case 0:
        return '#60a5fa';
      case 1:
        return '#fbbf24';
      case 2:
        return '#a78bfa';
      default:
        return '#60a5fa';
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.subscriptionCard, getCardStyle()]}
      onPress={onPress}
    >
      <View style={styles.subscriptionHeader}>
        <Text style={[styles.subscriptionName, getNameStyle()]}>
          {plan.name}
        </Text>
        <Text style={[styles.subscriptionPrice, getPriceStyle()]}>
          {getCurrencySymbol(selectedCurrency)}{plan.price}/mo
        </Text>
      </View>
      
      <View style={styles.featuresContainer}>
        {plan.features.map((feature, featureIndex) => (
          <View key={featureIndex} style={styles.featureRow}>
            <MaterialIcons 
              name="check-circle" 
              size={getIconSize()} 
              color={getIconColor()}
              style={styles.featureIcon}
            />
            <Text style={[styles.featureText, getFeatureStyle()]}>
              {feature}
            </Text>
          </View>
        ))}
      </View>
      
      {/* Premium badge pro prostřední kartu */}
      {index === 1 && (
        <View style={styles.premiumBadge}>
          <Text style={styles.premiumBadgeText}>MOST POPULAR</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  subscriptionCard: {
    backgroundColor: 'rgba(15, 15, 35, 0.98)',
    borderRadius: 28,
    padding: 28,
    borderWidth: 2,
    borderColor: 'rgba(251, 191, 36, 0.5)',
    width: 320,
    marginRight: 20,
    shadowColor: '#fbbf24',
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 20,
    position: 'relative',
    overflow: 'visible',
  },
  basicCard: {
    borderColor: 'rgba(59, 130, 246, 0.7)',
    shadowColor: '#3b82f6',
    backgroundColor: 'rgba(8, 15, 35, 0.98)',
    borderRadius: 24,
    elevation: 15,
    shadowOpacity: 0.4,
    shadowRadius: 20,
    borderWidth: 2.5,
  },
  proCard: {
    borderColor: 'rgba(245, 158, 11, 0.8)',
    shadowColor: '#f59e0b',
    backgroundColor: 'rgba(25, 18, 8, 0.98)',
    borderRadius: 26,
    elevation: 18,
    shadowOpacity: 0.45,
    shadowRadius: 22,
    borderWidth: 3,
    transform: [{ scale: 1.02 }],
  },
  ultraCard: {
    borderColor: 'rgba(139, 92, 246, 0.9)',
    shadowColor: '#8b5cf6',
    backgroundColor: 'rgba(20, 12, 35, 0.98)',
    transform: [{ scale: 1.05 }],
    elevation: 25,
    borderRadius: 30,
    shadowOpacity: 0.6,
    shadowRadius: 28,
    borderWidth: 3.5,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(251, 191, 36, 0.2)',
    gap: 16,
  },
  subscriptionName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fbbf24',
    fontFamily: 'System',
    letterSpacing: 1,
    textTransform: 'uppercase',
    flex: 1,
    textShadowColor: 'rgba(251, 191, 36, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    lineHeight: 20,
  },
  basicName: {
    color: '#60a5fa',
    fontSize: 17,
    letterSpacing: 0.8,
    textShadowColor: 'rgba(96, 165, 250, 0.4)',
    lineHeight: 19,
  },
  proName: {
    color: '#fbbf24',
    fontSize: 19,
    letterSpacing: 1.2,
    textShadowColor: 'rgba(251, 191, 36, 0.5)',
    textShadowRadius: 5,
    lineHeight: 21,
  },
  ultraName: {
    color: '#a78bfa',
    fontSize: 21,
    letterSpacing: 1.5,
    textShadowColor: 'rgba(167, 139, 250, 0.6)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
    lineHeight: 23,
  },
  subscriptionPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    fontFamily: 'System',
    textShadowColor: 'rgba(251, 191, 36, 0.6)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
    flexShrink: 0,
    letterSpacing: 0.5,
  },
  basicPrice: {
    fontSize: 20,
    textShadowColor: 'rgba(96, 165, 250, 0.6)',
  },
  proPrice: {
    fontSize: 24,
    textShadowColor: 'rgba(251, 191, 36, 0.7)',
    textShadowRadius: 7,
  },
  ultraPrice: {
    fontSize: 26,
    textShadowColor: 'rgba(167, 139, 250, 0.8)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
    letterSpacing: 1,
  },
  featuresContainer: {
    gap: 8,
    marginTop: 6,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  featureIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  featureText: {
    fontSize: 15,
    color: '#f1f5f9',
    fontFamily: 'System',
    fontWeight: '600',
    lineHeight: 22,
    paddingLeft: 8,
    position: 'relative',
    letterSpacing: 0.3,
  },
  basicFeature: {
    fontSize: 14,
    color: '#e2e8f0',
    fontWeight: '500',
  },
  proFeature: {
    fontSize: 15,
    color: '#f1f5f9',
    fontWeight: '600',
  },
  ultraFeature: {
    fontSize: 16,
    color: '#f8fafc',
    fontWeight: '700',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(167, 139, 250, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  premiumBadge: {
    position: 'absolute',
    top: -16,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: '#f59e0b',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
    zIndex: 10,
    borderWidth: 2,
    borderColor: '#fbbf24',
  },
  premiumBadgeText: {
    color: '#000',
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontFamily: 'System',
  },
});

export default SubscriptionCard;