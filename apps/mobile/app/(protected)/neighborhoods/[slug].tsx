import { feedTheme } from "@/components/feed/feed-theme";
import { useAuth } from "@/lib/auth-provider";
import type { NeighborhoodContextResponse } from "@yunicity/types";
import {
  NEIGHBORHOOD_DETAIL_EMPTY_SECTION,
  NEIGHBORHOOD_DETAIL_EVENTS,
  NEIGHBORHOOD_DETAIL_OFFERS,
  NEIGHBORHOOD_DETAIL_ORGS,
  NEIGHBORHOOD_DETAIL_POSTS,
  NEIGHBORHOOD_NOT_FOUND,
  NEIGHBORHOODS_RETRY,
  formatEventDateRange,
  neighborhoodAmbianceLine,
} from "@yunicity/utils";
import { useLocalSearchParams, useRouter, type Href } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type NeighborhoodResource = {
  key: string;
  data: NeighborhoodContextResponse | null;
  error: string | null;
};

export default function NeighborhoodDetailScreen() {
  const router = useRouter();
  const { slug, city: cityParam } = useLocalSearchParams<{ slug: string; city?: string }>();
  const { yunicityApi: api, user } = useAuth();
  const city = cityParam ?? user?.city ?? "Reims";
  const requestedKey = slug ? `${slug}::${city}` : "";
  const [resource, setResource] = useState<NeighborhoodResource | null>(null);

  const mountedRef = useRef(true);
  const dataGenRef = useRef(0);

  const fetchContext = useCallback(
    async (slugValue: string, cityValue: string) => {
      return api.neighborhoods.getNeighborhoodContext(slugValue, cityValue);
    },
    [api.neighborhoods],
  );

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      dataGenRef.current += 1;
    };
  }, []);

  useEffect(() => {
    if (!slug || !requestedKey) return;
    const dataGen = ++dataGenRef.current;
    const key = requestedKey;
    void (async () => {
      try {
        const ctx = await fetchContext(slug, city);
        if (!mountedRef.current || dataGen !== dataGenRef.current) return;
        setResource({ key, data: ctx, error: null });
      } catch {
        if (!mountedRef.current || dataGen !== dataGenRef.current) return;
        setResource({ key, data: null, error: NEIGHBORHOOD_NOT_FOUND });
      }
    })();
  }, [fetchContext, slug, city, requestedKey]);

  async function onRetry() {
    if (!slug || !requestedKey) return;
    const dataGen = ++dataGenRef.current;
    const key = requestedKey;
    setResource(null);
    try {
      const ctx = await fetchContext(slug, city);
      if (!mountedRef.current || dataGen !== dataGenRef.current) return;
      setResource({ key, data: ctx, error: null });
    } catch {
      if (!mountedRef.current || dataGen !== dataGenRef.current) return;
      setResource({ key, data: null, error: NEIGHBORHOOD_NOT_FOUND });
    }
  }

  const loading = Boolean(requestedKey) && resource?.key !== requestedKey;
  const error = resource?.key === requestedKey ? resource.error : null;
  const data = resource?.key === requestedKey ? resource.data : null;

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={feedTheme.accent} />
      </View>
    );
  }

  if (error || !data || !slug) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error ?? NEIGHBORHOOD_NOT_FOUND}</Text>
        <Pressable style={styles.retryBtn} onPress={() => void onRetry()}>
          <Text style={styles.retryText}>{NEIGHBORHOODS_RETRY}</Text>
        </Pressable>
      </View>
    );
  }

  const hood = data.neighborhood;
  const ambiance = neighborhoodAmbianceLine(hood.ambiance);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.city}>{hood.city}</Text>
      <Text style={styles.title}>{hood.display_name}</Text>
      {ambiance ? <Text style={styles.ambiance}>{ambiance}</Text> : null}
      {hood.short_description ? (
        <Text style={styles.description}>{hood.short_description}</Text>
      ) : null}

      <Text style={styles.sectionTitle}>{NEIGHBORHOOD_DETAIL_EVENTS}</Text>
      {data.recent_events.length === 0 ? (
        <Text style={styles.empty}>{NEIGHBORHOOD_DETAIL_EMPTY_SECTION}</Text>
      ) : (
        data.recent_events.map((event) => (
          <Pressable
            key={event.id}
            style={styles.item}
            onPress={() => router.push(`/(protected)/events/${event.id}` as Href)}
          >
            <Text style={styles.itemTitle}>{event.title}</Text>
            <Text style={styles.itemMeta}>
              {formatEventDateRange(event.starts_at, null)} · {event.location_name}
            </Text>
          </Pressable>
        ))
      )}

      <Text style={styles.sectionTitle}>{NEIGHBORHOOD_DETAIL_ORGS}</Text>
      {data.organizations.length === 0 ? (
        <Text style={styles.empty}>{NEIGHBORHOOD_DETAIL_EMPTY_SECTION}</Text>
      ) : (
        data.organizations.map((org) => (
          <Text key={org.id} style={styles.itemMeta}>
            {org.name}
          </Text>
        ))
      )}

      <Text style={styles.sectionTitle}>{NEIGHBORHOOD_DETAIL_OFFERS}</Text>
      {data.recent_offers.length === 0 ? (
        <Text style={styles.empty}>{NEIGHBORHOOD_DETAIL_EMPTY_SECTION}</Text>
      ) : (
        data.recent_offers.map((offer) => (
          <View key={offer.id} style={styles.item}>
            <Text style={styles.itemTitle}>{offer.title}</Text>
            <Text style={styles.itemMeta}>{offer.organization_name}</Text>
          </View>
        ))
      )}

      <Text style={styles.sectionTitle}>{NEIGHBORHOOD_DETAIL_POSTS}</Text>
      {data.recent_posts.length === 0 ? (
        <Text style={styles.empty}>{NEIGHBORHOOD_DETAIL_EMPTY_SECTION}</Text>
      ) : (
        data.recent_posts.map((post) => (
          <View key={post.id} style={styles.item}>
            {post.title ? <Text style={styles.itemTitle}>{post.title}</Text> : null}
            {post.body ? (
              <Text style={styles.itemMeta} numberOfLines={2}>
                {post.body}
              </Text>
            ) : null}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: feedTheme.bg },
  content: { padding: 16, paddingBottom: 40, gap: 8 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  city: { fontSize: 13, color: feedTheme.textMuted },
  title: { fontSize: 26, fontWeight: "700", color: feedTheme.text },
  ambiance: { fontSize: 14, color: feedTheme.accent, marginTop: 4 },
  description: { fontSize: 15, lineHeight: 22, color: feedTheme.text, marginVertical: 12 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: feedTheme.text,
    marginTop: 20,
    marginBottom: 8,
  },
  item: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: feedTheme.border,
    backgroundColor: feedTheme.bgElevated,
    padding: 12,
    marginBottom: 8,
  },
  itemTitle: { fontSize: 15, fontWeight: "600", color: feedTheme.text },
  itemMeta: { fontSize: 13, color: feedTheme.textMuted, marginTop: 4 },
  empty: { fontSize: 14, color: feedTheme.textMuted, marginBottom: 8 },
  error: { color: feedTheme.textMuted, marginBottom: 12, textAlign: "center" },
  retryBtn: {
    backgroundColor: feedTheme.accent,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
  },
  retryText: { color: "#fff", fontWeight: "600" },
});
