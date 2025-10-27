import { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import CustomAlert from '../components/CustomAlert';
import { useCustomAlert } from '../hooks/useCustomAlert';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));
  
  const {
    alertConfig,
    visible: alertVisible,
    hideAlert,
    showError,
    showSuccess,
    showWarning,
  } = useCustomAlert();

  const handleSignUp = async () => {
    if (!email || !nickname || !password) {
      showError('Chyba', 'Prosím vyplňte všechna pole');
      return;
    }

    if (password.length < 6) {
      showError('Chyba', 'Heslo musí mít alespoň 6 znaků');
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            nickname: nickname.trim(),
          }
        }
      });

      if (error) {
        showError('Chyba při registraci', error.message);
      } else {
        // Kontrola, zda je potřeba potvrzení emailu
        if (data.user && !data.user.email_confirmed_at) {
          showWarning(
            'Potvrďte email!', 
            `Registrace byla úspěšná, ale musíte potvrdit svůj email (${email}). Zkontrolujte svou emailovou schránku a klikněte na potvrzovací odkaz. Poté se můžete přihlásit.`
          );
        } else {
          showSuccess(
            'Registrace úspěšná!', 
            'Váš účet byl vytvořen. Nyní se můžete přihlásit.',
            [
              {
                text: 'OK',
                onPress: () => {
                  setIsLogin(true);
                  setPassword('');
                }
              }
            ]
          );
        }
      }
    } catch (error) {
      showError('Chyba', 'Něco se pokazilo. Zkuste to znovu.');
      console.error('SignUp error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      showError('Chyba', 'Prosím zadejte email a heslo');
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        // Detailnější error handling
        let errorMessage = error.message;
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Neplatné přihlašovací údaje. Zkontrolujte email a heslo, nebo se ujistěte, že jste potvrdili svůj email při registraci.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Email nebyl potvrzen. Zkontrolujte svou emailovou schránku a klikněte na potvrzovací odkaz.';
        }
        
        showError('Chyba při přihlašování', errorMessage);
      }
      // Úspěšné přihlášení se automaticky zpracuje v RootLayout
    } catch (error) {
      showError('Chyba', 'Něco se pokazilo. Zkuste to znovu.');
      console.error('SignIn error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setPassword('');
    
    // Animace při přepínání
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <View style={styles.container}>
      {/* Background Pattern */}
      <View style={styles.backgroundPattern}>
        {Array.from({ length: 50 }).map((_, i) => (
          <View key={i} style={[styles.patternDot, { 
            left: `${Math.random() * 100}%`, 
            top: `${Math.random() * 100}%`,
            opacity: 0.3 + Math.random() * 0.2
          }]} />
        ))}
        {Array.from({ length: 35 }).map((_, i) => (
          <View key={`line-${i}`} style={[styles.patternLine, { 
            left: `${Math.random() * 100}%`, 
            top: `${Math.random() * 100}%`,
            transform: [{ rotate: `${Math.random() * 360}deg` }],
            opacity: 0.2 + Math.random() * 0.2
          }]} />
        ))}
        {Array.from({ length: 25 }).map((_, i) => (
          <View key={`circle-${i}`} style={[styles.patternCircle, { 
            left: `${Math.random() * 100}%`, 
            top: `${Math.random() * 100}%`,
            opacity: 0.1 + Math.random() * 0.15
          }]} />
        ))}
      </View>
      
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Animated.View style={[styles.formContainer, { opacity: fadeAnim }]}>
            {/* Logo/Icon */}
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['#667eea', '#4299e1']}
                style={styles.logoGradient}
              >
                <MaterialIcons name="games" size={40} color="#ffffff" />
              </LinearGradient>
            </View>

            <Text style={styles.title}>DoSideQuest</Text>
            <Text style={styles.subtitle}>
              {isLogin ? 'Vítejte zpět! Přihlaste se do svého účtu' : 'Připojte se k naší komunitě'}
            </Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="email" size={20} color="#667eea" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="vas@email.cz"
                  placeholderTextColor="rgba(102, 126, 234, 0.5)"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
              </View>
            </View>

            {/* Nickname Input (pouze pro registraci) */}
            {!isLogin && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Nickname</Text>
                <View style={styles.inputWrapper}>
                  <MaterialIcons name="person" size={20} color="#667eea" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Váš nickname"
                    placeholderTextColor="rgba(102, 126, 234, 0.5)"
                    value={nickname}
                    onChangeText={setNickname}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                  />
                </View>
              </View>
            )}

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Heslo</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="lock" size={20} color="#667eea" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Vaše heslo"
                  placeholderTextColor="rgba(102, 126, 234, 0.5)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off" : "eye"} 
                    size={20} 
                    color="#667eea" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Main Action Button */}
            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={isLogin ? handleSignIn : handleSignUp}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={loading ? ['#cccccc', '#999999'] : ['#667eea', '#4299e1']}
                style={styles.buttonGradient}
              >
                <View style={styles.buttonContent}>
                  {loading && (
                    <MaterialIcons name="hourglass-empty" size={20} color="#ffffff" style={styles.buttonIcon} />
                  )}
                  <Text style={styles.buttonText}>
                    {loading 
                      ? (isLogin ? 'Přihlašování...' : 'Registrování...') 
                      : (isLogin ? 'Přihlásit se' : 'Registrovat se')
                    }
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Switch Mode Button */}
            <TouchableOpacity 
              style={styles.switchButton}
              onPress={toggleMode}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Text style={styles.switchButtonText}>
                {isLogin 
                  ? 'Nemáte účet? Registrujte se' 
                  : 'Už máte účet? Přihlaste se'
                }
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
        <CustomAlert
          visible={alertVisible}
          title={alertConfig.title}
          message={alertConfig.message}
          type={alertConfig.type}
          onClose={hideAlert}
          buttons={alertConfig.buttons}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafc',
    position: 'relative',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.1)',
    position: 'relative',
    overflow: 'hidden',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1a202c',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#4a5568',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2d3748',
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7fafc',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#2d3748',
    fontWeight: '500',
  },
  eyeIcon: {
    padding: 4,
  },
  button: {
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    shadowOpacity: 0.1,
    elevation: 2,
  },
  buttonGradient: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  switchButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  switchButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  patternDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#718096',
  },
  patternLine: {
    position: 'absolute',
    width: 30,
    height: 2,
    backgroundColor: '#a0aec0',
  },
  patternCircle: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#9ca3af',
    backgroundColor: 'transparent',
  },
});