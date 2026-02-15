import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

interface UserProfile {
  name: string;
  avatarUri: string | null;
}

interface UserContextType {
  profile: UserProfile;
  setName: (name: string) => void;
  setAvatar: (uri: string | null) => void;
}

const USER_KEY = "@tracker_user_profile";

const defaultProfile: UserProfile = {
  name: "",
  avatarUri: null,
};

const UserContext = createContext<UserContextType>({
  profile: defaultProfile,
  setName: () => {},
  setAvatar: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(USER_KEY).then((saved) => {
      if (saved) {
        try {
          setProfile(JSON.parse(saved));
        } catch {}
      }
      setLoaded(true);
    });
  }, []);

  const persist = useCallback((updated: UserProfile) => {
    setProfile(updated);
    AsyncStorage.setItem(USER_KEY, JSON.stringify(updated));
  }, []);

  const setName = useCallback(
    (name: string) => {
      persist({ ...profile, name });
    },
    [profile, persist],
  );

  const setAvatar = useCallback(
    (uri: string | null) => {
      persist({ ...profile, avatarUri: uri });
    },
    [profile, persist],
  );

  const value = useMemo(
    () => ({ profile, setName, setAvatar }),
    [profile, setName, setAvatar],
  );

  if (!loaded) return null;

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextType {
  return useContext(UserContext);
}
