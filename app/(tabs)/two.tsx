import { StyleSheet, FlatList, ActivityIndicator, Image, Pressable } from "react-native";
import { Text, View } from "@/components/Themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { REACT_APP_GITHUB_TOKEN } from "@env";
import { Link } from "expo-router";
export interface IUserResponse {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  user_view_type: string;
  site_admin: boolean;
  name: string;
  company: string;
  blog: string;
  location: string;
  email: any;
  hireable: boolean;
  bio: string;
  twitter_username: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}


export default function TabOneScreen() {
  const [error, setError] = useState<string | null>(null);
  const [issues, setIssues] = useState([]);
  const [user, setUser] = useState<IUserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const LogOut = async () => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem("@username");
      window.location.href = "/";
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setLoading(false);
    }
  }

  const fetchGH = async () => {
    const storedUsername = await AsyncStorage.getItem("@username");
    

    try {
      const response = await fetch(`https://api.github.com/users/${storedUsername}`, {
        headers: {
          'Authorization': `token ${REACT_APP_GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      setIssues(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("token: ", REACT_APP_GITHUB_TOKEN);
    const fetchUser = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem("@username");
        const response = await fetch(`https://api.github.com/users/${storedUsername}`);
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchGH();
    fetchUser();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{user?.login}</Text>
      <View
        style={styles.separator}
        darkColor="#eee"
        lightColor="rgba(255,255,255,0.1)"
      />

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#000",
          }}
        >
          <Image
            source={{ uri: user?.avatar_url }}
            style={{ width: 120, height: 120, borderRadius: 100, overflow: 'hidden', margin: 10 }}
          />
          <Text style={{ fontSize: 18, color: "#FFF", fontWeight: "bold" }}>
            {user?.name}
          </Text>
          <Text style={{ fontSize: 14, color: "#999" }}>@{user?.login}</Text>
          <Text style={{ margin: 5, color: "#999" }}>
            Seguidores: {user?.followers} Seguindo: {user?.following}
          </Text>

          <View
            style={styles.separator}
            darkColor="#eee"
            lightColor="rgba(255,255,255,0.1)"
          />

          <Text style={{ fontSize: 18, color: "#FFF", textAlign: "center" }}>
            {user?.bio}
          </Text>

          <Text style={{ fontSize: 18, color: "#FFF", textAlign: "justify" }}>
            {user?.url}
          </Text>

          <Pressable>
              {({ pressed }) => (
                <Text
                  style={{
                    fontSize: 18,
                    color: pressed ? "#FFF" : "#007AFF",
                    textAlign: "center",
                  }}
                  onPress={() => LogOut()}
                >
                    Sair
                </Text>
              )}
           </Pressable>

        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    flex: 1,
    padding: 16,
    paddingTop: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
    color: "#FFF"
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: "100%",
  },
  repoItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#333",
    borderRadius: 8,
  },
  repoName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  repoDesc: {
    fontSize: 14,
    fontStyle: "italic",
  },
});
