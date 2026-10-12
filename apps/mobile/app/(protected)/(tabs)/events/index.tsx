import { feedTheme } from "@/components/feed/feed-theme";
import { useAuth } from "@/lib/auth-provider";
import type { LocalEvent } from "@yunicity/types";
import {
  EVENTS_EMPTY,
  EVENTS_PAGE_SUBTITLE,
  EVENTS_PAGE_TITLE,
  formatEventDateRange,
  formatEventLocation,
  formatTerritorialLine,
} from "@yunicity/utils";
import { useRouter, type Href } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type EventsResource = {
  key: string;
  events: LocalEvent[];
  error: string | null;
};

function EventRow({ event }: { event: LocalEvent }) {
  const router = useRouter();
  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/(protected)/events/${event.id}` as Href)}
    >
      <Text style={styles.cardTitle}>{event.title}</Text>
      <Text style={styles.cardMeta}>{formatEventDateRange(event.starts_at, event.ends_at)}</Text>
      <Text style={styles.cardMeta}>
        {formatTerritorialLine(event.neighborhood_summary, event.city, event.district) ??
          formatEventLocation(event, event.city)}
      </Text>
    </Pressable>
  );
}

export default function EventsTabScreen() {
  const { yunicityApi: api, user } = useAuth();
  const cityKey = user?.city ?? "";
  const [resource, setResource] = useState<EventsResource | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const mountedRef = useRef(true);
  const dataGenRef = useRef(0);
  const refreshGenRef = useRef(0);

  const fetchEvents = useCallback(async () => {
    return api.events.listEvents({
      city: user?.city ?? undefined,
    });
  }, [api.events, user?.city]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      dataGenRef.current += 1;
      refreshGenRef.current += 1;
    };
  }, []);

  useEffect(() => {
    const dataGen = ++dataGenRef.current;
    const key = cityKey;
    void (async () => {
      try {
        const response = await fetchEvents();
        if (!mountedRef.current || dataGen !== dataGenRef.current) return;
        setResource({ key, events: response.items, error: null });
      } catch {
        if (!mountedRef.current || dataGen !== dataGenRef.current) return;
        setResource({ key, events: [], error: "Impossible de charger les moments locaux." });
      }
    })();
  }, [fetchEvents, cityKey]);

  async function onRefresh() {
    const refreshGen = ++refreshGenRef.current;
    const dataGen = ++dataGenRef.current;
    const key = cityKey;
    setRefreshing(true);
    try {
      const response = await fetchEvents();
      if (!mountedRef.current || dataGen !== dataGenRef.current) return;
      setResource({ key, events: response.items, error: null });
    } catch {
      if (!mountedRef.current || dataGen !== dataGenRef.current) return;
      setResource((prev) =>
        prev?.key === key
          ? { ...prev, error: "Impossible de charger les moments locaux." }
          : { key, events: [], error: "Impossible de charger les moments locaux." },
      );
    } finally {
      if (mountedRef.current && refreshGen === refreshGenRef.current) {
        setRefreshing(false);
      }
    }
  }

  async function onRetry() {
    const dataGen = ++dataGenRef.current;
    const key = cityKey;
    setResource(null);
    try {
      const response = await fetchEvents();
      if (!mountedRef.current || dataGen !== dataGenRef.current) return;
      setResource({ key, events: response.items, error: null });
    } catch {
      if (!mountedRef.current || dataGen !== dataGenRef.current) return;
      setResource({ key, events: [], error: "Impossible de charger les moments locaux." });
    }
  }

  const loading = resource?.key !== cityKey;
  const error = resource?.key === cityKey ? resource.error : null;
  const events = resource?.key === cityKey ? resource.events : [];

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => void onRefresh()} />
      }
    >
      <Text style={styles.title}>{EVENTS_PAGE_TITLE}</Text>
      <Text style={styles.subtitle}>{EVENTS_PAGE_SUBTITLE}</Text>
      {loading ? (
        <ActivityIndicator color={feedTheme.accent} style={styles.loader} />
      ) : error ? (
        <View style={styles.errorBlock}>
          <Text style={styles.empty}>{error}</Text>
          <Pressable style={styles.retryBtn} onPress={() => void onRetry()}>
            <Text style={styles.retryText}>Réessayer</Text>
          </Pressable>
        </View>
      ) : events.length === 0 ? (
        <Text style={styles.empty}>{EVENTS_EMPTY}</Text>
      ) : (
        <View style={styles.list}>
          {events.map((event) => (
            <EventRow key={event.id} event={event} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: feedTheme.bg },
  content: { padding: 16, paddingBottom: 40, gap: 12 },
  title: { fontSize: 22, fontWeight: "700", color: feedTheme.text },
  subtitle: { fontSize: 14, color: feedTheme.textMuted, marginBottom: 8 },
  loader: { marginTop: 24 },
  empty: { color: feedTheme.textMuted, fontSize: 14, lineHeight: 20 },
  list: { gap: 12 },
  card: {
    backgroundColor: feedTheme.bgElevated,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: feedTheme.border,
  },
  cardTitle: { fontSize: 16, fontWeight: "600", color: feedTheme.text },
  cardMeta: { fontSize: 13, color: feedTheme.textMuted, marginTop: 4 },
  errorBlock: { gap: 12, marginTop: 8 },
  retryBtn: {
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: feedTheme.accent,
  },
  retryText: { color: "#fff", fontSize: 14, fontWeight: "600" },
});
