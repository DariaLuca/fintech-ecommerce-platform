import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import { supabase } from "../utils/supabase";
import { useUser } from "../store/useUser";

export default function App({ Component, pageProps }: AppProps) {
  const setUser = useUser((state: any) => state.setUser);
  const setIsLoading = useUser((state: any) => state.setIsLoading);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser, setIsLoading]);

  return (
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
