import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import SubscriptionCard from './SubscriptionCard';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  features: string[];
}

interface SubscriptionPlansProps {
  plans: SubscriptionPlan[];
  selectedCurrency: string;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ plans, selectedCurrency }) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scrolling funkce
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % plans.length;
        
        // Scroll na další kartu
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({
            x: nextIndex * 340, // 320px šířka karty + 20px margin
            animated: true,
          });
        }
        
        return nextIndex;
      });
    }, 5000); // Každých 5 sekund

    return () => clearInterval(interval);
  }, [plans.length]);

  return (
    <ScrollView 
      ref={scrollViewRef}
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.subscriptionPlansContainer}
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
      pagingEnabled={true}
      decelerationRate="fast"
      snapToInterval={340}
      snapToAlignment="start"
    >
      {plans.map((plan, index) => (
        <SubscriptionCard
          key={plan.id}
          plan={plan}
          index={index}
          selectedCurrency={selectedCurrency}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  subscriptionPlansContainer: {
    marginTop: 20,
    marginHorizontal: -60, // Rozšíří na celou šířku stránky
    paddingTop: 20, // Přidáme padding pro "Most Popular" badge
    paddingBottom: 40,
  },
});

export default SubscriptionPlans;