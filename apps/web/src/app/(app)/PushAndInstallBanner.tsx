"use client";
import { useEffect, useState } from "react";
import { subscribeToPush, unsubscribeFromPush } from "./push-actions";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from(rawData, (c) => c.charCodeAt(0));
}

// FR-6.5-adjacent: solves "people don't know how to install a PWA" by putting
// the instructions directly in the app rather than assuming discoverability.
function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
  }, []);

  if (isStandalone) return null;

  return (
    <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm dark:border-amber-800 dark:bg-amber-950">
      <p className="font-medium">Install this app for quick access</p>
      {isIOS ? (
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          Tap the Share button, then &quot;Add to Home Screen&quot;.
        </p>
      ) : (
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          Open your browser menu and choose &quot;Install app&quot; or &quot;Add to Home Screen&quot;.
        </p>
      )}
    </div>
  );
}

function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).then(async (registration) => {
        setSubscription(await registration.pushManager.getSubscription());
      });
    }
  }, []);

  async function subscribe() {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!) as BufferSource,
    });
    setSubscription(sub);
    await subscribeToPush(JSON.parse(JSON.stringify(sub)));
  }

  async function unsubscribe() {
    if (!subscription) return;
    await subscription.unsubscribe();
    await unsubscribeFromPush(subscription.endpoint);
    setSubscription(null);
  }

  if (!isSupported) return null;

  return (
    <div className="rounded-xl border border-zinc-200 p-4 text-sm dark:border-zinc-800">
      {subscription ? (
        <div className="flex items-center justify-between">
          <span>Notifications are on for this device.</span>
          <button onClick={unsubscribe} className="text-red-600 underline dark:text-red-400">
            Turn off
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <span>Get notified about emergencies and new bookings.</span>
          <button onClick={subscribe} className="text-blue-600 underline dark:text-blue-400">
            Enable
          </button>
        </div>
      )}
    </div>
  );
}

export default function PushAndInstallBanner() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-3 px-4 pt-4">
      <InstallPrompt />
      <PushNotificationManager />
    </div>
  );
}
