import { TribeInvitationsSectionMobile } from "@/components/tribes/tribe-invitations-section";
import { feedTheme } from "@/components/feed/feed-theme";
import { useAuth } from "@/lib/auth-provider";
import type { Tribe } from "@yunicity/types";
import {
  TRIBE_CHARTER_LABEL,
  TRIBE_JOIN_CTA,
  TRIBE_MEMBER_COUNT,
  TRIBES_EMPTY,
  TRIBES_ERROR,
  TRIBES_LOADING,
  TRIBES_PAGE_SUBTITLE,
  TRIBES_PAGE_TITLE,
  TRIBES_RETRY,
  TRIBE_INVITATIONS_LINK_HINT,
  tribeCategoryLabel,
  tribeVisibilityLabel,
} from "@yunicity/utils";
import { useRouter, type Href } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

const PAGE_SIZE = 20;

function TribeCardMobile({
  tribe,
  city,
  onOpen,
  onJoin,
  joining,
}: {
  tribe: Tribe;
  city: string;
  onOpen: () => void;
  onJoin: () => void;
  joining: boolean;
}) {
  const canJoin =
    !tribe.is_archived && !tribe.viewer_is_member && tribe.visibility === "public";

  return (
    <Pressable style={styles.card} onPress={onOpen}>
      {tribe.cover_image_url ? (
        <Image source={{ uri: tribe.cover_image_url }} style={styles.cover} />
      ) : (
        <View style={styles.coverPlaceholder}>
          <Text style={styles.coverTitle}>{tribe.name}</Text>
        </View>
      )}
      <View style={styles.cardBody}>
        <Text style={styles.meta}>
          {tribe.city} · {tribeCategoryLabel(tribe.category)} ·{" "}
          {tribeVisibilityLabel(tribe.visibility)}
        </Text>
        <Text style={styles.cardName}>{tribe.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {tribe.description}
        </Text>
        <Text style={styles.memberCount}>
          {TRIBE_MEMBER_COUNT(tribe.active_member_count, tribe.member_limit)}
        </Text>
        {canJoin ? (
          <Pressable
            style={[styles.joinBtn, joining && styles.btnDisabled]}
            disabled={joining}
            onPress={onJoin}
          >
            <Text style={styles.joinBtnText}>{joining ? "…" : TRIBE_JOIN_CTA}</Text>
          </Pressable>
        ) : null}
      </View>
    </Pressable>
  );
}

type TribesResource = {
  key: string;
  items: Tribe[];
  page: number;
  total: number;
  error: string | null;
};

export default function TribesTabScreen() {
  const router = useRouter();
  const { yunicityApi: api, user } = useAuth();
  const city = user?.city ?? "Reims";
  const [resource, setResource] = useState<TribesResource | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [joiningSlug, setJoiningSlug] = useState<string | null>(null);

  const mountedRef = useRef(true);
  const dataGenRef = useRef(0);
  const refreshGenRef = useRef(0);
  const loadMoreGenRef = useRef(0);

  const fetchTribesPage = useCallback(
    async (pageNum: number) => {
      return api.tribes.listTribes({
        city,
        page: pageNum,
        page_size: PAGE_SIZE,
      });
    },
    [api.tribes, city],
  );

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      dataGenRef.current += 1;
      refreshGenRef.current += 1;
      loadMoreGenRef.current += 1;
    };
  }, []);

  useEffect(() => {
    const dataGen = ++dataGenRef.current;
    const key = city;
    void (async () => {
      try {
        const data = await fetchTribesPage(1);
        if (!mountedRef.current || dataGen !== dataGenRef.current) return;
        setResource({
          key,
          items: data.items,
          page: 1,
          total: data.total,
          error: null,
        });
      } catch {
        if (!mountedRef.current || dataGen !== dataGenRef.current) return;
        setResource({ key, items: [], page: 1, total: 0, error: TRIBES_ERROR });
      }
    })();
  }, [fetchTribesPage, city]);

  async function onRefresh() {
    const refreshGen = ++refreshGenRef.current;
    const dataGen = ++dataGenRef.current;
    const key = city;
    setRefreshing(true);
    try {
      const data = await fetchTribesPage(1);
      if (!mountedRef.current || dataGen !== dataGenRef.current) return;
      setResource({
        key,
        items: data.items,
        page: 1,
        total: data.total,
        error: null,
      });
    } catch {
      if (!mountedRef.current || dataGen !== dataGenRef.current) return;
      setResource((prev) =>
        prev?.key === key
          ? { ...prev, error: TRIBES_ERROR }
          : { key, items: [], page: 1, total: 0, error: TRIBES_ERROR },
      );
    } finally {
      if (mountedRef.current && refreshGen === refreshGenRef.current) {
        setRefreshing(false);
      }
    }
  }

  function loadMore() {
    const current = resource?.key === city ? resource : null;
    if (!current || loadingMore || current.items.length >= current.total) {
      return;
    }
    const loadMoreGen = ++loadMoreGenRef.current;
    const dataGen = ++dataGenRef.current;
    const nextPage = current.page + 1;
    const key = city;
    setLoadingMore(true);
    void (async () => {
      try {
        const data = await fetchTribesPage(nextPage);
        if (!mountedRef.current || dataGen !== dataGenRef.current) return;
        setResource((prev) => {
          if (!prev || prev.key !== key) return prev;
          return {
            ...prev,
            page: nextPage,
            total: data.total,
            items: [...prev.items, ...data.items],
            error: null,
          };
        });
      } catch {
        if (!mountedRef.current || dataGen !== dataGenRef.current) return;
        setResource((prev) =>
          prev?.key === key ? { ...prev, error: TRIBES_ERROR } : prev,
        );
      } finally {
        if (mountedRef.current && loadMoreGen === loadMoreGenRef.current) {
          setLoadingMore(false);
        }
      }
    })();
  }

  async function onRetry() {
    const dataGen = ++dataGenRef.current;
    const key = city;
    setResource(null);
    try {
      const data = await fetchTribesPage(1);
      if (!mountedRef.current || dataGen !== dataGenRef.current) return;
      setResource({
        key,
        items: data.items,
        page: 1,
        total: data.total,
        error: null,
      });
    } catch {
      if (!mountedRef.current || dataGen !== dataGenRef.current) return;
      setResource({ key, items: [], page: 1, total: 0, error: TRIBES_ERROR });
    }
  }

  async function reloadAfterJoin() {
    const dataGen = ++dataGenRef.current;
    const key = city;
    try {
      const data = await fetchTribesPage(1);
      if (!mountedRef.current || dataGen !== dataGenRef.current) return;
      setResource({
        key,
        items: data.items,
        page: 1,
        total: data.total,
        error: null,
      });
    } catch {
      if (!mountedRef.current || dataGen !== dataGenRef.current) return;
      setResource((prev) =>
        prev?.key === key
          ? { ...prev, error: TRIBES_ERROR }
          : { key, items: [], page: 1, total: 0, error: TRIBES_ERROR },
      );
    }
  }

  function confirmJoin(tribe: Tribe) {
    Alert.alert(TRIBE_JOIN_CTA, TRIBE_CHARTER_LABEL, [
      { text: "Annuler", style: "cancel" },
      {
        text: TRIBE_JOIN_CTA,
        onPress: () => {
          setJoiningSlug(tribe.slug);
          void api.tribes
            .joinTribe(tribe.slug, city, { charter_accepted: true })
            .then(() => reloadAfterJoin())
            .catch(() => Alert.alert("Impossible de rejoindre cette tribu pour le moment."))
            .finally(() => {
              if (mountedRef.current) setJoiningSlug(null);
            });
        },
      },
    ]);
  }

  const loading = resource?.key !== city;
  const error = resource?.key === city ? resource.error : null;
  const items = resource?.key === city ? resource.items : [];

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.srOnly}>{TRIBES_LOADING}</Text>
        <ActivityIndicator color={feedTheme.accent} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
        <Pressable style={styles.retryBtn} onPress={() => void onRetry()}>
          <Text style={styles.retryText}>{TRIBES_RETRY}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>{TRIBES_PAGE_TITLE}</Text>
        <Text style={styles.subtitle}>{TRIBES_PAGE_SUBTITLE}</Text>
        <Pressable
          onPress={() => router.push("/(protected)/tribes/invitation" as Href)}
          style={styles.linkHint}
        >
          <Text style={styles.linkHintText}>{TRIBE_INVITATIONS_LINK_HINT}</Text>
        </Pressable>
      </View>
      <TribeInvitationsSectionMobile />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => void onRefresh()} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={<Text style={styles.empty}>{TRIBES_EMPTY}</Text>}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator color={feedTheme.accent} style={styles.footerLoader} />
          ) : null
        }
        renderItem={({ item }) => (
          <TribeCardMobile
            tribe={item}
            city={city}
            joining={joiningSlug === item.slug}
            onOpen={() =>
              router.push(
                `/(protected)/tribes/${item.slug}?city=${encodeURIComponent(city)}` as Href,
              )
            }
            onJoin={() => confirmJoin(item)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: feedTheme.bg },
  header: { padding: 16, paddingBottom: 8 },
  title: { fontSize: 22, fontWeight: "700", color: feedTheme.text },
  subtitle: { fontSize: 14, color: feedTheme.textMuted, marginTop: 6, lineHeight: 20 },
  linkHint: { marginTop: 10 },
  linkHintText: { fontSize: 13, color: feedTheme.accent },
  list: { padding: 16, paddingTop: 8, gap: 14, paddingBottom: 40 },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: feedTheme.border,
    backgroundColor: feedTheme.bgElevated,
    overflow: "hidden",
  },
  cover: { width: "100%", height: 120 },
  coverPlaceholder: {
    minHeight: 120,
    justifyContent: "flex-end",
    padding: 14,
    backgroundColor: "#f5f5f5",
  },
  coverTitle: { fontSize: 18, fontWeight: "700", color: feedTheme.text },
  cardBody: { padding: 14, gap: 6 },
  meta: { fontSize: 12, color: feedTheme.textMuted },
  cardName: { fontSize: 17, fontWeight: "700", color: feedTheme.text },
  description: { fontSize: 14, color: feedTheme.textMuted, lineHeight: 20 },
  memberCount: { fontSize: 12, color: feedTheme.textMuted, marginTop: 4 },
  joinBtn: {
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: feedTheme.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  joinBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  btnDisabled: { opacity: 0.6 },
  empty: { color: feedTheme.textMuted, textAlign: "center", marginTop: 24 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  srOnly: { position: "absolute", width: 1, height: 1, opacity: 0 },
  error: { color: feedTheme.textMuted, marginBottom: 12, textAlign: "center" },
  retryBtn: {
    backgroundColor: feedTheme.accent,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
  },
  retryText: { color: "#fff", fontWeight: "600" },
  footerLoader: { marginVertical: 16 },
});
