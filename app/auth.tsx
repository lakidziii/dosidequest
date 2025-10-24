import { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { supabase } from '../lib/supabase';
import CustomAlert from '../components/CustomAlert';
import { useCustomAlert } from '../hooks/useCustomAlert';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
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
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>DoSideQuest</Text>
          <Text style={styles.subtitle}>
            {isLogin ? 'Přihlaste se do svého účtu' : 'Vytvořte si nový účet'}
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="vas@email.cz"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          {!isLogin && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nickname</Text>
              <TextInput
                style={styles.input}
                placeholder="Váš nickname"
                value={nickname}
                onChangeText={setNickname}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Heslo</Text>
            <TextInput
              style={styles.input}
              placeholder="Vaše heslo"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={isLogin ? handleSignIn : handleSignUp}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading 
                ? (isLogin ? 'Přihlašování...' : 'Registrování...') 
                : (isLogin ? 'Přihlásit se' : 'Registrovat se')
              }
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.switchButton}
            onPress={toggleMode}
            disabled={loading}
          >
            <Text style={styles.switchButtonText}>
              {isLogin 
                ? 'Nemáte účet? Registrujte se' 
                : 'Už máte účet? Přihlaste se'
              }
            </Text>
          </TouchableOpacity>
        </View>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  switchButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  switchButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
});