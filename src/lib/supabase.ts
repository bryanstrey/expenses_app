import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://yovsereanqjyvjpgnwdl.supabase.co/rest/v1/'
const SUPABASE_ANON_KEY = 'sb_publishable_bQk8H09nDNeRprjmbG5-oQ_6x-pYmgJ'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // Guarda a sessão no armazenamento do celular, pra não precisar fazer login toda vez que abrir o app.
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})