import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useI18n } from '../hooks/useI18n';
import ShopHeader from '../components/ShopHeader';
import SubscriptionPlans from '../components/SubscriptionPlans';
import BundleItem from '../components/BundleItem';
import BoostItem from '../components/BoostItem';
import CoinPackage from '../components/CoinPackage';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

export default function ShopScreen() {
  const { t } = useI18n();
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedCategory, setSelectedCategory] = useState('subscriptions');

  const categories = [
    { id: 'subscriptions', name: 'Subscriptions', icon: 'crown', iconColor: '#fbbf24', iconLibrary: 'FontAwesome5' as const },
    { id: 'bundles', name: 'Bundles', icon: 'gift-outline', iconColor: '#667eea', iconLibrary: 'Ionicons' as const },
    { id: 'boosts', name: 'Boosts', icon: 'flash-outline', iconColor: '#667eea', iconLibrary: 'Ionicons' as const },
    { id: 'coins', name: 'Coins', icon: 'coins', iconColor: '#fbbf24', iconLibrary: 'FontAwesome5' as const },
  ];

  const subscriptionPlans = [
    { id: 'premium', name: 'Premium', price: '9.99', features: ['Ad-free experience', 'Priority support', 'Exclusive content'] },
    { id: 'pro', name: 'Pro', price: '19.99', features: ['Everything in Premium', 'Advanced analytics', 'Custom themes'] },
    { id: 'ultra', name: 'Ultra', price: '29.99', features: ['Everything in Pro', 'Unlimited storage', 'VIP access'] },
  ];

  const bundles = [
    { 
      id: 'starter', 
      name: 'Starter Bundle', 
      description: 'Perfektní balíček pro začátečníky',
      discount: '-20%',
      originalPrice: '24.99',
      price: '19.99',
      items: ['100 mincí', '1 týden Premium', '2x XP boost (24h)']
    },
    { 
      id: 'advanced', 
      name: 'Advanced Bundle', 
      description: 'Pro pokročilé uživatele',
      discount: '-25%',
      originalPrice: '49.99',
      price: '37.49',
      items: ['300 mincí', '1 měsíc Premium', '3x XP boost (48h)', 'Exkluzivní avatar']
    }
  ];

  const boosts = [
    { 
      id: 'xp_boost', 
      name: 'XP Boost', 
      description: 'Zdvojnásobí získané XP body',
      duration: '24 hodin',
      price: '4.99'
    },
    { 
      id: 'coin_boost', 
      name: 'Coin Boost', 
      description: 'Zvýší zisk mincí o 50%',
      duration: '48 hodin',
      price: '7.99'
    },
    { 
      id: 'quest_boost', 
      name: 'Quest Boost', 
      description: 'Odemkne speciální úkoly',
      duration: '7 dní',
      price: '9.99'
    }
  ];

  const coinPackages = [
    { id: 'small', name: 'Malý balíček', amount: '100', bonus: 0, price: '4.99' },
    { id: 'medium', name: 'Střední balíček', amount: '500', bonus: 50, price: '19.99' },
    { id: 'large', name: 'Velký balíček', amount: '1000', bonus: 150, price: '34.99' },
    { id: 'mega', name: 'Mega balíček', amount: '5000', bonus: 1000, price: '99.99' }
  ];

  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrency(currency);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ShopHeader 
        selectedCurrency={selectedCurrency}
        onCurrencyChange={handleCurrencyChange}
      />
      
      <View style={styles.categoryTabsContainer}>
        {categories.map((category) => (
          <TouchableOpacity 
            key={category.id}
            style={[
              styles.categoryTab,
              selectedCategory === category.id && styles.categoryTabActive
            ]}
            onPress={() => handleCategorySelect(category.id)}
          >
            {category.iconLibrary === 'FontAwesome5' ? (
              <FontAwesome5 name={category.icon.replace('-outline', '')} size={18} color={selectedCategory === category.id ? '#ffffff' : '#a0aec0'} />
            ) : (
              <Ionicons name={category.icon} size={20} color={selectedCategory === category.id ? '#ffffff' : '#a0aec0'} />
            )}
            <Text style={[
              styles.categoryTabText,
              selectedCategory === category.id && styles.categoryTabTextActive
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.contentContainer}>
        {/* Subscription Plans */}
        {selectedCategory === 'subscriptions' && (
          <SubscriptionPlans 
            plans={subscriptionPlans}
            selectedCurrency={selectedCurrency}
          />
        )}

        {/* Bundles */}
        {selectedCategory === 'bundles' && (
          <View style={styles.bundlesContainer}>
            {bundles.map((bundle) => (
              <BundleItem 
                key={bundle.id} 
                bundle={bundle} 
                selectedCurrency={selectedCurrency} 
              />
            ))}
          </View>
        )}

        {/* Boosts */}
        {selectedCategory === 'boosts' && (
          <View style={styles.boostsContainer}>
            {boosts.map((boost) => (
              <BoostItem 
                key={boost.id} 
                boost={boost} 
                selectedCurrency={selectedCurrency} 
              />
            ))}
          </View>
        )}

        {/* Coins */}
        {selectedCategory === 'coins' && (
          <View style={styles.coinsContainer}>
            {coinPackages.map((pack) => (
              <CoinPackage 
                key={pack.id} 
                pack={pack} 
                selectedCurrency={selectedCurrency} 
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0f0f23',
    paddingBottom: 60,
  },
  categoryTabsContainer: {
    flexDirection: 'column',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#1a1a35',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    gap: 8,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  categoryTabActive: {
    backgroundColor: '#667eea',
  },
  categoryTabText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
    color: '#a0aec0',
  },
  categoryTabTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  contentContainer: {
    padding: 16,
    paddingTop: 24,
  },
  bundlesContainer: {
    gap: 16,
  },
  boostsContainer: {
    gap: 12,
  },
  coinsContainer: {
    gap: 12,
  },
});