import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useI18n } from '../hooks/useI18n';
import ShopHeader from '../components/ShopHeader';
import CategoryCard from '../components/CategoryCard';
import SubscriptionPlans from '../components/SubscriptionPlans';

export default function ShopScreen() {
  const { t } = useI18n();
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

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

  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrency(currency);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ShopHeader 
        selectedCurrency={selectedCurrency}
        onCurrencyChange={handleCurrencyChange}
      />
      
      <View style={styles.categoriesContainer}>
        {categories.map((category) => (
          <View key={category.id}>
            <CategoryCard category={category} />
            
            {/* Subscription Plans pro subscriptions kategorii */}
            {category.id === 'subscriptions' && (
              <SubscriptionPlans 
                plans={subscriptionPlans}
                selectedCurrency={selectedCurrency}
              />
            )}
          </View>
        ))}
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
  categoriesContainer: {
    padding: 60,
    gap: 24,
  },
});